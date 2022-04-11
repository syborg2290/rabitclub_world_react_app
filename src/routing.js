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
import WatchPartyControlPage from "./pages/WatchPartyControlPage";
import { setOnlineService } from "./services/user";
import AlertModalContext from "./context/AlertContext";
import AlertBox from "./components/common/AlertBox";
import AllUsersModal from "./components/AllUsersModal";
import AllUsersModalContext from "./context/AllUsersModalContext";

function Routing() {
  const location = useLocation();
  const user = useContext(UserContext);
  const alertContext = useContext(AlertModalContext);
  const allUsersContext = useContext(AllUsersModalContext);

  const changeStatusUser = async (status) => {
    await setOnlineService(status);
  };

  return (
    <div>
      <Online
        onChange={async (isOnline) => {
          await changeStatusUser(isOnline);
        }}
      >
        {!user.userLoading ? (
          <>
            <Header />
            {alertContext.showAlertModal && (
              <AlertBox
                show={alertContext.showAlertModal}
                setShow={alertContext.setShowAlertModal}
                alertText={alertContext.alertText}
              />
            )}

            {allUsersContext.showAllUsersModal && (
              <AllUsersModal
                show={allUsersContext.showAllUsersModal}
                setShow={allUsersContext.setShowAllUsersModal}
                user={user}
              />
            )}
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
              <Route
                exact
                path="/watch-party-room/"
                element={
                  user.user ? (
                    <WatchPartyControlPage user={user} />
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
      <Offline
        onChange={async (isOnline) => {
          await changeStatusUser(isOnline);
        }}
      >
        <NoInternetConnectionPage />
      </Offline>
    </div>
  );
}

export default Routing;
