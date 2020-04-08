import TWEEN from '@tweenjs/tween.js';

let camera, scene, controller, state;

export const ControllerSetup = (sce, stateGlobal, cam) => {

    scene = sce;
    state = stateGlobal;
    camera = cam;
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
            showAllTeeth();
            break;
        case 'right':
            makeAnimation(teeth, { x: 0, y: Math.PI / 2, z: 0 });
           // cameraResetAnimation();
            showAllTeeth();
            break;
        case 'front':
            makeAnimation(teeth, { x: 0, y: 0, z: 0 });
            //cameraResetAnimation();
            showAllTeeth();
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

const showAllTeeth = () => {

}

