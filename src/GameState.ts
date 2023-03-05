import { Canvas } from './Canvas';

export class GameState {
  private static _world = '1';
  private static _stage = '1';

  public static canvas: Canvas;

  public static init() {
    GameState.canvas = Canvas.getInstance()
  };

  public static get currentLevel() {
    return `${GameState._world}=${GameState._stage}`;
  }
}
