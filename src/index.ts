import { Animation } from './Animation';
import { Canvas } from './Canvas';
import { initKeypressHandling } from './handle-keypresses';

// document.addEventListener('click', () => {
//   var audio = new Audio('audio/01 Running About.mp3');
//   audio.play();
// });

Canvas.getInstance('canvas', 1024, 512);
initKeypressHandling();
Animation.animate();
