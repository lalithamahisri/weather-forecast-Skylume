# 🌤️ Weatherly

A modern, responsive weather dashboard that provides real-time weather information with an interactive map, hourly forecasts, 7-day forecasts, and condition-based visual effects.

## ✨ Features

* 🌡️ **Real-Time Weather** — View current temperature, weather condition, feels-like temperature, highs and lows.
* 🔎 **Location Search** — Search for weather information by city or location.
* 📍 **Current Location** — Use browser geolocation to get weather for your current position.
* ⏰ **Hourly Forecast** — View upcoming hourly temperatures and precipitation probability.
* 📅 **7-Day Forecast** — See daily weather conditions, temperature ranges, and precipitation chances.
* 🗺️ **Interactive Weather Map** — Explore locations using an interactive Leaflet/OpenStreetMap map.
* 🧭 **Map Location Selection** — Click on the map to select a location and retrieve its weather.
* 🗺️ **Weather Map Layers** — Switch between available map/weather layers.
* 🌅 **Sunrise & Sunset** — View sunrise and sunset times with a visual sun-path.
* 💨 **Current Conditions** — Monitor wind, humidity, UV index, visibility, and pressure.
* 🌡️ **Temperature Units** — Switch between Celsius and Fahrenheit.
* 🌧️ **Ambient Weather Effects** — Background effects adapt to the current weather condition.
* 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile screens.
* ⚡ **Smooth UI** — Subtle transitions, animations, loading states, and interactive elements.

## 🛠️ Technologies Used

* **React**
* **JavaScript**
* **Vite**
* **CSS**
* **Leaflet**
* **OpenStreetMap**
* **Weather API**
* **Geolocation API**

## 📂 Project Structure

```text
Weather-app/
│
├── public/
│
├── src/
│   ├── components/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

> The exact component structure may vary depending on the current implementation.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/weatherly.git
```

### 2. Navigate to the project

```bash
cd weatherly
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and add the required API key(s):

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

Do not commit `.env` to GitHub.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## 🗺️ Interactive Map

Weatherly uses an interactive map to allow users to explore different locations.

Users can:

* Zoom in and out
* Pan around the map
* Select locations
* View location information
* Retrieve weather for selected coordinates
* Switch between available map layers

Map interactions are isolated from the page scrolling experience so interacting with the map does not unexpectedly move the webpage.

## 🌦️ Ambient Weather Effects

The interface dynamically responds to weather conditions.

Examples include:

| Weather Condition | Visual Effect                     |
| ----------------- | --------------------------------- |
| ☀️ Clear & Hot    | Warm ambient glow                 |
| 🌧️ Rain          | Subtle rain animation             |
| ❄️ Snow           | Falling snow particles            |
| ⛈️ Thunderstorm   | Dim atmosphere and soft lightning |
| ☁️ Cloudy         | Slowly moving cloud gradients     |
| 🌫️ Fog           | Soft mist effects                 |
| 🌙 Clear Night    | Dark sky with subtle stars        |
| 💨 Windy          | Subtle background movement        |

The effects are designed to remain lightweight and do not interfere with the application's usability.

## 📱 Responsive Design

Weatherly is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The dashboard adapts its grid layout based on screen size while keeping the map, forecasts, and weather information usable.

## 🔐 Environment Variables

API keys and other sensitive configuration values should be stored in environment variables.

Example:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

Never upload API keys or `.env` files to GitHub.

## 🎯 Project Goals

The main goals of Weatherly are to provide:

1. Real-time weather information.
2. A clean and intuitive user interface.
3. Interactive location-based weather exploration.
4. Useful short-term and weekly forecasts.
5. Responsive design across devices.
6. A visually engaging experience through subtle weather-based effects.

## 🔮 Future Improvements

Potential future enhancements include:

* Weather alerts and notifications
* More detailed weather radar
* Air quality information
* Saved favorite locations
* Historical weather data
* Weather comparison between locations
* PWA/offline support
* More detailed weather map overlays

## 👩‍💻 Author

**Lalitha Mahi Sri**

Computer Science & Engineering

---

⭐ If you find Weatherly useful, consider giving the repository a star!
