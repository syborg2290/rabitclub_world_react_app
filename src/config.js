import Gun from "gun";

export const api_baseUrl = "http://localhost:4000/";

export const gun = Gun({
  peers: ["http://localhost:8000/gun"], // Put the relay node that you want here
});
