import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://api.openweathermap.org";
const API_KEY = "fe0f806894cddd1471a320bd4724da0b";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let data;

app.get("/", (req, res) => {
  res.render("index.ejs", { result: data });
});

app.post("/search-weather", async (req, res) => {
  try {
    const location = await axios.get(API_URL + "/geo/1.0/direct", {
      params: {
        q: req.body.cityName,
        appid: API_KEY,
      },
    });

    const weather = await axios.get(API_URL + "/data/2.5/weather", {
      params: {
        lat: location.data[0].lat,
        lon: location.data[0].lon,
        appid: API_KEY,
      },
    });

    data = new Object();
    data = weather.data;
    data.cityname = req.body.cityName;
    data.cityname = data.cityname.toUpperCase();
    data.main.temp = (
      Math.round((data.main.temp - 273.15) * 100) / 100
    ).toFixed(2);
    console.log(data);
    res.redirect("/");
  } catch (error) {
    res.statusCode;
  }
});

app.listen(port, () => {
  console.log("Server running on port http://localhost:" + port);
});
