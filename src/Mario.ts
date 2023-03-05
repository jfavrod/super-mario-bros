import { AnimationFn } from './Animation';
import { Observable } from './Observable';
import { ScreenProperties } from './ScreenProperties';
import { Surface } from './Surface';

type MarioSprite = {
  height: number;
  maxPos: number;
  startY: number;
  width: number;
};

type MarioState = {
  action: 'still' | 'run-backward' | 'run-forward',
  power: 'sm' | 'bg' | 'fp';
}

const image = new Image();
image.src = 'img/mario_sheet.png';

export class Mario {
  /** Which direction Mario is facing. */
  private static _direction: 'left' | 'right' = 'right';
  private static _lag = 5;
  private static _locationObs = new Observable<ScreenProperties>();
  private static _prevScreenProps = new ScreenProperties();
  private static _screenProps = new ScreenProperties();

  private static _spriteMap = {
    backward: {
      startY: 0,
      frames: [3, 4, 5],
    },
    forward: {
      startY: 0,
      frames: [0, 1, 2],
    },
    still: {
      startY: 50,
      frames: [0, 1],
    }
  }

  private static _state: MarioState = {
    action: 'still',
    power: 'sm',
  };

  public static get screenProps(): ScreenProperties { return new ScreenProperties(Mario._screenProps); }

  public static addLocationObserver(obs: (screenProps: ScreenProperties) => unknown) {
    return Mario._locationObs.addObserver(obs)
  }

  public static runBackward: AnimationFn = (ctx: CanvasRenderingContext2D, gameFrame: number) => {
    const sprite = Mario.getSprite();
    const { frames, startY } = Mario._spriteMap.backward;

    if (Mario._state.action === 'run-backward') {
      const spriteSheetX = frames[Mario._screenProps.currentFrame] * sprite.width;
      const spriteSheetY = startY;
      const destX = Mario._screenProps.currentPos.x;
      const destY = Surface.floor - sprite.height;

      ctx.drawImage(
        image,
        spriteSheetX, spriteSheetY, sprite.width, sprite.height,
        destX, destY, sprite.width, sprite.height,
      );

      if (gameFrame % Mario._lag === 0) {
        (Mario._screenProps.currentFrame + 1) === frames.length
          ? Mario._screenProps.currentFrame = 0
          : Mario._screenProps.currentFrame++;

        if (destX < 0) Mario._screenProps.currentPos.x = ctx.canvas.width;
        else Mario._screenProps.currentPos.x = destX - sprite.width;
      }
    } else {
      Mario._direction = 'left';
      Mario._state.action = 'run-backward';
      Mario.runBackward(ctx, gameFrame);
    }

    Mario.locationNotify();

    return {
      height: sprite.height,
      pos: { ...Mario._screenProps.currentPos },
      width: sprite.width,
    }
  };

  public static runForward: AnimationFn = (ctx: CanvasRenderingContext2D, gameFrame: number) => {
    const sprite = Mario.getSprite();
    const { frames, startY } = Mario._spriteMap.forward;

    if (Mario._state.action === 'run-forward') {
      const spriteSheetX = frames[Mario._screenProps.currentFrame] * sprite.width;
      const spriteSheetY = startY;
      const destX = Mario._screenProps.currentPos.x;
      const destY = Surface.floor - sprite.height;

      ctx.drawImage(
        image,
        spriteSheetX, spriteSheetY, sprite.width, sprite.height,
        destX, destY, sprite.width, sprite.height
      );

      if (gameFrame % Mario._lag === 0) {
        (Mario._screenProps.currentFrame + 1) === frames.length
          ? Mario._screenProps.currentFrame = 0
          : Mario._screenProps.currentFrame++;

        if (destX > ctx.canvas.width) Mario._screenProps.currentPos.x = 0;
        else Mario._screenProps.currentPos.x = destX + sprite.width;
      }
    } else {
      Mario._screenProps.currentFrame = 0;
      Mario._direction = 'right';
      Mario._state.action = 'run-forward';
      Mario.runForward(ctx, gameFrame);
    }

    Mario.locationNotify();

    return {
      height: sprite.height,
      pos: { ...Mario._screenProps.currentPos },
      width: sprite.width,
    }
  };

  public static standStill: AnimationFn = (ctx: CanvasRenderingContext2D, gameFrame: number) => {
    const sprite = Mario.getSprite();
    const { frames, startY } = Mario._spriteMap.still;
    const facing = {'right': 0, 'left': 1};

    if (Mario._state.action === 'still') {
      const spriteSheetX = frames[facing[Mario._direction]] * sprite.width;
      const spriteSheetY = startY;
      const destX = Mario._screenProps.currentPos.x;
      const destY = (Surface.floor - sprite.height);

      ctx.drawImage(
        image,
        spriteSheetX, spriteSheetY, sprite.width, sprite.height,
        destX, destY, sprite.width, sprite.height,
      );
    } else {
      // Take one more step if already running backward/forward.
      if (Mario._state.action === 'run-backward') {
        Mario._screenProps.currentPos.x -= sprite.width;
      } else if (Mario._state.action === 'run-forward') {
        Mario._screenProps.currentPos.x += sprite.width;
      }

      Mario._screenProps.currentFrame = 0;
      Mario._state.action = 'still';
      Mario.standStill(ctx, gameFrame);
    }

    Mario.locationNotify();

    return {
      height: sprite.height,
      pos: { ...Mario._screenProps.currentPos },
      width: sprite.width,
    }
  };

  private static getSprite(): MarioSprite {
    const { action, power } = Mario._state;

    const height = (() => {
      if (power === 'bg') return 50;
      if (power === 'fp') return 50;
      return 50;
    })()

    const maxPos = (() => {
      if (power === 'bg') return 2;
      if (power === 'fp') return 2;
      return 2;
    })();

    const startY = (() => {
      if (power === 'bg') return 0;
      if (power === 'fp') return 0;
      return 0;
    })();

    const width = (() => {
      if (power === 'bg') return 50;
      if (power === 'fp') return 50;
      return 50;
    })()

    return Object.freeze({
      height: height,
      maxPos,
      startY,
      width,
    });
  }

  private static locationNotify() {
    if (JSON.stringify(Mario._prevScreenProps) !== JSON.stringify(Mario._screenProps)) {
      Mario._locationObs.notify(Mario._screenProps);
      Mario._prevScreenProps.copy(Mario._screenProps);
    }
  }
}
