import { Injectable } from '@angular/core';

// import { WsDialogService } from '@ws/services';
// import { HttpStatus } from '@ws/providers';
import {
    GridLine,
    ToolbarItems,
    EditSettingsModel,
    SortSettingsModel,
    PageSettingsModel,
    GroupSettingsModel,
    FilterSettingsModel,
    SearchSettingsModel,
    RowDropSettingsModel,
    TextWrapSettingsModel,
    SelectionSettingsModel,
    FailureEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { isUndefined } from '@syncfusion/ej2-base';

@Injectable({ providedIn: 'root' })
export class GridProvider {
    constructor(
        // private _wsDialogService: WsDialogService,
    ){

    }

    // 表格线
    readonly gridLines: GridLine = 'Default';

    // 工具栏
    readonly toolbar: ToolbarItems | object = [
        'Add',
        'Edit',
        'Delete',
        { type: 'Separator' },
        'Print',
        { type: 'Separator' },
        { text: '刷新', tooltipText: '刷新', prefixIcon: 'e-refresh', id: 'refresh' },
        'Search',
    ];

    // 编辑设置
    readonly EditSettings: EditSettingsModel = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog',
        allowEditOnDblClick: true,
        showConfirmDialog: true,
        showDeleteConfirmDialog: true,
        template: '',
        newRowPosition: 'Top',
        dialog: {},
        allowNextRowEdit: false
    };

    // 排序设置
    readonly SortSettings: SortSettingsModel = {
        columns: [],
        allowUnsort: true
    };

    // 分页设置
    readonly PageSettings: PageSettingsModel = {
        pageSize: 20,
        pageCount: 8,
        currentPage: 1,
        enableQueryString: false,
        pageSizes: true,
        template: null
    };

    // 分组设置
    readonly GroupSettings: GroupSettingsModel = {
        showDropArea: true,
        showToggleButton: false,
        showGroupedColumn: true,
        showUngroupButton: true,
        disablePageWiseAggregates: false,
        columns: [],
        captionTemplate: ''
    };

    // 过滤设置
    readonly FilterSettings: FilterSettingsModel = {
        columns: [],
        type: 'Excel',
        mode: 'Immediate',
        showFilterBarStatus: true,
        immediateModeDelay: 1500,
        operators: null,
        ignoreAccent: false,
        enableCaseSensitivity: false
    };

    // 搜索设置
    readonly SearchSettings: SearchSettingsModel = {
        fields: [],
        key: '',
        operator: 'contains',
        ignoreCase: true,
        ignoreAccent: false
    };

    // 拖拽设置
    readonly RowDropSettings: RowDropSettingsModel = {
        targetID: null
    };

    // 换行设置
    readonly TextWrapSettings: TextWrapSettingsModel = {
        wrapMode: 'Content'
    };

    // 选择设置
    readonly SelectionSettings: SelectionSettingsModel = {
        mode: 'Row',
        cellSelectionMode: 'Flow',
        type: 'Single',
        checkboxOnly: false,
        persistSelection: false,
        checkboxMode: 'ResetOnRowClick',
        enableSimpleMultiRowSelection: false,
        enableToggle: true
    };

    // 操作失败
    actionFailure(args: FailureEventArgs): void {
        const Request: XMLHttpRequest = isUndefined(args.error) ? args[0].error : args.error[0].error;

        // this._wsDialogService.requestError({
        //     title: `${Request.status} ${HttpStatus[Request.status]}`,
        //     url: Request.responseURL,
        //     message: Request.response
        // });
    }
}
