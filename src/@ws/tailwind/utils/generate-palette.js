const chroma = require('chroma-js');
const _ = require('lodash');

/**
 * 从提供的配置生成调色板.接受单一颜色字符串或类似Tailwind的颜色对象.
 * 如果提供了类似于tailwind的颜* 色对象，它必须有500色度级别.
 *
 * @param config
 */
const generatePalette = (config) => {
  // 准备一个空调色板
  const palette = {
    50: null,
    100: null,
    200: null,
    300: null,
    400: null,
    500: null,
    600: null,
    700: null,
    800: null,
    900: null,
  };

  // 如果提供单一颜色, 把它分配给500
  if (_.isString(config)) {
    palette[500] = chroma.valid(config) ? config : null;
  }

  // 如果提供了一个部分调色板，请分配这些值
  if (_.isPlainObject(config)) {
    if (!chroma.valid(config[500])) {
      throw new Error(
        '您必须在您的调色板配置中有一个500色调!确保你的调色板的主色标记为500。',
      );
    }

    // 删除不是色调/颜色条目的所有内容
    config = _.pick(config, Object.keys(palette));

    // 合并值
    _.mergeWith(palette, config, (objValue, srcValue) =>
      chroma.valid(srcValue) ? srcValue : null,
    );
  }

  // 准备颜色阵列
  const colors = Object.values(palette).filter((color) => color);

  // 生成一个非常暗的和一个非常亮的默认颜色版本来使用它们作为边界颜色，而不是使用纯白色和纯黑色。这将在颜色的色调值之间停止进入灰色。
  colors.unshift(chroma.scale(['white', palette[500]]).domain([0, 1]).mode('lrgb').colors(50)[1]);
  colors.push(chroma.scale(['black', palette[500]]).domain([0, 1]).mode('lrgb').colors(10)[1]);

  // 准备域数组
  const domain = [
    0,
    ...Object.entries(palette)
      .filter(([key, value]) => value)
      .map(([key]) => parseInt(key) / 1000),
    1,
  ];

  // 生成颜色刻度
  const scale = chroma.scale(colors).domain(domain).mode('lrgb');

  // 构建并返回最终的调色板
  return {
    50: scale(0.05).hex(),
    100: scale(0.1).hex(),
    200: scale(0.2).hex(),
    300: scale(0.3).hex(),
    400: scale(0.4).hex(),
    500: scale(0.5).hex(),
    600: scale(0.6).hex(),
    700: scale(0.7).hex(),
    800: scale(0.8).hex(),
    900: scale(0.9).hex(),
  };
};

module.exports = generatePalette;
