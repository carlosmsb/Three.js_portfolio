import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Mesh } from 'three';

//Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

//Torus

const geometry = new THREE.TorusKnotGeometry( 7, 1.4, 200, 50 );
const material = new THREE.MeshStandardMaterial({color: 0xFFFFFF, emissive: 0x010101, roughness:0, metalness: 0.25, wireframe: true});
const torusKnot = new THREE.Mesh( geometry, material );
scene.add(torusKnot);

torusKnot.position.z = 10;
torusKnot.position.y = (3);
torusKnot.position.x = (-2);

//Lights

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

//Helpers

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

//stars

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Avatar

const pfpTexture = new THREE.TextureLoader().load('pfp.jpg');

const pfp = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: pfpTexture }));

scene.add(pfp);

//Earth

const earthmapTexture = new THREE.TextureLoader().load('earthmap.jpeg')
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');
const earthmap = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: earthmapTexture, normalMap: normalTexture,})
);

scene.add(earthmap)

earthmap.position.z = 25;
earthmap.position.setX(-10);

pfp.position.z = -5;
pfp.position.x = 10;

//Scroll animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  
  earthmap.rotation.x += 0.05;
  earthmap.rotation.y += 0.075;
  earthmap.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

//Animation

function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.001;
  torusKnot.rotation.y += 0.002;
  torusKnot.rotation.z += 0.001;

  earthmap.rotation.y += 0.005;

  pfp.rotation.x += 0.001;
  pfp.rotation.y += 0.002;
  pfp.rotation.z += 0.001;

  

  controls.update();

  renderer.render(scene, camera);
}

animate()
