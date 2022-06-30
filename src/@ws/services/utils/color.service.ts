import { Injectable } from '@angular/core';
import { forEach, fromPairs, map } from 'lodash-es';
import chroma from 'chroma-js';

@Injectable({
  providedIn: 'root',
})
export class WsColorService {
  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取背景颜色的文字对比色
   *
   * @param color
   */
  textContrast(color: string): string {
    // 准备一个空调色板
    let palette = {
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

    palette[500] = color;

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

    palette = {
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

    const lightColor = '#FFFFFF';
    let darkColor = '#FFFFFF';

    // 遍历调色板以找到最暗的颜色
    forEach(palette, (color) => {
      darkColor =
        chroma.contrast(color, '#FFFFFF') > chroma.contrast(darkColor, '#FFFFFF') ? color : darkColor;
    });

    // 生成对比色
    const textPalette = fromPairs(
      map(palette, (color, hue) => [
        hue,
        chroma.contrast(color, darkColor) > chroma.contrast(color, lightColor)
          ? darkColor
          : lightColor,
      ]),
    );

    // console.log('%c50', `color: ${textPalette[50]}; background: ${scale(0.05).hex()}`);
    // console.log('%c100', `color: ${textPalette[100]}; background: ${scale(0.1).hex()}`);
    // console.log('%c200', `color: ${textPalette[200]}; background: ${scale(0.2).hex()}`);
    // console.log('%c300', `color: ${textPalette[300]}; background: ${scale(0.3).hex()}`);
    // console.log('%c400', `color: ${textPalette[400]}; background: ${scale(0.4).hex()}`);
    // console.log('%c500', `color: ${textPalette[500]}; background: ${scale(0.5).hex()}`);
    // console.log('%c600', `color: ${textPalette[600]}; background: ${scale(0.6).hex()}`);
    // console.log('%c700', `color: ${textPalette[700]}; background: ${scale(0.7).hex()}`);
    // console.log('%c800', `color: ${textPalette[800]}; background: ${scale(0.8).hex()}`);
    // console.log('%c900', `color: ${textPalette[900]}; background: ${scale(0.9).hex()}`);

    return textPalette[500];
  }
}
