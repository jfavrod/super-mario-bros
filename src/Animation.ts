import { Canvas } from './Canvas';
import { ISprite } from './ISprite';

export type AnimationFn = (ctx: CanvasRenderingContext2D, gameFrame: number) => ISprite;

export class Animation {
  private static _canvas: Canvas;
  private static _gameFrame = 0;
  private static _isAnimating = false;

  private static _gameLoop: AnimationFn[] = [];
  private static _keys: string[] = [];

  public static addAnimation(key: string, animationFn: AnimationFn) {
    if (!Animation._keys.includes(key)) {
      const glIdx = (Animation._gameLoop.push(animationFn) - 1)
      const keyIdx = (Animation._keys.push(key) - 1);

      return () => {
        Animation._keys.splice(keyIdx, 1);
        Animation._gameLoop.splice(glIdx, 1);
      };
    }
  };

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

    Animation._gameLoop.forEach((anim) => anim(canvas.ctx, Animation._gameFrame));

    Animation._gameFrame++;
    requestAnimationFrame(Animation._animate);
  }
}
