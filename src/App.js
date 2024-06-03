import React, { useEffect, useState } from "react";

import sunnyIcon from "./assets/clearSunny.png";
import cloudyIcon from "./assets/cloudy-day.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humidity.png";
import rainyIcon from "./assets/rainy.png";
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";
import windyIcon from "./assets/windy.png";
import notFoundIcon from "./assets/notFound.png";

const WeatherDetails = ({
  icon,
  temperature,
  city,
  country,
  lat,
  long,
  wind,
  humidity,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temperature">{temperature}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitute</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="long">longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} className="icon" alt="humidity" />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windyIcon} className="icon" alt="wind" />
          <div className="data">
            <div className="wind-percentage">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

const App = () => {
  let apiKey = "859703cb9066d0c93255483b2997abdf";

  const [text, setText] = useState("london");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("-----");
  const [country, setCountry] = useState("--");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [cityNotFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const weatherIconMap = {
    "01d": sunnyIcon,
    "01n": sunnyIcon,
    "02d": cloudyIcon,
    "02n": cloudyIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainyIcon,
    "09n": rainyIcon,
    "10d": rainyIcon,
    "10n": rainyIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        setNotFound(true);

        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);
      const ic = data.weather[0].icon;
      setIcon(weatherIconMap[ic] || sunnyIcon);
      setNotFound(false);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  function handleCity(e) {
    setText(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      search();
    }
  }

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon">
            <img src={searchIcon} alt="search" onClick={() => search()} />
          </div>
        </div>
        {cityNotFound === false && loading === false ? (
          <WeatherDetails
            icon={icon}
            temperature={temp}
            city={city}
            country={country}
            lat={lat}
            long={long}
            humidity={humidity}
            wind={wind}
          />
        ) : (
          <div className="city-not-found">
            <h3>City Not Found</h3>
            <img src={notFoundIcon} alt="city-not-found" />
          </div>
        )}

      </div>
    </>
  );
};

export default App;
