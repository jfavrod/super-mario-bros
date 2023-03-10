export class Canvas {
  private static _instance?: Canvas;

  private _ctx: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  private _height: number;
  private _width: number;

  private constructor(id: string, width: number, height: number) {
    this._canvas = document.getElementById(id) as HTMLCanvasElement;

    this._height = this._canvas.height = height;
    this._width = this._canvas.width = width;

    this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public static getInstance() {
    if (Canvas._instance === undefined) {
      Canvas._instance = new Canvas('canvas', 1024, 512);
    }
    return Canvas._instance;
  }

  public get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  public get height(): number {
    return this._height;
  }

  public get width(): number {
    return this._width;
  }
}
