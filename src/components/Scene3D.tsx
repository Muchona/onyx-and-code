import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function OnyxCore() {
    const meshRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // Increased rotation speed for better visibility
        meshRef.current.rotation.y = t * 0.4;
        meshRef.current.rotation.x = Math.sin(t * 0.8) * 0.1;
        meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.05;

        // Subtle color pulse for energy effect
        if (materialRef.current) {
            const pulse = 0.8 + Math.sin(t * 2) * 0.2;
            materialRef.current.emissiveIntensity = pulse * 0.5;
        }
    });

    return (
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
            <group ref={meshRef}>
                {/* Inner Black Glass Core (Onyx) */}
                <mesh>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshStandardMaterial
                        ref={materialRef}
                        color="#050505"
                        roughness={0.05}
                        metalness={1}
                        transparent
                        opacity={0.98}
                    />
                </mesh>

                {/* Inner Solid Core Mask */}
                <mesh scale={0.7}>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshBasicMaterial color="black" />
                </mesh>

                {/* Outer Gold Wireframe - Increased visibility */}
                <mesh scale={[1.08, 1.08, 1.08]}>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshStandardMaterial
                        color="#D4AF37"
                        wireframe
                        transparent
                        opacity={0.6}
                        roughness={0}
                        metalness={1}
                        emissive="#D4AF37"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </group>
        </Float>
    );
}

export default function Scene3D() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas gl={{ antialias: !isMobile, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#D4AF37" />
                <pointLight position={[-10, -5, -10]} intensity={1.5} color="#4bb6ff" />

                {/* Optimized Atmosphere for Mobile */}
                <Stars
                    radius={100}
                    depth={50}
                    count={isMobile ? 1000 : 3000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.5}
                />
                <Sparkles
                    count={isMobile ? 40 : 150}
                    scale={10}
                    size={isMobile ? 2 : 3}
                    speed={0.2}
                    opacity={0.5}
                    color="#D4AF37"
                />

                <Environment preset="city" />
                <OnyxCore />
            </Canvas>
        </div>
    );
}
