import { Canvas } from './Canvas';

const canvas = Canvas.getInstance();

export class Surface {
  public static readonly playerForwardLimit = canvas.width / 2;
  public static readonly floor = canvas.height - 55;
}
