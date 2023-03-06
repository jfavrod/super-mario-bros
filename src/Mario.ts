import { Animation } from './Animation';
import { SpriteMap, SpriteSheetData } from './ISpriteMap';
import { Player, Position } from './Player';
import { Surface } from './Surface';

const image = new Image();
image.src = 'img/mario_sheet.png';

export class Mario extends Player {
  protected spriteMap: SpriteMap = {
    'backward': {
      frameCount: 3,
      height: this.power === 'sm' ? 50 : 0,
      startX: 150,
      startY: 0,
      width: 50,
    },
    'crouch': {} as SpriteSheetData,
    'forward': {
      frameCount: 3,
      height: this.power === 'sm' ? 50 : 0,
      startX: 0,
      startY: 0,
      width: 50,
    },
    'jump': {} as SpriteSheetData,
    'still': {
      frameCount: 1,
      height: this.power === 'sm' ? 50 : 0,
      startX: this.direction === 'left' ? 50 : 0,
      startY: 50,
      width: 50,
    },
  };

  public constructor() {
    super();
    const { height: spriteHeight, width: spriteWidth } = this.spriteMap[this.action];
    this.screenPos.y = (Surface.floor - spriteHeight),
    this.spriteSheetPos.y = spriteWidth;
  }

  public draw = (ctx: CanvasRenderingContext2D): void => {
    const sprite = this.spriteMap[this.action];

    ctx.drawImage(
      image,
      this.spriteSheetPos.x, this.spriteSheetPos.y, sprite.width, sprite.height,
      this.screenPos.x, this.screenPos.y, sprite.width, sprite.height, 
    );
  };

  public update = (): Position => {
    if (Animation.gameFrame % this.frameDelay === 0) {
      // If switching action, we need to reset the frame counter.
      if (this.action !== this.prevAction) this.currentFrame = 0;
      else this.currentFrame++;

      if (this.action === 'forward') this.moveForward();
      else if (this.action === 'still') this.standStill();
      else if (this.action === 'backward') this.moveBackward();

      if (this.action === 'still') this.notify('stop', this.screenPos);
      else this.notify('move', this.screenPos);

      this.prevAction = this.action;
      this.prevScreenPos = {...this.screenPos};
      this.updateSpiteMap();
    }

    return this.screenPos;
  };

  private moveBackward = () => {
    const { frameCount, height, startX, startY, width } = this.spriteMap[this.action];
    if (!(this.currentFrame < frameCount)) this.currentFrame = 0;

    this.direction = 'left';

    this.spriteSheetPos.x = startX + (width * this.currentFrame);
    this.spriteSheetPos.y = startY;

    // Cannot run off screen left.
    if ((this.screenPos.x - width) > (-1 * width)) {
      this.screenPos.x -= this.isRunning ? this.runSpeed : this.walkSpeed;
    }

    this.screenPos.y = (Surface.floor - height)
  };

  private moveForward = () => {
    const { frameCount, height, startX, startY, width } = this.spriteMap[this.action];
    if (!(this.currentFrame < frameCount)) this.currentFrame = 0;

    this.direction = 'right';

    this.spriteSheetPos.x = startX + (width * this.currentFrame);
    this.spriteSheetPos.y = startY;

    if ((this.screenPos.x + width) < Surface.playerForwardLimit) {
      this.screenPos.x += this.isRunning ? this.runSpeed : this.walkSpeed;
    }

    this.screenPos.y = (Surface.floor - height)
  };

  private standStill = () => {
    const { startX, startY } = this.spriteMap[this.action];

    this.spriteSheetPos.x = startX;
    this.spriteSheetPos.y = startY;
  };

  private updateSpiteMap = () => {
    this.spriteMap.backward.height = this.power === 'sm' ? 50 : 0;
    this.spriteMap.forward.height = this.power === 'sm' ? 50 : 0;

    this.spriteMap.still.height = this.power === 'sm' ? 50 : 0;
    this.spriteMap.still.startX = this.direction === 'left' ? 50 : 0;
  };
}
