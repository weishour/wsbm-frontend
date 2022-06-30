import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { Shortcut } from 'app/layout/common/shortcuts/shortcuts.types';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'shortcuts',
  templateUrl: './shortcuts.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'shortcuts',
})
export class ShortcutsComponent implements OnInit, OnDestroy {
  @ViewChild('shortcutsOrigin') private _shortcutsOrigin: MatButton;
  @ViewChild('shortcutsPanel') private _shortcutsPanel: TemplateRef<any>;

  mode: 'view' | 'modify' | 'add' | 'edit' = 'view';
  shortcutForm: FormGroup;
  shortcuts: Shortcut[];
  trackByFn = this._wsUtilsService.trackByFn;

  private _overlayRef: OverlayRef;

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _shortcutsService: ShortcutsService,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _wsUtilsService: WsUtilsService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 初始化表单
    this.shortcutForm = this._formBuilder.group({
      id: [null],
      label: ['', Validators.required],
      description: [''],
      icon: ['', Validators.required],
      link: ['', Validators.required],
      useRouter: ['', Validators.required],
    });

    // 获取捷径数据
    this._shortcutsService.shortcuts$
      .pipe(untilDestroyed(this))
      .subscribe((shortcuts: Shortcut[]) => {
        // 加载捷径
        this.shortcuts = shortcuts;

        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {
    // 销毁遮罩
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 打开捷径面板
   */
  openPanel(): void {
    // 如果快捷方式面板或其原点未定义则返回
    if (!this._shortcutsPanel || !this._shortcutsOrigin) {
      return;
    }

    // 确保在'view'模式下启动
    this.mode = 'view';

    // 创建遮罩，如果它不存在
    if (!this._overlayRef) {
      this._createOverlay();
    }

    // 将门户附加到遮罩层上
    this._overlayRef.attach(new TemplatePortal(this._shortcutsPanel, this._viewContainerRef));
  }

  /**
   * 关闭面板
   */
  closePanel(): void {
    this._overlayRef.detach();
  }

  /**
   * 改变模式
   */
  changeMode(mode: 'view' | 'modify' | 'add' | 'edit'): void {
    // 改变模式
    this.mode = mode;
  }

  /**
   * 修改捷径
   */
  newShortcut(): void {
    // 重置表单
    this.shortcutForm.reset();

    // 进入新增模式
    this.mode = 'add';
  }

  /**
   * 修改捷径
   */
  editShortcut(shortcut: Shortcut): void {
    // 使用捷径数据重置表单
    this.shortcutForm.reset(shortcut);

    // 进入修改模式
    this.mode = 'edit';
  }

  /**
   * 保存捷径
   */
  save(): void {
    // 从表单中获取数据
    const shortcut = this.shortcutForm.value;

    // 如果有id，更新它…
    if (shortcut.id) {
      this._shortcutsService.update(shortcut.id, shortcut).subscribe();
    }
    // 否则，创建一个新的捷径…
    else {
      this._shortcutsService.create(shortcut).subscribe();
    }

    // 返回修改模式
    this.mode = 'modify';
  }

  /**
   * 删除捷径
   */
  delete(): void {
    // 从表单中获取数据
    const shortcut = this.shortcutForm.value;

    // 删除
    this._shortcutsService.delete(shortcut.id).subscribe();

    // 返回修改模式
    this.mode = 'modify';
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 创建遮罩
   */
  private _createOverlay(): void {
    // 创建遮罩
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: 'ws-backdrop-on-mobile',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._shortcutsOrigin._elementRef.nativeElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ]),
    });

    // 在背景上点击分离门户的遮罩层
    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }
}
