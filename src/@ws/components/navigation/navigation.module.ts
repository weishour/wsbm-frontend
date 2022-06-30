import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WsScrollbarModule } from '@ws/directives/scrollbar/public-api';
import { WsHorizontalNavigationBasicItemComponent } from '@ws/components/navigation/horizontal/components/basic/basic.component';
import { WsHorizontalNavigationBranchItemComponent } from '@ws/components/navigation/horizontal/components/branch/branch.component';
import { WsHorizontalNavigationDividerItemComponent } from '@ws/components/navigation/horizontal/components/divider/divider.component';
import { WsHorizontalNavigationSpacerItemComponent } from '@ws/components/navigation/horizontal/components/spacer/spacer.component';
import { WsHorizontalNavigationComponent } from '@ws/components/navigation/horizontal/horizontal.component';
import { WsVerticalNavigationAsideItemComponent } from '@ws/components/navigation/vertical/components/aside/aside.component';
import { WsVerticalNavigationBasicItemComponent } from '@ws/components/navigation/vertical/components/basic/basic.component';
import { WsVerticalNavigationCollapsableItemComponent } from '@ws/components/navigation/vertical/components/collapsable/collapsable.component';
import { WsVerticalNavigationDividerItemComponent } from '@ws/components/navigation/vertical/components/divider/divider.component';
import { WsVerticalNavigationGroupItemComponent } from '@ws/components/navigation/vertical/components/group/group.component';
import { WsVerticalNavigationSpacerItemComponent } from '@ws/components/navigation/vertical/components/spacer/spacer.component';
import { WsVerticalNavigationComponent } from '@ws/components/navigation/vertical/vertical.component';

@NgModule({
  declarations: [
    WsHorizontalNavigationBasicItemComponent,
    WsHorizontalNavigationBranchItemComponent,
    WsHorizontalNavigationDividerItemComponent,
    WsHorizontalNavigationSpacerItemComponent,
    WsHorizontalNavigationComponent,
    WsVerticalNavigationAsideItemComponent,
    WsVerticalNavigationBasicItemComponent,
    WsVerticalNavigationCollapsableItemComponent,
    WsVerticalNavigationDividerItemComponent,
    WsVerticalNavigationGroupItemComponent,
    WsVerticalNavigationSpacerItemComponent,
    WsVerticalNavigationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    WsScrollbarModule,
  ],
  exports: [
    WsVerticalNavigationDividerItemComponent,
    WsVerticalNavigationBasicItemComponent,
    WsHorizontalNavigationComponent,
    WsVerticalNavigationComponent,
  ],
})
export class WsNavigationModule {}
