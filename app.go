package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// WeatherInfo represents basic weather information
type WeatherInfo struct {
	Main        string `json:"main"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

// CurrentWeather represents current weather conditions
type CurrentWeather struct {
	Temp       float64       `json:"temp"`
	FeelsLike  float64       `json:"feels_like"`
	Humidity   int           `json:"humidity"`
	Pressure   int           `json:"pressure"`
	UVIndex    float64       `json:"uvi"`
	Visibility int           `json:"visibility"`
	WindSpeed  float64       `json:"wind_speed"`
	WindDeg    int           `json:"wind_deg"`
	Weather    []WeatherInfo `json:"weather"`
}

// DailyTemp represents daily temperature data
type DailyTemp struct {
	Day   float64 `json:"day"`
	Min   float64 `json:"min"`
	Max   float64 `json:"max"`
	Night float64 `json:"night"`
}

// DailyWeather represents daily weather forecast
type DailyWeather struct {
	Dt      int64         `json:"dt"`
	Temp    DailyTemp     `json:"temp"`
	Weather []WeatherInfo `json:"weather"`
	Pop     float64       `json:"pop"`
}

// HourlyWeather represents hourly weather forecast
type HourlyWeather struct {
	Dt      int64         `json:"dt"`
	Temp    float64       `json:"temp"`
	Weather []WeatherInfo `json:"weather"`
	Pop     float64       `json:"pop"`
}

// WeatherData represents the complete weather data from OpenWeather API
type WeatherData struct {
	Current CurrentWeather  `json:"current"`
	Daily   []DailyWeather  `json:"daily"`
	Hourly  []HourlyWeather `json:"hourly"`
}

// LocationData represents geocoding data
type LocationData struct {
	Name    string  `json:"name"`
	Country string  `json:"country"`
	State   string  `json:"state"`
	Lat     float64 `json:"lat"`
	Lon     float64 `json:"lon"`
}

const (
	OPENWEATHER_API_KEY = "Here paste your Key"
	WEATHER_API_URL     = "https://api.openweathermap.org/data/3.0/onecall"
	GEOCODING_API_URL   = "https://api.openweathermap.org/geo/1.0/direct"
)

// GetWeatherByCoords fetches weather data by coordinates
func (a *App) GetWeatherByCoords(lat, lon float64) (*WeatherData, error) {
	apiURL := fmt.Sprintf("%s?lat=%f&lon=%f&appid=%s&units=metric&exclude=minutely,alerts",
		WEATHER_API_URL, lat, lon, OPENWEATHER_API_KEY)

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("błąd podczas pobierania danych pogodowych: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("błąd podczas odczytywania odpowiedzi: %v", err)
	}

	var weatherData WeatherData
	if err := json.Unmarshal(body, &weatherData); err != nil {
		return nil, fmt.Errorf("błąd podczas parsowania danych pogodowych: %v", err)
	}

	return &weatherData, nil
}

// GetLocationByName finds location coordinates by city name
func (a *App) GetLocationByName(cityName string) ([]LocationData, error) {
	encodedCity := url.QueryEscape(cityName)
	apiURL := fmt.Sprintf("%s?q=%s&limit=5&appid=%s",
		GEOCODING_API_URL, encodedCity, OPENWEATHER_API_KEY)

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("błąd podczas pobierania danych lokalizacji: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("błąd podczas odczytywania odpowiedzi: %v", err)
	}

	var locations []LocationData
	if err := json.Unmarshal(body, &locations); err != nil {
		return nil, fmt.Errorf("błąd podczas parsowania danych lokalizacji: %v", err)
	}

	return locations, nil
}

// GetWeatherByCity fetches weather data by city name
func (a *App) GetWeatherByCity(cityName string) (*WeatherData, error) {
	locations, err := a.GetLocationByName(cityName)
	if err != nil {
		return nil, err
	}

	if len(locations) == 0 {
		return nil, fmt.Errorf("nie znaleziono miasta: %s", cityName)
	}

	// Use the first location found
	location := locations[0]
	return a.GetWeatherByCoords(location.Lat, location.Lon)
}

// Greet returns a greeting for the given name (keeping for compatibility)
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Witaj %s! Sprawdź pogodę w swojej okolicy!", name)
}
