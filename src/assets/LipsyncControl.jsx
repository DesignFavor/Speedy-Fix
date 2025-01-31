import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

const LipsyncControl = forwardRef(({ nodes }, ref) => {
  const { camera, scene } = useThree();
  
  const [script, setScript] = useState("");
  const [playAudio, setPlayAudio] = useState(true);
  const [audio, setAudio] = useState(null);
  const [lipsync, setLipsync] = useState(null);

  useEffect(() => {
    if (!script) return;

    const loader = new THREE.FileLoader();
    loader.load(`/comments/${script}.json`, (data) => {
      try {
        setLipsync(JSON.parse(data));
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });
  }, [script]);

  useEffect(() => {
    if (!script) return;

    const newAudio = new Audio(`/comments/${script}.ogg`);
    setAudio(newAudio);

    if (playAudio) {
      newAudio.play().catch((error) => console.warn("Playback error:", error));
    }

    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.currentTime = 0;
      }
    };
  }, [playAudio, script]);

  const corresponding = {
    A: "AA",
    B: "MB",
    C: "AO",
    E: "EE",
    F: "FV",
    G: "EH",
    H: "L",
    X: "MB",
  };

  useFrame(() => {
    if (!audio || !lipsync) return;

    const currentAudioTime = audio.currentTime;

    Object.values(corresponding).forEach((value) => {
      Object.keys(nodes).forEach((name) => {
        if (nodes[name]?.morphTargetDictionary && nodes[name]?.morphTargetInfluences) {
          const index = nodes[name].morphTargetDictionary[value];
          if (index !== undefined) {
            nodes[name].morphTargetInfluences[index] = 0;
          }
        }
      });
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];
      if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
        Object.keys(nodes).forEach((name) => {
          if (nodes[name]?.morphTargetDictionary && nodes[name]?.morphTargetInfluences) {
            const correspondingMouth = corresponding[mouthCue.value];
            const index = nodes[name].morphTargetDictionary[correspondingMouth];
            if (index !== undefined) {
              nodes[name].morphTargetInfluences[index] = 1;
            }
          }
        });
        break;
      }
    }
  });

  const handleObjectClick = (objectName) => {
    const audioMap = {
      Marketing: "Marketing",
      Sale: "Sales",
      Service: "Service",
      app: "Custom-App",
      data: "Data-Integration",
      notdealing: "Management-Overhead",
      notdealing2: "Management-Overhead",
    };

    const newScript = audioMap[objectName];
    if (newScript) {
      setScript(newScript);
    }
  };

  useEffect(() => {
    const handlePointerEvent = (event) => {
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      if (event.touches) {
        pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      } else {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        handleObjectClick(clickedObject.name);
      }
    };

    window.addEventListener("click", handlePointerEvent);
    window.addEventListener("touchstart", handlePointerEvent);

    return () => {
      window.removeEventListener("click", handlePointerEvent);
      window.removeEventListener("touchstart", handlePointerEvent);
    };
  }, [camera, scene]);

  useEffect(() => {
    const quitButton = document.getElementById("quit-button");
    const handleQuitClick = () => {
      setScript("Bye-Bye");
    };

    if (quitButton) {
      quitButton.addEventListener("click", handleQuitClick);
    }

    return () => {
      if (quitButton) {
        quitButton.removeEventListener("click", handleQuitClick);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    playHappyAudio: () => {
      setScript("yes");
    },
  }));

  return null;
});

export default LipsyncControl;