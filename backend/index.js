require("dotenv").config();

const express = require("express"); //importing express module
const authRoutes = require("./routes/authRoutes");
const cors = require("cors"); //importing cors module
const mongoose = require("mongoose");
const app = express(); //creating an instance of express

const port = process.env.PORT; //defining the port number

// const authMiddleware = require("./middleware/authMiddleware");

const watchlistRoutes = require("./routes/watchlistRoutes");

app.use(cors());
app.use(express.json()); //express.json() is a middleware, automatically parse JSON from incoming (request is client sending  data to the server) request bodies, needed to parse incoming requests in json from react/postman which will be used later (for eg, as used in const { username, email, password } = req.body;), basically parses the incoming requests with json payloads and puts the parsed data into req.body

{
  /* <form onSubmit={handleRegister}>
  <input name="username" />
  <input name="email" />
  <input name="password" />
  <button type="submit">Register</button>
</form>; */
  // the data entered above is "handled by the below code as part of controlled forms in react"
  //the data extracted is then put in a response body JSON'fied and sends to backend, this whole thing is accepted as request (req.body) in the backend, the backend sends back data as res.[send()/json()/status(code)]
  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   const newUser = {
  //     username,
  //     email,
  //     password,
  //   };
  //   const res = await fetch("https://yourserver.com/auth/register", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(newUser), // ← This is the request body!
  //   });
  //   const data = await res.json();
  //   console.log(data);
  // };
}

app.get("/", (req, res) => {
  res.send("T.V. Tracker API is running!"); //respond is sent when root page is accessed
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes); //"use" lets u mount middleware functions or assign routers to specific paths, latter has been done here

// app.get("/api/watchlist", authMiddleware, (req, res) => {
//   res.json({
//     message: `Hello user ${req.user}, here is your watchlist!`,
//   });
// });

app.use("/api/watchlist", watchlistRoutes);

app.listen(port, () => {
  console.log("Server is running on localhost");
});
