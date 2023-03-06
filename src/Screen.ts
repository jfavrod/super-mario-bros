import { Animation } from './Animation';
import { Background } from './Background';
import { Canvas } from './Canvas';
import { Player, Position } from './Player';

/**
 * Observers sprites and 
 */
export class Screen {
  private static _canvas = Canvas.getInstance();
  private static _initialized = false;
  private static _player: Player;

  private static _stopBg: (() => void) | undefined;
  private static _removeInitBg: (() => void) | undefined;

  public static init(player: Player) {
    if (!Screen._initialized) {
      Screen._player = player;
      Screen._removeInitBg = Animation.addAnimation('init-bg', Background.init, 0);

      player.addObserver('move', Screen.playerMovementObserver);
      player.addObserver('stop', Screen.marioStopObserver);

      Screen.initKeyPressHandles();
      Screen._initialized = true;
    }
  }

  private static playerMovementObserver(pos: Position) {
    console.log('move', pos);
    Screen._removeInitBg!();
    if ((pos.x + Screen._player.spriteWidth) > (Screen._canvas.width / 2)) {
      Screen._stopBg = Animation.addAnimation('advance-bg', Background.advance, 0);
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
        if (event.key === 'ArrowRight') {
          Screen._player.setAction('forward');
        } else if (event.key === 'ArrowLeft') {
          Screen._player.setAction('backward');
        }
      }
    });

    document.addEventListener('keyup', () => {
      Screen._player.setAction('still');

      if (Screen._stopBg) {
        Screen._stopBg();
        Screen._stopBg = undefined;
      }
    });
  }
}
