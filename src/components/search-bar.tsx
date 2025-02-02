import { Search, Loader2, Clock } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history"; // Use the shared hook now
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const SearchBar = () => {
  const { query, setQuery, history, addToHistory } = useSearchHistory();  // Use the shared hook for query and history
  const navigate = useNavigate();
  
  const { data: locations, isLoading } = useLocationSearch(query);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };
  const filteredLocations = locations?.filter(location => 
    !history.some(item => item.lat === location.lat && item.lon === location.lon)
  );
  return (
    <Command>
      <CommandInput
        placeholder="Search cities..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.length > 2 && !isLoading && (
          <CommandEmpty>No cities found.</CommandEmpty>
        )}
        
        {/* Search History Section */}
        {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Searches
                  </p>
                </div>
                {history.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                    {item.state && (
                      <span className="text-sm text-muted-foreground">
                        , {item.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {item.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(item.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

        {/* Search Results */}
        <CommandSeparator />
        {filteredLocations && filteredLocations.length > 0 && (
          <CommandGroup heading="Suggestions">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {filteredLocations.map((location) => (
              <CommandItem
                key={`${location.lat}-${location.lon}`}
                value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                onSelect={handleSelect}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{location.name}</span>
                {location.state && (
                  <span className="text-sm text-muted-foreground">
                    , {location.state}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  , {location.country}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default SearchBar;
