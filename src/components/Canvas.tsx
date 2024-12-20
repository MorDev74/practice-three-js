'use client';

import { FC, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ModelType, ModelObject } from '@/types/model';

interface CanvasProps {
  activeModels: ModelType[];
}

const Canvas: FC<CanvasProps> = ({ activeModels }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelsRef = useRef<ModelObject>({});

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth - 256) / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 256, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Handle model updates
  useEffect(() => {
    const scene = sceneRef.current;
    const existingModels = modelsRef.current;

    if (!scene) return;

    // Remove models that are no longer active
    Object.keys(existingModels).forEach(modelType => {
      if (!activeModels.includes(modelType as ModelType)) {
        scene.remove(existingModels[modelType]);
        delete existingModels[modelType];
      }
    });

    // Add new models
    activeModels.forEach(modelType => {
      if (!existingModels[modelType]) {
        let geometry: THREE.BufferGeometry;
        
        switch (modelType) {
          case 'cube':
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
          case 'sphere':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
          case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            break;
          default:
            return;
        }

        const material = new THREE.MeshPhongMaterial({
          color: Math.random() * 0xffffff,
          flatShading: true,
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        scene.add(mesh);
        existingModels[modelType] = mesh;
      }
    });
  }, [activeModels]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = (window.innerWidth - 256) / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth - 256, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={mountRef} className="flex-1" />;
};

export default Canvas;