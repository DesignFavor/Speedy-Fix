import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import LipsyncControl from './LipsyncControl';

function SpeedyCharacter({
  playPackingAndBox,
  triggerReset, 
  playByeAnimation,
  playHappyAnimation,
}) {
  const { scene, animations, nodes, materials, action } = useGLTF('/scene/speedyupdate-cube2.glb');
  const mixer = useRef(new THREE.AnimationMixer(scene));
  const previousAction = useRef(null);
  const clock = useRef(new THREE.Clock());
  const fadeOutDuration = 0.3;

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.geometry.morphAttributes?.position) {
        child.morphTargetInfluences.forEach((influence, index) => {
          child.morphTargetInfluences[index] = Math.sin(index);
        });
      }
    });
  }, [scene]);

  useEffect(() => {
    const facialGroup = new THREE.Group();
    facialGroup.name = "facial";

    const skinnedMeshes = [
      { name: "Icosphere002_Icosphere002mesh006", material: materials.skin },

    ];

    skinnedMeshes.forEach(({ name, material }) => {
      const mesh = new THREE.SkinnedMesh(
        nodes[name]?.geometry,
        material
      );
      if (nodes[name]) {
        mesh.name = name;
        mesh.skeleton = nodes[name].skeleton;
        mesh.morphTargetDictionary = nodes[name].morphTargetDictionary;
        mesh.morphTargetInfluences = nodes[name].morphTargetInfluences;

        facialGroup.add(mesh);
      }
    });

    scene.add(facialGroup);
  }, [scene, nodes, materials]);
  

  useEffect(() => {

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const happyAction = mixer.current.clipAction(
      animations.find((clip) => clip.name === 'Action')
    );
    happyAction.play();
    previousAction.current = happyAction;

    return () => {
      happyAction.stop();
    };
  }, [animations, scene]);

  useEffect(() => {
    if (playPackingAndBox) {
      if (previousAction.current) {
        previousAction.current.fadeOut(fadeOutDuration);
      }

      const newActions = animations.filter(
        (clip) => clip.name === 'box' || clip.name === 'packing'
      );

      newActions.forEach((clip) => {
        const action = mixer.current.clipAction(clip);
        action.reset().setLoop(THREE.LoopOnce).clampWhenFinished = true;
        action.fadeIn(fadeOutDuration).play();
        previousAction.current = action;
      });
    }
  }, [playPackingAndBox, animations]);

useEffect(() => {
  if (triggerReset) {

    const boxAction = mixer.current.clipAction(
      animations.find((clip) => clip.name === 'box')
    );

    if (boxAction) {
      boxAction.stop(); 
      boxAction.reset(); 
    }
  }
}, [triggerReset, animations]);


    useEffect(() => {
      if (playByeAnimation) {
        if (previousAction.current) {
          previousAction.current.fadeOut(fadeOutDuration);
        }
    
        const byeClip = animations.find((clip) => clip.name === 'Bye');
        if (byeClip) {
          const byeAction = mixer.current.clipAction(byeClip);
          byeAction.reset().setLoop(THREE.LoopOnce).clampWhenFinished = true;
          byeAction.fadeIn(fadeOutDuration).play();
          previousAction.current = byeAction;
    
        } else {
        }
      }
    }, [playByeAnimation, animations, action]);

    useEffect(() => {
      if (playHappyAnimation) {
        if (previousAction.current) {
          previousAction.current.fadeOut(fadeOutDuration);
        }
    
        const HappyClip = animations.find((clip) => clip.name === 'Ahhyes');
        if (HappyClip) {
          const HappyAction = mixer.current.clipAction(HappyClip);
          HappyAction.reset().setLoop(THREE.LoopOnce).clampWhenFinished = true;
          HappyAction.fadeIn(fadeOutDuration).play();
          previousAction.current = HappyAction;
    
        } else {
        }
      }
    }, [playHappyAnimation, animations, action]);

    useEffect(() => {
      const animate = () => {
        const delta = clock.current.getDelta();
        mixer.current.update(delta);
    
        if (previousAction.current) {
          const isRunning = previousAction.current.isRunning();
    
          if (!isRunning) {

            const happyAction = mixer.current.clipAction(
              animations.find((clip) => clip.name === 'Action')
            );
            if (happyAction.isRunning()) {
              happyAction.stop();
            }
    
            const typingAction = mixer.current.clipAction(
              animations.find((clip) => clip.name === 'TypingAnimation')
            );
            const eyeBlinkAction = mixer.current.clipAction(
              animations.find((clip) => clip.name === 'EyeBlink')
            );
    
            typingAction.reset().fadeIn(fadeOutDuration).play();
            eyeBlinkAction.reset().fadeIn(fadeOutDuration).play();
            previousAction.current = typingAction;
            
          }
        }
    
        requestAnimationFrame(animate);
      };
    
      animate();
    

    return () => cancelAnimationFrame(animate);
  }, []);

  return (
    <>
      <primitive object={scene} />
      <LipsyncControl nodes={nodes} />
    </>
  );
}

export default SpeedyCharacter;
 