import React, { Component, createRef } from 'react';
import styles from './index.module.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import model from './assets/5.stl';

class Viewer extends Component {

  constructor(props) {
    super(props);

    this.refViewer = createRef();
  }

  componentDidMount() {
    this.init();
    this.settingsControls();
    this.setScene();
    this.loaderStl();
  }

  init = () => {
    const widthContainer = this.refViewer.current.clientWidth;
    const heightContainer = this.refViewer.current.clientHeight;

    this.camera = new THREE.PerspectiveCamera( 70, widthContainer / heightContainer, 1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.renderer.setSize( widthContainer, heightContainer);
    this.refViewer.current.appendChild( this.renderer.domElement );
  } 

  settingsControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.75;
    this.controls.dampingFactor = 0.1;
    this.controls.enableZoom = true;
   // this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = .75;
  }

  setScene = () => {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

	//	this.addShadowedLight( 1, 1, 1, 0xffffff, 0.35 );
	//	this.addShadowedLight( 0.5, 1, - 1, 0xffaa00, 0.1);
  }

  addShadowedLight( x, y, z, color, intensity ) {

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    this.scene.add( directionalLight );

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
     // let material = new THREE.MeshPhongMaterial( { color: 0xcb3234, specular: 0x111111, shininess: 200 } );
     // let material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
      let mesh = new THREE.Mesh(geometry, material);
          this.scene.add(mesh);
          
          // Compute the middle
        var middle = new THREE.Vector3();
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

        this.animate();
    });
  }

  animate = () => {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
  }

  render () {
    return (
      <div className={styles.ViewerContainer}>
        <div ref={this.refViewer} className={styles.Viewer} />
      </div>
    );
  }
  
}

export default Viewer;
