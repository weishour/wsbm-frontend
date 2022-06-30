import { MAT_DATE_FORMATS, MatDateFormats, MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

const MatDateFormats: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

export const MATERIAL_PROVIDES = [
  {
    // 禁用“主题”完整性检查
    provide: MATERIAL_SANITY_CHECKS,
    useValue: {
      doctype: true,
      theme: false,
      version: true,
    },
  },
  { provide: MAT_DATE_FORMATS, useValue: MatDateFormats },
  {
    // 默认情况下，在Angular Material表单字段中使用“fill”外观
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: {
      appearance: 'fill',
    },
  },
];
