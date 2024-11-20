"use client"

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Material
 *  - unlit: MeshBasicMaterial
 *  - phong: MeshPhongMaterial
 *  - lambert: MeshLambertMaterial
 * Ref
 *  - mouse drag drop move camera & top down & city mesh : https://threejs.org/examples/misc_controls_map.html
 *  - 3d card : https://threejs.org/examples/css3d_periodictable.html
 *  - audio : https://threejs.org/examples/webaudio_timing.html
 *  - postprocess bloom/selective : https://threejs.org/examples/webgpu_postprocessing_bloom_selective.html
 *  - earth : https://threejs.org/examples/webgpu_tsl_earth.html
 */

export function ThreeCanvas() {
    const mountRef = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        let renderer:THREE.WebGLRenderer;
        let scene:THREE.Scene;
        let camera:THREE.PerspectiveCamera | THREE.OrthographicCamera;
        let cameraControls:OrbitControls;

        let ambientLight:THREE.AmbientLight;
        let light:THREE.DirectionalLight;

        let cube:THREE.Mesh;

        init();
        render();

        function init() {
            renderer = new THREE.WebGLRenderer();
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (mountRef.current) {
                mountRef.current.appendChild(renderer.domElement);
            }
            cameraControls = new OrbitControls(camera, renderer.domElement);
            cameraControls.addEventListener("change", render);

            window.addEventListener("resize", onWindowResize, false);

            ////////////////////////////////////////////////////////////
            ambientLight = new THREE.AmbientLight( 0x7c7c7c, 3.0 );
            scene.add( ambientLight );

            light = new THREE.DirectionalLight( 0xFFFFFF, 3.0 );
            light.position.set( 0.32, 0.39, 0.7 );
            scene.add( light );

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0x00ff00
            });
            cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            camera.position.z = 5;
        }

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene,camera);
        }

        function onWindowResize() {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            renderer.setSize(canvasWidth, canvasHeight);
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = canvasWidth / canvasHeight;
            }
            camera.updateProjectionMatrix();

            render();
        }

    }, []);

    return ( <div ref={mountRef} />);
}