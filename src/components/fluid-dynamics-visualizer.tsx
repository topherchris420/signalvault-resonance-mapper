import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface FluidParticle {
  position: [number, number, number];
  velocity: [number, number, number];
  coherence: number;
  resonance: number;
}

const FluidParticles = ({ 
  particles, 
  coherenceLevel 
}: { 
  particles: FluidParticle[]; 
  coherenceLevel: number; 
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time => time + delta);
    
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position;
      const colors = meshRef.current.geometry.attributes.color;
      
      particles.forEach((particle, i) => {
        const i3 = i * 3;
        
        // Update particle positions with fluid motion
        const x = particle.position[0] + Math.sin(time * 0.5 + i * 0.1) * 0.1;
        const y = particle.position[1] + Math.cos(time * 0.3 + i * 0.15) * 0.1;
        const z = particle.position[2] + Math.sin(time * 0.7 + i * 0.2) * 0.05;
        
        positions.setXYZ(i, x, y, z);
        
        // Color based on coherence and resonance
        const hue = (particle.coherence * 0.3 + particle.resonance * 0.7) * 240 / 360; // Blue to green
        const saturation = 0.8;
        const lightness = 0.5 + (coherenceLevel * 0.3);
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        colors.setXYZ(i, color.r, color.g, color.b);
      });
      
      positions.needsUpdate = true;
      colors.needsUpdate = true;
    }
  });

  const positions = new Float32Array(particles.length * 3);
  const colors = new Float32Array(particles.length * 3);

  particles.forEach((particle, i) => {
    const i3 = i * 3;
    positions[i3] = particle.position[0];
    positions[i3 + 1] = particle.position[1];
    positions[i3 + 2] = particle.position[2];
    
    const hue = (particle.coherence * 0.3 + particle.resonance * 0.7) * 240 / 360;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  });

  return (
    <Points ref={meshRef} limit={particles.length}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particles.length}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particles.length}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial 
        size={0.02} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
      />
    </Points>
  );
};

const CoherenceField = ({ 
  coherenceLevel, 
  distortionLevel 
}: { 
  coherenceLevel: number; 
  distortionLevel: number; 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time => time + delta);
    
    if (meshRef.current) {
      // Apply distortion based on coherence breakdown
      const distortion = (1 - coherenceLevel) * distortionLevel * 0.5;
      meshRef.current.rotation.x = time * 0.1 + distortion;
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.scale.setScalar(1 + Math.sin(time) * distortion * 0.1);
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 32, 32]} position={[0, 0, 0]}>
      <meshBasicMaterial 
        color={new THREE.Color().setHSL(coherenceLevel * 240 / 360, 0.6, 0.3)}
        transparent 
        opacity={0.1 + coherenceLevel * 0.2}
        wireframe
      />
    </Sphere>
  );
};

interface FluidDynamicsVisualizerProps {
  coherenceLevel: number; // 0-1
  entropyLevel: number; // 0-1
  resonanceData: number[]; // Array of resonance values
  className?: string;
}

const FluidDynamicsVisualizer = ({ 
  coherenceLevel, 
  entropyLevel, 
  resonanceData,
  className 
}: FluidDynamicsVisualizerProps) => {
  const [particles, setParticles] = useState<FluidParticle[]>([]);

  useEffect(() => {
    // Generate particles based on data
    const particleCount = Math.min(200, resonanceData.length * 20);
    const newParticles: FluidParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const resonanceIndex = i % resonanceData.length;
      const resonance = resonanceData[resonanceIndex] || 0.5;
      
      // Position particles in 3D space
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      const radius = 1.5 + (resonance * 0.5);
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      newParticles.push({
        position: [x, y, z],
        velocity: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ],
        coherence: coherenceLevel + (Math.random() - 0.5) * 0.2,
        resonance: resonance
      });
    }

    setParticles(newParticles);
  }, [coherenceLevel, entropyLevel, resonanceData]);

  return (
    <div className={`w-full h-64 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <CoherenceField 
          coherenceLevel={coherenceLevel}
          distortionLevel={entropyLevel}
        />
        
        <FluidParticles 
          particles={particles}
          coherenceLevel={coherenceLevel}
        />
      </Canvas>
    </div>
  );
};

export default FluidDynamicsVisualizer;