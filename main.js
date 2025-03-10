// main.js

// Initialize SCORM when the page loads and finish when it unloads
window.addEventListener('load', () => {
  if (typeof initSCORM === 'function') {
    initSCORM();
  }
});
window.addEventListener('unload', () => {
  if (typeof finishSCORM === 'function') {
    finishSCORM();
  }
});

// Global variables for scene, camera, renderer, controls, and animation
let scene, camera, renderer, controls, currentObject, mixer, animationAction, clock;

// Animation loop: updates the animation mixer (if available), controls, and renders the scene
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
}

// Initialize the scene, camera, renderer, controls, and lighting
function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 30);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888); // Adjust clear color as needed
  document.body.appendChild(renderer.domElement);

  // Clock for animation timing
  clock = new THREE.Clock();

  // Add lights to improve model visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  // Additional directional light for fill
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-5, -5, -5).normalize();
  scene.add(directionalLight2);

  // Hemisphere light for softer ambient lighting
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);

  // OrbitControls for user interaction
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;

  animate();
}

// Load a 3D model from the models folder; here we only load syringe.glb
function loadObjectModel(filename) {
  const loader = new THREE.GLTFLoader();

  loader.load(
    `./models/${filename}`, // Ensure syringe.glb is in the models folder
    (gltf) => {
      // Remove any existing model
      if (currentObject) {
        scene.remove(currentObject);
      }
      currentObject = gltf.scene;
      scene.add(currentObject);

      // Set up animation mixer if the model contains animations
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentObject);
        animationAction = mixer.clipAction(gltf.animations[0]);
        // Animation will wait to be triggered via playAnimation()
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

// Expose playAnimation() so that it can be called from an HTML button
window.playAnimation = function () {
  if (animationAction) {
    animationAction.reset();
    animationAction.play();
    // Optionally, record this interaction via SCORM
    if (typeof recordInteraction === 'function') {
      recordInteraction("animationPlayed", "completed");
    }
  } else {
    console.log('No animation available for this model.');
  }
};

// Initialize the scene and load the syringe model by default
initScene();
window.loadSyringe();
