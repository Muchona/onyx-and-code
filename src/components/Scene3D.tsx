import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function OnyxCore() {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.15;
        meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef}>
                {/* Inner Black Glass Core (Onyx) */}
                <mesh>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshPhysicalMaterial
                        color="#000000"
                        roughness={0.1}
                        metalness={0.1}
                        transmission={0.6} // Glassy translucency
                        thickness={2} // Refraction depth
                        clearcoat={1}
                        clearcoatRoughness={0}
                        ior={1.5}
                    />
                </mesh>

                {/* Inner Solid Core Mask (to give volume to the glass) */}
                <mesh scale={0.7}>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshBasicMaterial color="black" />
                </mesh>

                {/* Outer Gold Wireframe */}
                <mesh scale={[1.05, 1.05, 1.05]}>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshStandardMaterial
                        color="#D4AF37"
                        wireframe
                        transparent
                        opacity={0.3}
                        roughness={0}
                        metalness={1}
                    />
                </mesh>
            </group>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
                <pointLight position={[-10, -5, -10]} intensity={1} color="#4bb6ff" />

                {/* Deep Space Atmosphere */}
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
                <Sparkles count={150} scale={10} size={3} speed={0.2} opacity={0.5} color="#D4AF37" />

                <Environment preset="city" />
                <OnyxCore />
            </Canvas>
        </div>
    );
}
