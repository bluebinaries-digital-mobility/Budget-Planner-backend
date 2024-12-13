import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
} from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import CommonOutlet from "../components/CommonOutlet/CommonOutlet";
import routePath from "./routePath";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import Authentication from "../pages/Authentication/Authentication";
import UnAuthroized from "../pages/UnAuthorized/UnAuthroized";
import AllBudgetList from "../pages/AllBudgetList/AllBudgetList";
import BudgetView from "../pages/BudgetView/BudgetView";
import BudgetSheet from "../pages/BudgetSheet/BudgetSheet";

const AppRoutes = () => {
  useEffect(() => {
    const getLocalStorageValue = localStorage.getItem("theme-mode");

    if (
      getLocalStorageValue === "light-mode" ||
      getLocalStorageValue === null
    ) {
      document.getElementsByTagName("body")[0].classList.add("light-theme");
      document.getElementsByTagName("body")[0].classList.remove("dark-theme");
    } else {
      document.getElementsByTagName("body")[0].classList.add("dark-theme");
      document.getElementsByTagName("body")[0].classList.remove("light-theme");
    }
  }, []);
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<PageNotFound />}></Route>
        <Route path={routePath.auth} element={<Authentication />} />
        <Route path={routePath.unAuthorized} element={<UnAuthroized />} />

        <Route
          path="/"
          element={
            <PrivateRoutes>
              <CommonOutlet />
            </PrivateRoutes>
          }
        >
          <Route path={routePath.root} element={<BudgetSheet />} />
          <Route path={routePath.budgetSheet} element={<BudgetSheet />} />
          <Route path={routePath.budgetView} element={<BudgetView />} />
          <Route path={routePath.allBudgetList} element={<AllBudgetList />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
