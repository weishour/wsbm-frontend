const chroma = require('chroma-js');
const _ = require('lodash');

/**
 * 生成给定调色板的对比版本。所提供的调色板必须与默认顺风调色板的格式相同
 *
 * @param palette
 * @private
 */
const generateContrasts = (palette) => {
  const lightColor = '#FFFFFF';
  let darkColor = '#FFFFFF';

  // 遍历调色板以找到最暗的颜色
  _.forEach(palette, (color) => {
    darkColor =
      chroma.contrast(color, '#FFFFFF') > chroma.contrast(darkColor, '#FFFFFF') ? color : darkColor;
  });

  // 生成对比色
  return _.fromPairs(
    _.map(palette, (color, hue) => [
      hue,
      chroma.contrast(color, darkColor) > chroma.contrast(color, lightColor)
        ? darkColor
        : lightColor,
    ]),
  );
};

module.exports = generateContrasts;
