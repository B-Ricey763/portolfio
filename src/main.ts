import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PLANE_SEGMENTS = 16

let container: HTMLDivElement;
let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let positions: THREE.BufferAttribute;
let curve: THREE.EllipseCurve;
let x = 0;
let plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;


init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0xffffff ) );

	curve = new THREE.EllipseCurve(
		0,  0,            // ax, aY
		1, 0.5,           // xRadius, yRadius
		0,  Math.PI ,  // aStartAngle, aEndAngle
	);
	

	const geometry = new THREE.PlaneGeometry(4, 4, PLANE_SEGMENTS, PLANE_SEGMENTS)
	positions = geometry.getAttribute('position') as THREE.BufferAttribute;
	applyCurveToPlane(positions, curve)

	const material = new THREE.MeshBasicMaterial({ wireframe: true })
	plane = new THREE.Mesh(geometry, material)
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

function applyCurveToPlane(positions: THREE.BufferAttribute, curve: THREE.EllipseCurve) {
	const planePoints = curve.getPoints( PLANE_SEGMENTS + 1 );
	for (let i = 0; i < positions.count; i++) {
		const point = planePoints[i % (PLANE_SEGMENTS + 1)]
		positions.setXYZ(i, point.x, positions.getY(i), point.y)
	}
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

function render() {
	curve.yRadius = x % 5
	x += 0.01
	applyCurveToPlane(positions, curve)
	plane.geometry.attributes.position.needsUpdate = true
	
	renderer.render( scene, camera );
	
	controls.update();
}

