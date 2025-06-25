const express = require("express");

const Watchlist = require("../models/Watchlist");

const authMiddleware = require("../middleware/authMiddleware"); // so only logged-in users can access these routes

const router = express.Router(); //allows you to define routes for /api/watchlist separately from index.js

// GET /api/watchlist/summary
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;

    const watched = await Watchlist.find({ userId, status: "watched" }).limit(
      10
    );
    const watching = await Watchlist.find({ userId, status: "watching" }).limit(
      10
    );
    const to_watch = await Watchlist.find({ userId, status: "to_watch" }).limit(
      10
    );

    res.json({ watched, watching, to_watch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  //post cuz adding show to watchlist, '/' → means the URL will be /api/watchlist, authMiddleware → checks token, sets req.user
  //'/' here and not the actual route cuz this is just he definition/logic of the route for this section, the global routing is set in the index folder
  try {
    const { showId, status, rating } = req.body; //Destructure from body → user sends { showId, status, rating } in JSON (how)

    //Check if this user already added this show, req.user → userId set by JWT middleware
    const exists = await Watchlist.findOne({
      userId: req.user,
      showId,
    });

    if (exists) {
      return res.status(400).json({ message: "Show already in watchlist" });
    }

    //Create new document using Watchlist model
    const newItem = new Watchlist({
      userId: req.user,
      showId,
      status,
      rating,
    });

    await newItem.save();

    return res.json(newItem); // use return here also (good practice)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  //authmiddleware is included here cuz it has to check if the user is legit or not so the middleware runs first then this route logic, it checks if the request has a valid JWT token; if valid: attaches req.user = userId (from decoded token) else sends a 404 code and stops flow

  //get cuz getting user watchlist
  try {
    const status = req.query.status; // ?status=watched, watching, to_watch, Optional filter → user can send: /api/watchlist → all items /api/watchlist?status=watched → only "watched" items; allows filtering

    //Build query for MongoDB, Always filter by userId → so each user sees their own list only If status provided → add to query
    const query = { userId: req.user };
    if (status) {
      query.status = status;
    }

    const list = await Watchlist.find(query);
    res.json(list); //Return the list to client
  } catch (err) {
    console.error(err);
    return res.send(400).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id; //document id in watchlist

    const deleted = await Watchlist.findOneAndDelete({
      _id: id,
      userId: req.user, //must match current user, Prevents other users from deleting your items
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  //put for updating status or rating
  try {
    //why not just send the id in body as well instead of sending via params
    const id = req.params.id;
    const { status, rating } = req.body;

    const updated = await Watchlist.findOneAndUpdate(
      { _id: id, userId: req.user },
      { status, rating },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
