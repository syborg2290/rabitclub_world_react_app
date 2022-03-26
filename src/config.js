import Gun from "gun";
import { create } from "ipfs-http-client";

export const api_baseUrl = "http://localhost:4000/";

export const gun = Gun({
  peers: ["http://localhost:8000/gun"], // Put the relay node that you want here
});

export const client = create("https://ipfs.infura.io:5001/api/v0");
