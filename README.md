# WeatherApp

## About the Application

WeatherApp is a modern weather application that allows users to check the current weather and forecasts for any city worldwide. The app displays data in a sleek, responsive interface with dynamic animations and intuitive navigation.

## Screens and Videos
<img width="1025" height="811" alt="1" src="https://github.com/user-attachments/assets/9bbad0d9-b485-4d5d-a9a8-f639c3453e8e" />


https://github.com/user-attachments/assets/64f68c0e-be5d-4c89-a945-364616a7d03e




### Features

- **City search** – search weather for any city in the world  
- **Current weather** – displays current temperature, weather description, and min/max temperatures  
- **Detailed data** – wind, humidity, feels-like temperature, and visibility information  
- **Hourly forecast** – weather forecast for the next 12 hours with precipitation probability  
- **7-day forecast** – weekly forecast with min and max temperatures  
- **Dynamic interface** – app background changes based on weather conditions and time of day  
- **UI animations** – smooth animations for an enjoyable user experience  

## Technologies

The application is built using the following technologies:

### Backend
- **Go** – fast and efficient programming language used for business logic  
- **Wails** – framework for building desktop apps with Go and web technologies  
- **OpenWeather API** – external API providing weather data  

### Frontend
- **React** – JavaScript library for building user interfaces  
- **TypeScript** – typed superset of JavaScript increasing code reliability  
- **Framer Motion** – library for creating animations  
- **Lucide React** – icon set used in the app  

## Running in Development Mode

To run the application in development mode, execute `wails dev` in the project directory. This will start the Vite development server, enabling hot-reloading of frontend changes. You can also connect to the development server at http://localhost:34115 to interact with Go methods in the browser.

## Building

To build a production version of the application, use `wails build`. This will generate an executable file for your operating system.

## Project Structure

- `app.go` – main Go file containing business logic and weather API communication  
- `main.go` – application entry point, Wails configuration and startup  
- `frontend/` – directory containing the frontend code  
  - `src/App.tsx` – main React component of the app  
  - `src/assets/` – application assets (fonts, images)  
  - `wailsjs/` – automatically generated code linking Go with TypeScript  

## License

This project is released under the MIT License.
