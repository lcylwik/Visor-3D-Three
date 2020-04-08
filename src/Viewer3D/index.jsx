import React, { Component, createRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import TWEEN from '@tweenjs/tween.js';

import styles from './index.module.css';

import OrientationHeader from './controls/orientation';
import * as SDCControls from './controls/SDCControls';
import { ControllerSetup } from './controls/controllerSetup';

import { steps } from './steps/data.json'
import AbstractDataModel from './models/modelsStore';
import TimeLine from './timeline/timeline';

class Viewer extends Component {

  constructor(props) {
    super(props);

    this.refViewer = createRef();
    this.refOrientation = createRef();

    this.state = {
      initialCamState: {
        position: '',
        rotation: ''
      },
      showingMandible: true,
      showingMaxilla: true,
      instantiated: false,
      loaded: false,
    }
    this.models = new AbstractDataModel();

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
  }

  componentDidUpdate(prevProps, prevState) {
    this.settingsControls();
    if(this.state.loaded && prevState.loaded !== this.state.loaded) {
      this.addModeltoScena(0);
    }
  }

  init = () => {
    const widthContainer = this.refViewer.current.clientWidth - 100;
    const heightContainer = this.refViewer.current.clientHeight;

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
    this.controls = SDCControls.makeController(SDCControlsSettings, this.camera, this.renderer, this.scene);
    ControllerSetup(this.scene, this.state, this.camera);
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
      this.setState({loaded: true})
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    TWEEN.update()
  }

  render() {
    return (
      <div className={styles.ViewerContainer}>
        <OrientationHeader refOri={this.refOrientation} />
        <div ref={this.refViewer} className={styles.Viewer} />
        <TimeLine data={steps} changeStep={this.addModeltoScena} />
      </div>
    );
  }

}

export default Viewer;
