import chalk from "chalk";
import convert from "color-convert";
import fs from "fs";
import { PNG } from "pngjs";

export default class ScreenInterface {
  frame: Frame;

  emulating: boolean;
  width: number;
  height: number;

  ws281x: any;

  constructor(width, height, emulating = false) {
    this.emulating = emulating;

    this.width = width;
    this.height = height;

    if (!emulating) {
      this.ws281x = require("ws281x");
      this.ws281x.configure({
        leds: width * height,
        gpio: process.env.GPIO ?? 18,
        strip: "rgb",
      });
    }

    this.clear();
  }

  getDimensions(): { amount: number; width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
      amount: this.width * this.height,
    };
  }

  private printFrameToConsole() {
    const { width, height } = this.getDimensions();

    let fieldPrint = "";
    for (let row = 0; row < height; row++) {
      fieldPrint += "\n";
      for (let col = 0; col < width; col++) {
        fieldPrint += chalk.rgb(...this.frame[col][row].asArray()).bold("■ ");
      }
    }
    process.stdout.write("\u001B[2J\u001B[0;0f");
    process.stdout.write(fieldPrint);
  }

  private duplicateFrame(template: Frame): Frame {
    const { width, height } = this.getDimensions();

    const frame: Frame = [];

    for (let x = 0; x < width; x++) {
      frame.push([]);
      for (let y = 0; y < height; y++) {
        frame[x][y] = template[x][y].copy();
      }
    }

    return frame;
  }

  private rotateMatrix(matrix): Frame {
    const n = matrix.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++) {
        const k = matrix[i][j];
        matrix[i][j] = matrix[y - j][i];
        matrix[y - j][i] = matrix[y - i][y - j];
        matrix[y - i][y - j] = matrix[j][y - i];
        matrix[j][y - i] = k;
      }
    }

    return matrix;
  }

  private renderPixels() {
    const { amount: pixelAmount, width, height } = this.getDimensions();

    let orientedPixels = this.duplicateFrame(this.frame);

    const orientation = process.env.ORIENTATION || 0;

    for (let i = 0; i < orientation; i++) {
      orientedPixels = this.rotateMatrix(orientedPixels);
    }

    const renderedStrip = new Uint32Array(pixelAmount);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let pix = 0;
        if (y % 2 == 0) {
          pix = y * width + x;
        } else {
          pix = y * width + width - 1 - x;
        }

        renderedStrip[pix] = orientedPixels[x][y].getUInt();
      }
    }

    this.ws281x.render(renderedStrip);
  }

  update(): ScreenInterface {
    if (this.emulating) this.printFrameToConsole();
    else this.renderPixels();

    return this;
  }

  setPixel(x: number, y: number, color: Color): ScreenInterface {
    if (x < this.width && y < this.width && x >= 0 && y >= 0)
      this.frame[x][y] = color;

    return this;
  }

  setFrame(frame: Frame): ScreenInterface {
    this.frame = frame;

    return this;
  }

  fill(color: Color): ScreenInterface {
    this.frame = [...Array(Number(this.height))].map((_) =>
      Array(Number(this.width)).fill(color)
    );

    return this;
  }

  async drawPng(file: fs.PathLike) {
    const { width, height } = this.getDimensions();

    return new Promise((resolve) => {
      fs.createReadStream(file)
        .pipe(new PNG())
        .on("parsed", (data) => {
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (width * y + x) << 2;

              const [r, g, b, a] = [
                data[idx + 0],
                data[idx + 1],
                data[idx + 2],
                data[idx + 3],
              ];

              if (a > 128) {
                this.setPixel(x, y, new Color(r, g, b));
              }
            }
          }

          resolve(this);
        });
    });
  }

  clear(): ScreenInterface {
    this.fill(new Color(0, 0, 0));

    return this;
  }
}

export class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  getHex(): string {
    return "0x" + convert.rgb.hex(this.r, this.g, this.b);
  }

  static random(): Color {
    const value = () => Math.round(Math.random() * 255);
    return new Color(value(), value(), value());
  }

  getUInt(): number {
    return (this.r << 16) | (this.g << 8) | this.b;
  }

  asArray(): [number, number, number] {
    return [this.r, this.g, this.b];
  }

  copy(): Color {
    return new Color(this.r, this.g, this.b);
  }
}

export type Frame = Color[][];
