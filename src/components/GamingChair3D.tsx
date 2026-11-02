import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

interface GamingChairProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  accentColor?: string;
}

export const GamingChair3D: React.FC<GamingChairProps> = ({
  scale = 0.022,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  accentColor = '#dc2626', // Sporty racing red trim
}) => {
  const obj = useLoader(OBJLoader, '/Cadeira.obj');

  const chairMesh = useMemo(() => {
    const clone = obj.clone(true);

    // High-contrast luxury sports gaming chair materials
    const mainLeather = new THREE.MeshStandardMaterial({
      color: '#18181b',
      roughness: 0.35,
      metalness: 0.1,
    });

    const secondaryLeather = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.4,
      metalness: 0.05,
    });

    const racingTrim = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.3,
      metalness: 0.2,
    });

    const chromeBase = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      metalness: 0.9,
      roughness: 0.15,
    });

    const plasticParts = new THREE.MeshStandardMaterial({
      color: '#09090b',
      roughness: 0.7,
      metalness: 0.1,
    });

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat) => {
            const name = mat.name;
            if (name.includes('phong2SG')) return chromeBase;
            if (name.includes('blinn1SG')) return mainLeather;
            if (name.includes('initialShadingGroup')) return secondaryLeather;
            if (name.includes('lambert7SG') || name.includes('lambert6SG')) return racingTrim;
            return plasticParts;
          });
        } else {
          mesh.material = mainLeather;
        }
      }
    });

    return clone;
  }, [obj, accentColor]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Shift up by 42.227 and center X so wheels sit flat on floor */}
      <group position={[-4.8, 42.2, 6.7]}>
        <primitive object={chairMesh} />
      </group>
    </group>
  );
};
