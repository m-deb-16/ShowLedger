const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //type: ObjectId → this field stores an ID that refers to another collection → the User
      // ref: 'User' → means this points to documents in the User collection (foreign key / relation)
      required: true,
    },
    showId: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["to_watch", "watching", "watched"], //enum → only allows these 3 values, can also query by status.
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      //min max is provided by mongoose
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);
