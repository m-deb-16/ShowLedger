import { useNavigate } from "react-router-dom";

const ShowCard = ({ show }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/show/${show.id}`);
  };

  return (
    <div
      className="border rounded p-2 shadow cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      <h3 className="font-semibold">{show.name}</h3>
      <p className="text-sm text-gray-600">Rating: {show.vote_average}</p>
      {show.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
          alt={show.name}
          className="mt-2 rounded"
        />
      ) : (
        <p className="text-sm text-gray-400">No image available</p>
      )}
    </div>
  );
};

export default ShowCard;
