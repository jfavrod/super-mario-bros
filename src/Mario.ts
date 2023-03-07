import { PlayerSpriteMap, SpriteSheetData } from './ISpriteMap';
import { Player } from './Player';
import { Surface } from './Surface';

export class Mario extends Player {
  protected _spriteMap: PlayerSpriteMap = {
    'backward': {
      frameCount: 3,
      height: this._power === 'sm' ? 50 : 0,
      startX: 150,
      startY: 0,
      width: 50,
    },
    'crouch': {} as SpriteSheetData,
    'forward': {
      frameCount: 3,
      height: this._power === 'sm' ? 50 : 0,
      startX: 0,
      startY: 0,
      width: 50,
    },
    'jump': {
      frameCount: 1,
      height: this._power === 'sm' ? 50 : 0,
      startX: this._direction === 'left' ? 350 : 300,
      startY: 0,
      width: 50,
    },
    'skid': {
      frameCount: 1,
      height: this._power === 'sm' ? 50 : 0,
      startX: this._direction === 'left' ? 100 : 150,
      startY: 50,
      width: 50,
    },
    'still': {
      frameCount: 1,
      height: this._power === 'sm' ? 50 : 0,
      startX: this._direction === 'left' ? 50 : 0,
      startY: 50,
      width: 50,
    },
  };

  public constructor(spriteSheetPath: string) {
    super(spriteSheetPath);
    const { height: spriteHeight, width: spriteWidth } = this._spriteMap[this._action];
    this._screenPos.y = (Surface.floor - spriteHeight),
    this._spriteSheetPos.y = spriteWidth;
  }

  protected updateSpiteMap = () => {
    this._spriteMap.backward.height = this._power === 'sm' ? 50 : 0;
    this._spriteMap.forward.height = this._power === 'sm' ? 50 : 0;
    this._spriteMap.jump.height = this._power === 'sm' ? 50 : 0;
    this._spriteMap.jump.startX = this._direction === 'left' ? 350 : 300;
    this._spriteMap.skid.height = this._power === 'sm' ? 50 : 0;
    this._spriteMap.skid.startX = this._direction === 'left' ? 100 : 150;
    this._spriteMap.still.height = this._power === 'sm' ? 50 : 0;
    this._spriteMap.still.startX = this._direction === 'left' ? 50 : 0;
  };
}
