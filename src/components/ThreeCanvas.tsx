"use client"

import { useRef, useEffect } from "react";
import * as THREE from "three";

export function ThreeCanvas() {
    const mountRef = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        function animation() {
            requestAnimationFrame(animation);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene,camera);
        }
        animation();
    }, []);

    return (
        <div ref={mountRef} />
    );
}