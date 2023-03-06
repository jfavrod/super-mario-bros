import { Canvas } from './Canvas';
import { ISprite } from './ISprite';

export type AnimationFn = (ctx: CanvasRenderingContext2D, gameFrame: number) => void;

export class Animation {
  private static _canvas: Canvas;
  private static _gameFrame = 0;
  private static _isAnimating = false;

  // private static _gameLoop: AnimationFn[] = [];
  private static _keys: string[] = [];
  private static sprites: ISprite[] = [];

  public static _loops = [
    [] as AnimationFn[],
    [] as AnimationFn[],
  ]

  public static get gameFrame() { return Animation._gameFrame }

  public static addAnimation(key: string, animationFn: AnimationFn, layer?: 0 | 1) {
    if (!Animation._keys.includes(key)) {
      Animation._loops[layer || 1].push(animationFn);
      Animation._keys.push(key);
    }

    return () => {
      const keyIdx = Animation._keys.findIndex((ky) => ky === key)
      const glIdx = Animation._loops[layer || 1].findIndex((anim) => anim === animationFn);
      Animation._keys.splice(keyIdx, 1);
      Animation._loops[layer || 1].splice(glIdx, 1);
    };
  };

  public static addSprite(sprite: ISprite) {
    Animation.sprites.push(sprite);
  }

  public static animate() {
    if (!Animation._isAnimating) {
      Animation._isAnimating = true;
      Animation._animate();
    }
  }

  public static stop() {
    Animation._isAnimating = false;
  }

  private static _animate() {
    if (!Animation._isAnimating) return;

    if (!Animation._canvas) Animation._canvas = Canvas.getInstance();
    const canvas = Animation._canvas;

    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    Animation._loops[0].forEach((anim) => anim(canvas.ctx, Animation._gameFrame));
    Animation._loops[1].forEach((anim) => anim(canvas.ctx, Animation._gameFrame));
    Animation.sprites.forEach((sprite) => {
      sprite.update();
      sprite.draw(canvas.ctx);
    });

    Animation.spriteCleanUp();

    Animation._gameFrame++;
    requestAnimationFrame(Animation._animate);
  }

  /** Remove sprites that are no longer on the screen. */
  private static spriteCleanUp() {
    return;
  }
}
