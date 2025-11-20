
import "./styles/font-setup.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import About from "./pages/About";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import NavBar from "./layout/NavBar";
import Footer from "./layout/Footer";
import DashBoard from "./Components/DashBoard";
import SignOut from "./Components/SignOut";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { storeContext } from "./context/storeContext"
import "react-toastify/dist/ReactToastify.css";

function App() {

  const { isAuth } = useContext(storeContext)
  return (
    <Router>
      <NavBar />
      <ToastContainer/>
        
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={ isAuth ? <DashBoard /> : <Login />} />
            <Route path="/dashboard" element={isAuth ?<DashBoard />: <Login/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/signout" element={isAuth ? <SignOut /> : <SignOut />} />
            <Route path="/profile" element={isAuth ? <Profile /> : <Login />} />
          </Routes>
        <Footer />
    </Router>
  );
}

export default App;
