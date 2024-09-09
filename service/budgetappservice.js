const mysqlConnection = require("../config/mySqlconnection");
const moment = require("moment");
const nodeEnvConfig = require("../nodeEnvConfig");
nodeEnvConfig.envConfig();
let datetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql");

/**
 * Service to get department filter for budget app
 * @param {number} userId - The ID of the user
 * @returns {Promise} - A promise that resolves with the list of tickets including the assigned user's name and comments
 */
const getDepartmentFilterService = async () => {
  return new Promise((resolve, reject) => {
    const query = `
         SELECT * FROM main_businessunits WHERE isactive='1'
        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(
          new Error(`getDepartmentFilterService query failed: ${err.message}`)
        );
      }
      resolve(result);
    });
  });
};

/**
 * Service to get
 * @param {number} userId - The ID of the user
 * @returns {Promise} - A promise that resolves with the list of tickets including the assigned user's name and comments
 */
const getPraticeFilterService = async (unitId) => {
  return new Promise((resolve, reject) => {
    console.log(unitId, "id");
    const query = `
SELECT * FROM main_departments WHERE isactive='1' AND unitid='${unitId}';        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(
          new Error(`getPracticeFilterService query failed: ${err.message}`)
        );
      }
      resolve(result);
    });
  });
};

/**
 * Service to get
 * @param {number} userId - The ID of the user
 * @returns {Promise} - A promise that resolves with the list of tickets including the assigned user's name and comments
 */
const getCustomerFilterService = async () => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT DISTINCT(client_name), id AS client_id, project_client_code, poc FROM tm_clients WHERE is_active = 1 GROUP BY client_name ORDER BY client_name ASC;
        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(
          new Error(`getCustomerFilterService query failed: ${err.message}`)
        );
      }
      resolve(result);
    });
  });
};

const addBudgetDataService = async (data, created_by) => {
  return new Promise((resolve, reject) => {
    const is_active = true;
    const query = `
       INSERT INTO budget_master (region, business_function, practice_name, cost_center_owner, project_name, customer, customer_type, currency, financial_year, f_quarter, created_on, is_active,created_by)
       VALUES (
        ${mysql.escape(data.region)}, 
        ${mysql.escape(data.business_function)}, 
        ${mysql.escape(data.practice_name)}, 
        ${mysql.escape(data.cost_center_owner)}, 
        ${mysql.escape(data.project_name)}, 
        ${mysql.escape(data.customer)}, 
        ${mysql.escape(data.customer_type)}, 
        ${mysql.escape(data.currency)}, 
        ${mysql.escape(data.financial_year)}, 
        ${mysql.escape(data.f_quarter)}, 
        ${mysql.escape(datetime)}, 
        ${mysql.escape(is_active)},
        ${mysql.escape(created_by)}

     )
        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(new Error(`add budget query failed: ${err.message}`));
      }
      const newId = result.insertId;
      console.log("Newly inserted row ID:", newId);
      const promises = [];

      for (let i = 0; i < data.child.length; i++) {
        // Define the SQL query with placeholders
        const query = `
          INSERT INTO budget_child 
          (master_Id, budget_type, item_description, cost_center, month_1, month_2, month_3, budget_total, remarks, created_on, created_by, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Define the values to insert using parameterized query
        const values = [
          newId,
          data.child[i].budget_type,
          data.child[i].item_description,
          data.child[i].cost_center,
          !data.child[i].month_1 ? 0 : parseFloat(data.child[i].month_1),
          !data.child[i].month_2 ? 0 : parseFloat(data.child[i].month_2),
          !data.child[i].month_3 ? 0 : parseFloat(data.child[i].month_3),
          !data.child[i].budget_total
            ? 0
            : parseFloat(data.child[i].budget_total),
          data.child[i].remarks,
          datetime, // Assume datetime is defined elsewhere
          created_by,
          is_active, // Assume is_active is defined elsewhere
        ];

        // Push each promise to an array
        promises.push(
          new Promise((resolve, reject) => {
            mysqlConnection.query(query, values, (err, result) => {
              if (err) {
                return reject(
                  new Error(`Add budget query failed: ${err.message}`)
                );
              }
              console.log(result, "lll");
              resolve(result);
            });
          })
        );
      }

      console.log(result, "lll");
      resolve(result);
    });
  });
};

const updateBudgetDataService = async () => {
  return new Promise((resolve, reject) => {
    const query = `
         SELECT
           id AS client_id,
           client_name,
           project_client_code,
           poc
         FROM tm_clients
         WHERE is_active = 1
         ORDER BY client_name ASC;
        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(new Error(`update budget query failed: ${err.message}`));
      }
      resolve(result);
    });
  });
};

const viewBudgetDataService = async (created_by) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
     budget_master.region AS region, 
      budget_master.business_function AS business_function, 
      budget_master.practice_name AS practice_name, 
      budget_master.cost_center_owner AS cost_center_owner, 
      budget_master.project_name AS project_name,  
      budget_master.currency AS currency, 
      budget_child.budget_type AS budget_type, 
      budget_child.item_description AS item_description, 
      budget_child.cost_center AS cost_center, 
      FORMAT(budget_child.month_1, 2) AS month_1, 
      FORMAT(budget_child.month_2, 2) AS month_2, 
      FORMAT(budget_child.month_3, 2) AS month_3, 
      FORMAT(budget_child.budget_total, 2) AS budget_total,
      budget_child.remarks AS remarks,
      budget_master.created_by AS created_by,
      DATE_FORMAT(budget_master.created_on, '%d-%m-%Y %H:%i:%s') AS created_on
        FROM 
          budget_master 
        LEFT JOIN 
            budget_child 
        ON 
            budget_child.master_Id = budget_master.id
        WHERE budget_master.created_by = ${mysql.escape(
          created_by
        )} ORDER BY budget_master.id ASC;
        `;
    mysqlConnection.query(query, (err, result) => {
      console.log(query, "queryquery");
      if (err) {
        return reject(new Error(`update budget query failed: ${err.message}`));
      }
      // console.log(result, "lll");
      resolve(result);
    });
  });
};

// budget_master.customer AS Customer,
// budget_master.customer_type AS Customer_Type,
const viewBudgetDataExportService = async (created_by) => {
  return new Promise((resolve, reject) => {
    const query = `
       SELECT 
       budget_master.region AS Region, 
      budget_master.business_function AS Business_Function, 
      budget_master.practice_name AS Department_Practice_Name, 
      budget_master.cost_center_owner AS Cost_Center_Owner, 
      budget_master.project_name AS Project_Name,  
      budget_master.currency AS Currency, 
      budget_child.budget_type AS Budget_Type, 
      budget_child.item_description AS Item_Description, 
      budget_child.cost_center AS Cost_Center, 
      REPLACE(FORMAT(budget_child.month_1, 2), ',', '') AS "Oct-24", 
      REPLACE(FORMAT(budget_child.month_2, 2), ',', '') AS "Nov-24", 
      REPLACE(FORMAT(budget_child.month_3, 2), ',', '') AS "Dec-24", 
      REPLACE(FORMAT(budget_child.budget_total, 2), ',', '') AS Q3_Budget,
      budget_child.remarks AS Remarks,
      budget_master.created_by AS Created_By,
       DATE_FORMAT(budget_master.created_on, '%d-%m-%Y %H:%i:%s') AS Created_On
          FROM 
              budget_master 
          LEFT JOIN 
              budget_child 
          ON 
              budget_child.master_Id = budget_master.id
               WHERE budget_master.created_by = ${mysql.escape(created_by)}
          ORDER BY 
              budget_master.id ASC;
        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(new Error(`update budget query failed: ${err.message}`));
      }
      resolve(result);
    });
  });
};

// For Excel Report Export - All Data
const viewReportService = async () => {
  return new Promise((resolve, reject) => {
    const query = `
     SELECT 
     budget_master.region AS region, 
      budget_master.business_function AS business_function, 
      budget_master.practice_name AS practice_name, 
      budget_master.cost_center_owner AS cost_center_owner, 
      budget_master.project_name AS project_name,  
      budget_master.currency AS currency, 
      budget_child.budget_type AS budget_type, 
      budget_child.item_description AS item_description, 
      budget_child.cost_center AS cost_center, 
      REPLACE(FORMAT(budget_child.month_1, 2), ',', '') AS month_1, 
      REPLACE(FORMAT(budget_child.month_2, 2), ',', '') AS month_2, 
      REPLACE(FORMAT(budget_child.month_3, 2), ',', '') AS month_3, 
      REPLACE(FORMAT(budget_child.budget_total, 2), ',', '') AS budget_total,
      budget_child.remarks AS remarks,
      budget_master.created_by AS created_by,
      DATE_FORMAT(budget_master.created_on, '%d-%m-%Y %H:%i:%s') AS created_on
        FROM 
          budget_master 
        LEFT JOIN 
            budget_child 
        ON 
            budget_child.master_Id = budget_master.id
         ORDER BY budget_master.id ASC;
        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(new Error(`update budget query failed: ${err.message}`));
      }
      resolve(result);
    });
  });
};

// For Excel Report Export - Only Specific User Data
// budget_master.customer AS Customer,
// budget_master.customer_type AS Customer_Type,
const viewReportExportService = async (created_by) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
      budget_master.region AS Region, 
      budget_master.business_function AS Business_Function, 
      budget_master.practice_name AS Department_Practice_Name,
      budget_master.cost_center_owner AS Cost_Center_Owner, 
      budget_master.project_name AS Project_Name, 
      budget_master.currency AS Currency, 
      budget_child.budget_type AS Budget_Type, 
      budget_child.item_description AS Item_Description, 
      budget_child.cost_center AS Cost_Center, 
       REPLACE(FORMAT(budget_child.month_1, 2), ',', '') AS "Oct-24", 
      REPLACE(FORMAT(budget_child.month_2, 2), ',', '') AS "Nov-24", 
      REPLACE(FORMAT(budget_child.month_3, 2), ',', '') AS "Dec-24", 
      REPLACE(FORMAT(budget_child.budget_total, 2), ',', '') AS Q3_Budget,
      budget_child.remarks AS Remarks,
      budget_master.created_by AS Created_By,
       DATE_FORMAT(budget_master.created_on, '%d-%m-%Y %H:%i:%s') AS Created_On
        FROM 
          budget_master 
        LEFT JOIN 
            budget_child 
        ON 
            budget_child.master_Id = budget_master.id
        ORDER BY budget_master.id ASC;
        `;
    mysqlConnection.query(query, (err, result) => {
      if (err) {
        return reject(new Error(`update budget query failed: ${err.message}`));
      }
      resolve(result);
    });
  });
};

/**
 * Service to return the token to the front end to validate the session
 * @param {Object} req - The data that contains the token
 * @returns {Promise} - A promise that resolves with the token
 */
const getSessionService = async (req) => {
  try {
    // Return a token
    const tokenValue = req.token;
    return tokenValue;
  } catch (err) {
    console.error("Error in getSessionService:", err);
    throw err;
  }
};

const getMailId = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      //    let query = `SELECT
      //    user_id as userId

      //  FROM
      //    bhub_pmt_access_matrix
      //  WHERE
      //    user_id = '${userId}'
      //    AND is_active = 1
      //  `
      // console.log(userId, "userId");
      let data = {
        pmo_access: 0,
        super_access: 0,
      };
      let query = `SELECT *  FROM bhub_budget_planner_access_matrix WHERE user_id = ${userId} AND is_active = 1 ;`;
      mysqlConnection.query(query, async (err, rows) => {
        if (!err) {
          // console.log(rows, "rows");
          if (rows?.length > 0) {
            data.pmo_access = rows[0]?.pmo_access;
            data.super_access = rows[0]?.super_access;
            resolve(data);
          } else {
            console.log(err);
            resolve(data);
          }
        } else {
          reject({
            error: true,
            message: "something went wrong, Please try later.",
          });
        }
      });
    } catch (err) {
      reject({
        error: true,
        message: "something went wrong, Please try later.",
      });
    }
  });
};

module.exports = {
  getDepartmentFilterService,
  getPraticeFilterService,
  getCustomerFilterService,
  addBudgetDataService,
  updateBudgetDataService,
  viewBudgetDataService,
  getSessionService,
  viewReportService,
  viewReportExportService,
  viewBudgetDataExportService,
  getMailId,
};
