import { AnimationFn } from './Animation';
import { SpriteState } from './SpriteState';

const image = new Image();
image.src = 'img/bg-1-1.png';

export class Background extends SpriteState {
  private static _screenProps = new SpriteState();

  private static getSprite = () => ({
    height: 480,
    startY: 0,
  });

  public static init: AnimationFn = (ctx: CanvasRenderingContext2D, gameFrame: number) => {
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

    return {
      height: ctx.canvas.height,
      pos: {
        x: 0,
        y: 0,
      },
      width: ctx.canvas.width,
    }
  }

  public static advance: AnimationFn = (ctx: CanvasRenderingContext2D, gameFrame: number) => {
    const sprite = Background.getSprite();
    let { currentFrame } = Background._screenProps;

    const spriteSheetX = currentFrame;
    const spriteSheetY = sprite.startY;
    const destX = 0;
    const destY = ctx.canvas.height - sprite.height;

    // ctx.drawImage(
    //   image,
    //   spriteSheetX, spriteSheetY, ctx.canvas.width, sprite.height,
    //   destX, destY, ctx.canvas.width, sprite.height 
    // );

    Background._screenProps.currentFrame += 5;

    return {
      height: ctx.canvas.height,
      pos: {
        x: 0,
        y: 0,
      },
      width: ctx.canvas.width,
    }
  }
}
