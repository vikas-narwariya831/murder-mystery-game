import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useTexture } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

interface PandaDetectiveProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isWalking?: boolean;
  isSitting?: boolean;
}

export const PandaDetective: React.FC<PandaDetectiveProps> = ({
  scale = 0.011,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isWalking = false,
  isSitting = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const fbx = useFBX('/Panda_Character.fbx');
  const texture = useTexture('/Panda01_Holotna_Game_Studio_Texture.jpg');

  // Clone with SkeletonUtils to preserve all SkinnedMesh bones & materials
  const clonedModel = useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true; // Crucial for FBX UVs
      texture.needsUpdate = true;
    }

    const clone = SkeletonUtils.clone(fbx);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;

        if (mesh.material && texture) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              const m = mat as THREE.MeshPhongMaterial;
              m.map = texture;
              m.needsUpdate = true;
            });
          } else {
            const m = mesh.material as THREE.MeshPhongMaterial;
            m.map = texture;
            m.needsUpdate = true;
          }
        }
      }
    });

    return clone;
  }, [fbx, texture]);

  // Set up real skeletal animation mixer with FBX's built-in walk, idle & sit clips
  const { mixer, actions } = useMemo(() => {
    const m = new THREE.AnimationMixer(clonedModel);
    const acts: Record<string, THREE.AnimationAction> = {};

    fbx.animations.forEach((origClip) => {
      const clip = origClip.clone();

      // For sitting animations (PandaSittingIdle / PandaSitting):
      // The FBX model baked both IK targets and FK bone rotations.
      // Remove artificial IKLeg & POLELeg constraints so the natural leg mesh stays intact.
      if (clip.name === 'PandaSittingIdle' || clip.name === 'PandaSitting') {
        const ikNames = ['IKLegLeft', 'IKLegRight', 'POLELegLeft', 'POLELegRight'];
        clip.tracks = clip.tracks.filter(
          (tr) => !ikNames.some((ik) => tr.name.startsWith(ik))
        );

        clip.tracks.forEach((tr) => {
          if (tr.name === 'Thigh.R.quaternion') {
            for (let i = 0; i < tr.values.length; i += 4) {
              const q = new THREE.Quaternion(tr.values[i], tr.values[i + 1], tr.values[i + 2], tr.values[i + 3]);
              const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.72);
              q.multiply(rot);
              tr.values[i] = q.x;
              tr.values[i + 1] = q.y;
              tr.values[i + 2] = q.z;
              tr.values[i + 3] = q.w;
            }
          }
          if (tr.name === 'Thigh.L.quaternion') {
            for (let i = 0; i < tr.values.length; i += 4) {
              const q = new THREE.Quaternion(tr.values[i], tr.values[i + 1], tr.values[i + 2], tr.values[i + 3]);
              const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.72);
              q.multiply(rot);
              tr.values[i] = q.x;
              tr.values[i + 1] = q.y;
              tr.values[i + 2] = q.z;
              tr.values[i + 3] = q.w;
            }
          }
        });
      }

      acts[clip.name] = m.clipAction(clip);
    });

    return { mixer: m, actions: acts };
  }, [clonedModel, fbx.animations]);

  // Animated Cigarette Smoke Effect rising from the tip of the cigar/stick
  const smokeParticlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particleCount = 28;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      life: i / particleCount,
      speed: 0.22 + Math.random() * 0.14,
      driftX: (Math.random() - 0.5) * 0.12,
      driftZ: (Math.random() - 0.5) * 0.12,
      scale: 0.035 + Math.random() * 0.03,
      rotSpeed: (Math.random() - 0.5) * 3,
    }));
  }, [particleCount]);

  // Ensure Stick has tip anchor on mount and attach smoke mesh
  useEffect(() => {
    const stickBone = clonedModel.getObjectByName('Stick');
    if (stickBone && !stickBone.getObjectByName('CigaretteTipAnchor')) {
      const anchor = new THREE.Object3D();
      anchor.name = 'CigaretteTipAnchor';
      anchor.position.set(-0.011, 0.165, 0.148);
      stickBone.add(anchor);
    }
  }, [clonedModel]);

  // Switch between Walk, Sit, and Idle animations smoothly
  useEffect(() => {
    // Prefer authentic PandaIdle2 for a clean upright standing posture without unnatural hunching
    const currentAction = isWalking
      ? (actions['PandaWalk'] || actions['PandaRun'])
      : isSitting
      ? (actions['PandaSittingIdle'] || actions['PandaSitting'])
      : (actions['PandaIdle2'] || actions['PandaIdle1']);

    if (!currentAction) return;

    // Fade out all other actions and play current one
    Object.values(actions).forEach((act) => {
      if (act !== currentAction) {
        act.fadeOut(0.25);
      }
    });

    currentAction.reset().fadeIn(0.25).play();

    return () => {
      currentAction.fadeOut(0.2);
    };
  }, [isWalking, isSitting, actions]);

  // Advance animation frames and cigarette smoke particles
  useFrame((state, delta) => {
    mixer.update(delta);

    // Update cigarette smoke rising from Stick tip
    if (smokeParticlesRef.current && groupRef.current) {
      const stickBone = clonedModel.getObjectByName('Stick');
      if (stickBone) {
        stickBone.updateWorldMatrix(true, false);
        // Get true world position of the cigarette tip
        const tipWorld = new THREE.Vector3(-0.011, 0.165, 0.148).applyMatrix4(stickBone.matrixWorld);

        // Convert world position to local space of the smokeParticles container group
        const tipLocal = groupRef.current.worldToLocal(tipWorld.clone());

        const time = state.clock.getElapsedTime();

        particles.forEach((p, i) => {
          p.life += delta * p.speed;
          if (p.life > 1) {
            p.life = 0;
            p.driftX = (Math.random() - 0.5) * 0.12;
            p.driftZ = (Math.random() - 0.5) * 0.12;
          }

          // Natural vertical plume rising upwards in Y
          const rise = p.life * 0.65;
          const wobbleX = Math.sin(time * 3 + i * 0.8) * 0.03 * p.life;
          const wobbleZ = Math.cos(time * 2.5 + i * 0.8) * 0.03 * p.life;

          const px = tipLocal.x + (p.driftX * p.life) + wobbleX;
          const py = tipLocal.y + rise;
          const pz = tipLocal.z + (p.driftZ * p.life) + wobbleZ;

          // Expand as smoke ascends
          const scale = p.scale * (0.5 + p.life * 2.5);
          dummy.position.set(px, py, pz);
          dummy.rotation.set(time * 0.5, time * p.rotSpeed, time * 0.3);
          dummy.scale.set(scale, scale * 1.15, scale);
          dummy.updateMatrix();

          smokeParticlesRef.current!.setMatrixAt(i, dummy.matrix);
        });

        smokeParticlesRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Rotate by Math.PI so the Panda faces forward (+Z) naturally */}
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={clonedModel} />
      </group>

      {/* Realistic Volumetric Cigarette Smoke rising from tip */}
      <instancedMesh
        ref={smokeParticlesRef}
        args={[undefined, undefined, particleCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 14, 14]} />
        <meshStandardMaterial
          color="#f1f5f9"
          emissive="#e2e8f0"
          emissiveIntensity={0.25}
          transparent
          opacity={0.45}
          roughness={0.9}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
};
