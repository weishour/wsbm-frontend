const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents }) => {
  /*
   * 添加基本组件。这些是非常重要的，让一切看起来正确。 我们之所以将这些添加到“组件”层，是因为它们必* 须在几乎所有其他东西之前定义.
   */
  addComponents({
    '.mat-icon': {
      '--tw-text-opacity': '1',
      color: 'rgba(var(--ws-mat-icon-rgb), var(--tw-text-opacity))',
    },
    '.text-default': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--ws-text-default-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-secondary': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--ws-text-secondary-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-hint': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--ws-text-hint-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-disabled': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--ws-text-disabled-rgb), var(--tw-text-opacity)) !important',
    },
    '.divider': {
      color: 'var(--ws-divider) !important',
    },
    '.bg-card': {
      '--tw-bg-opacity': '1 !important',
      backgroundColor: 'rgba(var(--ws-bg-card-rgb), var(--tw-bg-opacity)) !important',
    },
    '.bg-default': {
      '--tw-bg-opacity': '1 !important',
      backgroundColor: 'rgba(var(--ws-bg-default-rgb), var(--tw-bg-opacity)) !important',
    },
    '.bg-dialog': {
      '--tw-bg-opacity': '1 !important',
      backgroundColor: 'rgba(var(--ws-bg-dialog-rgb), var(--tw-bg-opacity)) !important',
    },
    '.ring-bg-default': {
      '--tw-ring-opacity': '1 !important',
      '--tw-ring-color': 'rgba(var(--ws-bg-default-rgb), var(--tw-ring-opacity)) !important',
    },
    '.ring-bg-card': {
      '--tw-ring-opacity': '1 !important',
      '--tw-ring-color': 'rgba(var(--ws-bg-card-rgb), var(--tw-ring-opacity)) !important',
    },
  });

  addComponents({
    '.bg-hover': {
      backgroundColor: 'var(--ws-bg-hover) !important',
    },
  });
});
