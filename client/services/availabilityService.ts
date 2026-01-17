import API from "./api";

export const addAvailability = (data: any) =>
  API.post("/availability", data);

export const getAvailability = () =>
  API.get("/availability");
