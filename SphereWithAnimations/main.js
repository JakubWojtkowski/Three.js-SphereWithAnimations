import * as THREE from "./node_modules/three/build/three.module.js";
import gsap from "./node_modules/gsap/all.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";


// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


// canvas
const canvas = document.querySelector('#bg');


// scene, camera and render
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.setZ(30);
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( window.devicePixelRatio );


renderer.render( scene, camera);


// geometry, material and mesh
const geometry = new THREE.SphereGeometry(3, 32, 32);

const material = new THREE.MeshStandardMaterial({ 
    color: 0x67FF63,
    // metalness: 0.1,
    roughness: 0.5
});

const sphere = new THREE.Mesh( geometry, material );

scene.add( sphere );


// lights
const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set( 0, 10, 10 );
light.intensity = 1.5;
scene.add(light);


// controls
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;


// resize update function
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});


// animate() update function
const animate = () => {
    window.requestAnimationFrame( animate );

    controls.update();
    renderer.render( scene, camera );
}

animate();

// ----- GSAP ------- 
// Timeline magic
const timeline = gsap.timeline({ defaults: { duration: 1 } }); // it allows us to essentially synchronize multiple animations together

timeline.fromTo( 
    sphere.scale,
    { z: 0, x: 0, y: 0 },
    { z: 1, x: 1, y: 1 }
);

const nav = document.querySelector("nav");
timeline.fromTo( nav, { y: "-100%" }, { y: "0%" });

const title = document.querySelector("h1.title");
timeline.fromTo( title, { opacity: 0 }, { opacity: 1 });


// changing color, mouse animation
let mouseDown = false; // flag
let rgb = [];
window.addEventListener("mousedown", () => mouseDown = true );
window.addEventListener("mouseup", () => mouseDown = false );

window.addEventListener("mousemove", (e) => {
    if( mouseDown ) {
        rgb = [
            Math.round( (e.pageX / sizes.width) * 255 ),
            Math.round( (e.pageY / sizes.height) * 255 ),
            150
        ];
        // animating...
        let newColor = new THREE.Color( `rgb(${ rgb.join(",") })` );
        gsap.to( sphere.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b
        });
    } 

});