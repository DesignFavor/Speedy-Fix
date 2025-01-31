import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Box3 } from 'three';
import SpeedyCharacter from './assets/Speedy';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

function Scene({ playPackingAndBox, triggerReset, playByeAnimation, onDroppedObjectsChange , playHappyAnimation  }) {
  const { gl, scene, camera } = useThree();
  const dragControlsRef = useRef();
  const targetBox = useRef();
  const originalPositions = useRef({});
  const [triggerSendAnimation, setTriggerSendAnimation] = useState(false);

  useEffect(() => {
    const draggableObjects = [
      scene.getObjectByName('Marketing'),
      scene.getObjectByName('data'),
      scene.getObjectByName('Service'),
      scene.getObjectByName('Sale'),
      scene.getObjectByName('app'),
      scene.getObjectByName('notdealing2'),
      scene.getObjectByName('notdealing'),
    ].filter(Boolean);

    targetBox.current = scene.getObjectByName('PaperBox_PaperBox_0');

    draggableObjects.forEach((obj) => {
      if (!originalPositions.current[obj.name]) {
        originalPositions.current[obj.name] = obj.position.clone();
      }
    });

    if (draggableObjects.length > 0 && targetBox.current) {
      const dragControls = new DragControls(draggableObjects, camera, gl.domElement);

      dragControls.addEventListener('dragstart', (event) => {
        event.object.material.transparent = true;
        event.object.material.opacity = 0.5;
      });

      dragControls.addEventListener('dragend', (event) => {
        event.object.material.transparent = false;
        event.object.material.opacity = 1;

        if (isObjectNearBox(event.object, targetBox.current)) {
          event.object.position.copy(targetBox.current.position);
          event.object.visible = false;

          onDroppedObjectsChange((prev) => {
            const newDroppedObjects = [...prev, event.object.name];
            console.log('Dropped Objects:', newDroppedObjects);
            return newDroppedObjects;
          });

          setTriggerSendAnimation(true);
        }
      });

      dragControlsRef.current = dragControls;

      return () => {
        dragControls.dispose();
      };
    }
  }, [scene, camera, gl, onDroppedObjectsChange]);

  const isObjectNearBox = (object, box) => {
    const objectBox = new Box3().setFromObject(object);
    const targetBox = new Box3().setFromObject(box);
    return targetBox.intersectsBox(objectBox);
  };

  const resetObjects = () => {
    Object.keys(originalPositions.current).forEach((name) => {
      const obj = scene.getObjectByName(name);
      if (obj) {
        obj.position.copy(originalPositions.current[name]);
        obj.visible = true;
      }
    });

    onDroppedObjectsChange([]);
    setTriggerSendAnimation(false);
  };

  useEffect(() => {
    if (triggerReset) {
      resetObjects();
    }
  }, [triggerReset]);

  return (
    <>
      <ambientLight intensity={1} />
      <spotLight
        intensity={200}
        angle={1}
        penumbra={1}
        decay={1.4}
        color="#fff"
        position={[-8.2, 6.4, 1.8]}
        rotation={[-Math.PI / 0, 0, 0]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <SpeedyCharacter
        playPackingAndBox={playPackingAndBox}
        triggerSendAnimation={triggerSendAnimation}
        triggerReset={triggerReset}
        playByeAnimation={playByeAnimation}
        playHappyAnimation={playHappyAnimation}
        onSendAnimationComplete={() => setTriggerSendAnimation(false)}
      />
    </>
  );
}

export default Scene;
