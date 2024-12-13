import UserIcon from "../../assets/images/user.png";
import InhouseImg from "../../assets/images/reports.png";
import submitImg from "../../assets/images/Submitted Budget.png";
import budgetPlan from "../../assets/images/budgetPlan.png";
import { NavLink, useNavigate } from "react-router-dom";
import routePath from "../../routes/routePath";
import { decodeUser } from "../../services/auth";
import { useEffect, useState } from "react";
import { getUserAccessList } from "../../services/sidebarService";
// import { decodeUser } from "../../constants/decryptToken.js";
// import jwtDecode from "jwt-decode";

const Sidebar = () => {
  const [accessUser, setAccessUser] = useState(false);
  const navigate = useNavigate();

  // const accessUser = [
  //   "devanshi.jadav@yopmail.com",
  //   "kishore@bluebinaries.com",
  //   "Venkatesh.Krishnan@bluebinaries.com",
  //   "sreekanth.mallampati@bluebinaries.com",
  //   "puttaiah.bellamkonda@bluebinaries.com",
  //   // "natesan.ramanathan@bluebinaries.com",
  //   // "pravin.s@bluebinaries.com",
  // ];
  let tokenDetails = decodeUser();

  useEffect(() => {
    getUserAccessList()
      .then((res) => {
        console.log("res", res);
        if (res.status === 200 && res.data) {
          setAccessUser(res.data.userAccess?.super_access);
        }
      })
      .catch((err) => {
        console.log("err", err);
        // navigate(routePath.unAuthorized)
      });
  }, []);
  return (
    <div className="sidebar-container">
      <div className="sidebar-body">
        <div className="user-con">
          <img src={UserIcon} alt="user" />
          <span>{tokenDetails?.userFullName}</span>
          <span>{tokenDetails?.roleName}</span>
        </div>

        <NavLink
          to={routePath.budgetSheet}
          // activeClassName="active"
          // className={({ isActive }) => (isActive ? "active" : "inactive")}
        >
          <div className="project-con">
            <img src={budgetPlan} alt="project" />
            <span>Plan The Budget</span>
          </div>
        </NavLink>
        <NavLink to={routePath.budgetView}>
          <div className="project-con">
            <img src={submitImg} alt="project" />
            <span>My Submitted Budget</span>
          </div>
        </NavLink>
        {accessUser === 1 && (
          <NavLink to={routePath.allBudgetList}>
            <div className="project-con">
              <img src={InhouseImg} alt="project" />
              <span>Reports</span>
            </div>
          </NavLink>
        )}
        {/* <div className="project-con">
          <img src={helpIcon} alt="project" />
          <span>System User Guide</span>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
