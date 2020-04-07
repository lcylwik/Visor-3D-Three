import React, { Component, createRef } from 'react';
import styles from './index.module.css';
import * as THREE from 'three';
import { OrbitControls } from './controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import model from './assets/5.stl';
import OrientationHeader from './controls/orientation';

class Viewer extends Component {

  constructor(props) {
    super(props);

    this.refViewer = createRef();
    this.state = {
      orientation: "front"
    }
  }

  componentDidMount() {
    this.init();
    this.settingsControls();
    this.setScene();
    this.loaderStl();
  }

  init = () => {
    const widthContainer = this.refViewer.current.clientWidth - 100;
    const heightContainer = this.refViewer.current.clientHeight - 100;

    this.camera = new THREE.PerspectiveCamera(70, widthContainer / heightContainer, 0.01, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.renderer.setSize(widthContainer, heightContainer);
    this.refViewer.current.appendChild(this.renderer.domElement);
  }

  settingsControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.75;
    this.controls.dampingFactor = 0.1;
    this.controls.enableZoom = true;
    this.controls.maxZoom = 100
    // this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = .75;
    this.controls.addEventListener( 'change', this.change );

  }

  change = (e) => {
   
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
  }

  setOrientation = (ori) => {
    if (this.state.orientation !== ori) {
      this.setState({ orientation: ori })
    }
  }

  changeDirection = (dir) => {
    const go = dir;
    if (this.state.orientation === go) return;

    if (go === 'front' && this.state.orientation === 'left') {
      this.intervalFront = setInterval(this.moveFrontSinceLeft, 20);
    } else if (go === 'front' && this.state.orientation === 'rigth') {
      this.intervalFront = setInterval(this.moveFrontSinceRigth, 20);
    } else if (go === 'left')
      this.intervalLeft = setInterval(this.moveLeft, 20);
    else this.intervalRigth = setInterval(this.moveRigth, 20);
  }

  moveFrontSinceLeft = () => {
    this.mesh.translateZ(Math.PI / 10)
    this.mesh.rotateY(Math.PI / 50)
    if (this.mesh.rotation._y > 0.15) {
      clearInterval(this.intervalFront);
      this.setOrientation('front');
    }
  }

  moveFrontSinceRigth = () => {
    this.mesh.rotateY(-Math.PI / 50)
    this.mesh.translateZ(-Math.PI / 10)
    if (this.mesh.rotation._y < 0.15) {
      clearInterval(this.intervalFront);
      this.setOrientation('front');
    }
  }

  moveLeft = () => {
    this.mesh.rotateY(-Math.PI / 50)
    this.mesh.translateZ(-Math.PI / 10)
    if (this.mesh.rotation._y < -0.9) {
      clearInterval(this.intervalLeft);
      this.setOrientation('left');
    }
  }

  moveRigth = () => {
    this.mesh.rotateY(Math.PI / 50)
    this.mesh.translateZ(Math.PI / 10)
    if (this.mesh.rotation._y > 1.3) {
      clearInterval(this.intervalRigth);
      this.setOrientation('rigth');
    }
  }


  render() {
    return (
      <div className={styles.ViewerContainer}>
        <OrientationHeader changeDirection={this.changeDirection} />
        <div ref={this.refViewer} className={styles.Viewer} />
      </div>
    );
  }

}

export default Viewer;
