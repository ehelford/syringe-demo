// Initialize scene, camera, renderer, and controls
let scene, camera, renderer, controls, currentObject;

// Function to initialize the scene
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.3); // Adjust distance as needed

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x888888); // Medium gray background
    document.body.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // OrbitControls for rotation-only interaction
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Disable panning
    controls.enableZoom = false; // Disable zooming

    animate();
}

// Function to load a specific object model into the scene
function loadObjectModel(filename) {
    const loader = new THREE.GLTFLoader();

    loader.load(
        `./models/${filename}`, // Path to the model file
        (gltf) => {
            // Remove previous object if it exists
            if (currentObject) {
                scene.remove(currentObject);
            }

            // Add the new object to the scene
            currentObject = gltf.scene;
            scene.add(currentObject);
        },
        (xhr) => {
            console.log(`${filename} loaded: ${(xhr.loaded / xhr.total) * 100}%`);
        },
        (error) => {
            console.error(`An error occurred while loading ${filename}:`, error);
        }
    );
}

// Functions to load each individual object model, now globally accessible
window.loadAspirator = function () {
    loadObjectModel('aspirator.glb');
};

window.loadCurette = function () {
    loadObjectModel('curette.glb');
};

window.loadDilator = function () {
    loadObjectModel('dilator.glb');
};

window.loadSpeculum = function () {
    loadObjectModel('speculum.glb');
};

window.loadTenaculum = function () {
    loadObjectModel('tenaculum.glb');
};

// Function to render the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialize the scene and load the default object
initScene();
window.loadAspirator(); // Set a default object, or leave this out to start with an empty scene
