import axios from "axios";
import { flask_server_baseUrl } from "../config";

export const watchPartyVideoUpload = async (file, watchPartyId) => {
  try {
    const data = new FormData();
    data.append(
      "file",
      new File([file], watchPartyId + ".mp4", { type: "video/mp4" })
    );
    data.append("filename", watchPartyId);
    const response = await axios.post(
      flask_server_baseUrl + "upload_watch_party",
      data
    );

    if (response.status === 200 && response.data === "done") {
      return "done";
    }

    return "undone";
  } catch (error) {
    return "Something went wrong, try again!";
  }
};

export const getVideoChunkAccTimestamp = async (id, startTime, endTime) => {
  try {
    const data = {
      watch_party_id: id,
      startTimestamp: startTime,
      endTimestamp: endTime,
    };
    const response = await axios.post(
      flask_server_baseUrl + "get_video_chunk",
      data
    );
    if (response.status === 200 && response.data.message === "done") {
      return response.data.result;
    }

    return "undone";
  } catch (error) {
    return "Something went wrong, try again!";
  }
};

export const watchPartyVideoChunkToBase64 = async (file, watchPartyId) => {
  try {
    const data = new FormData();
    data.append(
      "file",
      new File([file], watchPartyId + ".mp4", { type: "video/mp4" })
    );
    data.append("filename", watchPartyId);
    const response = await axios.post(
      flask_server_baseUrl + "video_chunk_base64",
      data
    );

    return response.data;
  } catch (error) {
    return "Something went wrong, try again!";
  }
};

export const removeVideoDataWatchparty = async (id) => {
  try {
    const data = {
      watch_party_id: id,
    };
    const response = await axios.post(
      flask_server_baseUrl + "remove_videodata_watchparty",
      data
    );
    if (response.status === 200 && response.data === "done") {
      return "done";
    }

    return "undone";
  } catch (error) {
    return "Something went wrong, try again!";
  }
};
