import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { WsVerticalNavigationComponent } from '@ws/components/navigation/vertical/vertical.component';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ws-vertical-navigation-basic-item',
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsVerticalNavigationBasicItemComponent implements OnInit, OnDestroy {
  @Input() item: WsNavigationItem;
  @Input() name: string;
  // 导航项被右击后发出的事件
  @Output() readonly contextMenu: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  isActiveMatchOptions: IsActiveMatchOptions;
  private _wsVerticalNavigationComponent: WsVerticalNavigationComponent;

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _wsNavigationService: WsNavigationService,
    private _wsUtilsService: WsUtilsService,
  ) {
    // 将等效{exact: false}设置为活动匹配选项的默认值。我们不分配项目。
    // isActiveMatchOptions直接指向[routerLinkActiveOptions]，因为如果它一开始是"undefined"，路由器会抛出一个错误并停止工作。
    this.isActiveMatchOptions = this._wsUtilsService.subsetMatchOptions;
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 从项目的“isActiveMatchOptions”或项目的“exactMatch”选项的等效形式设置“isActiveMatchOptions”
    this.isActiveMatchOptions =
      this.item.isActiveMatchOptions ?? this.item.exactMatch
        ? this._wsUtilsService.exactMatchOptions
        : this._wsUtilsService.subsetMatchOptions;

    // 获取父导航组件
    this._wsVerticalNavigationComponent = this._wsNavigationService.getComponent(this.name);

    // 检测变更
    this._changeDetectorRef.markForCheck();

    // 在导航组件上订阅onRefreshed
    this._wsVerticalNavigationComponent.onRefreshed
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // 注册导航项组件
        this._wsNavigationService.registerComponent(this.item.id, this);

        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {
    // 从注册表中注销导航组件
    this._wsNavigationService.deregisterComponent(this.item.id);
  }

  /**
   * 右击事件
   * @param {MouseEvent} event
   */
  onContextMenu(event: MouseEvent): void {
    this.contextMenu.next(event);
  }
}
