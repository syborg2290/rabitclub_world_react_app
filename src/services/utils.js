import axios from "axios";
import { api_baseUrl } from "../config";

export const getCurrentDateService = async () => {
  try {
    const response = await axios.get(api_baseUrl + "getServerDate");
    if (
      response.statusCode === 500 ||
      response.statusCode === 400 ||
      response.statusCode === 404
    ) {
      return "Something went wrong, try again!";
    }

    return response.data;
  } catch (error) {
    return "Something went wrong, try again!";
  }
};
