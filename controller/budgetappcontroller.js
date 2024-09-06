const nodeEnvConfig = require("../nodeEnvConfig");
nodeEnvConfig.envConfig();
const path = require("path");

// Import service functions
const {
  getDepartmentFilterService,
  getPraticeFilterService,
  getCustomerFilterService,
  addBudgetDataService,
  viewReportService,
  viewBudgetDataService,
  getSessionService,
  viewReportExportService,
  viewBudgetDataExportService,
  getMailId,
} = require("../service/budgetappservice");
const { CLIENT_RENEG_LIMIT } = require("tls");

/**
 * Controller to get tickets assigned to the user ID (Tickets Assigned to me)
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getDepartmentName = async (req, res) => {
  try {
    const department = await getDepartmentFilterService();
    return res.status(200).json({ statusCode: 200, success: true, department });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// Get Practice Name from DB bhub database
const getPraticeName = async (req, res) => {
  try {
    const { id } = req.query;
    const practice = await getPraticeFilterService(id);
    return res.status(200).json({ statusCode: 200, success: true, practice });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// Get customer Name from DB bhub database
const getCustomerName = async (req, res) => {
  try {
    const customer = await getCustomerFilterService();
    return res.status(200).json({ statusCode: 200, success: true, customer });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// Add Budget Data from DB budget master database
const addBudgetData = async (req, res) => {
  try {
    const data = req.body;
    const created_by = req.user.emailAddress;
    const tickets = await addBudgetDataService(data, created_by);
    return res.status(200).json({ statusCode: 200, success: true, tickets });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// view Budget Data from DB budget master and budget child database based on email
const viewBudgetData = async (req, res) => {
  try {
    const created_by = req.user.emailAddress;
    console.log("created_by", created_by);
    const viewData = await viewBudgetDataService(created_by);
    return res.status(200).json({ statusCode: 200, success: true, viewData });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// view Budget Data from DB budget master and budget child database
const exportBudgetData = async (req, res) => {
  try {
    const created_by = req.user.emailAddress;
    const tickets = await viewBudgetDataExportService(created_by);
    return res.status(200).json({ statusCode: 200, success: true, tickets });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// view Budget Data from DB budget master and budget child database
const viewBudgetReport = async (req, res) => {
  try {
    const tickets = await viewReportService();
    return res.status(200).json({ statusCode: 200, success: true, tickets });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// view Budget Data from DB budget master and budget child database
const exportBudgetReport = async (req, res) => {
  try {
    const tickets = await viewReportExportService();
    return res.status(200).json({ statusCode: 200, success: true, tickets });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

// view Budget Data from DB budget master and budget child database
const getAccessMailId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mailId = await getMailId(userId);
    return res.status(200).json({ statusCode: 200, success: true, mailId });
  } catch (err) {
    console.error("Error getting department:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, Please try later.",
      err,
    });
  }
};

/**
 * Controller to get token to check the session in front end
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getSession = async (req, res) => {
  try {
    const result = await getSessionService(req, res);
    if (!result) {
      return res.status(500).json({
        statusCode: 500,
        error: true,
        message: "Something went wrong, Please try later.",
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        error: false,
        response: result,
      });
    }
  } catch (err) {
    res.status(500).send({
      statusCode: 500,
      error: true,
      message: "Something went wrong, Please try later.",
    });
  }
};

// Export controller methods
module.exports = {
  getDepartmentName,
  getPraticeName,
  getCustomerName,
  addBudgetData,
  viewBudgetData,
  getSession,
  exportBudgetData,
  viewBudgetReport,
  exportBudgetReport,
  getAccessMailId,
};
