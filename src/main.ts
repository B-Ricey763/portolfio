import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { div } from 'three/examples/jsm/nodes/Nodes.js';

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

	const curve = new THREE.EllipseCurve(
		0,  0,            // ax, aY
		1, 0.5,           // xRadius, yRadius
		0,  Math.PI ,  // aStartAngle, aEndAngle
	);

	const points = curve.getPoints( 50 );
	const geo2 = new THREE.BufferGeometry().setFromPoints( points );

	const mat2 = new THREE.LineBasicMaterial( { color: 0xff0000 } );

	// Create the final object to add to the scene
	const ellipse = new THREE.Line( geo2, mat2 );

	const divisions = 50
	const geometry = new THREE.PlaneGeometry(4, 4, divisions, divisions)
	const positions = geometry.getAttribute('position');
	const planePoints = curve.getPoints( divisions + 1 );

	for (let i = 0; i < positions.count; i++) {
		const point = planePoints[i % (divisions + 1)]
		positions.setXYZ(i, point.x, positions.getY(i), point.y)
	}
	const material = new THREE.MeshBasicMaterial({ wireframe: true })
	const plane = new THREE.Mesh(geometry, material)
	plane.position.z = -15
	scene.add(plane)

	scene.add(ellipse);
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

