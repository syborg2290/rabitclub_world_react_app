import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthModal from "./components/AuthModal";
// import NewPinModal from "./components/NewPinModal";
import AuthModalContext from "./context/AuthModalContext";
import { getUserService, logoutService } from "./services/user";
import UserContext from "./context/UserContext";
import Routing from "./routing";
import NewPinModalContext from "./context/NewPinModalContext";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  // const [showNewPinModal, setShowNewPinModal] = useState(false);
  const [viewport, setViewport] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);

  const getUser = async () => {
    const res = await getUserService();
    if (res.status === true) {
      setUser(res.result);
    }
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
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
            logout,
            setUser,
          }}
        >
          <BrowserRouter>
            <Routing />
            <AuthModal />
            {/* <NewPinModal /> */}
          </BrowserRouter>
        </UserContext.Provider>
      </NewPinModalContext.Provider>
    </AuthModalContext.Provider>
  );
}

export default App;
