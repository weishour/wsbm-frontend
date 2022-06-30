import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnChanges,
  Renderer2,
  SecurityContext,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { WsHighlightService } from '@ws/components/highlight/highlight.service';

@Component({
  selector: 'textarea[ws-highlight]',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'wsHighlight',
})
export class WsHighlightComponent implements OnChanges, AfterViewInit {
  // 要突出显示的一段代码
  @Input() code: string;
  // 突出显示代码的语言 (https://highlightjs.org/usage/)
  @Input() lang: string;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  highlightedCode: string;
  private _viewRef: EmbeddedViewRef<any>;

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _domSanitizer: DomSanitizer,
    private _elementRef: ElementRef,
    private _renderer2: Renderer2,
    private _wsHighlightService: WsHighlightService,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 代码或者语言
    if ('code' in changes || 'lang' in changes) {
      // 如果viewContainerRef不可用则返回
      if (!this._viewContainerRef.length) {
        return;
      }

      // 突出显示并插入代码
      this._highlightAndInsert();
    }
  }

  /**
   * 视图初始化后
   */
  ngAfterViewInit(): void {
    // 如果没有语言设置则返回
    if (!this.lang) {
      return;
    }

    // 如果没有代码输入，则从文本区域获取代码
    if (!this.code) {
      // 获取代码
      this.code = this._elementRef.nativeElement.value;
    }

    // 突出显示并插入
    this._highlightAndInsert();
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 突出显示并插入突出显示的代码
   *
   * @private
   */
  private _highlightAndInsert(): void {
    // 如果模板引用不可用则返回
    if (!this.templateRef) {
      return;
    }

    // 如果代码或语言未定义则返回
    if (!this.code || !this.lang) {
      return;
    }

    // 如果已经有组件，则销毁该组件
    if (this._viewRef) {
      this._viewRef.destroy();
      this._viewRef = null;
    }

    // 突出显示并清除代码，以防万一
    this.highlightedCode = this._domSanitizer.sanitize(
      SecurityContext.HTML,
      this._wsHighlightService.highlight(this.code, this.lang),
    );

    // 如果高亮显示的代码为空则返回
    if (this.highlightedCode === null) {
      return;
    }

    // 渲染并插入模板
    this._viewRef = this._viewContainerRef.createEmbeddedView(this.templateRef, {
      highlightedCode: this.highlightedCode,
      lang: this.lang,
    });

    // 检测的变化
    this._viewRef.detectChanges();
  }
}
