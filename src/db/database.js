const express = require("express");

const cors = require('cors');



const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


const databasePath = path.join(__dirname, "userData.db");

let database = null;

const initializeDbAndServer = async () => {
    try {
      database = await open({
        filename: databasePath,
        driver: sqlite3.Database,
      });
      app.listen(3001, () =>
      console.log("Server Running at http://localhost:3001/")
      );
    } catch (error) {
      console.log(`DB Error: ${error.message}`);
      process.exit(1);
    }
  };


app.post('/api-save-image', async (req,res) => {
  console.log(req)
  const {imageUrl,location}  = req.body 
  
  const addImageQuery =` INSERT INTO
    UserImages(imageUrl,location)
    VALUES
        (
        '${imageUrl}',
        '${location}'  
        );`;
    
    try {
      await database.run(addImageQuery);
      console.log("Image saved successfully.");
      res.send("saved succesfully")
    } catch (error) {
        console.error("Error saving image:", error);
        res.send("Error saving image")
    }

})



app.get('/saved-images', async (req,res) => {
  const getImagesQuery = `SELECT * FROM UserImages;`

  try {
    const data = await database.all(getImagesQuery)
    res.send(data)
    console.log("images fetched successfully")
  } catch (error) {
    console.error("Error fetching images:", error);
  }
})



 


initializeDbAndServer()

 