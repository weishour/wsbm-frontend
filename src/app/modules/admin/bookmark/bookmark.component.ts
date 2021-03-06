import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { wsAnimations } from '@ws/animations';
import { WsConfigService } from '@ws/services/config';
import { WsConfirmationService } from '@ws/services/confirmation';
import {
  WsNavigationItem,
  WsNavigationService,
  WsVerticalNavigationComponent,
} from '@ws/components/navigation';
import { AppConfig, AY_50 } from 'app/core/config';
import { NavigationService } from 'app/core/navigation';
import { LabelGroupService, LabelGroup } from 'app/core/label-group';
import { Label, LabelService } from 'app/core/label';
import {
  AccordionComponent,
  ExpandEventArgs,
  AccordionClickArgs,
  MenuEventArgs,
  BeforeOpenCloseMenuEventArgs,
  ContextMenuComponent,
} from '@syncfusion/ej2-angular-navigations';
import { EmitType, closest } from '@syncfusion/ej2-base';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment';
import { some, find, isUndefined, remove } from 'lodash-es';
import { filter } from 'rxjs';
import { BookmarkGroupComponent } from './group/group.component';
import { DrawerLabelData } from './label/label.types';

@UntilDestroy()
@Component({
  selector: 'ws-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
})
export class BookmarkComponent implements OnInit, AfterViewInit {
  @ViewChild('acrdnInstance') acrdnInstance: AccordionComponent;
  @ViewChild('labelDrawer') labelDrawer: MatDrawer;
  @ViewChild('labelContextmenu') labelContextmenu: ContextMenuComponent;

  /** ?????????????????? */
  fileUrl = `${environment.BASE_API}files/`;
  /** ???????????? */
  AY_50 = AY_50;
  /** ?????????????????? */
  activeNavigation: WsNavigationItem;
  /** ?????????????????? */
  accordionClickEventArgs: Event;
  /** ?????????????????? */
  labelGroups: LabelGroup[];
  /** ???????????????????????? */
  drawerLabelData: DrawerLabelData;
  /** ??????????????? */
  currentColor: string;

  /** ????????????????????????????????? */
  labelContextmenuTarget = '';
  /** ?????????????????? */
  labelGroupSelected: LabelGroup;
  /** ?????????????????? */
  labelSelected: Label;

  /**
   * ????????????
   */
  constructor(
    public navigationService: NavigationService,
    @Inject(DOCUMENT) private _document: Document,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _wsConfigService: WsConfigService,
    private _translocoService: TranslocoService,
    private _wsNavigationService: WsNavigationService,
    private _labelGroupService: LabelGroupService,
    private _labelService: LabelService,
    private _wsConfirmationService: WsConfirmationService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ ??????????????????
  // ----------------------------------------------------------------------------

  /**
   * ???????????????
   */
  ngOnInit(): void {
    // ??????????????????
    this._wsConfigService.config$.pipe(untilDestroyed(this)).subscribe((config: AppConfig) => {
      const currentTheme = find(config.themes, { id: config.theme });
      this.currentColor = currentTheme.color;
    });

    // ??????NavigationEnd??????
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(() => {
        this._initParams();
        this.initGroup();
      });
  }

  /**
   * ??????????????????
   */
  ngAfterViewInit(): void {
    this._initParams();
    this.initGroup();

    // ??????????????????????????????
    this.labelContextmenu.items = [
      {
        id: 'edit',
        text: '??????',
        iconCss: 'e-icons e-edit',
      },
      {
        id: 'delete',
        text: '??????',
        iconCss: 'e-icons e-delete-5',
      },
    ];
  }

  // ----------------------------------------------------------------------------
  // @ ????????????
  // ----------------------------------------------------------------------------

  /**
   * ????????????
   */
  initGroup(): void {
    this._labelGroupService.getClassifyGroups(this.activeNavigation.id).subscribe({
      next: (data) => {
        this.accordionClickEventArgs = undefined;
        this._contextmenuTarget(data);
        this.labelGroups = data;
      },
    });
  }

  /**
   * ????????????
   */
  addGroup(): void {
    const dialogRef = this._matDialog.open(BookmarkGroupComponent, {
      data: {
        action: 'add',
        activeNavigation: this.activeNavigation,
        count: this.labelGroups.length,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'object') {
        this.labelGroups.push(result);
      }
    });
  }

  /**
   * ????????????
   */
  editGroup(event: MouseEvent, labelGroup: LabelGroup): void {
    event.stopPropagation();

    const dialogRef = this._matDialog.open(BookmarkGroupComponent, {
      data: {
        action: 'edit',
        activeNavigation: this.activeNavigation,
        labelGroup,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'object') {
        this.labelGroups.map((labelGroup) => {
          if (labelGroup.id == result.id) labelGroup.title = result.title;
          return labelGroup;
        });
      }
    });
  }

  /**
   * ????????????
   */
  removeGroup(event: MouseEvent, labelGroup: LabelGroup): void {
    event.stopPropagation();

    const dialogRef = this._wsConfirmationService.show(
      'warning',
      '????????????',
      '????????????????????????????????????????????????',
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        // ????????????
        this._labelGroupService.remove(labelGroup.id).subscribe({
          next: (data) => remove(this.labelGroups, ['id', data.id]),
        });
      }
    });
  }

  /**
   * ????????????????????????
   * @param {ExpandEventArgs} event
   * @returns
   */
  accordionExpanding(event: ExpandEventArgs): void {
    if (!isUndefined(this.accordionClickEventArgs)) {
      const header = closest(this.accordionClickEventArgs?.target as Element, '.e-acrdn-header'),
        buttonEle = closest(this.accordionClickEventArgs.target as Element, '.e-toggle-icon');

      if (header && !buttonEle) event.cancel = true;
    }
  }

  /**
   * ??????????????????
   * @param {AccordionClickArgs} args
   */
  accordionClicked(args: AccordionClickArgs): void {
    this.accordionClickEventArgs = args.originalEvent;
  }

  /**
   * ????????????????????????
   * @param event
   */
  labelGroupDrop(event: CdkDragDrop<LabelGroup[]>) {
    if (event.previousIndex !== event.currentIndex) {
      // ????????????????????????
      moveItemInArray(this.labelGroups, event.previousIndex, event.currentIndex);

      // ??????????????????
      const menuId = this.activeNavigation.id;
      const ids = this.labelGroups.map((labelGroup) => labelGroup.id);
      this._labelGroupService.sort(menuId, ids).subscribe();
    }
  }

  /**
   * ????????????
   * @param {LabelGroup} labelGroup
   */
  addLabel(labelGroup: LabelGroup): void {
    this.drawerLabelData = {
      action: 'add',
      activeNavigation: this.activeNavigation,
      labelGroups: this.labelGroups,
      labelGroup,
      count: 0,
      currentColor: this.currentColor,
    };
    this.labelDrawer.open('program');
  }

  /**
   * ??????????????????
   * @param {MouseEvent} event
   */
  onLabelContextMenu(event: MouseEvent, label: Label): void {
    this.labelGroupSelected = this.labelGroups.find((labelGroup) =>
      some(labelGroup.labels, ['id', label.id]),
    );
    this.labelSelected = label;
  }

  /**
   * ????????????????????????????????????
   */
  labelContextMenubeforeOpen: EmitType<object> = (args: BeforeOpenCloseMenuEventArgs): void => {};

  /**
   * ????????????????????????????????????
   */
  labelContextMenuSelect(args: MenuEventArgs): void {
    const item = args.item;

    switch (item.id) {
      case 'edit':
        this.drawerLabelData = {
          action: 'edit',
          activeNavigation: this.activeNavigation,
          labelGroups: this.labelGroups,
          labelGroup: this.labelGroupSelected,
          label: this.labelSelected,
          count: 0,
          currentColor: this.currentColor,
        };
        this.labelDrawer.open('program');
        break;
      case 'delete':
        // ????????????
        this._labelService.remove(this.labelSelected.id).subscribe({
          next: (data) => remove(this.labelGroupSelected.labels, ['id', data.id]),
        });
        break;
    }
  }

  /**
   * ???????????????????????????????????????
   * @param {Label} label
   */
  addLabelComplete(label: Label): void {
    // ????????????target????????????
    this.labelContextmenuTarget = '';

    const labelGroup = this.labelGroups.find((labelGroup) => labelGroup.id === label.group.id);
    if (labelGroup.labels) {
      labelGroup.labels.push(label);
    } else {
      labelGroup.labels = [label];
    }

    this._contextmenuTarget(this.labelGroups);
  }

  /**
   * ???????????????????????????????????????
   * @param {Label} label
   */
  editLabelComplete(label: Label): void {
    // ????????????target????????????
    this.labelContextmenuTarget = '';

    const labelGroup = this.labelGroups.find((labelGroup) => labelGroup.id === label.group.id);
    labelGroup.labels = labelGroup.labels.map((labelData) =>
      labelData.id === label.id ? label : labelData,
    );

    this._contextmenuTarget(this.labelGroups);
  }

  // ----------------------------------------------------------------------------
  // @ ????????????
  // ----------------------------------------------------------------------------

  /**
   * ???????????????
   */
  private _initParams(): void {
    const group = this._activatedRoute.snapshot.params?.group;
    const link = `/bookmark/${group}`;

    const navComponent =
      this._wsNavigationService.getComponent<WsVerticalNavigationComponent>('mainNavigation');

    // ????????????????????????
    const navigation = navComponent.navigation;

    this.activeNavigation =
      group !== 'home'
        ? find(navigation, { link })
        : {
            id: 'home',
            title: this._translocoService.translate('navigation.home'),
            translation: 'navigation.home',
            type: 'basic',
            icon: 'heroicons_outline:home',
            link: '/bookmark/home',
          };
  }

  /**
   * ???????????????
   */
  private _contextmenuTarget(labelGroups: LabelGroup[]): void {
    const labelGroup = labelGroups.find(
      (labelGroup) => labelGroup?.labels && labelGroup.labels.length > 0,
    );
    setTimeout(
      () => (this.labelContextmenuTarget = labelGroup?.labels.length > 0 ? '.label-card' : ''),
    );
  }
}
