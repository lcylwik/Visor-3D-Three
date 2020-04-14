import React, { Component, createRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import TWEEN from '@tweenjs/tween.js';
import AWS from 'aws-sdk';

import styles from './index.module.css';

import OrientationHeader from './controls/orientation';
import * as SDCControls from './controls/SDCControls';

import { steps } from './steps/data.json'
import AbstractDataModel from './models/modelsStore';
import TimeLine from './timeline/timeline';
import Player from './player/player';
import {
  ControllerSetup,
  setColorBoton,
  play,
  stop,
  prev,
  next
} from './controls/controllerSetup';

class Viewer extends Component {

  constructor(props) {
    super(props);

    this.refViewer = createRef();
    this.refOrientation = createRef();
    this.refTimeLine = createRef();

    this.state = {
      initialCamState: {
        position: '',
        rotation: ''
      },
      showingMandible: true,
      showingMaxilla: true,
      instantiated: false,
      loaded: false,
      currentStep: 0,
    }
    this.models = new AbstractDataModel();
    //this.setCredentials();
    this.name = "Lianet";
    // this.readBucket();
  }

  componentDidMount() {
    this.controller = {
      prev: "",
      next: "",
      orientation: this.refOrientation.current,
      playBtn: "",
      stopBtn: ""
    };

    this.init();
    this.setScene();
    this.loadAllStl();
    this.settingsControls();
    setColorBoton(this.refTimeLine.current, 0, styles.Active, styles.NoActive)
    this.renderer.domElement.addEventListener("change", this.animate);
    this.camera.addEventListener("change", this.animate);
  }

  componentDidUpdate(prevProps, prevState) {
    this.settingsControls();
    if (this.state.loaded && prevState.loaded !== this.state.loaded) {
      this.addModeltoScena(0);
    }
  }

  init = () => {
    const widthContainer = 335;
    const heightContainer = 221;

    this.camera = new THREE.PerspectiveCamera(70, widthContainer / heightContainer, 0.01, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.renderer.setSize(widthContainer, heightContainer);
    this.refViewer.current.appendChild(this.renderer.domElement);

    this.setState({
      initialCamState: {
        position: this.camera.position.clone(),
        rotation: this.camera.rotation.clone()
      }
    })
  }

  settingsControls = () => {
    let SDCControlsSettings = {
      zoomSpeed: 0.1,
      mouseSpeed: 0.18,
      zoomInLimit: 3,
      //zoomOutLimit: 12,
    };
    this.controls = SDCControls.makeController(SDCControlsSettings, this.camera, this.renderer, this.scene, this.animate);
    ControllerSetup(this.scene, this.state, this.camera, this.refTimeLine.current, steps.length, this.animate, this.refOrientation);
    this.controls.addEventListener('change', this.animate);
  }

  setScene = () => {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 1.5));
    this.scene.background = new THREE.Color(0xe0ebff);
  }

  addModeltoScena = (step) => {
    this.removeModelToScena()
    if (this.models.has(step)) {
      let model = this.models.get(step);
      model.name = "currentStep"
      this.scene.add(model);
      this.animate();
      setColorBoton(step, styles.Active, styles.NoActive)
      this.setState({ currentStep: step })
    }
  }

  removeModelToScena = () => {
    let { el, key } = this.models.hasByName("currentStep");
    if (el) {
      el.name = "";
      this.models.set(key, el);
      this.scene.remove(el);
    }
  }

  loadAllStl = () => {
    steps.map((st, index) => {
      let stl = require(`./assets/${st.id}.stl`);
      this.loaderStl(stl, index);
    });
  }

  loaderStl = (stl, index) => {
    (new STLLoader()).load(stl, (geometry) => {
      let material = new THREE.MeshPhongMaterial({ color: 0xA3A3A3, specular: 100, shininess: 100 });
      let mesh = new THREE.Mesh(geometry, material);

      // Compute the middle
      let middle = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(middle);

      // Center it
      mesh.position.x = -1 * middle.x;
      mesh.position.y = -1 * middle.y;
      mesh.position.z = -1 * middle.z;

      // Pull the camera away as needed
      var largestDimension = Math.max(geometry.boundingBox.max.x,
        geometry.boundingBox.max.y, geometry.boundingBox.max.z)
      this.camera.position.z = largestDimension * 1.5;

      this.models.save(mesh)
      this.setState({ loaded: true })
    });
  }

  animate = () => {
    console.log("animate")
    //requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    TWEEN.update()
  }

  setCredentials = () => {
    AWS.config.update(
      {
        accessKeyId: "...",
        secretAccessKey: "...",
      }
    );
  }

  readBucket = () => {
    debugger
    let s3 = new AWS.S3();
    s3.getObject(
      { Bucket: "mystls", Key: "1.stl" },
      function (error, data) {
        debugger
        if (error != null) {
          console.log("Failed to retrieve an object: " + error);
        } else {
          console.log("Loaded " + data.ContentLength + " bytes");
          // do something with data.Body
        }
      }
    );
  }

  render() {
    return (
      <div className={styles.ViewerContainer}>
        <div className={styles.TitleViewer}>{`${this.name}, ¡Tu nueva sonrisa te está esperando!`}</div>
        <div ref={this.refViewer} className={styles.Viewer} />
        <div className={styles.ControllersContainer}>
          <div className={styles.Controllers}>
            <Player data={steps} onPlay={play} onStop={stop} onPrev={prev} onNext={next}></Player>
            <TimeLine refTL={this.refTimeLine} data={steps} changeStep={this.addModeltoScena} />
          </div>
          <OrientationHeader refOri={this.refOrientation} />
        </div>
      </div>
    );
  }

}

export default Viewer;
