import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { DropDownModule } from 'ng-devui';
import { SchemesComponent } from 'app/layout/common/schemes/schemes.component';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [SchemesComponent],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    DropDownModule,
    SharedModule,
    TranslocoModule,
  ],
  exports: [SchemesComponent],
})
export class SchemesModule {}
