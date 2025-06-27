import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";
import SearchPage from "./pages/SearchPage";
import RegisterPage from "./pages/Register";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/search" element={<SearchPage />} />
          {/* Add other routes later */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
