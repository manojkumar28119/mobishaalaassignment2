import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import CameraComponent from "../CameraComponent";
import { FaCamera } from "react-icons/fa";
import CapturedImages from "../CapturedImages";
import "./index.css";

// Override Leaflet's default icon to fix the marker display issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export default function MapWithCurrentLocation(props) {
  const [isClicked, setClicked] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const mapRef = useRef();

 
  const onClickCameraIcon = () => {
    setClicked((prevState) => !prevState);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Get user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        map.setView([latitude, longitude], 13);
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );

    const provider = new OpenStreetMapProvider();

    // Add search control when the map is loaded
    const handleMapLoad = () => {
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        autoCompleteDelay: 250,
        autoClose: true,
        marker: {
          icon: new L.Icon.Default(),
          draggable: false,
        },
      }); 

      console.log("Search control created:", searchControl);

      map.addControl(searchControl, { topLeft: true });
    };

    map.whenReady(handleMapLoad);

    // Clean up function
    return () => {
      map.off("load", handleMapLoad);
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100vh", width: "100vw" }}
        ref={mapRef}
      >
        {coordinates && (
          <Marker position={[coordinates.latitude, coordinates.longitude]}>
            <Popup>
              you are here
            </Popup>
          </Marker>
        )}

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "10px",
          zIndex: 1000, 
        }}
      >
        <CapturedImages />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "10px",
          zIndex: 1000,
        }}
        className="camera-component"
      >
        {isClicked && <CameraComponent />}
        <button type="button" className="camera-btn" onClick={onClickCameraIcon}>
          <FaCamera size={25} color="#ffffff" />
        </button>
      </div>
    </div>
  );
}
