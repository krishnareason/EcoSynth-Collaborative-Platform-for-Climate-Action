import React from 'react';
import './ThreatDashboard.css';

// Helper component for the default weather view
const WeatherDisplay = ({ weather }) => {
    if (!weather || !weather.main) {
        return <p>Weather data is currently unavailable.</p>;
    }
    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

    return (
        <div className="weather-display">
            <h3>Regional Weather</h3>
            <p><strong>{weather.name}</strong></p>
            <div className="weather-main">
                <img src={iconUrl} alt={weather.weather[0].description} />
                <span className="weather-temp">{Math.round(weather.main.temp)}°C</span>
            </div>
            <p className="weather-desc">{weather.weather[0].description}</p>
            <div className="weather-details">
                <span>Feels like: {Math.round(weather.main.feels_like)}°C</span>
                <span>Humidity: {weather.main.humidity}%</span>
            </div>
        </div>
    );
};


export default function ThreatDashboard({ threat, closeDashboard, regionalWeather }) {
    // If no threat is selected and there's no weather, don't show.
    if (!threat && !regionalWeather) {
        return null;
    }

    return (
        <div className={`threat-dashboard ${!threat && !regionalWeather ? 'hidden' : ''}`}>
            <button className="close-btn" onClick={closeDashboard}>×</button>
            
            {threat ? (
                // If a specific threat IS selected, show its details
                <>
                    <h3>{threat.title}</h3>
                    <p><strong>Location:</strong> {threat.lat.toFixed(4)}, {threat.lng.toFixed(4)}</p>
                    <p><strong>Description:</strong> {threat.description}</p>
                    <p className={`severity severity-${threat.severity?.toLowerCase()}`}>
                        <strong>Severity:</strong> {threat.severity}
                    </p>
                    <div className="dashboard-actions">
                        <button>Acknowledge</button>
                        <button>Deploy Team</button>
                    </div>
                </>
            ) : (
                // If NO threat is selected, show the regional weather
                <WeatherDisplay weather={regionalWeather} />
            )}
        </div>
    );
}