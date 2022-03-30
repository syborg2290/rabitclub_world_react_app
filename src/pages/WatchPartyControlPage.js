import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const WatchPartyControlPage = (props) => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
  }, []);

  return <div className="flex p-10 bg-dark m-10 rounded-md"></div>;
};

export default WatchPartyControlPage;
