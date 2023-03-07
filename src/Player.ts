import { ISprite } from './ISprite';
import { PlayerSpriteMap } from './ISpriteMap';
import { Observable } from './Observable';
import { Surface } from './Surface';

export type PlayerAction = 'still' | 'forward' | 'backward' | 'jump' | 'crouch' | 'skid';
export type PlayerDirection = 'left' | 'right';
export type PlayerPower = 'sm' | 'lg' | 'fp';
export type Position = { x: number; y: number; };

export abstract class Player extends Observable<'move' | 'stop', Position> implements ISprite {
  /** Map PlayerActions to the sprite sheet. */
  protected abstract _spriteMap: PlayerSpriteMap;

  /** The current action of the player. Default `still` */
  protected _action: PlayerAction = 'still';
  /** The current frame of the sprite sheet. */
  protected _currentFrame = 0;
  /** Which direction the Player is facing. */
  protected _direction: PlayerDirection = 'right';
  /** Game frames to wait before drawing next sprite frame. */
  protected _frameDelay = 5;
  protected _image: HTMLImageElement;
  protected _isRunning = false;
  protected _lifetime = 0;
  /** Small (sm), Large (lg), or Fire Power (fp). Default `sm` */
  protected _power: PlayerPower = 'sm';

  /** The previous action of the player. */
  protected _prevAction: PlayerAction = 'still';
  /** The previous position of the sprite on the screen. */
  protected _prevScreenPos: Position = { x: 0, y: 0 };

  /** The current position of the sprite on the screen. */
  protected _screenPos: Position = { x: 0, y: 0 };
  protected _spriteSheetPos: Position = { x: 0, y: 0};

  protected _preSequenceAction: PlayerAction | undefined;
  /** Holds an animation sequence. */
  protected _sequence: CallableFunction[] = [];

  protected _runSpeed = 30;
  protected _walkSpeed = 15;

  /** @param spriteSheetPath Path to player's sprite sheet. */
  public constructor(spriteSheetPath: string) {
    super();
    this._image = new Image();
    this._image.src = spriteSheetPath;
  }

  public draw = (ctx: CanvasRenderingContext2D): void => {
    const sprite = this._spriteMap[this._action];

    ctx.drawImage(
      this._image,
      this._spriteSheetPos.x, this._spriteSheetPos.y, sprite.width, sprite.height,
      this._screenPos.x, this._screenPos.y, sprite.width, sprite.height, 
    );
  };

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public set isRunning(bool: boolean) {
    if (bool === true) this._frameDelay = 3;
    else this._frameDelay = 5;

    this._isRunning = bool;
  }

  public get spriteWidth(): number {
    return this._spriteMap[this._action].width;
  }

  public setAction(action: PlayerAction): void {
    this._action = action;
  }

  public setDirection(direction: PlayerDirection): void {
    this._direction = direction;
  }

  public update = (): Position => {
    if (this._lifetime % this._frameDelay === 0) {
      // If switching action, we need to reset the frame counter.
      if (this._action !== this._prevAction) this._currentFrame = 0;
      else this._currentFrame++;

      if (this._sequence.length) {
        (this._sequence.shift()!)();
        if (this._sequence.length === 0) this._action = this._preSequenceAction!;
      }

      else if (this._action === 'forward') this.moveForward();

      else if (this._action === 'backward') this.moveBackward();

      else if (this._action === 'jump') {
        this._preSequenceAction = this._prevAction;
        this.performJump();
      }

      else if (this._action === 'still') this.standStill();

      if (this._action === 'still') this.notify('stop', this._screenPos);
      else this.notify('move', this._screenPos);

      if (this._prevAction !== this._action) this._prevAction = this._action;

      this._prevScreenPos = {...this._screenPos};
      this.updateSpiteMap();
    }

    this._lifetime++;
    return this._screenPos;
  };

  /** Make any necessary updates to the spriteMap after each animation. */
  protected abstract updateSpiteMap(): void;

  private moveBackward = () => {
    const { frameCount, height, startX, startY, width } = this._spriteMap[this._action];
    if (!(this._currentFrame < frameCount)) this._currentFrame = 0;

    this._direction = 'left';

    this._spriteSheetPos.x = startX + (width * this._currentFrame);
    this._spriteSheetPos.y = startY;

    // Cannot run off screen left.
    if ((this._screenPos.x - width) > (-1 * width)) {
      this._screenPos.x -= this.isRunning ? this._runSpeed : this._walkSpeed;
    }

    this._screenPos.y = (Surface.floor - height)
  };

  private moveForward = () => {
    const { frameCount, height, startX, startY, width } = this._spriteMap[this._action];
    if (!(this._currentFrame < frameCount)) this._currentFrame = 0;

    this._direction = 'right';

    this._spriteSheetPos.x = startX + (width * this._currentFrame);
    this._spriteSheetPos.y = startY;

    if ((this._screenPos.x + width) < Surface.playerForwardLimit) {
      this._screenPos.x += this.isRunning ? this._runSpeed : this._walkSpeed;
    }

    this._screenPos.y = (Surface.floor - height)
  };

  private performJump = () => {
    const { height, startX, startY } = this._spriteMap[this._action];
    // Help player get to the min jump height;
    const boost = this._power === 'sm' ? 12 : 0;

    const x = [((-0.5 * height) - boost), ((-1 * height) - boost), ((-0.5 * height) - boost), 0]

    for (let i = 0; i < 4; i++) {
      this._sequence.push(() => {

        this._spriteSheetPos.x = startX;
        this._spriteSheetPos.y = startY;

        this._screenPos.y = (Surface.floor - height) + x[i];
      });
    }
  };

  private standStill = () => {
    const { startX, startY } = this._spriteMap[this._action];

    this._spriteSheetPos.x = startX;
    this._spriteSheetPos.y = startY;
  };
}
