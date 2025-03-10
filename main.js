// Global variables for scene, camera, renderer, controls, and animation
let scene, camera, renderer, controls, currentObject, mixer, animationAction, clock;

// Animation loop that updates the mixer if available
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
}

// Initialize the scene
function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-20, -30, 30); // Adjusted camera position for a better view

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x505050); // Black background
; // Medium gray background
  document.body.appendChild(renderer.domElement);

  // Clock for animation timing
  clock = new THREE.Clock();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 40);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 40);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 40);
  directionalLight2.position.set(-5, -5, -5).normalize();
  scene.add(directionalLight2);

  // OrbitControls for interaction
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;

  animate();
}

// Load a model from the models folder
function loadObjectModel(filename) {
  const loader = new THREE.GLTFLoader();

  loader.load(
    `./models/${filename}`,
    (gltf) => {
      // Remove any previous model
      if (currentObject) {
        scene.remove(currentObject);
      }

      currentObject = gltf.scene;
      scene.add(currentObject);

// Traverse the model and update transparent materials
currentObject.traverse((child) => {
  if (child.isMesh && child.material) {
    // Enable transparency if it's not already set
    child.material.transparent = true;
    // Set an alphaTest value to help with depth sorting of transparent textures
    child.material.alphaTest = 0.5;
  }
});

      // If the model contains animations, set up the mixer and store the first animation clip
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentObject);
        animationAction = mixer.clipAction(gltf.animations[0]);
        // Do not auto-play; wait for the user to click "Play Animation"
      }
    },
    (xhr) => {
      console.log(`${filename} loaded: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error(`An error occurred while loading ${filename}:`, error);
    }
  );
}

// Load the syringe model
window.loadSyringe = function () {
  loadObjectModel('syringe.glb');
};

// Function to play the animation when the user clicks the button
window.playAnimation = function () {
  if (animationAction) {
    // Reset and play the animation from the beginning
    animationAction.reset();
    animationAction.play();
  } else {
    console.log('No animation available for this model.');
  }
};

// Initialize the scene and load the syringe model by default
initScene();
window.loadSyringe();
