import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthModal from "./components/AuthModal";
// import NewPinModal from "./components/NewPinModal";
import AuthModalContext from "./context/AuthModalContext";
import { getUserService, logoutService } from "./services/user";
import UserContext from "./context/UserContext";
import Routing from "./routing";
import NewPinModalContext from "./context/NewPinModalContext";
import PreviousActionContext from "./context/PreviousActionContext";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  // const [showNewPinModal, setShowNewPinModal] = useState(false);
  const [previousAction, setPreviousAction] = useState({});
  const [viewport, setViewport] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);

  const getUser = async () => {
    const res = await getUserService();
    if (res.status === true) {
      setUserId(res.result.id);
      setUser(res.result.username);
    }
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    setUserId(null);
  };

  return (
    <AuthModalContext.Provider
      value={{
        show: showAuthModal,
        setShow: setShowAuthModal,
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
          }}
        >
          <PreviousActionContext.Provider
            value={{
              setPreviousAction,
              previousAction,
            }}
          >
            <BrowserRouter>
              <Routing />
              <AuthModal />
              {/* <NewPinModal /> */}
            </BrowserRouter>
          </PreviousActionContext.Provider>
        </UserContext.Provider>
      </NewPinModalContext.Provider>
    </AuthModalContext.Provider>
  );
}

export default App;
