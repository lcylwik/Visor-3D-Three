import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let state = {
    w: null,
    h: null,
    xComponent: null,
    yComponent: null,
    zComponent: null,
    isDragging: false,
    previousPosition: {
        x: 0,
        y: 0
    },
    canvasOffset: null,
    mouseSpeed: null,
    touchMode: false
};
let camera, scene, renderer;

let Animate, id;

let manipulationStartEvents = ['mousedown', 'touchstart'];
let manipulationEndEvents = ['mouseup', 'mouseout', 'touchend'];
let manipulationInProgressEvents = ['mousemove', 'touchmove'];

const makeController = (config, cam, render, sce, animate) => {
    camera = cam;
    scene = sce;
    renderer = render;
    Animate = animate;

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.zoomSpeed = config.zoomSpeed;
    controls.minDistance = 10;
    controls.maxDistance = 200;
    controls.maxZoom = 1
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableRotate = false;
    state.mouseSpeed = config.mouseSpeed;
    setUpManipulationHandlers();
    return controls;
};

const setUpManipulationHandlers = () => {
    setUpControlEvents(manipulationStartEvents, 'touchstart', controlStart);
    setUpControlEvents(manipulationEndEvents, 'touchend', controlEnd);
    setUpControlEvents(manipulationInProgressEvents, 'touchmove', controlRotation);
}

const setUpControlEvents = (events, touchEventType, callback) => {
    attachEvents(events, function (e) {
        chooseTouchOrClickHandler(e, touchEventType, callback);
    });
}

const chooseTouchOrClickHandler = (event, touchEventType, callback) => {
    if (!state.touchMode || event.type === touchEventType) {
        callback(event);
    }
}

const attachEvents = (events, callback) => {
    events.forEach(function (eventType) {
        renderer.domElement.addEventListener(eventType, callback);
    });
}

const toRadians = (angle) => {
    return angle * (Math.PI / 180);
}

const getOffset = (elem) => {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

const detectTouchMode = (e) => {
    if (e.type === 'touchstart' && !state.touchMode) {
        state.touchMode = true;
        state.mouseSpeed *= 2;
        state.canvasOffset = getOffset(renderer.domElement);
    }
}

const createRelativeEventPosition = (event) => {
    switch (event.type) {
        case 'mousemove':
            return {
                x: event.offsetX,
                y: event.offsetY
            };
        case 'touchstart':
        case 'touchmove':
            var thisTouch = event.changedTouches[0];
            return {
                x: thisTouch.pageX - state.canvasOffset.left,
                y: thisTouch.pageY - state.canvasOffset.top
            };
        default:
            return null;
    }
}

const createDeltaMove = (relativePosition) => {
    return {
        x: relativePosition.x - state.previousPosition.x,
        y: relativePosition.y - state.previousPosition.y
    };
}

const updateAll = () => {
    requestAnimationFrame(function loop() {
        Animate()
        //console.log("inicializa request touch", id)
        id = requestAnimationFrame(loop)
    });
}

const stopUdate = () => {
    if (id !== undefined) {
        let interval = setInterval(() => {
            //console.log("start interval touch", id)
            if (id === undefined) {
                clearInterval(interval)
                interval = undefined
                //console.log("stop interval touch", id)
            }
            cancelAnimationFrame(id);
            id = undefined;
        }, 50)
    }
}

const controlStart = (e) => {
    detectTouchMode(e);
    state.isDragging = true;
    state.currentModel = scene;
    state.w = renderer.domElement.offsetWidth;
    state.h = renderer.domElement.offsetHeight;

    if (e.type === 'touchstart') {
        state.previousPosition = createRelativeEventPosition(e);
    }
    updateAll()
}

const controlEnd = (event) => {
    state.isDragging = false;
    stopUdate()
}

const controlRotation = (event) => {
    var relativeEventPosition = createRelativeEventPosition(event);
    var deltaMove = createDeltaMove(relativeEventPosition);

    if (event.type === 'touchmove' && event.targetTouches.length > 1) {
        return;
    }

    if (state.isDragging) {
        state.xComponent = Math.sin((Math.PI / state.w) * relativeEventPosition.x);
        state.yComponent = Math.sin((Math.PI / state.h) * relativeEventPosition.y);
        state.zComponent = { x: Math.cos((Math.PI / state.w) * relativeEventPosition.x), y: Math.cos((Math.PI / state.h) * relativeEventPosition.y) };
        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                toRadians(state.xComponent * deltaMove.y * state.mouseSpeed),
                toRadians(state.yComponent * deltaMove.x * state.mouseSpeed),
                toRadians((state.zComponent.x * deltaMove.y - state.zComponent.y * deltaMove.x) * state.mouseSpeed),
                'XYZ'
            ));
        state.currentModel.quaternion.multiplyQuaternions(deltaRotationQuaternion, state.currentModel.quaternion);
    }
    state.previousPosition = relativeEventPosition;
}

export { makeController }
