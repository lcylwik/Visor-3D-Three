import TWEEN from '@tweenjs/tween.js';

let camera, scene, refTL, state, totalSteps, intervalPlay;

export const ControllerSetup = (sce, stateGlobal, cam, refTimeLine, length) => {
    scene = sce;
    state = stateGlobal;
    camera = cam;
    refTL = refTimeLine;
    totalSteps = length;
}

export const clickHandlers = (e) => {
    let direction = e.target.dataset.direction;
    direction && setDirection(direction);
    console.log(state)
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
    let tween = new TWEEN.Tween(teeth.rotation).to(xyz, 600);
    tween.easing(TWEEN.Easing.Quadratic.InOut)
    tween.start();
};

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
    addClass(el, classHidden)
    removeClass(refPlay, classHidden)
}

export const prev = () => {
    if (state.currentStep - 1 >= 0)
    refTL.children[state.currentStep - 1].click()
}

export const next = () => {
    if (state.currentStep + 1 < totalSteps)
    refTL.children[state.currentStep + 1].click()
}

