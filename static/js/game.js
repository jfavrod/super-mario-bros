"use strict";
define("Canvas", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Canvas = void 0;
    class Canvas {
        constructor(id, width, height) {
            this._canvas = document.getElementById(id);
            this._height = this._canvas.height = height;
            this._width = this._canvas.width = width;
            this._ctx = this._canvas.getContext('2d');
        }
        static getInstance(id, width, height) {
            if (Canvas._instance === undefined) {
                if (!id || !width || !height)
                    throw new Error('id, width, and height required to create a new instance of Canvas');
                Canvas._instance = new Canvas(id, width, height);
            }
            return Canvas._instance;
        }
        get ctx() {
            return this._ctx;
        }
        get height() {
            return this._height;
        }
        get width() {
            return this._width;
        }
    }
    exports.Canvas = Canvas;
});
define("ISprite", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Animation", ["require", "exports", "Canvas"], function (require, exports, Canvas_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Animation = void 0;
    class Animation {
        static addAnimation(key, animationFn) {
            if (!Animation._keys.includes(key)) {
                const glIdx = (Animation._gameLoop.push(animationFn) - 1);
                const keyIdx = (Animation._keys.push(key) - 1);
                return () => {
                    Animation._keys.splice(keyIdx, 1);
                    Animation._gameLoop.splice(glIdx, 1);
                };
            }
        }
        ;
        static animate() {
            if (!Animation._isAnimating) {
                Animation._isAnimating = true;
                Animation._animate();
            }
        }
        static stop() {
            Animation._isAnimating = false;
        }
        static _animate() {
            if (!Animation._isAnimating)
                return;
            if (!Animation._canvas)
                Animation._canvas = Canvas_1.Canvas.getInstance();
            const canvas = Animation._canvas;
            canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
            Animation._gameLoop.forEach((anim) => anim(canvas.ctx, Animation._gameFrame));
            Animation._gameFrame++;
            requestAnimationFrame(Animation._animate);
        }
    }
    exports.Animation = Animation;
    Animation._gameFrame = 0;
    Animation._isAnimating = false;
    Animation._gameLoop = [];
    Animation._keys = [];
});
define("Mario", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mario = void 0;
    const image = new Image();
    image.src = 'img/mario_sheet.png';
    class Mario {
        static getSprite() {
            const { action, power } = Mario._state;
            const height = (() => {
                if (power === 'bg')
                    return 50;
                if (power === 'fp')
                    return 50;
                return 50;
            })();
            const maxPos = (() => {
                if (power === 'bg')
                    return 2;
                if (power === 'fp')
                    return 2;
                return 2;
            })();
            const startY = (() => {
                if (power === 'bg')
                    return 0;
                if (power === 'fp')
                    return 0;
                return 0;
            })();
            const width = (() => {
                if (power === 'bg')
                    return 50;
                if (power === 'fp')
                    return 50;
                return 50;
            })();
            return Object.freeze({
                height: height,
                maxPos,
                startY,
                width,
            });
        }
    }
    exports.Mario = Mario;
    Mario._currentPos = { x: 0, y: 0 };
    /** The current animation frame from the sprite sheet. */
    Mario._currentFrame = 0;
    /** Which direction Mario is facing. */
    Mario._direction = 'right';
    Mario._lag = 5;
    Mario._spriteMap = {
        backward: {
            startY: 0,
            frames: [3, 4, 5],
        },
        forward: {
            startY: 0,
            frames: [0, 1, 2],
        },
        still: {
            startY: 50,
            frames: [0, 1],
        }
    };
    Mario._state = {
        action: 'still',
        power: 'sm',
    };
    Mario.runBackward = (ctx, gameFrame) => {
        const sprite = Mario.getSprite();
        const { frames, startY } = Mario._spriteMap.backward;
        if (Mario._state.action === 'run-backward') {
            const spriteSheetX = frames[Mario._currentFrame] * sprite.width;
            const spriteSheetY = startY;
            const destX = Mario._currentPos.x - sprite.width;
            const destY = ctx.canvas.height - sprite.height;
            ctx.drawImage(image, spriteSheetX, spriteSheetY, sprite.width, sprite.height, destX, destY, sprite.width, sprite.height);
            if (gameFrame % Mario._lag === 0) {
                (Mario._currentFrame + 1) === frames.length
                    ? Mario._currentFrame = 0
                    : Mario._currentFrame++;
                if (destX < 0)
                    Mario._currentPos.x = ctx.canvas.width;
                else
                    Mario._currentPos.x = destX;
            }
        }
        else {
            Mario._direction = 'left';
            Mario._state.action = 'run-backward';
            Mario.runBackward(ctx, gameFrame);
        }
        return {
            len: sprite.height,
            pos: Object.assign({}, Mario._currentPos),
            width: sprite.width,
        };
    };
    Mario.runForward = (ctx, gameFrame) => {
        const sprite = Mario.getSprite();
        const { frames, startY } = Mario._spriteMap.forward;
        if (Mario._state.action === 'run-forward') {
            const spriteSheetX = frames[Mario._currentFrame] * sprite.width;
            const spriteSheetY = startY;
            const destX = Mario._currentPos.x + sprite.width;
            const destY = ctx.canvas.height - sprite.height;
            ctx.drawImage(image, spriteSheetX, spriteSheetY, sprite.width, sprite.height, destX, destY, sprite.width, sprite.height);
            if (gameFrame % Mario._lag === 0) {
                (Mario._currentFrame + 1) === frames.length
                    ? Mario._currentFrame = 0
                    : Mario._currentFrame++;
                if (destX > ctx.canvas.width)
                    Mario._currentPos.x = 0;
                else
                    Mario._currentPos.x = destX;
            }
        }
        else {
            Mario._currentFrame = 0;
            Mario._direction = 'right';
            Mario._state.action = 'run-forward';
            Mario.runForward(ctx, gameFrame);
        }
        return {
            len: sprite.height,
            pos: Object.assign({}, Mario._currentPos),
            width: sprite.width,
        };
    };
    Mario.standStill = (ctx, gameFrame) => {
        const sprite = Mario.getSprite();
        const { frames, startY } = Mario._spriteMap.still;
        const facing = { 'right': 0, 'left': 1 };
        if (Mario._state.action === 'still') {
            const spriteSheetX = frames[facing[Mario._direction]] * sprite.width;
            const spriteSheetY = startY;
            const destX = Mario._currentPos.x;
            const destY = ctx.canvas.height - sprite.height;
            ctx.drawImage(image, spriteSheetX, spriteSheetY, sprite.width, sprite.height, destX, destY, sprite.width, sprite.height);
        }
        else {
            // Take one more step if already running backward/forward.
            if (Mario._state.action === 'run-backward') {
                Mario._currentPos.x -= sprite.width;
            }
            else if (Mario._state.action === 'run-forward') {
                Mario._currentPos.x += sprite.width;
            }
            Mario._currentFrame = 0;
            Mario._state.action = 'still';
            Mario.standStill(ctx, gameFrame);
        }
        return {
            len: sprite.height,
            pos: Object.assign({}, Mario._currentPos),
            width: sprite.width,
        };
    };
});
define("Screen", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Screen = void 0;
    class Screen {
    }
    exports.Screen = Screen;
});
define("handle-keypresses", ["require", "exports", "Animation", "Mario"], function (require, exports, Animation_1, Mario_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initKeypressHandling = void 0;
    const initKeypressHandling = () => {
        let remove;
        let currentKey = '';
        document.addEventListener('keydown', (event) => {
            if (currentKey !== 'ArrayRight' && currentKey !== 'ArrayLeft') {
                remove && remove();
                remove = undefined;
                if (event.key === 'ArrowRight') {
                    remove = Animation_1.Animation.addAnimation('running', Mario_1.Mario.runForward);
                }
                else if (event.key === 'ArrowLeft') {
                    remove = Animation_1.Animation.addAnimation('running-rev', Mario_1.Mario.runBackward);
                }
            }
        });
        document.addEventListener('keyup', () => {
            console.log('stop', remove);
            remove && remove();
            remove = undefined;
            remove = Animation_1.Animation.addAnimation('stand-still', Mario_1.Mario.standStill);
        });
    };
    exports.initKeypressHandling = initKeypressHandling;
});
define("index", ["require", "exports", "Animation", "Canvas", "handle-keypresses"], function (require, exports, Animation_2, Canvas_2, handle_keypresses_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // document.addEventListener('click', () => {
    //   var audio = new Audio('audio/01 Running About.mp3');
    //   audio.play();
    // });
    Canvas_2.Canvas.getInstance('canvas', 1024, 512);
    (0, handle_keypresses_1.initKeypressHandling)();
    Animation_2.Animation.animate();
});
