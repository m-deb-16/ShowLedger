import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ShowDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [watchlistInfo, setWatchlistInfo] = useState(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        });
        setShow(res.data);
      } catch (err) {
        console.error("Error fetching show details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  useEffect(() => {
    const fetchWatchlistStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `http://localhost:5000/api/watchlist/show/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWatchlistInfo(res.data);
        setStatus(res.data.status);
        if (res.data.rating) {
          setRating(res.data.rating);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Not in watchlist, do nothing
          setWatchlistInfo(null);
        } else {
          console.error("Error fetching watchlist status", err);
        }
      }
    };

    fetchWatchlistStatus();
  }, [id]);

  const handleAddOrUpdateWatchlist = async () => {
    if (!status) {
      alert("Please select a status.");
      return;
    }
    if (status === "watched" && (!rating || rating < 1 || rating > 10)) {
      alert("Please provide a rating between 1 and 10.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/watchlist",
        {
          showId: id,
          status,
          rating: status === "watched" ? rating : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Watchlist updated: ${status}`);
    } catch (err) {
      console.error("Error updating watchlist", err);
      alert("Failed to update watchlist");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading show details...</div>;
  }

  if (!show) {
    return <div className="p-4 text-center text-red-500">Show not found</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">{show.name}</h2>
      <p className="text-gray-600 mb-4">
        {show.overview || "No description available."}
      </p>
      {show.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
          className="rounded mb-4"
        />
      )}
      <div className="mt-4">
        <p>Rating: {show.vote_average}</p>
        <p>First Air Date: {show.first_air_date}</p>
        <p>Number of Seasons: {show.number_of_seasons}</p>
        <p>Number of Episodes: {show.number_of_episodes}</p>
      </div>

      <div className="mt-6">
        <p className="mb-2">
          Current Watchlist Status:{" "}
          <span className="font-semibold">
            {watchlistInfo ? watchlistInfo.status : "Not in watchlist"}
          </span>
        </p>
        {watchlistInfo && watchlistInfo.status === "watched" && (
          <p className="mb-2">
            Your Rating: {watchlistInfo.rating || "No rating yet"}
          </p>
        )}

        <div className="flex items-center mb-2">
          <label className="mr-2">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-1 mr-2"
          >
            <option value="">Select Status</option>
            <option value="to_watch">To Watch</option>
            <option value="watching">Watching</option>
            <option value="watched">Watched</option>
          </select>
        </div>

        {status === "watched" && (
          <div className="flex items-center mb-2">
            <label className="mr-2">Your Rating (1-10):</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border rounded p-1 w-20"
            />
          </div>
        )}

        <button
          onClick={handleAddOrUpdateWatchlist}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          {watchlistInfo ? "Update Watchlist" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default ShowDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const ShowDetails = () => {
//   const { id } = useParams();
//   const [show, setShow] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     const fetchShowDetails = async () => {
//       try {
//         const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
//           headers: {
//             Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
//           },
//         });
//         setShow(res.data);
//       } catch (err) {
//         console.error("Error fetching show details", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShowDetails();
//   }, [id]);

//   // const handleAddToWatchlist = async () => {
//   //   if (!status) {
//   //     alert("Please select a status.");
//   //     return;
//   //   }
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     await axios.post(
//   //       "http://localhost:5000/api/watchlist",
//   //       {
//   //         showId: id,
//   //         status: status,
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );
//   //     alert(`Added to your ${status} list!`);
//   //   } catch (err) {
//   //     console.error("Error adding to watchlist", err);
//   //     console.error(
//   //       "Full error: ",
//   //       err.response?.data,
//   //       err.response?.status,
//   //       err.message
//   //     );
//   //     alert("Failed to add to watchlist");
//   //   }
//   // };

//   const handleAddOrUpdateWatchlist = async () => {
//     if (!status) {
//       alert("Please select a status.");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         "http://localhost:5000/api/watchlist",
//         {
//           showId: id,
//           status,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       alert(`Watchlist updated: ${status}`);
//     } catch (err) {
//       console.error("Error updating watchlist", err);
//       alert("Failed to update watchlist");
//     }
//   };

//   if (loading) {
//     return <div className="p-4 text-center">Loading show details...</div>;
//   }

//   if (!show) {
//     return <div className="p-4 text-center text-red-500">Show not found</div>;
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-3xl font-bold mb-2">{show.name}</h2>
//       <p className="text-gray-600 mb-4">
//         {show.overview || "No description available."}
//       </p>
//       {show.poster_path && (
//         <img
//           src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
//           alt={show.name}
//           className="rounded mb-4"
//         />
//       )}
//       <div className="mt-4">
//         <p>Rating: {show.vote_average}</p>
//         <p>First Air Date: {show.first_air_date}</p>
//         <p>Number of Seasons: {show.number_of_seasons}</p>
//         <p>Number of Episodes: {show.number_of_episodes}</p>
//       </div>

//       <div className="mt-6">
//         <label className="mr-2">Add to Watchlist:</label>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="border rounded p-1 mr-2"
//         >
//           <option value="">Select Status</option>
//           <option value="to_watch">To Watch</option>
//           <option value="watching">Watching</option>
//           <option value="watched">Watched</option>
//         </select>
//         <button
//           // onClick={handleAddToWatchlist}
//           onClick={handleAddOrUpdateWatchlist}
//           className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ShowDetails;
