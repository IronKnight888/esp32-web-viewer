let scene, camera, renderer, cube;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene"),
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

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

function applyRotation(eulerDeg) {
  const [x, y, z] = eulerDeg.map(deg => deg * Math.PI / 180);
  const euler = new THREE.Euler(y, x, z); // Note: apply in YXZ order to match BNO055
  cube.setRotationFromEuler(euler);

  // 🔄 Output quaternion to console
  const q = cube.quaternion;
  console.log({
    x: q.x.toFixed(4),
    y: q.y.toFixed(4),
    z: q.z.toFixed(4),
    w: q.w.toFixed(4)
  });
}

init();

const socket = new WebSocket(`wss://${location.host}`);
socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.joint === "cube" || data.euler) {
      applyRotation(data.euler || [0, 0, 0]);
    }
  } catch (e) {
    console.error("Bad data", event.data);
  }
};
