import axios from "axios";
import { apiEndpoints } from "./apiEndpoints";
import { getUserIdToken } from "./auth";

export const getDepartmentData = async () => {
  let token = getUserIdToken();
  return await axios.get(apiEndpoints.departmentFilter, {
    headers: {
      // Authorization: token,
      Authorization: "Bearer " + token,
    },
  });
};
export const getPracticeData = async (id) => {
  //   return await axios.get(
  //     `http://localhost:3000/budget-app/practice-filter?id=${id}`
  //   );
  // return await axios.get(`${apiEndpoints.practiceFilter}?id=${id}`);

  let token = getUserIdToken();
  return await axios.get(`${apiEndpoints.practiceFilter}?id=${id}`, {
    headers: {
      // Authorization: token,
      Authorization: "Bearer " + token,
    },
  });
};
export const getCustomerData = async () => {
  let token = getUserIdToken();
  return await axios.get(apiEndpoints.customerFilter, {
    headers: {
      // Authorization: token,
      Authorization: "Bearer " + token,
    },
  });
};
export const saveBudgetData = async (data) => {
  let token = getUserIdToken();
  return await axios.post(apiEndpoints.saveFilter, data, {
    headers: {
      // Authorization: token,
      Authorization: "Bearer " + token,
    },
  });
};
