import { useState } from "react";
import axios from "axios";

const LocationAutocomplete = ({ onSelect }: { onSelect: (location: { description: string; coordinates: [number, number] }) => void }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);

    if (searchTerm.trim().length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchTerm
          )}&format=json&addressdetails=1&limit=5`
        );

        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion: any) => {
    onSelect({
      description: suggestion.display_name,
      coordinates: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)],
    });
    setQuery(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search for a location"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-40 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
