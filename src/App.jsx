import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import PageLoader from "./components/PageLoader"; // ⬅️ Import Loader

// Pages...
import Dashboard from "./pages/Dashboard";
import Alumni from "./pages/Alumni";
import Berita from "./pages/Berita";
import Testimoni from "./pages/Testimoni";
import Sebaran from "./pages/Sebaran";
import Analytics from "./pages/Analytics";
import Setting from "./pages/Setting";
import LoginPage from "./auth/LoginPage";

// Route proteksi login
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Komponen pembungkus untuk handle loader saat route berubah
const AppRoutesWithLoader = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 600); // delay minimal

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {isLoading && <PageLoader />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/alumni" element={<Alumni />} />
                  <Route path="/berita" element={<Berita />} />
                  <Route path="/testimoni" element={<Testimoni />} />
                  <Route path="/sebaran" element={<Sebaran />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/setting" element={<Setting />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutesWithLoader />
    </Router>
  );
}

export default App;
