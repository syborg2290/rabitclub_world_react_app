import axios from "axios";
import { api_baseUrl } from "../config";

export const registerService = async (email, password, username) => {
  try {
    const data = { email, password, username };
    const response = await axios.post(api_baseUrl + "register", data, {
      withCredentials: true,
    });
    if (
      response.statusCode === 500 ||
      response.statusCode === 400 ||
      response.statusCode === 404
    ) {
      return { status: false, result: "Something went wrong, try again!" };
    }

    if (response.data["message"] === "done") {
      return { status: true, result: response.data["user"] };
    }
    return { status: false, result: response.data["message"] };
  } catch (error) {
    return { status: false, result: "Something went wrong, try again!" };
  }
};

export const loginService = async (username, password) => {
  try {
    const data = { username, password };
    const response = await axios.post(api_baseUrl + "login", data, {
      withCredentials: true,
    });
    if (
      response.statusCode === 500 ||
      response.statusCode === 400 ||
      response.statusCode === 404
    ) {
      return { status: false, result: "Something went wrong, try again!" };
    }

    if (response.data["message"] === "done") {
      return { status: true, result: response.data["user"] };
    }
    return { status: false, result: response.data["message"] };
  } catch (error) {
    return { status: false, result: "Something went wrong, try again!" };
  }
};

export const getUserService = async () => {
  try {
    const response = await axios.get(api_baseUrl + "user", {
      withCredentials: true,
    });
    if (
      response.statusCode === 500 ||
      response.statusCode === 400 ||
      response.statusCode === 404
    ) {
      return { status: false, result: "Something went wrong, try again!" };
    }

    if (response.data["message"] === "done") {
      return {
        status: true,
        result: {
          id: response.data["id"],
          username: response.data["user"],
          userData: response.data["userData"],
        },
      };
    }
    return { status: false, result: response.data["message"] };
  } catch (error) {
    return { status: false, result: "Something went wrong, try again!" };
  }
};

export const getUserFromIdService = async (id) => {
  try {
    const response = await axios.get(api_baseUrl + "user/" + id, {
      withCredentials: true,
    });
    if (
      response.statusCode === 500 ||
      response.statusCode === 400 ||
      response.statusCode === 404
    ) {
      return { status: false, result: "Something went wrong, try again!" };
    }

    if (response.data["message"] === "done") {
      return {
        status: true,
        result: {
          user: response.data["user"],
        },
      };
    }
    return { status: false, result: response.data["message"] };
  } catch (error) {
    return { status: false, result: "Something went wrong, try again!" };
  }
};

export const logoutService = async () => {
  try {
    await axios.get(api_baseUrl + "logout", {
      withCredentials: true,
    });
  } catch (error) {
    return { status: false, result: "Something went wrong, try again!" };
  }
};

export const updateCoverPicService = async (url) => {
  try {
    const data = { url };
    const response = await axios.post(api_baseUrl + "update_cover", data, {
      withCredentials: true,
    });
    if (
      response.statusCode === 500 ||
      response.statusCode === 400 ||
      response.statusCode === 404
    ) {
      return { status: false, result: "Something went wrong, try again!" };
    }

    if (response.data["message"] === "done") {
      return { status: true, result: response.data["result"] };
    }
    return { status: false, result: response.data["message"] };
  } catch (error) {
    return { status: false, result: "Something went wrong, try again!" };
  }
};

export const updateProfileService = async (email, bio, url) => {
  try {
    const data = { email, bio, url };
    const response = await axios.post(api_baseUrl + "update_profile", data, {
      withCredentials: true,
    });
    if (
      response.statusCode === 500 ||
      response.statusCode === 400 ||
      response.statusCode === 404
    ) {
      return { status: false, result: "Something went wrong, try again!" };
    }

    if (response.data["message"] === "done") {
      return { status: true, result: response.data["result"] };
    }
    return { status: false, result: response.data["message"] };
  } catch (error) {
    return { status: false, result: "Something went wrong, try again!" };
  }
};
