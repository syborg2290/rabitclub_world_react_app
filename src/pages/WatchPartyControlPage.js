import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { client, gun } from "../config";

const WatchPartyControlPage = (props) => {
  const location = useLocation();

  useEffect(() => {
    createWatchParty();
    // eslint-disable-next-line
  }, []);

  const createWatchParty = async () => {
    for (var i = 0; i < location.state.chunksArr.length; i++) {
      const blob = location.state.chunksArr[i];
      const blobCreated = await client.add(blob);
      let blobUrl = `https://ipfs.infura.io/ipfs/${blobCreated.path}`;
      let index = i;
      gun
        .get("watch_parties")
        .get("live")
        .get(location.state.userId)
        .get(location.state.watchpartyId)
        .map()
        .once((data, key) => {
          if (data) {
            const newObj = data;
            newObj.ipfsBlobUrlCount = newObj.ipfsBlobUrlCount + 1;
            gun.get(key).put(newObj);
            gun
              .get("watch_party_segments")
              .get(location.state.watchpartyId)
              .get(index)
              .set(blobUrl);
          }
        });
    }
  };

  const endWatchParty = () => {
    gun
      .get("watch_parties")
      .get("live")
      .get(location.state.userId)
      .get(location.state.watchpartyId)
      .back(3)
      .put("end");
  };

  return (
    <div className="flex p-10 bg-dark m-10 rounded-md">
      <button
        type="button"
        className="bg-backgroundColor-mainColor hover:opacity-75 w-full text-white font-semibold p-1 mt-5 rounded-md outline-none"
        onClick={endWatchParty}
      >
        {"End"}
      </button>
    </div>
  );
};

export default WatchPartyControlPage;
