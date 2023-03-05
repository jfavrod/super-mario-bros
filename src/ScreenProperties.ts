export class ScreenProperties {
  /** The current frame of the sprite sheet. */
  public currentFrame = 0;
  /** Where the element is on the canvas. */
  public currentPos = { x: 0, y: 0 };

  public constructor(screenProps?: ScreenProperties) {
    if (screenProps) this.copy(screenProps);
  }

  public copy(screenProps: ScreenProperties) {
    this.currentFrame = screenProps.currentFrame;
    this.currentPos = {...screenProps.currentPos};
  }
}
