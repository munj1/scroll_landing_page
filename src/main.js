import * as THREE from "three";
import { House } from "./House";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("white");

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-5, 2, 25);
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight("white", 0.7);
spotLight.position.set(0, 150, 100);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024; //그림자 퀄리티 좋게
spotLight.shadow.mapSize.height = 1024; //
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

// Mesh
//그림자표현을 위해서 바닥을 만들어준거임
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: "white" })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const gltfLoader = new GLTFLoader();

const houses = [];
//1번
houses.push(
  new House({
    x: -5,
    z: 20,
    modelSrc: "/models/house.glb",
    gltfLoader,
    scene,
  })
);
//2
houses.push(
  new House({
    x: 7,
    z: 10,
    modelSrc: "/models/house.glb",
    gltfLoader,
    scene,
  })
);
//3
houses.push(
  new House({
    x: -10,
    z: 0,
    modelSrc: "/models/house.glb",
    gltfLoader,
    scene,
  })
);
//4
houses.push(
  new House({
    x: 10,
    z: -10,
    modelSrc: "/models/house.glb",
    gltfLoader,
    scene,
  })
);
//5
houses.push(
  new House({
    x: -5,
    z: -20,
    modelSrc: "/models/house.glb",
    gltfLoader,
    scene,
  })
);

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

let currentSection = 0;

function setSection() {
  const newSection = Math.round(window.scrollY / window.innerHeight);
  if (currentSection !== newSection) {
    gsap.to(camera.position, {
      duration: 1,
      x: houses[currentSection].x,
      z: houses[currentSection].z + 5,
    });
    currentSection = newSection;
  }
}

// 이벤트
window.addEventListener("scroll", setSection);
window.addEventListener("resize", setSize);

draw();
