const express = require("express");
const fs = require("fs");
const multer = require("multer");
const budgetAppRouter = express.Router();
const budgetAppController = require("../controller/budgetappcontroller");
const auth = require("../middleware/authentication");

// Getting assigned tickets

budgetAppRouter.get(
  "/get-session",
  auth.verifyToken,
  budgetAppController.getSession
);

budgetAppRouter.get(
  "/department-filter",
  auth.verifyToken,
  budgetAppController.getDepartmentName
);

budgetAppRouter.get(
  "/practice-filter",
  auth.verifyToken,
  budgetAppController.getPraticeName
);

budgetAppRouter.get(
  "/customer-filter",
  auth.verifyToken,
  budgetAppController.getCustomerName
);

budgetAppRouter.post(
  "/add-budgetData",
  auth.verifyToken,
  budgetAppController.addBudgetData
);

//My Submitted budget
//List
budgetAppRouter.get(
  "/view-budgetData",
  auth.verifyToken,
  budgetAppController.viewBudgetData
);

//Export
budgetAppRouter.get(
  "/export-budgetData",
  auth.verifyToken,
  budgetAppController.exportBudgetData
);

//Report
//List
budgetAppRouter.get(
  "/view-budgetReport",
  auth.verifyToken,
  budgetAppController.viewBudgetReport
);

//Export
budgetAppRouter.get(
  "/export-budgetReport",
  auth.verifyToken,
  budgetAppController.exportBudgetReport
);

//Export
budgetAppRouter.get(
  "/getAccessMailId",
  auth.verifyToken,
  budgetAppController.getAccessMailId
);

module.exports = budgetAppRouter;
