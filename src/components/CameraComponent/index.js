import { useState, useEffect } from "react";

import Webcam from "react-webcam";
import "./index.css";

const CameraComponent = () => {
  const [imageUrl, setImageSrc] = useState("");
  const [error, setError] = useState(null);
  const [placeName, setPlaceName] = useState("");

  useEffect(() => {
    getPosition();
  }, []);

  // Function to get the user's current position
  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error.message);
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  const getPlace = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();

      // Extracting address from the response
      const address = data.display_name;
      setPlaceName(address);
    } catch (error) {
      console.error("Error fetching place:", error);
    }
  };

  // Usage example:
  const getPosition = async () => {
    try {
      const position = await getLocation();
      console.log("Latitude:", position.latitude);
      console.log("Longitude:", position.longitude);
      const latitude = position.latitude;
      const longitude = position.longitude;
      console.log("ok");
      getPlace(latitude, longitude);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onClickCapture = async (imageSrc) => {
    const userImageData = {
      imageUrl: imageSrc,
      location: placeName,
    };
    console.log(userImageData);
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userImageData),
      };

      const response = await fetch(
        "http://localhost:3001/api-save-image",
        options
      );
      console.log(response);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <div className="web-cam">
      <Webcam
        audio={false}
        height={200}
        screenshotFormat="image/jpeg"
        width={200}
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot();
              onClickCapture(imageSrc);
              setImageSrc(imageSrc);
            }}
            className="btn"
          >
            Capture Me
          </button>
        )}
      </Webcam>
    </div>
  );
};

export default CameraComponent;
