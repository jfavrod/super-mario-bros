import { Animation } from './Animation';
import { Mario } from './Mario';

export const initKeypressHandling = () => {

  let remove: CallableFunction | undefined;
  let currentKey: string = '';

  document.addEventListener('keydown', (event) => {
    if (currentKey !== 'ArrayRight' && currentKey !== 'ArrayLeft') {
      remove && remove();
      remove = undefined;

      if (event.key === 'ArrowRight') {
        remove = Animation.addAnimation('running', Mario.runForward);
      } else if (event.key === 'ArrowLeft') {
        remove = Animation.addAnimation('running-rev', Mario.runBackward);
      }
    }
  });

  document.addEventListener('keyup', () => {
    console.log('stop', remove);
    remove && remove();
    remove = undefined;
    remove = Animation.addAnimation('stand-still', Mario.standStill);
  });
};
