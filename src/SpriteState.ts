export class SpriteState {
  /** The current frame of the sprite sheet. */
  public currentFrame = 0;
  /** Where the element is on the canvas. */
  public currentPos = { x: 0, y: 0 };

  public constructor(spriteState?: SpriteState) {
    if (spriteState) this.copy(spriteState);
  }

  public copy(screenProps: SpriteState) {
    this.currentFrame = screenProps.currentFrame;
    this.currentPos = {...screenProps.currentPos};
  }
}
