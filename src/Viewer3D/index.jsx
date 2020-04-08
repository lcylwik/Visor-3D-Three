import React, { Component, createRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import TWEEN from '@tweenjs/tween.js';

import styles from './index.module.css';
import model from './assets/5.stl';
import OrientationHeader from './controls/orientation';
import * as SDCControls from './controls/SDCControls';
import { ControllerSetup } from './controls/controllerSetup';

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
      instantiated: false
    }
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
    this.loaderStl();
    this.settingsControls();
  }

  componentDidUpdate() {
    this.settingsControls();
  }

  init = () => {
    const widthContainer = this.refViewer.current.clientWidth - 100;
    const heightContainer = this.refViewer.current.clientHeight - 100;

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
      zoomSpeed: 2.2,
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

    //	this.addShadowedLight( 1, 1, 1, 0xffffff, 0.35 );
    //	this.addShadowedLight( 0.5, 1, - 1, 0xffaa00, 0.1);
  }

  addShadowedLight(x, y, z, color, intensity) {

    var directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    this.scene.add(directionalLight);

    directionalLight.castShadow = true;

    var d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

  }

  loaderStl = () => {
    (new STLLoader()).load(model, (geometry) => {
      let material = new THREE.MeshPhongMaterial({ color: 0xA3A3A3, specular: 100, shininess: 100 });
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);

      // Compute the middle
      this.middle = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(this.middle);

      // Center it
      this.mesh.position.x = -1 * this.middle.x;
      this.mesh.position.y = -1 * this.middle.y;
      this.mesh.position.z = -1 * this.middle.z;

      // Pull the camera away as needed
      var largestDimension = Math.max(geometry.boundingBox.max.x,
        geometry.boundingBox.max.y, geometry.boundingBox.max.z)
      this.camera.position.z = largestDimension * 1.5;

      this.animate();
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
      </div>
    );
  }

}

export default Viewer;
