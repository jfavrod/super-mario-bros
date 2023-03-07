import { PlayerAction } from './Player';

export type SpriteSheetData = {
  /** Number of frames in the complete sprite movement. */
  frameCount: number;
  /** The height of the sprite frame. */
  height: number;
  /**
   * How far (in pixels) from the left edge the sprite frames start in
   * the sprite sheet.
   */
  startX: number;
  /**
   * How far (in pixels) from the top edge the sprite frames start in
   * the sprite sheet.
   */
  startY: number;
  /** The width of the sprite frame. */
  width: number;
};

export type PlayerSpriteMap = Record<PlayerAction, SpriteSheetData>;
