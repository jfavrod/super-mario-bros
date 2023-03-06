import { ISprite } from './ISprite';
import { SpriteMap } from './ISpriteMap';
import { Observable } from './Observable';

export type PlayerAction = 'still' | 'forward' | 'backward' | 'jump' | 'crouch';
export type PlayerDirection = 'left' | 'right';
export type PlayerPower = 'sm' | 'lg' | 'fp';
export type Position = { x: number; y: number; };

export abstract class Player extends Observable<'move' | 'stop', Position> implements ISprite {
  /** Map PlayerActions to the sprite sheet. */
  protected abstract spriteMap: SpriteMap;

  /** The current action of the player. Default `still` */
  protected action: PlayerAction = 'still';
  /** The current frame of the sprite sheet. */
  protected currentFrame = 0;
  /** Which direction the Player is facing. */
  protected direction: PlayerDirection = 'right';
  /** Game frames to wait before drawing next sprite frame. */
  protected frameDelay = 5;
  protected _isRunning = false;
  /** Small (sm), Large (lg), or Fire Power (fp). Default `sm` */
  protected power: PlayerPower = 'sm';

  /** The previous action of the player. */
  protected prevAction: PlayerAction = 'still';
  /** The previous position of the sprite on the screen. */
  protected prevScreenPos: Position = { x: 0, y: 0 };

  protected runSpeed = 30;
  protected walkSpeed = 15;

  /** The current position of the sprite on the screen. */
  protected screenPos: Position = { x: 0, y: 0 };
  protected spriteSheetPos: Position = { x: 0, y: 0};

  public abstract draw(ctx: CanvasRenderingContext2D): void;
  public abstract update(): Position;

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get spriteWidth(): number {
    return this.spriteMap[this.action].width;
  }

  public setAction(action: PlayerAction): void {
    this.action = action;
  }

  public setDirection(direction: PlayerDirection): void {
    this.direction = direction;
  }
}
