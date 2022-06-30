import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule],
})
export class SharedModule {}
