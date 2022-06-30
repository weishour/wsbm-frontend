import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { addClass } from '@syncfusion/ej2-base';
import { ColorPickerEventArgs, PaletteTileEventArgs } from '@syncfusion/ej2-angular-inputs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HeroiconsOutlineUpload, WsLogoData } from '@ws/constants';
import { WsLoadingService } from '@ws/services/loading';
import { WsColorService, WsImageService } from '@ws/services/utils';
import { WsMessageService } from '@ws/services/message';
import { environment } from 'environments/environment';
import { LabelGroup } from 'app/core/label-group';
import { Icon, SiteService } from 'app/core/site';
import { Label, LabelService } from 'app/core/label';
import { FilePond, FilePondErrorDescription, FilePondFile, FilePondOptions } from 'filepond';
import { orderBy, isNull, isUndefined, isEmpty } from 'lodash-es';
import { DrawerLabelData } from './label.types';
import type { SafeAny } from '@ws/types';

@UntilDestroy()
@Component({
  selector: 'bookmark-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarkLabelComponent implements OnChanges, OnInit, AfterViewInit {
  /** 操作类型 */
  action: string;
  /** 操作名称 */
  actionName: string;
  /** 标签表单 */
  labelForm: FormGroup;
  /** 分组表单 */
  labelGroups: LabelGroup[] = [];
  /** 标签 */
  label: Label;
  /** 上传设置 */
  pondOptions: FilePondOptions;
  /** 颜色定义 */
  paletteColors: { [key: string]: string[] };
  /** 颜色(预设) */
  circleColor: string = '';
  /** 颜色(详细) */
  sliderColor: string = '';

  /** 唯守图标 */
  wsStage: SafeAny;
  wsContentBg: SafeAny = new Konva.Rect();
  wsContent: SafeAny = new Konva.Path();
  /** 文字图标 */
  textStage: SafeAny;
  textContentBg: SafeAny = new Konva.Rect();
  textContent: SafeAny = new Konva.Text();

  /** 标签抽屉实体 */
  @Input() matDrawer: MatDrawer;
  /** 标签抽屉传参数据 */
  @Input() drawerLabelData: DrawerLabelData;
  /** 新增完标签数据后发出的事件 */
  @Output() readonly addComplete: EventEmitter<Label> = new EventEmitter<Label>();
  /** 修改完标签数据后发出的事件 */
  @Output() readonly editComplete: EventEmitter<Label> = new EventEmitter<Label>();
  /** filepond实体 */
  @ViewChild('filepond') filepond: FilePond;

  /** 文件访问地址 */
  fileUrl = `${environment.BASE_API}files/`;
  /** 是否显示loading */
  loadingShow = false;

  /**
   * 构造函数
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _wsLoadingService: WsLoadingService,
    private _wsColorService: WsColorService,
    private _wsImageService: WsImageService,
    private _siteService: SiteService,
    private _labelService: LabelService,
    private _wsMessageService: WsMessageService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ 生命周期钩子
  // -----------------------------------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('drawerLabelData' in changes) {
      const currentValue: DrawerLabelData = changes.drawerLabelData.currentValue;

      if (!isUndefined(currentValue)) {
        this.action = currentValue.action;
        this.actionName = this.action === 'add' ? '添加' : '修改';
        this.labelGroups = currentValue.labelGroups;

        // 当前分组赋值
        this.labelForm.patchValue({
          menuId: currentValue.activeNavigation.id,
          groupId: currentValue.labelGroup.id,
        });

        // 当前背景色
        const currentColor = `${currentValue.currentColor}ff`;
        this.circleColor = this.sliderColor = currentColor;
        this._backgroundHandle(currentColor);

        // 修改赋值
        if (this.action === 'edit') {
          this.label = currentValue.label;

          this.labelForm.patchValue({
            id: this.label.id,
            address: this.label.address,
            iconTitle: this.label.iconTitle,
            iconName: this.label.iconName,
            iconType: this.label.iconType,
            title: this.label.title,
            description: this.label.description,
          });

          if (this.label.iconType === 'upload') {
            this.filepond.addFile(this.fileUrl + this.label.iconName);
          } else {
            this.iconChoose(this.label.iconType);
            this.iconTitleEdit(this.labelForm.value.iconTitle);
          }
        }
      }
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 创建标签表单
    this.labelForm = this._formBuilder.group({
      menuId: [null, Validators.required],
      groupId: [null, Validators.required],
      address: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
          ),
        ],
      ],
      iconTitle: ['W'],
      iconName: [''],
      iconType: ['ws'],
      file: [null, Validators.required],
      title: ['', Validators.required],
      description: [''],
    });

    // 订阅抽屉开关状态
    this.matDrawer.openedChange.pipe(untilDestroyed(this)).subscribe((state) => {
      // 抽屉关闭
      if (!state) {
        // 数据重置
        this._dataReset();
      } else {
      }
    });

    this._wsLoadingService.show$.pipe(untilDestroyed(this)).subscribe((value) => {
      this.loadingShow = value;
    });

    /** filepond配置 */
    this.pondOptions = {
      instantUpload: false,
      labelIdle: HeroiconsOutlineUpload,
      imagePreviewHeight: 110,
      imagePreviewTransparencyIndicator: 'grid',
      imageCropAspectRatio: '1:1',
      imageResizeTargetWidth: 200,
      imageResizeTargetHeight: 200,
      stylePanelLayout: 'compact circle',
      styleLoadIndicatorPosition: 'center bottom',
      styleProgressIndicatorPosition: 'right bottom',
      styleButtonRemoveItemPosition: 'right top',
      styleButtonProcessItemPosition: 'left bottom',
      credits: false,
      maxFileSize: '1MB',
      labelMaxFileSizeExceeded: '上传文件太大',
      labelMaxFileSize: '允许上传最大文件大小为{filesize}',
      acceptedFileTypes: [
        'image/png',
        'image/jpeg',
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'image/svg+xml',
      ],
      labelFileTypeNotAllowed: '上传的文件类型无效',
      fileValidateTypeLabelExpectedTypes: '允许类型 {allTypes}',
      fileValidateTypeLabelExpectedTypesMap: {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/x-icon': 'ico',
        'image/vnd.microsoft.icon': 'ico',
        'image/svg+xml': 'svg',
      },
      fileRenameFunction: (file) => {
        let extension = file.extension;
        extension = extension.split('-').length > 1 ? '.png' : extension;
        return `upload${extension}`;
      },
    };

    /** 调色板颜色定义 */
    this.paletteColors = {
      custom: [
        '',
        '#4f46e5ff',
        '#2196f3ff',
        '#0d9488ff',
        '#4caf50ff',
        '#f43f5eff',
        '#9333eaff',
        '#f59e0bff',
        '#ff5722ff',
      ],
    };
  }

  /**
   * 视图初始化后
   */
  ngAfterViewInit(): void {
    this._wsKonvaHandle();
    this._textKonvaHandle();

    // FilePond实例引发警告
    this.filepond['pond'].onwarning = (error: FilePondErrorDescription) => {
      if (error) {
        if (error.body === 'Max files') {
          // 上传异常提示
          this._wsMessageService.toast('warning', '最多允许上传一个文件');
        }
        return;
      }
    };

    // 文件已添加事件
    this.filepond['pond'].onaddfile = (error: SafeAny, filePondFile: FilePondFile) => {
      if (error) {
        // 上传异常提示
        this._wsMessageService.toast('warning', `${error.main}, ${error.sub}`);

        // 删除当前文件
        this.filepond.removeFile();
        return;
      }

      // 表单文件字段赋值
      this.iconChoose('upload');
      this.loadingShow = false;
    };

    // 文件加载开始事件
    this.filepond['pond'].onaddfilestart = (filePondFile: FilePondFile) => {
      this.loadingShow = true;
    };

    // 文件已删除事件
    this.filepond['pond'].onremovefile = (error: SafeAny) => {
      if (isNull(error)) {
        // 表单文件字段赋值
        this.labelForm.patchValue({ file: null, iconName: '' });
      }
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ 公共方法
  // -----------------------------------------------------------------------------------------------------

  /**
   * 右上角关闭抽屉
   */
  close(): void {
    // 关闭抽屉
    this.matDrawer.toggle(false, 'mouse');
  }

  /**
   * 添加
   */
  add(isContinue: boolean = false): void {
    // 如果表单无效则返回
    if (!this._labelFormVerify()) return;

    // 禁用表单
    this.labelForm.disable();

    // multipart/form-data处理
    const formData = new FormData();
    Object.keys(this.labelForm.controls).forEach((formControlName) => {
      if (!['iconName'].includes(formControlName)) {
        formData.append(formControlName, this.labelForm.get(formControlName).value);
      }
    });
    formData.append('sort', this.drawerLabelData.count.toString());

    this._labelService.add(formData).subscribe({
      next: (data) => {
        this.labelForm.enable();

        if (isContinue) {
          // 数据重置
          this._dataReset();
        } else {
          this.close();
        }

        // 执行可观察对象
        this.addComplete.next(data);
      },
      error: () => {
        this.labelForm.enable();
      },
    });
  }

  /**
   * 修改
   */
  edit(): void {
    // 如果表单无效则返回
    if (!this._labelFormVerify()) return;

    // 禁用表单
    this.labelForm.disable();

    // multipart/form-data处理
    const formData = new FormData();
    formData.append('id', this.label.id.toString());
    Object.keys(this.labelForm.controls).forEach((formControlName) => {
      formData.append(formControlName, this.labelForm.get(formControlName).value);
    });
    formData.append('sort', this.drawerLabelData.count.toString());

    // 判断图标文件是否修改
    switch (this.labelForm.value.iconType) {
      case 'ws':
        if (this.labelForm.value.iconType == this.label.iconType) formData.delete('file');
        break;
      case 'text':
        if (this.label.iconTitle !== 'W' && this.labelForm.value.iconTitle === this.label.iconTitle)
          formData.delete('file');
        break;
      default:
        if (this.labelForm.value.iconName === this.label.iconName) formData.delete('file');
        break;
    }

    this._labelService.edit(formData).subscribe({
      next: (data) => {
        this.labelForm.enable();

        this.close();

        // 执行可观察对象
        this.editComplete.next(data);
      },
      error: () => {
        this.labelForm.enable();
      },
    });
  }

  /**
   * 取消
   */
  cancel(): void {
    // 关闭抽屉
    this.matDrawer.toggle(false, 'mouse');
  }

  /**
   * 一键获取
   */
  getSiteInfo(address: string): void {
    const addressControl = this.labelForm.get('address');

    if (addressControl.hasError('required')) {
      addressControl.markAsTouched({ onlySelf: true });
      this._wsMessageService.toast('warning', '请输入地址!');
      return;
    } else if (addressControl.hasError('pattern')) {
      this._wsMessageService.toast('warning', '请输入正确的地址!');
      return;
    }

    this._siteService.getSiteInfo(address).subscribe({
      next: (data) => {
        // 图标
        if (data?.icons && data?.icons.length > 0) {
          let icons = data.icons.filter((icon) => !isEmpty(icon.base64) && icon.size > 0);
          icons = orderBy(icons, ['size'], 'desc');

          const icon: Icon = icons.length > 1 ? icons[1] : icons[0];
          if (icon) {
            this.filepond.addFile(icon.base64);
          } else {
            // 删除当前文件
            this.filepond.removeFile();
          }
        }

        // 标题
        if (data?.title) {
          this.labelForm.patchValue({ title: data.title });
        }

        // 描述
        if (data?.description) {
          this.labelForm.patchValue({ description: data.description });
        }
      },
      error: (error) => {
        if (error.status == 500) this._wsMessageService.error('获取站点信息失败');
      },
    });
  }

  /**
   * 图标选择
   * @param {string} type
   */
  iconChoose = (type: string) => {
    this.labelForm.patchValue({ iconType: type });

    // 表单获取File对象
    this._fileHandle();
  };

  /**
   * 文字图标修改
   * @param {string} value
   */
  iconTitleEdit(value: string): void {
    this.textContent.text(value);

    // 表单获取File对象
    this._fileHandle();
  }

  /**
   * 颜色(预设)改变处理
   * @param {ColorPickerEventArgs} args
   */
  circleOnChange(args: ColorPickerEventArgs): void {
    this.circleColor = this.sliderColor = args.currentValue.hex;
    this._backgroundHandle(args['value']);
  }

  /**
   * 颜色(预设)渲染处理
   * @param {PaletteTileEventArgs} args
   */
  circleTileRender(args: PaletteTileEventArgs): void {
    addClass([args.element], ['e-icons', 'e-custom-circle']);
  }

  /**
   * 颜色(详细)改变处理
   * @param {ColorPickerEventArgs} args
   */
  sliderOnChange(args: ColorPickerEventArgs): void {
    this._backgroundHandle(args['value']);
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 标签表单验证
   * @returns
   */
  private _labelFormVerify(): boolean {
    if (this.labelForm.invalid) {
      const groupControl = this.labelForm.get('groupId'),
        addressControl = this.labelForm.get('address'),
        fileControl = this.labelForm.get('file'),
        titleControl = this.labelForm.get('title');

      if (groupControl.hasError('required')) {
        groupControl.markAsTouched({ onlySelf: true });
        this._wsMessageService.toast('warning', '请选择分组!');
      } else if (addressControl.hasError('required')) {
        addressControl.markAsTouched({ onlySelf: true });
        this._wsMessageService.toast('warning', '请输入地址!');
      } else if (addressControl.hasError('pattern')) {
        addressControl.markAsTouched({ onlySelf: true });
        this._wsMessageService.toast('warning', '请输入正确的地址!');
      } else if (fileControl.hasError('required')) {
        this._wsMessageService.toast('warning', '请上传图标!');
      } else if (titleControl.hasError('required')) {
        titleControl.markAsTouched({ onlySelf: true });
        this._wsMessageService.toast('warning', '请输入名称!');
      }

      return false;
    }

    return true;
  }

  /**
   * 表单获取File对象
   */
  private _fileHandle(): void {
    let file: File;
    const iconType = this.labelForm.value.iconType;
    switch (iconType) {
      case 'ws':
        file = this._wsImageService.dataURLtoFile(
          this.wsStage.toDataURL({ pixelRatio: 2 }),
          iconType,
        );
        break;
      case 'text':
        file = this._wsImageService.dataURLtoFile(
          this.textStage.toDataURL({ pixelRatio: 2 }),
          iconType,
        );
        break;
      default:
        const filePondFile: FilePondFile = this.filepond.getFile();
        if (isNull(filePondFile)) {
          file = null;
        } else {
          file = new File([filePondFile.file], filePondFile.filename, {
            type: filePondFile.fileType,
          });
        }
        break;
    }

    this.labelForm.patchValue({ file, iconName: `${iconType}.png` });
  }

  /**
   * 数据重置
   */
  private _dataReset(): void {
    // 数据初始化
    this.circleColor = this.sliderColor = '';

    // 重置表单
    this.labelForm.reset();
    this.labelForm.patchValue({
      menuId: this.drawerLabelData.activeNavigation.id,
      groupId: this.drawerLabelData.labelGroup.id,
      iconTitle: 'W',
      iconType: 'ws',
    });
    this.labelForm.enable();

    // 重置图标
    this.textContent.text('W');
    if (!isNull(this.filepond.getFile())) this.filepond.removeFile();
  }

  /**
   * 唯守图标处理
   */
  private _wsKonvaHandle(): void {
    this.wsStage = new Konva.Stage({
      container: 'icon-image',
      width: 106,
      height: 106,
    });

    const wsLayer = new Konva.Layer();

    this.wsContentBg = new Konva.Rect({
      width: 106,
      height: 106,
      cornerRadius: 6,
    });

    this.wsContent = new Konva.Path({
      x: 16,
      y: 16,
      data: WsLogoData,
      scale: {
        x: 0.7,
        y: 0.7,
      },
    });

    wsLayer.add(this.wsContentBg);
    wsLayer.add(this.wsContent);
    this.wsStage.add(wsLayer);
  }

  /**
   * 文字图标处理
   */
  private _textKonvaHandle(): void {
    this.textStage = new Konva.Stage({
      container: 'text-image',
      width: 106,
      height: 106,
    });

    const textLayer = new Konva.Layer();

    this.textContentBg = new Konva.Rect({
      width: 106,
      height: 106,
      cornerRadius: 6,
    });

    this.textContent = new Konva.Text({
      width: 106,
      height: 106,
      align: 'center',
      verticalAlign: 'middle',
      text: 'W',
      fontSize: 50,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      wrap: 'none',
    });

    textLayer.add(this.textContentBg);
    textLayer.add(this.textContent);
    this.textStage.add(textLayer);
  }

  /**
   * 图标背景色处理
   * @param {string} color
   */
  private _backgroundHandle(color: string): void {
    const background = color || 'transparent';

    // 获取文字的背景对比色
    const textContrast = this._wsColorService.textContrast(color || '#ffffff');

    // 改变图标背景色
    this.wsContentBg.fill(background);
    this.textContentBg.fill(background);

    // 改变唯守图标颜色
    this.wsContent.fill(textContrast);

    // 改变文字图标颜色
    this.textContent.fill(textContrast);

    // 表单获取File对象
    this._fileHandle();
  }
}
