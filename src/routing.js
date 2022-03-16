import { useContext } from "react";
import { Offline, Online } from "react-detect-offline";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import UserContext from "./context/UserContext";
import HomePage from "./pages/HomePage";
import NewLocationPage from "./pages/NewLocationPage";
import NoInternetConnectionPage from "./pages/NoInternetConnectionPage";
import ProfilePage from "./pages/ProfilePage";

function Routing() {
  const location = useLocation();
  const user = useContext(UserContext);

  return (
    <div>
      <Online>
        <Header />
        <Routes location={location}>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/account" element={<ProfilePage user={user} />} />
          <Route
            exact
            path="/new-location/"
            element={<NewLocationPage user={user} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Online>
      <Offline>
        <NoInternetConnectionPage />
      </Offline>
    </div>
  );
}

export default Routing;
