import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { MatMenu } from '@angular/material/menu';
import { WsHorizontalNavigationComponent } from '@ws/components/navigation/horizontal/horizontal.component';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ws-horizontal-navigation-branch-item',
  templateUrl: './branch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsHorizontalNavigationBranchItemComponent implements OnInit {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_child: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() child: boolean = false;
  @Input() item: WsNavigationItem;
  @Input() name: string;
  @ViewChild('matMenu', { static: true }) matMenu: MatMenu;

  trackByFn = this._wsUtilsService.trackByFn;

  private _wsHorizontalNavigationComponent: WsHorizontalNavigationComponent;

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
   * 组件初始化
   */
  ngOnInit(): void {
    // 获取父导航组件
    this._wsHorizontalNavigationComponent = this._wsNavigationService.getComponent(this.name);

    // 在导航组件上订阅onRefreshed
    this._wsHorizontalNavigationComponent.onRefreshed
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 触发变更检测
   */
  triggerChangeDetection(): void {
    // 检测变更
    this._changeDetectorRef.markForCheck();
  }
}
