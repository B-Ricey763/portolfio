import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let container: HTMLDivElement;

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let controls: OrbitControls;

let windowHalfX = window.innerWidth / 2;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0xffffff ) );

	const geometry = new THREE.PlaneGeometry(4, 4, 4, 4)
	const positions = geometry.getAttribute('position');
	let v = new THREE.Vector3(0, 0, 0);
	console.log(positions.getZ(0))
	positions.setZ(0, 1);
	const material = new THREE.MeshBasicMaterial()
	const plane = new THREE.Mesh(geometry, material)
	plane.position.z = -15
	scene.add(plane)


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	container.style.touchAction = 'none';

	controls = new OrbitControls( camera, renderer.domElement )
	controls.target.set(0, 0, plane.position.z)
	camera.position.set( 0, 0, 20 );
	controls.update();
	//

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	
	renderer.render( scene, camera );
	
	controls.update();
}

