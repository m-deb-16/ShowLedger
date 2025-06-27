import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get("https://api.themoviedb.org/3/search/tv", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
        params: {
          query: searchQuery,
          include_adult: true,
          language: "en-US",
          page: 1,
        },
      });
      setSuggestions(res.data.results.slice(0, 5));
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (title) => {
    navigate(`/search?q=${encodeURIComponent(title)}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex flex-wrap items-center justify-between relative">
      <div className="font-bold text-lg">TV Tracker</div>

      <div className="relative">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center my-2 sm:my-0"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TV shows..."
            className="p-1 rounded-l text-black"
          />
          <button type="submit" className="bg-blue-600 px-2 rounded-r">
            Search
          </button>
        </form>

        {suggestions.length > 0 && (
          <ul className="absolute bg-white text-black border rounded w-full mt-1 z-10">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => handleSuggestionClick(s.name)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-x-4">
        <Link to="/home" className="hover:underline">
          Home
        </Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
