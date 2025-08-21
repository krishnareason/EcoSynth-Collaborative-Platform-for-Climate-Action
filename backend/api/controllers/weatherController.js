const fetch = require('node-fetch'); // Make sure you have node-fetch installed: npm install node-fetch

const getWeatherData = async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!lat || !lon) {
        return res.status(400).json({ message: 'Latitude and Longitude are required.' });
    }
    if (!apiKey) {
        return res.status(500).json({ message: 'Weather API key is not configured on the server.' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();
        res.status(200).json(weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ message: 'Failed to fetch weather data.' });
    }
};

module.exports = { getWeatherData };