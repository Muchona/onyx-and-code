import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, ContactShadows, RoundedBox, Torus } from '@react-three/drei';
import * as THREE from 'three';

function Cup() {
  return (
    <group>
      {/* Cup Body - Paper Texture */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 2, 32]} />
        <meshStandardMaterial color="#F5F5F1" roughness={0.8} />
      </mesh>
      
      {/* Cup Rim (White) */}
      <mesh position={[0, 1.05, 0]}>
         <torusGeometry args={[0.8, 0.05, 16, 32]} />
         <meshStandardMaterial color="#F5F5F1" roughness={0.8} />
      </mesh>

      {/* Sleeve - Cardboard Texture */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.81, 0.65, 1, 32]} />
        <meshStandardMaterial color="#966F50" roughness={0.9} />
      </mesh>
      
      {/* Coffee Liquid Surface */}
      <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshPhysicalMaterial 
          color="#4B3621" 
          roughness={0.2} 
          metalness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
        />
      </mesh>
    </group>
  );
}

function Lid() {
    const lidRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (lidRef.current) {
             // Independent subtle float for the lid
            lidRef.current.position.y = 1.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
            lidRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.05;
            lidRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.8) * 0.05;
        }
    });

    return (
        <group ref={lidRef} position={[0.2, 1.8, 0.2]} rotation={[0.2, 0, 0.1]}>
             {/* Lid Top */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.82, 0.85, 0.1, 32]} />
                <meshStandardMaterial color="#1A1A1A" roughness={0.5} />
            </mesh>
             {/* Lid Rim */}
             <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.85, 0.05, 16, 32]} />
                <meshStandardMaterial color="#1A1A1A" roughness={0.5} />
            </mesh>
             {/* Sip Hole */}
             <mesh position={[0.6, 0.16, 0]} rotation={[0,0,0]}>
                 <boxGeometry args={[0.15, 0.05, 0.1]} />
                 <meshStandardMaterial color="#000000" />
             </mesh>
        </group>
    )

}

function Splash() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if(groupRef.current) {
            // Pulse effect
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
            groupRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group ref={groupRef} position={[0, 0.9, 0]}>
            {/* Main Column */}
             <mesh position={[0, 0.3, 0]} rotation={[0.1,0,0.2]}>
                <cylinderGeometry args={[0.2, 0.4, 0.8, 16]} />
                <meshPhysicalMaterial 
                    color="#4B3621" 
                    roughness={0.1}
                    metalness={0} 
                    transmission={0}
                    clearcoat={1}
                />
             </mesh>
             
             {/* Random Droplets */}
             {[...Array(6)].map((_, i) => (
                 <mesh key={i} position={[
                     (Math.random() - 0.5) * 0.8, 
                     0.5 + Math.random() * 0.8, 
                     (Math.random() - 0.5) * 0.8
                 ]} scale={0.1 + Math.random() * 0.1}>
                     <sphereGeometry args={[1, 16, 16]} />
                     <meshPhysicalMaterial color="#4B3621" roughness={0.1} clearcoat={1} />
                 </mesh>
             ))}
        </group>
    );
}

export default function CoffeeSplash() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#9EBBCB' }}>
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 45 }}>
        <Environment preset="studio" />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        {/* Floating Composition */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[0, 0.5]}>
           <group rotation={[0.1, 0, 0]}>
              <Cup />
              <Lid />
              <Splash />
           </group>
        </Float>

        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls makeDefault />
      </Canvas>
      
      {/* Overlay Text/UI if needed, purely optional based on video style */}
      <div style={{ position: 'absolute', bottom: 30, left: 30, color: 'white', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Moffett Blend</h2>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Zero Gravity Roast</p>
      </div>
    </div>
  );
}
