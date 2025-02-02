import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { CurrentWeather } from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temprature";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import WeatherSkeleton from "../components/loading-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Units } from "../api/types"

export function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const [units, setUnits] = useState<Units>('metric');
  const coordinates = { lat, lon };
  
  const weatherQuery = useWeatherQuery(coordinates, units);
  const forecastQuery = useForecastQuery(coordinates, units);
  
  const handleUnitChange = (value: string) => {
    setUnits(value as Units)
  }

  useEffect(() => {
    if(weatherQuery.refetch){
      weatherQuery.refetch();
    }
    if(forecastQuery.refetch){
      forecastQuery.refetch();
    }
  }, [units]);


  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }


  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div className="flex gap-2">
           <Select
          value={units}
          onValueChange={handleUnitChange} >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Celsius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Farenheit</SelectItem>
              <SelectItem value="metric">Celsius</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} units={units} />
        <HourlyTemperature data={forecastQuery.data} />
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
}
