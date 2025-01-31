import { useState } from "react";

const subtitles = [
  { key: "Sale", text: "Sales: Gewinnen Sie eine ganzheitliche Sicht auf Kunden, indem Sie Daten aus verschiedenen Quellen konsolidieren" },
  { key: "app", text: "Custom App: Wenn der Standard von Microsoft nicht ausreicht, meistern Sie jede Challenge mit einer Custom App. " },
  { key: "Service", text: "Service: Steigern Sie Ihre Servicequalität, indem Sie mit generativer KI und Automatisierung Kundenanfragen schneller und effektiver bearbeiten." },
  { key: "data", text: "Data Integration: Integrieren Sie alle Kundendaten in einer zentralen Plattform" },
  { key: "Marketing", text: "Marketing: Stärken Sie Kundenbeziehungen und steigern Sie den Umsatz, indem Sie Marketingprozesse automatisieren" }
];

export default function SubtitleSlider() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
  };

  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex - 1 + subtitles.length) % subtitles.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 relative">
      <div
        className="bg-white text-black text-center rounded-3xl shadow-2xl"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          padding: "40px 60px",
          borderRadius: "30px",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
        }}
      >
        <div style={{display: "flex", alignItems: "center", columnGap: "20px"}}>
          {/* Previous Button Image */}
          <div 
            onClick={handlePrevious}
            className="cursor-pointer hover:scale-110 transition-transform duration-300"
          >
            <img 
              src="/prev.png" 
              alt="Previous"
              style={{ width: "30px", height: "30px" }}
            />
          </div>

          {/* Subtitle Text */}
          <img
            src="/speedy.png"
            alt="Logo"
            className="speedy-image"
            style={{ width: "100px", height: "100px" }}
          />
          <p
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex-grow subtitle-text"
            style={{
              fontFamily: "'Arial', sans-serif",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {subtitles[index].text}
          </p>

          {/* Next Button Image */}
          <div 
            onClick={handleNext}
            className="cursor-pointer hover:scale-110 transition-transform duration-300"
          >
            <img 
              src="/Next.png" 
              alt="Next"
              style={{ width: "30px", height: "30px" }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .subtitle-text {
            font-size: 16px !important;
          }
          .speedy-image {
            width: 70px !important;
            height: 70px !important;
          }
        }
      `}</style>
    </div>
  );
}