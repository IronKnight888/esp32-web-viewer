let scene, camera, renderer, cube;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Cube with smooth material
  const geometry = new THREE.BoxGeometry(1, 2, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0x6699ff,
    metalness: 0.3,
    roughness: 0.4,
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 3, 3);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040); // soft light
  scene.add(ambient);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function applyQuaternion([x, y, z, w]) {
  cube.quaternion.set(x, y, z, w);
}

init();

// Connect to WebSocket
const socket = new WebSocket(`wss://${location.host}/ws`);
socket.onopen = () => console.log("✅ WebSocket connected");
socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.joint === "cube" && Array.isArray(data.quat)) {
      applyQuaternion(data.quat);
    }
  } catch (e) {
    console.error("Bad WebSocket data:", event.data);
  }
};
