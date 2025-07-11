// js/logo_animation.js

import * as THREE from './three.module.js';

let scene, camera, renderer, logoMesh; // Declare logoMesh globally or accessible

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();

    // 2. Camera Setup
    const trackMapDiv = document.querySelector('.track-map');
    const width = trackMapDiv.clientWidth;
    const height = trackMapDiv.clientHeight;

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5; // Adjust camera distance as needed

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Set clear color to black with 0 opacity (transparent)

    trackMapDiv.appendChild(renderer.domElement);

    // 4. Load Texture (Your Logo)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        'ep2-logo.png', // Path to your logo image
        function(texture) {
            // Adjust texture filtering for better quality (optional)
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            // Create Geometry (a plane for the 2D logo, or a thin box for 3D)
            // Aspect ratio of your logo: 724 / 419 = ~1.727
            // Adjust plane dimensions to match your logo's aspect ratio
            const logoAspectRatio = 724 / 419;
            const planeHeight = 2.5; // Arbitrary height, adjust for visual size
            const planeWidth = planeHeight * logoAspectRatio;

            const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight); // Plane to display 2D image
            // Or for a very thin 3D logo:
            // const geometry = new THREE.BoxGeometry(planeWidth, planeHeight, 0.1);

            // Create Material
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true, // Important if your logo has transparency
                side: THREE.DoubleSide // To see the logo from both front and back
            });

            // 5. Create Mesh
            logoMesh = new THREE.Mesh(geometry, material);
            scene.add(logoMesh);

            // Start the animation loop once the texture is loaded
            animate();
        },
        // Optional: Progress callback
        undefined,
        // Optional: Error callback
        function(err) {
            console.error('An error occurred loading the texture:', err);
        }
    );

    // Add lighting if you decide to use MeshLambertMaterial or MeshPhongMaterial
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add(ambientLight);
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    // directionalLight.position.set(0, 1, 1);
    // scene.add(directionalLight);


    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    const trackMapDiv = document.querySelector('.track-map');
    const width = trackMapDiv.clientWidth;
    const height = trackMapDiv.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}


// 6. Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (logoMesh) { // Ensure the mesh is loaded before attempting to rotate
        logoMesh.rotation.y += 0.01; // Spin around the Y-axis
        // logoMesh.rotation.x += 0.005; // Optional: Spin around X-axis as well
    }

    renderer.render(scene, camera);
}

// Initialize the scene when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
