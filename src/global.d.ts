/**
 * 将SCSS文件声明为模块，这样我们就可以将它们导入TS文件并使用它们的内容
 */
declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare const Konva: any;
