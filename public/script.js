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

function applyRotationFromIMU(data) {
  if (!("x" in data && "y" in data && "z" in data)) return;
  const x = parseFloat(data.x) * Math.PI / 180;
  const y = parseFloat(data.y) * Math.PI / 180;
  const z = parseFloat(data.z) * Math.PI / 180;
  cube.rotation.set(x, y, z);
}

init();

// Connect to WebSocket on same host
const socket = new WebSocket(`wss://${location.host}/ws`);

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    applyRotationFromIMU(data);
  } catch (e) {
    console.error("Invalid data received:", event.data);
  }
};
