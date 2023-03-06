import { AnimationFn } from './Animation';
import { SpriteState } from './SpriteState';

const image = new Image();
image.src = 'img/bg-1-1.png';

export class Background extends SpriteState {
  private static _screenProps = new SpriteState();
  private static _speed = 3;

  public static get speed(): number {
    return Background._speed;
  }

  public static set speed(spd: number) {
    Background._speed = spd;
  }

  private static getSprite = () => ({
    height: 480,
    startY: 0,
  });

  public static init: AnimationFn = (ctx: CanvasRenderingContext2D) => {
    const sprite = Background.getSprite();
    let { currentFrame } = Background._screenProps;

    const spriteSheetX = currentFrame;
    const spriteSheetY = sprite.startY;
    const destX = 0;
    const destY = ctx.canvas.height - sprite.height;

    ctx.drawImage(
      image,
      spriteSheetX, spriteSheetY, ctx.canvas.width, sprite.height,
      destX, destY, ctx.canvas.width, sprite.height 
    );
  }

  public static advance = () => {
    Background._screenProps.currentFrame += Background._speed;
  }
}
