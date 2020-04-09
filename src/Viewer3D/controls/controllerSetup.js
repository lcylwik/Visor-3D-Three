import TWEEN from '@tweenjs/tween.js';

let camera, scene, refTL, state, totalSteps, intervalPlay;

let Update, id;

export const ControllerSetup = (sce, stateGlobal, cam, refTimeLine, length, animate) => {
    scene = sce;
    state = stateGlobal;
    camera = cam;
    refTL = refTimeLine;
    totalSteps = length;
    Update = animate;
}

export const clickHandlers = (e) => {
    let direction = e.target.dataset.direction;
    direction && setDirection(direction);
}

const setDirection = (dir) => {
    let teeth = scene;
    let direction = dir.toLowerCase();

    //controller.orientation activar className

    switch (direction) {
        case 'left':
            makeAnimation(teeth, { x: 0, y: -Math.PI / 2, z: 0 });
            //cameraResetAnimation();
            break;
        case 'right':
            makeAnimation(teeth, { x: 0, y: Math.PI / 2, z: 0 });
            // cameraResetAnimation();
            break;
        case 'front':
            makeAnimation(teeth, { x: 0, y: 0, z: 0 });
            //cameraResetAnimation();
            break;
    }
}

const makeAnimation = function (teeth, xyz) {
    UpdateAll(teeth, xyz);
    let tween = new TWEEN.Tween(teeth.rotation).to(xyz, 600)
    tween.easing(TWEEN.Easing.Quadratic.InOut)
    tween.start()
};

const creteRequestFrame = () => {
    requestAnimationFrame(function loop() {
        Update()
        id = requestAnimationFrame(loop)
    });
}

const stopRequestFrame = (teeth, xyz) => {
    let interval = setInterval(() => {
        if (teeth.rotation.y === xyz.y && teeth.rotation.x === xyz.x && teeth.rotation.z === xyz.z) {
            if (id === null) {
                clearInterval(interval)
                interval = null
            }
            console.log("stop interval")
            cancelAnimationFrame(id);
            id = null;
        }
    }, 50)
}

const stopReques = () => {
    let interval = setInterval(() => {
        console.log("start interval")
        clearInterval(interval)
        interval = null
        console.log("stop interval")
        cancelAnimationFrame(id);
        id = null;
    }, 50)
}

const UpdateAll = (teeth, xyz) => {
    creteRequestFrame();
    stopRequestFrame(teeth, xyz);
}

const cameraResetAnimation = () => {
    let initialCamStateObj = {
        x: state.initialCamState.position.x,
        y: state.initialCamState.position.y,
        z: state.initialCamState.position.z
    };
    new TWEEN.Tween(camera.position).to(initialCamStateObj, 600).easing(TWEEN.Easing.Quadratic.InOut).start();
    new TWEEN.Tween(camera.rotation).to(initialCamStateObj, 600).easing(TWEEN.Easing.Quadratic.InOut).start();
};

export const addClass = (el, myClass) => {
    el.classList.add(myClass);
}

export const removeClass = (el, myClass) => {
    el.classList.remove(myClass);
}

export const setColorBoton = (step, active, NoActive) => {
    let childrens = refTL.children;
    for (let i = 0; i < childrens.length; i++) {
        const child = childrens[i];
        if (i === step) {
            removeClass(child, NoActive);
            addClass(child, active);
        } else {
            addClass(child, NoActive);
            removeClass(child, active);
        }
    }
}

export const play = (el, classHidden, refStop) => {
    if (!intervalPlay) {
        playing(el, classHidden, refStop);
        intervalPlay = setInterval(() => {
            playing(el, classHidden, refStop);
        }, 600)
        removeClass(refStop, classHidden)
        addClass(el, classHidden)
    }
}

const playing = (refPlay, classHidden, refStop) => {
    if (state.currentStep + 1 < totalSteps) {
        refTL.children[state.currentStep + 1].click()
    } else {
        stop(refStop, classHidden, refPlay)
    }
}

export const stop = (el, classHidden, refPlay) => {
    clearInterval(intervalPlay);
    intervalPlay = null;
    addClass(el, classHidden);
    removeClass(refPlay, classHidden);
    stopReques();
}

export const prev = () => {
    if (state.currentStep - 1 >= 0)
        refTL.children[state.currentStep - 1].click()
}

export const next = () => {
    if (state.currentStep + 1 < totalSteps)
        refTL.children[state.currentStep + 1].click()
}

