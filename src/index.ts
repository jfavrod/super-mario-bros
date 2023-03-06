import { Animation } from './Animation';
import { Mario } from './Mario';
import { Screen } from './Screen';

// document.addEventListener('click', () => {
//   var audio = new Audio('audio/01 Running About.mp3');
//   audio.play();
// });

const player = new Mario('img/mario_sheet.png');

Screen.init(player);
Animation.addSprite(player);
Animation.animate();
