
require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.VISUAL_CROSSING_API_KEY;
const express = require('express');
const { createClient } = require('redis');
const app = express();
const PORT = process.env.PORT || 3000;
const rateLimit = require('express-rate-limit');
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(() => console.log('Connected to Redis'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, try again later",
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter);
app.get('/weather/:city', async (request, respone) => {
  const cityName = request.params.city.toLowerCase();
  try {
    const cachedData = await redisClient.get(cityName);

    if (cachedData) {
      console.log(`Cache Hit for ${cityName}`);
      return respone.json(JSON.parse(cachedData));
    }

    console.log(`Cache Miss for ${cityName}`);
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&key=${API_KEY}&contentType=json`;

    const apiResponse = await axios.get(url);

    const weatherData = {
      city: apiResponse.data.address,
      temp: apiResponse.data.currentConditions.temp,
      conditions: apiResponse.data.currentConditions.conditions,
      humidity: apiResponse.data.currentConditions.humidity,
      windspeed: apiResponse.data.currentConditions.windspeed,
      winddir: apiResponse.data.currentConditions.winddir,
      pressure: apiResponse.data.currentConditions.pressure,
      visibility: apiResponse.data.currentConditions.visibility,
      solarradiation: apiResponse.data.currentConditions.solarradiation,
      solarenergy: apiResponse.data.currentConditions.solarenergy,
      uvindex: apiResponse.data.currentConditions.uvindex,

    };

    await redisClient.set(cityName, JSON.stringify(weatherData), {
      EX: 3600
    })

    respone.json(weatherData);
  } catch (error) {
    console.log(error);
    respone.status(500).send('Failed to fetch weather data. Was the name correct?');
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})