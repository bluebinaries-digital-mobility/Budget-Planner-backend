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

budgetAppRouter.get(
  "/view-budgetData",
  auth.verifyToken,
  budgetAppController.viewBudgetData
);

budgetAppRouter.get(
  "/view-budgetReport",
  auth.verifyToken,
  budgetAppController.viewBudgetReport
);

module.exports = budgetAppRouter;
