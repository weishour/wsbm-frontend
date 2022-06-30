const chroma = require('chroma-js');
const _ = require('lodash');
const path = require('path');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;
const generateContrasts = require(path.resolve(__dirname, '../utils/generate-contrasts'));

// ----------------------------------------------------------------------------
// @ Utilities
// ----------------------------------------------------------------------------

/**
 * 规范所提供的主题
 *
 * @param theme
 */
const normalizeTheme = (theme) => {
  return _.fromPairs(
    _.map(
      _.omitBy(theme, (palette, paletteName) => paletteName.startsWith('on') || _.isEmpty(palette)),
      (palette, paletteName) => [
        paletteName,
        {
          ...palette,
          DEFAULT: palette['DEFAULT'] || palette[500],
        },
      ],
    ),
  );
};

/**
 * 从提供的主题为'colors'配置生成可变颜色
 *
 * @param theme
 */
const generateVariableColors = (theme) => {
  // https://github.com/adamwathan/tailwind-css-variable-text-opacity-demo
  const customPropertiesWithOpacity =
    (name) =>
    ({ opacityVariable, opacityValue }) => {
      if (opacityValue) {
        return `rgba(var(--ws-${name}-rgb), ${opacityValue})`;
      }
      if (opacityVariable) {
        return `rgba(var(--ws-${name}-rgb), var(${opacityVariable}, 1))`;
      }
      return `rgb(var(--ws-${name}-rgb))`;
    };

  return _.fromPairs(
    _.flatten(
      _.map(_.keys(flattenColorPalette(normalizeTheme(theme))), (name) => [
        [name, customPropertiesWithOpacity(name)],
        [`on-${name}`, customPropertiesWithOpacity(`on-${name}`)],
      ]),
    ),
  );
};

/**
 * 生成并返回带有主题名称和颜色的主题对象
 * 这对于从Angular访问主题非常有用(Typescript).
 *
 * @param themes
 * @returns {unknown[]}
 */
function generateThemesObject(themes) {
  const normalizedDefaultTheme = normalizeTheme(themes.default);
  return _.map(_.cloneDeep(themes), (value, key) => {
    const theme = normalizeTheme(value);
    const primary =
      theme && theme.primary && theme.primary.DEFAULT
        ? theme.primary.DEFAULT
        : normalizedDefaultTheme.primary.DEFAULT;
    const accent =
      theme && theme.accent && theme.accent.DEFAULT
        ? theme.accent.DEFAULT
        : normalizedDefaultTheme.accent.DEFAULT;
    const warn =
      theme && theme.warn && theme.warn.DEFAULT
        ? theme.warn.DEFAULT
        : normalizedDefaultTheme.warn.DEFAULT;

    return _.fromPairs([
      [
        key,
        {
          primary,
          accent,
          warn,
        },
      ],
    ]);
  });
}

// ----------------------------------------------------------------------------
// @ WS TailwindCSS 主插件
// ----------------------------------------------------------------------------
const theming = plugin.withOptions(
  (options) =>
    ({ addComponents, e, theme }) => {
      // ----------------------------------------------------------------------------
      // @ 遍历颜色
      // ----------------------------------------------------------------------------
      const mapVariableColors = _.fromPairs(
        _.map(options.themes, (theme, themeName) => [
          themeName === 'default' ? 'body, .theme-default' : `.theme-${e(themeName)}`,
          _.fromPairs(
            _.flatten(
              _.map(
                flattenColorPalette(
                  _.fromPairs(
                    _.flatten(
                      _.map(normalizeTheme(theme), (palette, paletteName) => [
                        [e(paletteName), palette],
                        [
                          `on-${e(paletteName)}`,
                          _.fromPairs(
                            _.map(generateContrasts(palette), (color, hue) => [
                              hue,
                              _.get(theme, [`on-${paletteName}`, hue]) || color,
                            ]),
                          ),
                        ],
                      ]),
                    ),
                  ),
                ),
                (value, key) => [
                  [`--ws-${e(key)}`, value],
                  [`--ws-${e(key)}-rgb`, chroma(value).rgb().join(',')],
                ],
              ),
            ),
          ),
        ]),
      );

      addComponents(mapVariableColors);

      // ----------------------------------------------------------------------------
      // @ 生成基于css自定义属性和实用程序类的方案
      // ----------------------------------------------------------------------------
      const schemeCustomProps = _.map(['light', 'dark'], (colorScheme) => {
        const isDark = colorScheme === 'dark';
        const background = theme(`ws.customProps.background.${colorScheme}`);
        const foreground = theme(`ws.customProps.foreground.${colorScheme}`);
        const lightSchemeSelectors = 'body.light, .light, .dark .light';
        const darkSchemeSelectors = 'body.dark, .dark, .light .dark';

        return {
          [isDark ? darkSchemeSelectors : lightSchemeSelectors]: {
            /**
             * 如果自定义属性不可用，浏览器将使用回退值, 在本例中，我们想使用'--is-dark'
             * 作为暗主题的指示符，所以我们可以像这样使用它:
             * background-color: var(--is-dark, red);
             *
             * 如果我们在黑暗主题上将'--is-dark'设置为"true"，那么上述规则将因为“回退值”逻辑而失* 效. 因此，我们将'--is-dark'设置为"false"，而不是全部设置为黑暗主题，这样就可以在* 黑暗主题上使用回退值.
             *
             * 在浅色主题上, 由于'--is-dark'存在, 上面的规则将被插值为:
             * "background-color: false"
             *
             * 在dark主题上，因为'--is-dark' 不存在，所以回退值将被使用(在本例中是‘red’)， 并且* 规则将被插值为
             * :"background-color: red"
             *
             * 这样更容易理解和记忆
             */
            ...(!isDark ? { '--is-dark': 'false' } : {}),

            // 从customProps生成自定义属性
            ..._.fromPairs(
              _.flatten(
                _.map(background, (value, key) => [
                  [`--ws-${e(key)}`, value],
                  [`--ws-${e(key)}-rgb`, chroma(value).rgb().join(',')],
                ]),
              ),
            ),
            ..._.fromPairs(
              _.flatten(
                _.map(foreground, (value, key) => [
                  [`--ws-${e(key)}`, value],
                  [`--ws-${e(key)}-rgb`, chroma(value).rgb().join(',')],
                ]),
              ),
            ),
          },
        };
      });

      const schemeUtilities = (() => {
        // 生成通用样式和实用程序
        return {};
      })();

      addComponents(schemeCustomProps);
      addComponents(schemeUtilities);
    },
  (options) => {
    return {
      theme: {
        extend: {
          colors: generateVariableColors(options.themes.default),
        },
        ws: {
          customProps: {
            background: {
              light: {
                'bg-app-bar': '#FFFFFF',
                'bg-card': '#FFFFFF',
                'bg-default': colors.slate[100],
                'bg-dialog': '#FFFFFF',
                'bg-hover': chroma(colors.slate[400]).alpha(0.12).css(),
                'bg-status-bar': colors.slate[300],
              },
              dark: {
                'bg-app-bar': colors.slate[900],
                'bg-card': colors.slate[800],
                'bg-default': colors.slate[900],
                'bg-dialog': colors.slate[800],
                'bg-hover': 'rgba(255, 255, 255, 0.05)',
                'bg-status-bar': colors.slate[900],
              },
            },
            foreground: {
              light: {
                'text-default': colors.slate[800],
                'text-secondary': colors.slate[500],
                'text-hint': colors.slate[400],
                'text-disabled': colors.slate[400],
                border: colors.slate[200],
                divider: colors.slate[200],
                icon: colors.slate[500],
                'mat-icon': colors.slate[500],
              },
              dark: {
                'text-default': '#FFFFFF',
                'text-secondary': colors.slate[400],
                'text-hint': colors.slate[500],
                'text-disabled': colors.slate[600],
                border: chroma(colors.slate[100]).alpha(0.12).css(),
                divider: chroma(colors.slate[100]).alpha(0.12).css(),
                icon: colors.slate[400],
                'mat-icon': colors.slate[400],
              },
            },
          },
          themes: generateThemesObject(options.themes),
        },
      },
    };
  },
);

module.exports = theming;
