import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mix } from 'three/examples/jsm/nodes/Nodes.js';


let container: HTMLDivElement;
let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let mixer: THREE.AnimationMixer
let clips: THREE.AnimationClip[]

init();
animate();

function init() {

	// Configuring 3js
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
	scene = new THREE.Scene();
	// Making a light
	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.AmbientLight(color, intensity);
	scene.add(light);

	// Loading model
	const loader = new GLTFLoader();

	loader.load( "../public/Book.glb", function ( gltf ) {
		mixer = new THREE.AnimationMixer( gltf.scene )
		clips = gltf.animations
		clips.forEach( function ( clip ) {
			mixer.clipAction( clip ).play();
		} );		
		scene.add( gltf.scene );
	}, undefined, function ( error ) {

		console.error( error );

	} );


	// Setting up plane
	const planeSize = 40;
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load('../public/checker.png');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.NearestFilter;
	texture.colorSpace = THREE.SRGBColorSpace;
	const repeats = planeSize / 2;
	texture.repeat.set(repeats, repeats);
	const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
	  map: texture,
	  side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(planeGeo, planeMat);
	mesh.rotation.x = Math.PI * -.5;
	scene.add(mesh);
	
	// Setting up renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	container.style.touchAction = 'none';

	controls = new OrbitControls( camera, renderer.domElement )
	controls.target.set(0, 0, 0)
	camera.position.set( 0, 0, 20 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function animate() {
	requestAnimationFrame( animate );

	render();
}

const clock = new THREE.Clock()
function render() {
	if (mixer !== undefined) {
		mixer.update( clock.getDelta() )
	}
	renderer.render( scene, camera );
	
	controls.update();
}

