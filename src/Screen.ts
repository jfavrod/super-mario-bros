import { Animation } from './Animation';
import { Background } from './Background';
import { Canvas } from './Canvas';
import { Mario } from './Mario';
import { SpriteState } from './SpriteState';

/**
 * Observers sprites and 
 */
export class Screen {
  private static _canvas = Canvas.getInstance();

  private static _initialized = false;

  private static _stopBg: (() => void) | undefined;
  private static _removeInitBg: (() => void) | undefined;
  private static _removeRunForward: (() => void) | undefined;
  private static _removeRunReverse: (() => void) | undefined;
  private static _removeStandStill: (() => void) | undefined;

  public static init() {
    if (!Screen._initialized) {
      Screen._removeInitBg = Animation.addAnimation('init-bg', Background.init, 0);

      Mario.addLocationObserver(Screen.marioMovementObserver);
      Mario.addStopObserver(Screen.marioStopObserver);

      Screen.initKeyPressHandles();
      Screen._initialized = true;
    }
  }

  private static marioMovementObserver(pos: SpriteState) {
    if ((pos.currentPos.x + (Mario.getSprite().width / 2)) > (Screen._canvas.width / 2)) {
      // If we're not already stopped and we're moving.
      if (!Screen._stopBg && Screen._removeRunForward) {
        Screen._stopBg = Animation.addAnimation('advance-bg', Background.advance, 0);
      }
    }
  }

  private static marioStopObserver() {
    if (Screen._stopBg) {
      Screen._stopBg();
      Screen._stopBg = undefined;
    }
  }

  private static initKeyPressHandles() {
    let currentKey: string = '';

    document.addEventListener('keydown', (event) => {
      currentKey = event.key;

      if (currentKey === 'ArrowRight' || currentKey === 'ArrowLeft') {
        Screen._removeStandStill && Screen._removeStandStill();
        Screen._removeStandStill = undefined;

        if (event.key === 'ArrowRight') {
          Screen._removeRunForward = Animation.addAnimation('running', Mario.runForward);
        } else if (event.key === 'ArrowLeft') {
          Screen._removeRunReverse = Animation.addAnimation('running-rev', Mario.runBackward);
        }
      }
    });

    document.addEventListener('keyup', () => {
      Screen._removeRunForward && Screen._removeRunForward();
      Screen._removeRunForward = undefined;

      Screen._removeRunReverse && Screen._removeRunReverse();
      Screen._removeRunReverse = undefined;

      Screen._stopBg && Screen._stopBg();
      Screen._stopBg = undefined;

      Screen._removeStandStill = Animation.addAnimation('stand-still', Mario.standStill);
    });
  }
}
