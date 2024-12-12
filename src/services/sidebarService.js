import axios from "axios";
import { apiEndpoints } from "./apiEndpoints";
import { getUserIdToken } from "./auth";

export const getUserAccessList = async () => {
  let token = getUserIdToken();
  return await axios.get(apiEndpoints.isAccessAll, {
    headers: {
      // Authorization: token,
      Authorization: "Bearer " + token,
    },
  });
};
