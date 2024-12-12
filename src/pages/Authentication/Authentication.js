import React, { useEffect } from "react";

import { Loader } from "../../utils/Images";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import routePath from "../../routes/routePath";
import { USER_ID_TOKEN_BUDGET } from "../../constant/auth";

function Authentication() {
  const params = useParams();
  const navigate = useNavigate();
  const sectionUrl =
    process.env.REACT_APP_API_BASE_URL + "/budget-app/get-session";

  const header = {
    headers: {
      Authorization: "Bearer " + params?.id,
    },
  };
  console.log("sectionUrl", sectionUrl, header);
  useEffect(() => {
    axios
      .get(sectionUrl, header)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem(USER_ID_TOKEN_BUDGET, params?.id);
          localStorage.setItem(
            "USER_ACCESS",
            response?.data?.currentUserAccess
          );
          navigate(routePath?.budgetSheet);
        } else {
          navigate(routePath?.unAuthorized);
        }
      })
      .catch((err) => {
        navigate(routePath?.unAuthorized);
      });
  }, []);

  return (
    <div className="authentication-container">
      <div className="authenticate-loader">
        <div className="loader-img">
          <img src={Loader.imgFile} alt={Loader.imgName} />
        </div>
        <span>Loading...</span>
      </div>
    </div>
  );
}

export default Authentication;
