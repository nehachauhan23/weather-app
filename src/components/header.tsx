import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";
export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"} className="flex ">
          <img
            src={"/logo.png"}
            alt="Weather App"
            className="h-14"
          />
          <h2 className="flex items-center font-bold text-lg sm:text-2xl pl-2">WeatherApp</h2>
        </Link>
        {/* {location.pathname !== "/" && ( */}
        <div className="flex gap-4">
          <CitySearch />
        </div>
        {/* )} */}
      </div>
    </header>
  );
}
