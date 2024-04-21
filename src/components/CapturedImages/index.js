import { useState, useEffect } from "react";

import ImageItem from "../ImageItem";
import "./index.css";

const CapturedImages = (props) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/saved-images");
      if (response.ok) {
        const fetchedData = await response.json();
        setData(fetchedData);
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 4000); // Fetch data every 5 seconds
    return () => clearInterval(intervalId); 
  }, []);  
  return (
    <div className="captured-images-card">
      {data.length !== 0 &&
        data.map((each) => <ImageItem item={each} key={each.id} />)}
    </div>
  );
};

export default CapturedImages;
