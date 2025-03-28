
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkoutsProvider } from "./contexts/WorkoutsContext";

import "./App.css";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Workouts from "./pages/Workouts";
import Exercises from "./pages/Exercises";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <WorkoutsProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/history" element={<Layout><History /></Layout>} />
            <Route path="/workouts" element={<Layout><Workouts /></Layout>} />
            <Route path="/exercises" element={<Layout><Exercises /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WorkoutsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
