let scene, camera, renderer, cube;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("scene") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BoxGeometry(1, 2, 0.5);
  const material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function applyRotation(euler) {
  const [x, y, z] = euler.map(deg => deg * Math.PI / 180);
  cube.rotation.set(y, x, z);
}

init();

const socket = new WebSocket(`wss://${location.host}`);
socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.joint === "cube") {
      applyRotation(data.euler);
    }
  } catch (e) {
    console.error("Bad data", event.data);
  }
};
