import { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import UserContext from "./context/UserContext";
import HomePage from "./pages/HomePage";
import NewLocationPage from "./pages/NewLocationPage";

function Routing() {
  const location = useLocation();
  const user = useContext(UserContext);

  return (
    <div>
      <Header />
      <Routes location={location}>
        <Route exact path="/" element={<HomePage />} />
        <Route
          exact
          path="/new-location/"
          element={<NewLocationPage user={user} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default Routing;
