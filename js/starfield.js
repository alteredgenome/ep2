import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

let scene, camera, renderer, stars;
const STAR_COUNT = 5000; // Number of stars
const STAR_SPEED = 0.5; // How fast stars move towards the camera

function initStarfield() {
    const trackMapContainer = document.querySelector('.track-map');

    // Create a new canvas for the starfield
    const starfieldCanvas = document.createElement('canvas');
    starfieldCanvas.id = 'starfield-canvas';
    trackMapContainer.appendChild(starfieldCanvas);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75, // Field of view
        trackMapContainer.clientWidth / trackMapContainer.clientHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.z = 5; // Initial camera position

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: starfieldCanvas,
        alpha: true // Allow transparency to show the black background of track-map
    });
    renderer.setSize(trackMapContainer.clientWidth, trackMapContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < STAR_COUNT; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000); // Spread stars over a large area
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000); // Initial z position
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF, // White stars
        size: 2, // Size of each star
        sizeAttenuation: true // Stars appear smaller further away
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const trackMapContainer = document.querySelector('.track-map');
    camera.aspect = trackMapContainer.clientWidth / trackMapContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(trackMapContainer.clientWidth, trackMapContainer.clientHeight);
}

function animateStarfield() {
    requestAnimationFrame(animateStarfield);

    // Zooming effect: move stars towards the camera
    stars.geometry.attributes.position.array.forEach((pos, i) => {
        if (i % 3 === 2) { // Only modify the Z coordinate
            stars.geometry.attributes.position.array[i] -= STAR_SPEED; // Move star closer
            // If star goes past camera, reset it to the far end
            if (stars.geometry.attributes.position.array[i] < camera.position.z - 1000) {
                stars.geometry.attributes.position.array[i] = camera.position.z + 1000;
            }
        }
    });
    stars.geometry.attributes.position.needsUpdate = true; // Important: tell Three.js to update geometry

    renderer.render(scene, camera);
}

// Ensure Three.js is loaded and the DOM is ready before initializing
window.onload = function() {
    initStarfield();
    animateStarfield();
};
