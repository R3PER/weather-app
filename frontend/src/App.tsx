import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Wind, Eye, Droplets, Thermometer, Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { GetWeatherByCity } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, size = 24, className = "" }) => {
  const getIcon = () => {
    const iconCode = icon.substring(0, 2);
    const props = { 
      size, 
      className: `drop-shadow-lg ${className}`,
      style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }
    };
    
    switch (iconCode) {
      case '01': return <Sun {...props} color="#FED84B" />;
      case '02': case '03': case '04': return <Cloud {...props} color="#CBD5E0" />;
      case '09': case '10': return <CloudRain {...props} color="#63B3ED" />;
      case '13': return <CloudSnow {...props} color="#E2E8F0" />;
      default: return <Sun {...props} color="#FED84B" />;
    }
  };
  
  return <div className="flex items-center justify-center">{getIcon()}</div>;
};

function App() {
  const [weatherData, setWeatherData] = useState<main.WeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Warszawa');

  useEffect(() => {
    fetchWeather('Warszawa');
  }, []);

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await GetWeatherByCity(city);
      setWeatherData(data);
      setCurrentLocation(city);
    } catch (err) {
      setError(`Nie udało się pobrać danych pogodowych: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pl-PL', { 
      weekday: 'short',
      day: 'numeric'
    });
  };

  const getBackgroundClasses = () => {
    if (!weatherData?.current?.weather?.[0]) return 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500';
    
    const condition = weatherData.current.weather[0].main.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;

    if (condition.includes('clear')) {
      return isNight 
        ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800'
        : 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500';
    } else if (condition.includes('cloud')) {
      return isNight 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700'
        : 'bg-gradient-to-br from-gray-400 via-blue-300 to-gray-500';
    } else if (condition.includes('rain')) {
      return isNight 
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-blue-800'
        : 'bg-gradient-to-br from-slate-500 via-blue-400 to-slate-600';
    } else if (condition.includes('snow')) {
      return 'bg-gradient-to-br from-blue-200 via-white to-blue-300';
    }
    return 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500';
  };

  return (
    <div className={`min-h-screen text-white relative overflow-hidden ${getBackgroundClasses()}`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() * 0.5 + 0.5],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
            }}
          />
        ))}
      </div>

      <div className="max-w-lg mx-auto py-4 px-4 relative z-10">
        <div className="space-y-6">
          {/* Search Bar */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Wyszukaj miasto..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/20 backdrop-blur-md border-none rounded-2xl placeholder-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                />
              </div>
            </form>
          </motion.div>

          {error && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl">
                {error}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto"></div>
                  <p className="text-lg font-medium">Ładowanie danych pogodowych...</p>
                </div>
              </motion.div>
            ) : weatherData ? (
              <motion.div
                key="weather"
                className="w-full space-y-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Current Weather */}
                <motion.div
                  className="w-full bg-white/20 backdrop-blur-3xl rounded-3xl border border-white/30 p-8 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2 opacity-90">
                      <MapPin size={16} />
                      <span className="text-lg font-medium">{currentLocation}</span>
                    </div>
                    
                    <div className="text-8xl font-thin leading-none">
                      {Math.round(weatherData.current.temp)}°
                    </div>
                    
                    <div className="text-xl capitalize opacity-90">
                      {weatherData.current.weather[0]?.description}
                    </div>
                    
                    <div className="text-lg opacity-80">
                      Maks. {Math.round(weatherData.daily[0]?.temp.max || 0)}° Min. {Math.round(weatherData.daily[0]?.temp.min || 0)}°
                    </div>
                  </div>
                </motion.div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Wind, label: 'WIATR', value: `${Math.round(weatherData.current.wind_speed)} km/h` },
                    { icon: Droplets, label: 'WILGOTNOŚĆ', value: `${weatherData.current.humidity}%` },
                    { icon: Thermometer, label: 'ODCZUWALNA', value: `${Math.round(weatherData.current.feels_like)}°` },
                    { icon: Eye, label: 'WIDOCZNOŚĆ', value: `${Math.round(weatherData.current.visibility / 1000)} km` },
                  ].map((detail, index) => (
                    <motion.div
                      key={detail.label}
                      className="bg-white/20 backdrop-blur-3xl rounded-2xl border border-white/30 p-4 shadow-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 opacity-70">
                          <detail.icon size={14} />
                          <span className="text-xs font-medium">{detail.label}</span>
                        </div>
                        <div className="text-2xl font-semibold">{detail.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Hourly Forecast */}
                <motion.div
                  className="bg-white/20 backdrop-blur-3xl rounded-2xl border border-white/30 p-6 shadow-xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <h3 className="text-sm font-medium mb-4 opacity-70">PROGNOZA GODZINOWA</h3>
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    {weatherData.hourly.slice(1, 13).map((hour, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2 min-w-[60px]">
                        <div className="text-sm opacity-80">
                          {index === 0 ? 'Teraz' : formatTime(hour.dt)}
                        </div>
                        <WeatherIcon icon={hour.weather[0]?.icon || '01d'} size={24} />
                        <div className="text-base font-semibold">
                          {Math.round(hour.temp)}°
                        </div>
                        <div className="bg-blue-500/20 px-2 py-1 rounded-full text-xs">
                          {Math.round(hour.pop * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Daily Forecast */}
                <motion.div
                  className="bg-white/20 backdrop-blur-3xl rounded-2xl border border-white/30 p-6 shadow-xl"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <h3 className="text-sm font-medium mb-4 opacity-70">PROGNOZA 7-DNIOWA</h3>
                  <div className="space-y-3">
                    {weatherData.daily.slice(1, 8).map((day, index) => (
                      <div key={index} className="flex items-center py-2">
                        <div className="text-base min-w-[60px] opacity-90">
                          {index === 0 ? 'Jutro' : formatDate(day.dt)}
                        </div>
                        <div className="mx-4">
                          <WeatherIcon icon={day.weather[0]?.icon || '01d'} size={20} />
                        </div>
                        <div className="bg-blue-500/20 px-2 py-1 rounded-full text-xs mr-4">
                          {Math.round(day.pop * 100)}%
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex items-center space-x-4 min-w-[80px] justify-end">
                          <span className="text-base opacity-70">
                            {Math.round(day.temp.min)}°
                          </span>
                          <span className="text-base font-semibold">
                            {Math.round(day.temp.max)}°
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
