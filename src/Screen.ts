import { Animation } from './Animation';
import { Background } from './Background';
import { Canvas } from './Canvas';
import { Player, Position } from './Player';

const BACKWARD_KEY = 'ArrowLeft';
const FORWARD_KEY = 'ArrowRight';
const JUMP_KEY = 'd';
const RUN_WALK_KEY = 'a';

const movement = [BACKWARD_KEY, FORWARD_KEY, JUMP_KEY, RUN_WALK_KEY];

/**
 * Observers sprites and 
 */
export class Screen {
  private static _canvas = Canvas.getInstance();
  private static _initialized = false;
  private static _player: Player;

  private static _stopBg: (() => void) | undefined;

  public static init(player: Player) {
    if (!Screen._initialized) {
      Screen._player = player;
      Animation.addAnimation('init-bg', Background.init, 0);

      player.addObserver('move', Screen.playerMovementObserver);
      player.addObserver('stop', Screen.marioStopObserver);

      Screen.initKeyPressHandles();
      Screen._initialized = true;
    }
  }

  private static playerMovementObserver(pos: Position) {
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
    document.addEventListener('keydown', (event) => {
      const currentKey = event.key;

      if (movement.includes(currentKey)) {
        if (event.key === FORWARD_KEY) {
          Screen._player.setAction('forward');
        } else if (event.key === BACKWARD_KEY) {
          Screen._player.setAction('backward');
        } else if (event.key === JUMP_KEY) {
          Screen._player.setAction('jump');
        } else if (currentKey === RUN_WALK_KEY) {
          Screen._player.isRunning = true;
          Background.speed = 8;
        }
      } else {
        console.log(currentKey);
      }
    });

    document.addEventListener('keyup', (event) => {
      const currentKey = event.key;

      if (currentKey === BACKWARD_KEY || currentKey === FORWARD_KEY) {
        Screen._player.setAction('still');
        if (Screen._stopBg) {
          Screen._stopBg();
          Screen._stopBg = undefined;
        }
      } else if (currentKey === RUN_WALK_KEY) {
        Screen._player.isRunning = false;
        Background.speed = 3;
      }
    });
  }
}
