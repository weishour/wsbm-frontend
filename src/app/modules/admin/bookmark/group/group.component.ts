import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WsMessageService } from '@ws/services/message';
import { LabelGroupService } from 'app/core/label-group';
import { DialogGroupData } from './group.types';

@Component({
  selector: 'bookmark-group',
  templateUrl: './group.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class BookmarkGroupComponent implements OnInit {
  /** 操作类型 */
  action: string;
  /** 操作名称 */
  actionName: string;
  /** 分组表单 */
  groupForm: FormGroup;

  /**
   * 构造函数
   */
  constructor(
    public matDialogRef: MatDialogRef<BookmarkGroupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogGroupData,
    private _formBuilder: FormBuilder,
    private _labelGroupService: LabelGroupService,
    private _wsMessageService: WsMessageService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ 生命周期钩子
  // -----------------------------------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    this.action = this.dialogData.action;
    this.actionName = this.action === 'add' ? '添加' : '修改';

    // 创建分组表单
    this.groupForm = this._formBuilder.group({
      title: ['', Validators.required],
    });

    // 修改赋值
    if (this.action === 'edit') {
      this.groupForm.setValue({
        title: this.dialogData.labelGroup.title,
      });
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ 公共方法
  // -----------------------------------------------------------------------------------------------------

  /**
   * 右上角关闭弹窗
   */
  close(): void {
    // 关闭弹窗
    this.matDialogRef.close('close');
  }

  /**
   * 添加
   */
  add(): void {
    // 如果表单无效则返回
    if (!this._groupFormVerify()) return;

    // 禁用表单
    this.groupForm.disable();

    const menuId = this.dialogData.activeNavigation.id;
    const sort = this.dialogData.count;
    this._labelGroupService.add({ ...this.groupForm.value, menuId, sort }).subscribe({
      next: (data) => {
        this.groupForm.enable();

        // 关闭添加分类菜单Dialog
        this.matDialogRef.close(data);
      },
      error: () => {
        this.groupForm.enable();
      },
    });
  }

  /**
   * 修改
   */
  edit(): void {
    // 如果表单无效则返回
    if (!this._groupFormVerify()) return;

    // 数据是否修改过
    if (!this.groupForm.dirty) {
      this._wsMessageService.toast('warning', '请修改数据!');
      return;
    }

    // 禁用表单
    this.groupForm.disable();

    const id = this.dialogData.labelGroup.id;
    this._labelGroupService.edit({ ...this.groupForm.value, id }).subscribe({
      next: (data) => {
        this.groupForm.enable();

        // 关闭添加分类菜单Dialog
        this.matDialogRef.close(data);
      },
      error: () => {
        this.groupForm.enable();
      },
    });
  }

  /**
   * 取消
   */
  cancel(): void {
    // 关闭弹窗
    this.matDialogRef.close('cancel');
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 分组表单验证
   * @returns
   */
  private _groupFormVerify(): boolean {
    if (this.groupForm.invalid) {
      const titleControl = this.groupForm.get('title');

      if (titleControl.hasError('required')) {
        titleControl.markAsTouched({ onlySelf: true });
        this._wsMessageService.toast('warning', '请输入名称!');
      }

      return false;
    }

    return true;
  }
}
