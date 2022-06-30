import { DOCUMENT } from '@angular/common';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WsLoadingService {
  private _auto$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private _mode$: BehaviorSubject<'determinate' | 'indeterminate'> = new BehaviorSubject<
    'determinate' | 'indeterminate'
  >('indeterminate');
  private _progress$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(0);
  private _show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _urlMap: Map<string, boolean> = new Map<string, boolean>();

  private _loadingScreenEl: Element;
  private _player: AnimationPlayer;
  private _renderer: Renderer2;

  /**
   * 构造函数
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _animationBuilder: AnimationBuilder,
    private _rendererFactory2: RendererFactory2,
  ) {
    this._loadingInit();
  }

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 自动模式可观察对象访问器
   */
  get auto$(): Observable<boolean> {
    return this._auto$.asObservable();
  }

  /**
   * 模式可观察对象访问器
   */
  get mode$(): Observable<'determinate' | 'indeterminate'> {
    return this._mode$.asObservable();
  }

  /**
   * 进度可观察对象访问器
   */
  get progress$(): Observable<number> {
    return this._progress$.asObservable();
  }

  /**
   * 显示可观察对象访问器
   */
  get show$(): Observable<boolean> {
    return this._show$.asObservable();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 显示加载条
   */
  show(): void {
    this._show$.next(true);
  }

  /**
   * 隐藏加载条
   */
  hide(): void {
    this._show$.next(false);
  }

  /**
   * 设置自动模式
   *
   * @param value
   */
  setAutoMode(value: boolean): void {
    this._auto$.next(value);
  }

  /**
   * 设置模式
   *
   * @param value
   */
  setMode(value: 'determinate' | 'indeterminate'): void {
    this._mode$.next(value);
  }

  /**
   * 手动设置进度条
   *
   * @param value
   */
  setProgress(value: number): void {
    if (value < 0 || value > 100) {
      console.error('Progress value must be between 0 and 100!');
      return;
    }

    this._progress$.next(value);
  }

  /**
   * 显示全局loading
   */
  showFull(): void {
    this._renderer.setStyle(this._loadingScreenEl, 'display', 'block');

    this._player = this._animationBuilder
      .build([
        style({ opacity: '0', zIndex: '99999' }),
        animate('400ms ease', style({ opacity: '1' })),
      ])
      .create(this._loadingScreenEl);

    setTimeout(() => this._player.play(), 0);
  }

  /**
   * 隐藏全局loading
   */
  hideFull(): void {
    this._player = this._animationBuilder
      .build([
        style({ opacity: '1' }),
        animate('400ms ease', style({ opacity: '0', zIndex: '-10' })),
      ])
      .create(this._loadingScreenEl);

    setTimeout(() => this._player.play(), 0);
  }

  /**
   * 设置给定url的加载状态
   *
   * @param status
   * @param url
   */
  _setLoadingStatus(status: boolean, url: string): void {
    // 如果没有提供url，则返回
    if (!url) {
      console.error('The request URL must be provided!');
      return;
    }

    if (status === true) {
      this._urlMap.set(url, status);
      this._show$.next(true);
    } else if (status === false && this._urlMap.has(url)) {
      this._urlMap.delete(url);
    }

    // 只有在所有外发请求完成时才将状态设置为“false”
    if (this._urlMap.size === 0) {
      this._show$.next(false);
    }
  }

  /**
   * loading初始化
   *
   * @private
   */
  private _loadingInit(): void {
    this._renderer = this._rendererFactory2.createRenderer(null, null);

    // 获取全局loading元素
    this._loadingScreenEl = this._document.body.querySelector('#ws-loading');
  }
}
