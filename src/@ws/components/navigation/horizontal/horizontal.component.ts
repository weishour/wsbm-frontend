import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { wsAnimations } from '@ws/animations';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'ws-horizontal-navigation',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss'],
  animations: wsAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'wsHorizontalNavigation',
})
export class WsHorizontalNavigationComponent implements OnChanges, OnInit, OnDestroy {
  // 唯一名称
  @Input() name: string = this._wsUtilsService.randomId();
  // 导航项数组
  @Input() navigation: WsNavigationItem[];

  trackByFn = this._wsUtilsService.trackByFn;
  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _wsNavigationService: WsNavigationService,
    private _wsUtilsService: WsUtilsService,
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
    // 导航
    if ('navigation' in changes) {
      // 检测变更
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 确保名称输入不是空字符串
    if (this.name === '') {
      this.name = this._wsUtilsService.randomId();
    }

    // 注册导航组件
    this._wsNavigationService.registerComponent(this.name, this);
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {
    // 从注册表中注销导航组件
    this._wsNavigationService.deregisterComponent(this.name);
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 刷新组件以应用更改
   */
  refresh(): void {
    // 检测变更
    this._changeDetectorRef.markForCheck();

    // 执行可观察对象
    this.onRefreshed.next(true);
  }
}
