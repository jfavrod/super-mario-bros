import { Position } from './Player';

export interface ISprite {
  draw(ctx: CanvasRenderingContext2D): void;
  update(): Position;
}
