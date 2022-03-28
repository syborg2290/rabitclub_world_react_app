import { useContext } from "react";
import { Offline, Online } from "react-detect-offline";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import UserContext from "./context/UserContext";
import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";
import NewLocationPage from "./pages/NewLocationPage";
import NoInternetConnectionPage from "./pages/NoInternetConnectionPage";
import ProfilePage from "./pages/ProfilePage";
import PinPage from "./pages/PinPage";
import WatchPartyPage from "./pages/WatchPartyPage";

function Routing() {
  const location = useLocation();
  const user = useContext(UserContext);

  return (
    <div>
      <Online>
        {!user.userLoading ? (
          <>
            <Header />
            <Routes location={location}>
              <Route exact path="/" element={<HomePage />} />
              <Route
                exact
                path="/account"
                element={
                  user.user ? <ProfilePage user={user} /> : <Navigate to="/" />
                }
              />
              <Route
                exact
                path="/new-location/"
                element={
                  user.user ? (
                    <NewLocationPage user={user} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                exact
                path="/pin/"
                element={
                  user.user ? <PinPage user={user} /> : <Navigate to="/" />
                }
              />
              <Route
                exact
                path="/watch-party/"
                element={
                  user.user ? (
                    <WatchPartyPage user={user} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <LoadingPage />
        )}
      </Online>
      <Offline>
        <NoInternetConnectionPage />
      </Offline>
    </div>
  );
}

export default Routing;
