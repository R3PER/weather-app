export namespace main {
	
	export class WeatherInfo {
	    main: string;
	    description: string;
	    icon: string;
	
	    static createFrom(source: any = {}) {
	        return new WeatherInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.main = source["main"];
	        this.description = source["description"];
	        this.icon = source["icon"];
	    }
	}
	export class CurrentWeather {
	    temp: number;
	    feels_like: number;
	    humidity: number;
	    pressure: number;
	    uvi: number;
	    visibility: number;
	    wind_speed: number;
	    wind_deg: number;
	    weather: WeatherInfo[];
	
	    static createFrom(source: any = {}) {
	        return new CurrentWeather(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.temp = source["temp"];
	        this.feels_like = source["feels_like"];
	        this.humidity = source["humidity"];
	        this.pressure = source["pressure"];
	        this.uvi = source["uvi"];
	        this.visibility = source["visibility"];
	        this.wind_speed = source["wind_speed"];
	        this.wind_deg = source["wind_deg"];
	        this.weather = this.convertValues(source["weather"], WeatherInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DailyTemp {
	    day: number;
	    min: number;
	    max: number;
	    night: number;
	
	    static createFrom(source: any = {}) {
	        return new DailyTemp(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.day = source["day"];
	        this.min = source["min"];
	        this.max = source["max"];
	        this.night = source["night"];
	    }
	}
	export class DailyWeather {
	    dt: number;
	    temp: DailyTemp;
	    weather: WeatherInfo[];
	    pop: number;
	
	    static createFrom(source: any = {}) {
	        return new DailyWeather(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dt = source["dt"];
	        this.temp = this.convertValues(source["temp"], DailyTemp);
	        this.weather = this.convertValues(source["weather"], WeatherInfo);
	        this.pop = source["pop"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class HourlyWeather {
	    dt: number;
	    temp: number;
	    weather: WeatherInfo[];
	    pop: number;
	
	    static createFrom(source: any = {}) {
	        return new HourlyWeather(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dt = source["dt"];
	        this.temp = source["temp"];
	        this.weather = this.convertValues(source["weather"], WeatherInfo);
	        this.pop = source["pop"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class LocationData {
	    name: string;
	    country: string;
	    state: string;
	    lat: number;
	    lon: number;
	
	    static createFrom(source: any = {}) {
	        return new LocationData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.country = source["country"];
	        this.state = source["state"];
	        this.lat = source["lat"];
	        this.lon = source["lon"];
	    }
	}
	export class WeatherData {
	    current: CurrentWeather;
	    daily: DailyWeather[];
	    hourly: HourlyWeather[];
	
	    static createFrom(source: any = {}) {
	        return new WeatherData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.current = this.convertValues(source["current"], CurrentWeather);
	        this.daily = this.convertValues(source["daily"], DailyWeather);
	        this.hourly = this.convertValues(source["hourly"], HourlyWeather);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

