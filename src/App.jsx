import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing';
import SoundManager from './SoundManager';
import Scene from './Scene';
import CartPopup from './assets/CartPopup';
import LipsyncControl from './assets/LipsyncControl';
import * as THREE from 'three';
import './App.css';
import { Preloader } from './assets/Preloader';
import SubtitleComponent from './assets/SubtitleComponent';


function App() {
  const [playPackingAndBox, setPlayPackingAndBox] = useState(false);
  const [triggerReset, setTriggerReset] = useState(false);
  const [playByeAnimation, setByeAnimation] = useState(false);
  const [playHappyAnimation, setHappyAnimation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [droppedObjects, setDroppedObjects] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [loading, setLoading] = useState(true); 
  const soundManager = SoundManager({});
  const lipsyncControlRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);


  const handleCartClick = () => {
    setPlayPackingAndBox(true);
    setTimeout(() => setPlayPackingAndBox(false), 1000);
    soundManager.handleClickSound();
    setTimeout(() => setShowPopup(true), 3000);
  };

  const handleHappyClick = () => {
    setHappyAnimation(true);
    setTimeout(() => setHappyAnimation(false), 1000);
    soundManager.handleClickSound();

    if (lipsyncControlRef.current) {
      lipsyncControlRef.current.playHappyAudio();
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setName('');
    setMessage('');
    setThankYouMessage('');
  };

  const handleProceed = () => {
    console.log('Proceed clicked, Dropped Objects:', droppedObjects);
    window.location.href = '/next-page';
  };

  const handleMouseDown = (e) => {
    e.target.style.transform = 'scale(0.9)';
  };

  const handleMouseUp = (e) => {
    e.target.style.transform = 'scale(1)';
  };

  const handleResetClick = () => {
    setTriggerReset(true);
    setTimeout(() => setTriggerReset(false), 0);
    soundManager.handleClickSound();
  };

  const handleQuitClick = (e) => {
    e.stopPropagation();
    console.log('Quit button clicked.');
    setByeAnimation(true);
    soundManager.handleClickSound();
    
  
    setTimeout(() => {
      setByeAnimation(false);
      window.location.href = '/goodbye'; 
    }, 2000);
  
    if (lipsyncControlRef.current) {
      lipsyncControlRef.current.playByeByeAudio();
    }
  };



  const handleInfoClick = () => {
    soundManager.handleClickSound();
    setIsSubtitleVisible(prev => !prev); // Toggle visibility
  };

  const SetupRenderer = () => {
    const { gl } = useThree();
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.CineonToneMapping;
    gl.toneMappingExposure = 1;
    return null;
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Canvas style={{ height: '100vh', width: '100vw', position: 'absolute', zIndex: "0" }} shadows>
        <SetupRenderer />
        <Suspense fallback={null}>
          <EffectComposer >
            <N8AO  aoRadius={1} />
            <Bloom luminanceThreshold={1.5} luminanceSmoothing={2} height={300} />
          </EffectComposer>
          <PerspectiveCamera
      makeDefault
      position={isMobile ? [-4, 3, -5] : [-4, 3, -4]} 
      fov={isMobile ? 70 : 45} 
      rotation={[0.05, 3.15, 0]}
          />
          <Environment preset="night" intensity={1} background={true} />
          <Scene
            playPackingAndBox={playPackingAndBox}
            triggerReset={triggerReset}
            playByeAnimation={playByeAnimation}
            playHappyAnimation={playHappyAnimation}
            onDroppedObjectsChange={setDroppedObjects}
          />
        
          <LipsyncControl ref={lipsyncControlRef} nodes={{}} />
        </Suspense>
        
      </Canvas>



      <div className="button-container">
        <button
          className="button"
          onClick={handleResetClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <img src="/reset.png" alt="Reset" className="icon" />
        </button>
        <button
          className="button"
          onClick={handleCartClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <img src="/cart.png" alt="Cart" className="icon" />
        </button>
      </div>

      <img
        src="/Quit.png"
        alt="Quit"
        className="quit-icon"
        id="quit-button"
        style={{ top: '10px', left: '10px', position: 'absolute' }}
        onClick={handleQuitClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />

<img
        src="/info.png"
        alt="Info-icon"
        className="Info-icon"
        id="Info-button"
        style={{ top: '10px', right: '10px', position: 'absolute' }}
        onClick={handleInfoClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />

{isSubtitleVisible && (

        <SubtitleComponent />

    )}

      <CartPopup
        showPopup={showPopup}
        name={name}
        message={message}
        thankYouMessage={thankYouMessage}
        setName={setName}
        setMessage={setMessage}
        handleProceed={handleProceed}
        handleClosePopup={handleClosePopup}
        droppedObjects={droppedObjects}
        handleHappyAnimation={handleHappyClick}
      />


      {loading && (
        <Preloader
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: 50,
          }}
        />
      )}
    </>
  );
}

export default App;
