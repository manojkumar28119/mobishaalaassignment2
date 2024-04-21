import {useState} from "react"
import CameraComponent from "./components/CameraComponent"
import CapturedImages from "./components/CapturedImages"
import MapWithCurrentLocation from "./components/MapWithCurrentLocation"
import './App.css';


const App = () => (
  <div className="App">
     <MapWithCurrentLocation />
  </div>
);

export default App;
