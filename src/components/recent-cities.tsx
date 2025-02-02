import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useSearchHistory } from "@/hooks/use-search-history";

interface RecentCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

function RecentCityTablet({
  name,
  lat,
  lon
}: RecentCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon },'metric');

  const handleClick = () => {
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
      role="button"
      tabIndex={0}
    >

      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className="h-8 w-8"
            />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function RecentCities() {
  const { history } = useSearchHistory();
  // console.log("history : ", history);
  
  if (!history.length) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Recent Searches</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {history.map((city) => (
            <RecentCityTablet
              key={city.id}
              {...city}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
}