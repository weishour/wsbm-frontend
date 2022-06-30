import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { WsConfirmationDialogComponent } from '@ws/services/confirmation/dialog/dialog.component';
import {
  WsConfirmationConfig,
  ConfirmationIconType,
} from '@ws/services/confirmation/confirmation.types';
import { merge } from 'lodash-es';

@Injectable()
export class WsConfirmationService {
  private _defaultConfig: WsConfirmationConfig = {
    title: '确认操作',
    message: '您确定要确认此操作吗?',
    icon: {
      show: true,
      name: 'heroicons_outline:exclamation',
      color: 'warning',
    },
    dismissible: false,
  };

  /**
   * 构造函数
   */
  constructor(private _matDialog: MatDialog, private _translocoService: TranslocoService) {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 带有状态的确认框
   * @param {ConfirmationIconType} status
   * @param {string} title
   * @param {string} message
   * @param {WsConfirmationConfig} config
   * @returns
   */
  show(
    status: ConfirmationIconType,
    title: string,
    message: string,
    config: WsConfirmationConfig = {},
  ): MatDialogRef<WsConfirmationDialogComponent> {
    const showConfig: WsConfirmationConfig = {
      title,
      message,
      icon: this._defaultConfig.icon,
    };

    // icon图标
    switch (status) {
      case 'info':
        showConfig.icon.name = 'heroicons_outline:information-circle';
        break;
      case 'success':
        showConfig.icon.name = 'heroicons_outline:check-circle';
        break;
      case 'warning':
        showConfig.icon.name = 'heroicons_outline:exclamation';
        break;
      case 'error':
        showConfig.icon.name = 'heroicons_outline:x-circle';
        break;
      default:
        showConfig.icon.show = false;
        break;
    }

    // icon颜色
    showConfig.icon.color = status;

    // 将用户配置与配置合并
    const userConfig = merge({}, config, showConfig);

    // 打开确认框
    return this.open(userConfig);
  }

  /**
   * 打开确认框
   * @param {WsConfirmationConfig} config
   * @returns
   */
  open(config: WsConfirmationConfig = {}): MatDialogRef<WsConfirmationDialogComponent> {
    this._defaultConfig.actions = {
      confirm: {
        show: true,
        label: this._translocoService.translate('common.confirm'),
        color: 'primary',
      },
      cancel: {
        show: true,
        label: this._translocoService.translate('common.cancel'),
      },
    };

    // 将用户配置与默认配置合并
    const userConfig = merge({}, this._defaultConfig, config);

    // 打开对话框
    return this._matDialog.open(WsConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: 'ws-confirmation-dialog-panel',
    });
  }
}
