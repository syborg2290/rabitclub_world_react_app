import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthModal from "./components/AuthModal";
// import NewPinModal from "./components/NewPinModal";
import AuthModalContext from "./context/AuthModalContext";
import {
  getUserService,
  logoutService,
  setLoggedService,
  setOnlineRequestTimeService,
  setOnlineService,
} from "./services/user";
import UserContext from "./context/UserContext";
import Routing from "./routing";
import NewPinModalContext from "./context/NewPinModalContext";
import PreviousActionContext from "./context/PreviousActionContext";
import AlertModalContext from "./context/AlertContext";
import AllUsersModalContext from "./context/AllUsersModalContext";
import ForgotPasswordModal from "./components/ForgotPasswordModal";

function App() {
  const MINUTE_MS = 60000;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showAllUsersModal, setShowAllUsersModal] = useState(false);
  const [alertText, setAlertText] = useState("");
  // const [showNewPinModal, setShowNewPinModal] = useState(false);
  const [previousAction, setPreviousAction] = useState({});
  const [viewport, setViewport] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUser();
    const interval = setInterval(async () => {
      if (user) {
        await setOnlineRequestTimeService();
      }
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    // eslint-disable-next-line
  }, []);

  const getUser = async () => {
    const res = await getUserService();
    if (res.status === true) {
      setUserId(res.result.id);
      setUser(res.result.username);
      setUserData(res.result.userData);
      setUserLoading(false);
    } else {
      setUserLoading(false);
    }
  };

  const logout = async () => {
    const resSetOnline = await setOnlineService(false);
    if (resSetOnline["status"] === true) {
      const resSetLogged = await setLoggedService(false);
      if (resSetLogged["status"] === true) {
        localStorage.setItem("logoutStatus", "true");
        await logoutService();
        setUser(null);
        setUserId(null);
      }
    }
  };

  return (
    <AuthModalContext.Provider
      value={{
        show: showAuthModal,
        setShow: setShowAuthModal,
        showForgotPassword: showForgotPasswordModal,
        setShowForgotPassword: setShowForgotPasswordModal,
      }}
    >
      <NewPinModalContext.Provider
        value={{
          // show: showNewPinModal,
          // setShow: setShowNewPinModal,
          setViewport,
          viewport,
          setCoordinates,
          coordinates,
        }}
      >
        <UserContext.Provider
          value={{
            user,
            userId,
            logout,
            setUser,
            setUserId,
            userData,
            setUserData,
            userLoading,
          }}
        >
          <PreviousActionContext.Provider
            value={{
              setPreviousAction,
              previousAction,
            }}
          >
            <AlertModalContext.Provider
              value={{
                setShowAlertModal,
                showAlertModal,
                setAlertText,
                alertText,
              }}
            >
              <AllUsersModalContext.Provider
                value={{
                  setShowAllUsersModal,
                  showAllUsersModal,
                }}
              >
                <BrowserRouter>
                  <Routing />
                  <AuthModal />
                  <ForgotPasswordModal
                    show={showForgotPasswordModal}
                    setShow={setShowForgotPasswordModal}
                    showAuth={showAuthModal}
                    setShowAuth={setShowAuthModal}
                  />
                  {/* <NewPinModal /> */}
                </BrowserRouter>
              </AllUsersModalContext.Provider>
            </AlertModalContext.Provider>
          </PreviousActionContext.Provider>
        </UserContext.Provider>
      </NewPinModalContext.Provider>
    </AuthModalContext.Provider>
  );
}

export default App;
