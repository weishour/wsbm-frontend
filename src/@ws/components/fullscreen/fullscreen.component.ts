import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FSDocument, FSDocumentElement } from '@ws/components/fullscreen/fullscreen.types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, debounceTime } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ws-fullscreen',
  templateUrl: './fullscreen.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'wsFullscreen',
})
export class WsFullscreenComponent implements OnInit {
  // 图标的模板
  @Input() iconTpl: TemplateRef<any>;
  // 切换按钮的工具提示
  @Input() tooltip: string;

  defaultIcon = 'feather:maximize';
  defaultTooltip = 'fullscreen';

  private _fsDoc: FSDocument;
  private _fsDocEl: FSDocumentElement;
  private _isFullscreen: boolean = false;

  /**
   * 构造函数
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this._fsDoc = _document as FSDocument;
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    this._fsDocEl = document.documentElement as FSDocumentElement;

    // ESC按键退出全屏处理
    fromEvent(window, 'resize').pipe(
      untilDestroyed(this),
      debounceTime(300),
    ).subscribe(_ => {
      // 处理页面变化时的操作
      if (this._getBrowserFullscreenElement() == null && this._isFullscreen) {
        if (this._isFullscreen) {
          this.defaultIcon = 'feather:maximize';
          this.defaultTooltip = 'fullscreen';
        } else {
          this.defaultIcon = 'feather:minimize';
          this.defaultTooltip = 'fullscreen_exit';
        }
      }

      // 检查是否打开全屏
      this._isFullscreen = this._getBrowserFullscreenElement() !== null;

      this._changeDetectorRef.markForCheck();
    });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 切换全屏模式
   */
  toggleFullscreen(): void {
    // 检查是否打开全屏
    this._isFullscreen = this._getBrowserFullscreenElement() !== null;

    // 切换全屏
    if (this._isFullscreen) {
      this._closeFullscreen();
      this.defaultIcon = 'feather:maximize';
      this.defaultTooltip = 'fullscreen';
    } else {
      this._openFullscreen();
      this.defaultIcon = 'feather:minimize';
      this.defaultTooltip = 'fullscreen_exit';
    }
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 获取浏览器的全屏元素
   *
   * @private
   */
  private _getBrowserFullscreenElement(): Element {
    if (typeof this._fsDoc.fullscreenElement !== 'undefined') {
      return this._fsDoc.fullscreenElement;
    }

    if (typeof this._fsDoc.mozFullScreenElement !== 'undefined') {
      return this._fsDoc.mozFullScreenElement;
    }

    if (typeof this._fsDoc.msFullscreenElement !== 'undefined') {
      return this._fsDoc.msFullscreenElement;
    }

    if (typeof this._fsDoc.webkitFullscreenElement !== 'undefined') {
      return this._fsDoc.webkitFullscreenElement;
    }

    throw new Error('此浏览器不支持全屏模式');
  }

  /**
   * 打开全屏
   *
   * @private
   */
  private _openFullscreen(): void {
    if (this._fsDocEl.requestFullscreen) {
      this._fsDocEl.requestFullscreen();
      return;
    }

    // Firefox
    if (this._fsDocEl.mozRequestFullScreen) {
      this._fsDocEl.mozRequestFullScreen();
      return;
    }

    // Chrome, Safari and Opera
    if (this._fsDocEl.webkitRequestFullscreen) {
      this._fsDocEl.webkitRequestFullscreen();
      return;
    }

    // IE/Edge
    if (this._fsDocEl.msRequestFullscreen) {
      this._fsDocEl.msRequestFullscreen();
      return;
    }
  }

  /**
   * 关闭全屏
   *
   * @private
   */
  private _closeFullscreen(): void {
    if (this._fsDoc.exitFullscreen) {
      this._fsDoc.exitFullscreen();
      return;
    }

    // Firefox
    if (this._fsDoc.mozCancelFullScreen) {
      this._fsDoc.mozCancelFullScreen();
      return;
    }

    // Chrome, Safari and Opera
    if (this._fsDoc.webkitExitFullscreen) {
      this._fsDoc.webkitExitFullscreen();
      return;
    }

    // IE/Edge
    else if (this._fsDoc.msExitFullscreen) {
      this._fsDoc.msExitFullscreen();
      return;
    }
  }
}
