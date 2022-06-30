import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { wsAnimations } from '@ws/animations';
import { WsMediaWatcherService } from '@ws/services/media-watcher';

@Component({
  selector: 'ws-masonry',
  templateUrl: './masonry.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
  exportAs: 'wsMasonry',
})
export class WsMasonryComponent implements OnChanges, AfterViewInit {
  // 列模板
  @Input() columnsTemplate: TemplateRef<any>;
  // 列数
  @Input() columns: number;
  // 分配到列中的项目
  @Input() items: any[] = [];
  distributedColumns: any[] = [];

  /**
   * 构造函数
   */
  constructor(private _wsMediaWatcherService: WsMediaWatcherService) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 列
    if ('columns' in changes) {
      // 分配项
      this._distributeItems();
    }

    // 项
    if ('items' in changes) {
      // 分配项
      this._distributeItems();
    }
  }

  /**
   * 视图初始化后
   */
  ngAfterViewInit(): void {
    // 第一次分配项
    this._distributeItems();
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 将项分配到列中
   */
  private _distributeItems(): void {
    // 如果没有项，则返回空数组
    if (this.items.length === 0) {
      this.distributedColumns = [];
      return;
    }

    // 准备分配到列的数组
    this.distributedColumns = Array.from(Array(this.columns), item => ({ items: [] }));

    // 将项目分发到列中
    for (let i = 0; i < this.items.length; i++) {
      this.distributedColumns[i % this.columns].items.push(this.items[i]);
    }
  }
}
