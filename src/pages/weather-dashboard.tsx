import { CurrentWeather } from "@/components/current-weather";
import { HourlyTemperature } from "@/components/hourly-temprature";
import { RecentCities } from "@/components/recent-cities";
import SearchBar from "@/components/search-bar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { WeatherDetails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";

export function WeatherDashboard() {
  const { history } = useSearchHistory();
  const units = 'metric';
  const mostRecentCity = history?.[0];  
  const weatherQuery = mostRecentCity
    ? useWeatherQuery({ lat: mostRecentCity.lat, lon: mostRecentCity.lon }, "metric")
    : null;
  const forecastQuery = mostRecentCity
    ? useForecastQuery({ lat: mostRecentCity.lat, lon: mostRecentCity.lon }, "metric")
    : null;




  if (weatherQuery?.error || forecastQuery?.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }



  return (
    <div className="space-y-4">
      <RecentCities />
      <h1 className="text-center capitalize font-bold text-lg sm:text-xl">
        Check weather of your favorite city
      </h1>

      <Card className="p-5 bg-black">
        <div className="flex gap-4">
          <SearchBar />
        </div>
      </Card>

      {history && history.length > 0 && mostRecentCity && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {mostRecentCity.name}, {weatherQuery?.data?.sys.country}
            </h1>
          </div>

          <div className="grid gap-6">
            <CurrentWeather data={weatherQuery?.data} units={units} />
            <HourlyTemperature data={forecastQuery?.data} />
            <div className="grid gap-6 md:grid-cols-2 items-start">
              <WeatherDetails data={weatherQuery?.data} />
              <WeatherForecast data={forecastQuery?.data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
