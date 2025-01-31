import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

export const Preloader = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/loading.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error('Error loading animation:', error));
  }, []);

  if (!animationData) {
    return <div>Loading...</div>;
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData, 
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={styles.container}>
      <img
        src="/speedy.png"
        alt="Loading..."
        style={{
          height: '200px',
          width: '200px',
          marginBottom: '-20px',
        }}
      />
      <Lottie options={defaultOptions} height={100} width={300} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: 'white',
    zIndex: 5,
    position: 'absolute',
  },
};
