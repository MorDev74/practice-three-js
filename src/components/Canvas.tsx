'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface CanvasProps {
    scene: string
}

export default function Canvas({ scene }: CanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const meshRef = useRef<THREE.Mesh | null>(null)
    const frameIdRef = useRef<number>(0)

    // Initialize Three.js scene
    useEffect(() => {
        if (!canvasRef.current) return

        // Setup renderer
        rendererRef.current = new THREE.WebGLRenderer({ antialias: true })
        rendererRef.current.setSize(window.innerWidth - 256, window.innerHeight)
        canvasRef.current.innerHTML = ''
        canvasRef.current.appendChild(rendererRef.current.domElement)

        // Setup scene
        sceneRef.current = new THREE.Scene()

        // Setup camera
        cameraRef.current = new THREE.PerspectiveCamera(
            75,
            (window.innerWidth - 256) / window.innerHeight,
            0.1,
            1000
        )
        cameraRef.current.position.z = 5

        // Setup lighting
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(1, 1, 1)
        sceneRef.current.add(light)
        sceneRef.current.add(new THREE.AmbientLight(0x404040))

        // Handle window resize
        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current) return
            cameraRef.current.aspect = (window.innerWidth - 256) / window.innerHeight
            cameraRef.current.updateProjectionMatrix()
            rendererRef.current.setSize(window.innerWidth - 256, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize)
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current)
            }
            if (meshRef.current && sceneRef.current) {
                sceneRef.current.remove(meshRef.current)
                meshRef.current.geometry.dispose()
                if (Array.isArray(meshRef.current.material)) {
                    meshRef.current.material.forEach(material => material.dispose())
                } else {
                    meshRef.current.material.dispose()
                }
            }
            if (rendererRef.current) {
                rendererRef.current.dispose()
            }
        }
    }, []) // Only run once on mount

    // Handle scene changes
    useEffect(() => {
        if (!sceneRef.current) return

        // Remove and dispose old mesh
        if (meshRef.current) {
            sceneRef.current.remove(meshRef.current)
            meshRef.current.geometry.dispose()
            if (Array.isArray(meshRef.current.material)) {
                meshRef.current.material.forEach(material => material.dispose())
            } else {
                meshRef.current.material.dispose()
            }
            meshRef.current = null
        }

        // Create new geometry based on active scene
        let geometry: THREE.BufferGeometry
        let material: THREE.Material

        switch (scene) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32)
                material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
                break
            case 'torus':
                geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
                material = new THREE.MeshPhongMaterial({ color: 0xff00ff })
                break
            default: // cube
                geometry = new THREE.BoxGeometry(2, 2, 2)
                material = new THREE.MeshPhongMaterial({ color: 0x0000ff })
        }

        meshRef.current = new THREE.Mesh(geometry, material)
        sceneRef.current.add(meshRef.current)

        // Animation function
        const animate = () => {
            if (!meshRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return

            frameIdRef.current = requestAnimationFrame(animate)
            meshRef.current.rotation.x += 0.01
            meshRef.current.rotation.y += 0.01
            rendererRef.current.render(sceneRef.current, cameraRef.current)
        }

        animate()

        // Cleanup function for scene change
        return () => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current)
            }
        }
    }, [scene]) // Re-run when scene changes

    return (
        <div ref={canvasRef} className="flex-1 bg-black" />
    )
}
