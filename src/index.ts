import { Animation } from './Animation';
import { Background } from './Background';
import { Canvas } from './Canvas';
import { initKeypressHandling } from './handle-keypresses';
import { Screen } from './Screen';

// document.addEventListener('click', () => {
//   var audio = new Audio('audio/01 Running About.mp3');
//   audio.play();
// });

Canvas.getInstance();
Screen.init();
initKeypressHandling();
Animation.addAnimation('init-bg', Background.init);
Animation.animate();
