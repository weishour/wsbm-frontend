import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { wsAnimations } from '@ws/animations/public-api';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, map } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'wsSearch',
  animations: wsAnimations,
})
export class SearchComponent implements OnChanges, OnInit {
  // 外观 (basic将显示一个简单的搜索字段。bar将显示一个覆盖标题的下拉栏)
  @Input() appearance: 'basic' | 'bar' = 'basic';
  // 抖动的毫秒数
  @Input() debounce: number = 300;
  // 搜索值的最小长度
  @Input() minLength: number = 2;
  // 搜索发生后发出的事件
  @Output() search: EventEmitter<any> = new EventEmitter<any>();

  opened: boolean = false;
  resultSets: any[];
  searchControl: FormControl = new FormControl();
  trackByFn = this._wsUtilsService.trackByFn;

  private _matAutocomplete: MatAutocomplete;

  /**
   * 构造函数
   */
  constructor(
    private _elementRef: ElementRef,
    private _httpClient: HttpClient,
    private _renderer2: Renderer2,
    private _wsUtilsService: WsUtilsService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 组件类的HostBinding
   */
  @HostBinding('class') get classList(): any {
    return {
      'search-appearance-bar': this.appearance === 'bar',
      'search-appearance-basic': this.appearance === 'basic',
      'search-opened': this.opened,
    };
  }

  /**
   * 搜索栏输入框访问器
   *
   * @param value
   */
  @ViewChild('barSearchInput')
  set barSearchInput(value: ElementRef) {
    // 如果该值存在，这意味着搜索输入现在在DOM中，我们可以聚焦输入。
    if (value) {
      // 给Angular一些时间来完成变更检测周期
      setTimeout(() => {
        // 聚焦输入元素
        value.nativeElement.focus();
      });
    }
  }

  /**
   * 自动完成引用访问器
   *
   * @param value
   */
  @ViewChild('matAutocomplete')
  set matAutocomplete(value: MatAutocomplete) {
    this._matAutocomplete = value;
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 外观
    if ('appearance' in changes) {
      // 为防止出现任何问题，请在更改外观后关闭搜索
      this.close();
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅搜索字段值更改
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounce),
        untilDestroyed(this),
        map((value) => {
          // 设置resultSets为空，如果没有值或值的长度小于minLength，这样自动完成面板可以关闭
          if (!value || value.length < this.minLength) {
            this.resultSets = null;
          }

          // 继续
          return value;
        }),
        // 过滤掉undefined/null/false语句，也过滤掉小于minLength的值
        filter((value) => value && value.length >= this.minLength),
      )
      .subscribe((value) => {
        this._httpClient
          .post('api/common/search', { query: value })
          .subscribe((resultSets: any) => {
            // 存储结果集
            this.resultSets = resultSets;

            // 执行事件
            this.search.next(resultSets);
          });
      });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 按下键的搜索输入
   *
   * @param event
   */
  onKeydown(event: KeyboardEvent): void {
    // 按下ESC
    if (event.code === 'Escape') {
      // 如果外观是'bar'并且自动完成没有打开，监听escape键关闭搜索
      if (this.appearance === 'bar' && !this._matAutocomplete.isOpen) {
        this.close();
      }
    }
  }

  /**
   * 打开搜素用于工具栏
   */
  open(): void {
    // 如果它已经打开，则返回
    if (this.opened) {
      return;
    }

    // 打开搜素
    this.opened = true;
  }

  /**
   * 关闭搜索用于工具栏
   */
  close(): void {
    // 如果它已经关闭，则返回
    if (!this.opened) {
      return;
    }

    // 清除搜索输入
    this.searchControl.setValue('');

    // 关闭搜索
    this.opened = false;
  }
}
