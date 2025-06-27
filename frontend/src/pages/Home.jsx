import { useEffect, useState } from "react";
import axios from "axios";
import ShowCard from "../components/ShowCard";

const Home = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("popular");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (filter === "popular") {
          const res = await axios.get(
            "https://api.themoviedb.org/3/trending/tv/day?language=en-US",
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
              },
            }
          );
          setShows(res.data.results);
        } else {
          // Fetch watchlist
          const res = await axios.get(
            `http://localhost:5000/api/watchlist${
              filter === "all" ? "" : `?status=${filter}`
            }`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const entries = res.data; // Array of { showId, status, ... }

          // Fetch TMDB data for each showId
          const detailPromises = entries.map((entry) =>
            axios
              .get(`https://api.themoviedb.org/3/tv/${entry.showId}`, {
                headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                },
              })
              .then((r) => ({
                ...r.data,
                _watchlistStatus: entry.status, // Add status info for later use if needed
              }))
          );

          const detailedShows = await Promise.all(detailPromises);
          setShows(detailedShows);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">TV Shows</h2>

      {token && (
        <div className="mb-4">
          <label className="mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded p-1"
          >
            <option value="popular">Popular Shows</option>
            <option value="all">All Watchlist</option>
            <option value="to_watch">To Watch</option>
            <option value="watching">Watching</option>
            <option value="watched">Watched</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
