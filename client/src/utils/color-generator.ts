export default class ColorGenerator {
  private static colors = [
    'Aqua',
    'Aquamarine',
    'CadetBlue',
    'Chartreuse',
    'Chocolate',
    'CornflowerBlue',
    'Crimson',
    'Cyan',
    'DarkGreen',
    'DarkKhaki',
    'DarkMagenta',
    'DarkOliveGreen',
    'DarkRed',
    'DeepPink',
    'DeepSkyBlue',
    'DodgerBlue',
    'FireBrick',
    'Gold',
    'GoldenRod',
    'Green',
    'GreenYellow',
    'HotPink',
    'IndianRed',
    'Khaki',
    'Lavender',
    'LightCoral',
    'LightSalmon',
    'Lime',
    'LimeGreen',
    'Magenta',
    'Olive',
    'OliveDrab',
    'Orange',
    'OrangeRed',
    'Orchid',
    'Peru',
    'Pink',
    'Plum',
    'PowderBlue',
    'RebeccaPurple',
    'Red',
    'RoyalBlue',
    'Salmon',
    'SandyBrown',
    'SeaGreen',
    'SkyBlue',
    'SlateBlue',
    'SpringGreen',
    'SteelBlue',
    'Tan',
    'Teal',
    'Thistle',
    'Tomato',
    'Turquoise',
    'Violet',
    'Wheat',
    'Yellow',
    'YellowGreen',
  ];

  private usedColors: Record<string, boolean> = {};

  private currentColorIndex = -1;

  generateColor(): string {
    if (this.currentColorIndex === ColorGenerator.colors.length - 1)
      this.currentColorIndex = 0;
    else this.currentColorIndex += 1;

    const color = ColorGenerator.colors[this.currentColorIndex];

    if (this.usedColors[color]) return this.generateColor();

    this.usedColors[color] = true;
    return color;
  }

  unUseColor(color: string): void {
    if (color in this.usedColors) this.usedColors[color] = false;
  }
}
