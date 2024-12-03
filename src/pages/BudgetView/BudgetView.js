import React, { useEffect, useState } from "react";
import {
  getBudgetList,
  getBudgetListExport,
} from "../../services/budgetViewServices";
import downloadIcon from "../../assets/images/file.png";
import noDataFoundIcon from "../../assets/images/no-data-found.png";
import * as XLSX from "xlsx";
import moment from "moment";
import { toast } from "react-toastify";
import LoaderCommon from "../../components/LoaderCommon/LoaderCommon";

const BudgetView = () => {
  const [budgetListApi, setBudgetList] = useState([]);
  const [isloader, setIsLoader] = useState(true);

  useEffect(() => {
    getBudgetList()
      .then((res) => {
        setIsLoader(true);
        if (res.statusCode === 200 || (res.status === 200 && res.data)) {
          setIsLoader(false);

          setBudgetList(res.data.viewData);
        } else {
          setIsLoader(false);
        }
      })
      .catch((err) => {
        toast.error("Network Error");
        setIsLoader(false);
      });
  }, []);

  //download data as exel
  const exportBudgetSheet = (e) => {
    setIsLoader(true);
    getBudgetListExport()
      .then((res) => {
        if (res.status === 200 && res.data) {
          let Heading = [["Region", "Business Function"]];
          const workbook = XLSX.utils.book_new();
          // const worksheet = XLSX.utils.json_to_sheet(budgetListExportData);
          const worksheet = XLSX.utils.json_to_sheet(res.data.tickets);
          XLSX.utils.sheet_add_aoa(worksheet, Heading);
          // XLSX.utils.sheet_add_json(worksheet, arr, { origin: 'A2', skipHeader: true });
          // Iterate through columns J, K, L, M
          const range = XLSX.utils.decode_range(worksheet["!ref"]); //
          const columnsToFormat = ["J", "K", "L", "M"];
          const lastRow = range.e.r + 1; // Last row index in the sheet

          // Add sum formulas in the row after the data
          columnsToFormat.forEach((col) => {
            const sumCell = `${col}${lastRow + 1}`;
            worksheet[sumCell] = {
              t: "n",
              f: `SUM(${col}2:${col}${lastRow})`,
              s: { numFmt: "0.00" },
            }; // Formula for sum
          });

          // Format cells in columns J, K, L, M as numbers
          columnsToFormat.forEach((col) => {
            for (let row = 2; row <= lastRow; row++) {
              // Skip the header row
              const cellAddress = `${col}${row}`;
              if (!worksheet[cellAddress]) worksheet[cellAddress] = {}; // Create cell if it does not exist
              worksheet[cellAddress].t = "n"; // Set cell type to number
            }
          });

          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

          XLSX.writeFile(
            workbook,
            "BB-My-Budget-Report-" +
              moment(new Date()).format("YYYY-MM-DD-HH-mm-ss") +
              ".xlsx"
          );
          // setBudgetListExportData(res.data.tickets);
        }
      })
      .catch((err) => {
        setIsLoader(false);
        toast.error("Network Error");
      });
  };
  return (
    <div className="budget-view-main">
      <div className="budget-view-body ">
        {/* {isloader && <LoaderCommon />} */}
        <div className="budget-view">
          {budgetListApi?.length > 0 ? (
            <>
              <div className="download-btn">
                <button title="Export Report" onClick={exportBudgetSheet}>
                  <img
                    onClick={exportBudgetSheet}
                    src={downloadIcon}
                    alt="download"
                  />
                  Export
                </button>
              </div>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Business Function</th>
                    <th>Department/Practice Name</th>
                    <th>Cost Center Owner</th>
                    <th>Project Name</th>
                    {/* <th>Customer Type</th> */}
                    {/* <th>Customer</th> */}
                    <th>Budget Type</th>
                    <th>Cost Center</th>
                    <th>Item Description</th>
                    <th>Currency</th>
                    <th>Jan-25</th>
                    <th>Feb-25</th>
                    <th>Mar-25</th>
                    <th>Total</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetListApi?.map((item, i) => (
                    <tr>
                      <td title={item.region}>
                        {item.region ? item.region : "--"}
                      </td>
                      <td title={item.business_function} className="truncatee">
                        {item.business_function ? item.business_function : "--"}
                      </td>
                      <td title={item.practice_name} className="truncatee">
                        {item.practice_name ? item.practice_name : "--"}
                      </td>
                      <td title={item.cost_center_owner}>
                        {item.cost_center_owner ? item.cost_center_owner : "--"}
                      </td>
                      <td title={item.project_name}>
                        {item.project_name ? item.project_name : "--"}
                      </td>

                      <td title={item.budget_type}>
                        {item.budget_type ? item.budget_type : "--"}
                      </td>
                      <td title={item.cost_center}>
                        {item.cost_center ? item.cost_center : "--"}
                      </td>
                      <td title={item.item_description}>
                        {item.item_description ? item.item_description : "--"}
                      </td>
                      <td title={item.currency}>
                        {item.currency ? item.currency : "--"}
                      </td>
                      <td
                        title={item.month_1}
                        style={{ textAlign: "right", paddingRight: "10px" }}
                      >
                        {item.month_1 ? item.month_1 : 0.0}
                      </td>
                      <td
                        title={item.month_2}
                        style={{ textAlign: "right", paddingRight: "10px" }}
                      >
                        {item.month_2 ? item.month_2 : 0.0}
                      </td>
                      <td
                        title={item.month_3}
                        style={{ textAlign: "right", paddingRight: "10px" }}
                      >
                        {item.month_3 ? item.month_3 : 0.0}
                      </td>
                      <td
                        title={item.budget_total}
                        style={{ textAlign: "right", paddingRight: "10px" }}
                      >
                        {item.budget_total ? item.budget_total : 0.0}
                      </td>
                      <td className="truncate" title={item.remarks}>
                        {item.remarks ? item.remarks : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : isloader ? (
            <LoaderCommon />
          ) : (
            <div className="no-data-found">
              <p>No Data Found</p>
              <img src={noDataFoundIcon} alt="nodata" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetView;
