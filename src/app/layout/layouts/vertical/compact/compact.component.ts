import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ViewChild,
  Inject,
  ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WsMediaWatcherService } from '@ws/services/media-watcher';
import {
  WsNavigationItem,
  WsNavigationService,
  WsVerticalNavigationComponent,
} from '@ws/components/navigation';
import { WsDrawerService } from '@ws/components/drawer';
import { WsMessageService } from '@ws/services/message';
import { WsConfirmationService } from '@ws/services/confirmation';
import { Navigation, NavigationService } from 'app/core/navigation';
import { IconsService } from 'app/core/icons';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import {
  ContextMenuComponent,
  BeforeOpenCloseMenuEventArgs,
  MenuEventArgs,
} from '@syncfusion/ej2-angular-navigations';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';
import { find, isEmpty } from 'lodash-es';

@UntilDestroy()
@Component({
  selector: 'compact-layout',
  templateUrl: './compact.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompactLayoutComponent implements OnInit, AfterViewInit {
  name: string = 'mainNavigation';
  isScreenSmall: boolean;
  navigation: Navigation;
  toggleNavigationIcon = 'ws:menu_collapse';
  toggleNavigationTooltip = 'collapse';

  @ViewChild('addItemMenu', { read: ElementRef }) AddItemMenu: ElementRef<HTMLElement>;
  @ViewChild('menuContextmenu') menuContextmenu: ContextMenuComponent;
  @ViewChild('addItemDialog') AddItemDialog: DialogComponent;
  @ViewChild('editItemDialog') EditItemDialog: DialogComponent;

  /** 分类菜单右键目标元素选择器 */
  menuContextmenuTarget = '';
  /** 分类表单 */
  classifyForm: FormGroup;
  /** 图标数据 */
  iconsDatas: { name: string; value: string }[];
  /** 主页菜单 */
  homeItem: WsNavigationItem;
  /** 添加分类 */
  addItem: WsNavigationItem;
  /** 系统设置 */
  settingsItem: WsNavigationItem;
  /** 被选中的分类菜单 */
  classifyMenuSelected: WsNavigationItem;

  /**
   * 构造函数
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _navigationService: NavigationService,
    private _wsMediaWatcherService: WsMediaWatcherService,
    private _wsNavigationService: WsNavigationService,
    private _wsDrawerService: WsDrawerService,
    private _translocoService: TranslocoService,
    private _wsMessageService: WsMessageService,
    private _iconsService: IconsService,
    private _wsConfirmationService: WsConfirmationService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅导航数据
    this._navigationService.navigation$
      .pipe(untilDestroyed(this))
      .subscribe((navigation: Navigation) => {
        this.menuContextmenuTarget =
          navigation.compact.length > 0 ? '.ws-vertical-navigation-item-wrapper.ws-menu-item' : '';
        this.navigation = navigation;
      });

    /** 主页菜单 */
    this.homeItem = {
      id: 'home',
      title: this._translocoService.translate('navigation.home'),
      translation: 'navigation.home',
      type: 'basic',
      icon: 'heroicons_outline:home',
      link: '/bookmark/home',
    };

    /** 添加分类 */
    this.addItem = {
      title: this._translocoService.translate('navigation.add_classify'),
      translation: 'navigation.add_classify',
      type: 'basic',
      icon: 'heroicons_outline:view-grid-add',
      function: this._addMenu.bind(this),
    };

    /** 系统设置 */
    this.settingsItem = {
      title: this._translocoService.translate('settings.name'),
      translation: 'settings.name',
      type: 'basic',
      icon: 'heroicons_outline:cog',
      function: this._toggleSettings.bind(this),
    };

    // 订阅媒体更改
    this._wsMediaWatcherService.onMediaChange$
      .pipe(untilDestroyed(this))
      .subscribe(({ matchingAliases }) => {
        // 检查屏幕是否小
        this.isScreenSmall = !matchingAliases.includes('md');
      });

    // 订阅语言更改
    this._translocoService.langChanges$.subscribe((_) => {
      const navComponent = this._wsNavigationService.getComponent<WsVerticalNavigationComponent>(
        this.name,
      );

      // 主页菜单
      this._translocoService
        .selectTranslate(this.homeItem.translation)
        .pipe(take(1))
        .subscribe((translation) => (this.homeItem.title = translation));

      // 添加分类
      this._translocoService
        .selectTranslate(this.addItem.translation)
        .pipe(take(1))
        .subscribe((translation) => (this.addItem.title = translation));

      // 系统设置
      this._translocoService
        .selectTranslate(this.settingsItem.translation)
        .pipe(take(1))
        .subscribe((translation) => (this.settingsItem.title = translation));

      if (navComponent) setTimeout(() => navComponent.refresh());
    });

    // 图标列表数据
    this._iconsService.icons.pipe(untilDestroyed(this)).subscribe((icons) => {
      this.iconsDatas = icons.list.map((name: string) => {
        return { name, value: `${icons.namespace}:${name}` };
      });
    });

    // 创建分类表单
    this.classifyForm = this._formBuilder.group({
      icon: [null, Validators.required],
      title: ['', [Validators.required]],
    });
  }

  /**
   * 视图初始化后
   */
  ngAfterViewInit(): void {
    const navComponent = this._wsNavigationService.getComponent<WsVerticalNavigationComponent>(
      this.name,
    );

    if (navComponent) {
      this._toggleNavigationIcon(navComponent.opened);
    }

    // 订阅导航模式变化
    navComponent.modeChanged
      .pipe(untilDestroyed(this))
      .subscribe((mode) => this._toggleNavigationIcon(mode === 'side'));

    // 订阅导航菜单拖动变化
    navComponent.basicItemDropChanged.pipe(untilDestroyed(this)).subscribe((event) => {
      const ids = this.navigation.compact.map((navigation) => navigation.id);

      // 调整分类菜单排序
      this._navigationService.sort(ids).subscribe();
    });

    // 添加右键菜单选项
    this.menuContextmenu.items = [
      {
        id: 'edit',
        text: '编辑',
        iconCss: 'e-icons e-edit',
      },
      {
        id: 'delete',
        text: '删除',
        iconCss: 'e-icons e-delete-5',
      },
    ];

    // 添加分类菜单Dialog按钮设置
    this.AddItemDialog.buttons = [
      {
        click: this._saveButtonClick.bind(this),
        buttonModel: {
          content: '添加',
          iconCss: 'e-icons e-check-4',
          isPrimary: true,
        },
        isFlat: false,
        type: 'Submit',
      },
      {
        click: () => {
          this.AddItemDialog.hide();
        },
        buttonModel: {
          content: '取消',
          iconCss: 'e-icons e-close-5',
          cssClass: 'text-red',
        },
        isFlat: false,
      },
    ];

    // 修改分类菜单Dialog按钮设置
    this.EditItemDialog.buttons = [
      {
        click: this._editButtonClick.bind(this),
        buttonModel: {
          content: '修改',
          iconCss: 'e-icons e-edit',
          isPrimary: true,
        },
        isFlat: false,
        type: 'Submit',
      },
      {
        click: () => {
          this.EditItemDialog.hide();
        },
        buttonModel: {
          content: '取消',
          iconCss: 'e-icons e-close-5',
          cssClass: 'text-red',
        },
        isFlat: false,
      },
    ];

    this._document.onclick = (args: any): void => {
      // console.log(args.target)
    };
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 切换导航
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // 获取导航
    const navigation = this._wsNavigationService.getComponent<WsVerticalNavigationComponent>(name);

    if (navigation) {
      // 切换打开状态
      navigation.toggle();

      // 当模式为side时，切换导航图标
      if (navigation.mode === 'side') {
        this._toggleNavigationIcon(navigation.opened);
      }
    }
  }

  /**
   * 添加分类菜单Dialog关闭事件
   */
  addItemDialogClose: EmitType<object> = (): void => {
    this.classifyForm.reset();
  };

  /**
   * 修改分类菜单Dialog打开事件
   */
  editItemDialogOpen: EmitType<object> = (args): void => {
    // 防止将焦点放在第一个元素上
    args.preventFocus = true;
  };

  /**
   * 修改分类菜单Dialog关闭事件
   */
  editItemDialogClose: EmitType<object> = (): void => {
    this.classifyForm.reset();
  };

  /**
   * 图标过滤筛选
   * @param {FilteringEventArgs} event
   */
  onFiltering: EmitType<FilteringEventArgs> = (event: FilteringEventArgs) => {
    let query: Query = new Query();
    // 基于过滤类型的搜索字符串构造查询
    query = !isEmpty(event.text) ? query.where('name', 'contains', event.text, true) : query;
    // 将过滤器数据源、过滤器查询传递给updateData方法
    event.updateData(this.iconsDatas, query);
  };

  /**
   * 右键菜单打开之前事件
   */
  contextMenubeforeOpen: EmitType<object> = (args: BeforeOpenCloseMenuEventArgs): void => {
    // 关闭分类菜单Dialog
    this.AddItemDialog.hide();
    this.EditItemDialog.hide();

    // 设定位置
    if (!isEmpty(args.event)) {
      const { left, top } = this._getItemMenuPosition(args.event);
      args.left = left;
      args.top = top;
    }
  };

  /**
   * 右键菜单选项点击事件
   */
  contextMenuSelect(args: MenuEventArgs): void {
    const item = args.item;
    switch (item.id) {
      case 'edit':
        const controlParent: ContextMenuComponent = item['controlParent'],
          targetElement: HTMLElement = controlParent['targetElement'],
          left = controlParent['left'],
          top = controlParent['top'] - targetElement.clientHeight / 2;

        this.classifyForm.setValue({
          icon: this.classifyMenuSelected.icon,
          title: this.classifyMenuSelected.title,
        });

        this.EditItemDialog.position = { X: left, Y: top };
        this.EditItemDialog.show();
        break;
      case 'delete':
        const dialogRef = this._wsConfirmationService.show(
          'warning',
          '系统提示',
          '确认要删除分类下的所有内容吗？',
        );

        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'confirmed') {
            // 删除分类菜单
            this._navigationService.remove(this.classifyMenuSelected.id).subscribe();
          }
        });
        break;
    }
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 切换导航图标
   *
   * @param opened
   */
  private _toggleNavigationIcon(opened: boolean): void {
    setTimeout(() => {
      this.toggleNavigationIcon = opened ? 'ws:menu_collapse' : 'ws:menu_expand';
      this.toggleNavigationTooltip = opened ? 'collapse' : 'expand';
    });
  }

  /**
   * 切换设置
   */
  private _toggleSettings(item: WsNavigationItem): void {
    // 获取设置抽屉组件
    const settingsDrawer = this._wsDrawerService.getComponent('settingsDrawer');

    settingsDrawer.toggle();
  }

  /**
   * 添加分类
   */
  private _addMenu(event: PointerEvent, item: WsNavigationItem): void {
    this.EditItemDialog.hide();

    const addItemMenu: HTMLElement = this.AddItemMenu.nativeElement;

    // 添加分类菜单Dialog位置设置
    const { left, top } = this._getAddMenuDialogPosition(addItemMenu);
    this.AddItemDialog.position = { X: left, Y: top };

    this._toggleAddItemDialog();
  }

  /**
   * 切换添加分类Dialog
   */
  private _toggleAddItemDialog(): void {
    if (this.AddItemDialog.visible) {
      this.AddItemDialog.hide();
    } else {
      this.AddItemDialog.show();
    }
  }

  /**
   * 添加分类菜单
   * @returns
   */
  private _saveButtonClick: EmitType<object> = () => {
    // 如果表单无效则返回
    if (!this._classifyFormVerify()) return;

    // 禁用表单
    this.classifyForm.disable();

    // 动态分类菜单target绑定处理
    this.menuContextmenuTarget = '';

    // 添加分类菜单
    const sort = this.navigation.compact.length;
    this._navigationService.add({ ...this.classifyForm.value, sort }).subscribe({
      next: () => {
        this.classifyForm.enable();

        // 关闭添加分类菜单Dialog
        this.AddItemDialog.hide();
      },
      error: () => {
        this.classifyForm.enable();
      },
    });
  };

  /**
   * 修改分类菜单
   * @returns
   */
  private _editButtonClick: EmitType<object> = () => {
    // 如果表单无效则返回
    if (!this._classifyFormVerify()) return;

    // 数据是否修改过
    if (!this.classifyForm.dirty) {
      this._wsMessageService.toast('warning', '请修改数据!');
      return;
    }

    // 禁用表单
    this.classifyForm.disable();

    // 修改分类菜单
    const id = this.classifyMenuSelected.id;
    this._navigationService.edit({ ...this.classifyForm.value, id }).subscribe({
      next: () => {
        this.classifyForm.enable();

        // 关闭修改分类菜单Dialog
        this.EditItemDialog.hide();
      },
      error: () => {
        this.classifyForm.enable();
      },
    });
  };

  /**
   * 分类菜单表单验证
   * @returns
   */
  private _classifyFormVerify(): boolean {
    if (this.classifyForm.invalid) {
      const iconControl = this.classifyForm.get('icon');
      const titleControl = this.classifyForm.get('title');

      if (iconControl.hasError('required')) {
        iconControl.markAsTouched({ onlySelf: true });
        this._wsMessageService.toast('warning', '请选择图标!');
      } else if (titleControl.hasError('required')) {
        titleControl.markAsTouched({ onlySelf: true });
        this._wsMessageService.toast('warning', '请输入名称!');
      }

      return false;
    }

    return true;
  }

  /**
   * 获取分类菜单位置处理
   * @param {MouseEvent} event
   * @returns
   */
  private _getItemMenuPosition(event: Event): { left: number; top: number } {
    let left = 0,
      top = 0;

    const itemMenu: HTMLElement = find(event['path'], [
      'className',
      'ws-vertical-navigation-item-wrapper ws-menu-item',
    ]);

    if (itemMenu) {
      // 被选中的分类菜单信息
      this.classifyMenuSelected = this._wsNavigationService.getItem(
        itemMenu.id,
        this.navigation.compact,
      );

      // 被选中的分类菜单位置
      const clientRect = itemMenu.getBoundingClientRect();
      left = itemMenu.clientWidth + 8 * 2 + 6;
      top = clientRect.top;
    }

    return { left, top };
  }

  /**
   * 获取添加分类菜单Dialog位置处理
   * @param {HTMLElement} itemMenu
   * @returns
   */
  private _getAddMenuDialogPosition(itemMenu: HTMLElement): { left: number; top: number } {
    let left = 0,
      top = 0;

    if (itemMenu) {
      const clientRect = itemMenu.getBoundingClientRect();
      left = itemMenu.clientWidth + 6;
      top = clientRect.top - itemMenu.clientHeight / 2;
    }

    return { left, top };
  }
}
