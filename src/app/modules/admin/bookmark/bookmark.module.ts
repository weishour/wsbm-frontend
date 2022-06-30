import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WsFilePondModule, WsTippyModule } from '@ws/modules';
import { WsScrollbarModule } from '@ws/directives/scrollbar';
import { WsDrawerModule } from '@ws/components/drawer';
import { WsPlayerModule } from '@ws/components/player';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PanelModule, LoadingModule } from 'ng-devui';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { BookmarkComponent } from 'app/modules/admin/bookmark/bookmark.component';
import { BookmarkGroupComponent } from 'app/modules/admin/bookmark/group/group.component';
import { BookmarkLabelComponent } from 'app/modules/admin/bookmark/label/label.component';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';

const bookmarkRoutes: Route[] = [
  {
    path: '',
    component: BookmarkComponent,
  },
];

@NgModule({
  declarations: [BookmarkComponent, BookmarkGroupComponent, BookmarkLabelComponent],
  imports: [
    RouterModule.forChild(bookmarkRoutes),
    WsScrollbarModule,
    WsDrawerModule,
    WsPlayerModule,
    DragDropModule,
    MatRippleModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    PanelModule,
    LoadingModule,
    TranslocoModule,
    SharedModule,
    AccordionModule,
    ColorPickerModule,
    ContextMenuModule,
    WsFilePondModule,
    WsTippyModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BookmarkModule {}
