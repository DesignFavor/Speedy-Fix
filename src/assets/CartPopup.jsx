import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "/public/Thankyou.json";

const CartPopup = ({
  showPopup,
  thankYouMessage,
  handleClosePopup,
  handleProceed,
  handleHappyAnimation,
  droppedObjects = [],
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const sendEmail = async () => {
    try {
      if (!droppedObjects || droppedObjects.length === 0) {
        setEmailStatus("Please Select Your Service.");
        return false;
      }
  
      console.log("Objects to send:", droppedObjects);
  
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/send-email`, {
        name,
        email,
        message,
        droppedObjects,
      });
  
      if (response.status === 200) {
        setEmailStatus("Email sent successfully!");
        return true;
      } else {
        setEmailStatus("Failed to send email.");
        return false;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus("Error sending email: " + error.message);
      return false;
    }
  };

  const handleProceedClick = async () => {
    const emailSent = await sendEmail();
    if (emailSent) {
      handleClosePopup();
      handleHappyAnimation();
      setShowThankYou(true); 

      const audio = new Audio("../public/thankyou.mp3");
      audio.play(); 
    }
  };

  useEffect(() => {
    let timer;
    if (showThankYou) {
      timer = setTimeout(() => {
        setShowThankYou(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [showThankYou]);

  const styles = {
    popup: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "20px",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "400px",
      maxWidth: "90%",
    },
    title: {
      fontFamily: "cursive",
      textAlign: "center",
      marginBottom: "20px",
    },
    input: {
      marginBottom: "10px",
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
    },
    buttons: {
      display: "flex",
      justifyContent: "space-between",
    },
    button: {
      margin: "5px",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      border: "none",
      color: "white",
      fontWeight: "bold",
      flex: 1,
      margin: "0 5px",
    },
    declineButton: {
      backgroundColor: "lightcoral",
      border: "2px solid #e74c3c",
    },
    proceedButton: {
      backgroundColor: "lightgreen",
      border: "2px solid #2ecc71",
    },
    emailStatus: {
      color: "red",
      textAlign: "center",
    },
    thankYouOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 2000,
    },
  };

  return (
    <>
      {showPopup && (
        <div style={styles.popup}>
          <h2 style={styles.title}>Contact Us!</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Nachricht "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
          />

          {emailStatus && <p style={styles.emailStatus}>{emailStatus}</p>}

          {thankYouMessage ? (
            <p style={styles.emailStatus}>{thankYouMessage}</p>
          ) : (
            <div style={styles.buttons}>
              <button
                onClick={handleClosePopup}
                style={{ ...styles.button, ...styles.declineButton }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleProceedClick}
                style={{ ...styles.button, ...styles.proceedButton }}
              >
                Absenden
              </button>
            </div>
          )}
        </div>
      )}

      {showThankYou && (
        <div style={styles.thankYouOverlay}>
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: animationData,
            }}
            height={300}
            width={300}
          />
        </div>
      )}
    </>
  );
};

export default CartPopup;
