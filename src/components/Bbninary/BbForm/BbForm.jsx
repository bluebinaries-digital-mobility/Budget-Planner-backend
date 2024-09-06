import { Toast } from "bootstrap";
import React, { useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import { toast } from "react-toastify";
import deleteIcon from "../../../assets/images/delete.png";
import DropdownIcon from "../../../assets/images/down-arrow.png";

import {
  calculateRowTotal,
  calculateTotals,
  getMonthValue,
  monthMap,
} from "../../../utils/helpers";
import { formValidation } from "../../../utils/validation";
import {
  getCustomerData,
  getDepartmentData,
  getPracticeData,
  saveBudgetData,
} from "../../../services/home.services";
import ConfirmPopup from "../SubmitPopup/SubmitPopup/ConfirmPopup";
import { useNavigate } from "react-router-dom";
import routePath from "../../../routes/routePath";
import { decode } from "html-entities";

const BbForm = () => {
  const navigate = useNavigate();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isChildError, setIsChildError] = useState(false);
  const [formErr, setFormErr] = useState();
  const [budgetTotal, setBudgetTotal] = useState(0);
  const currencySymbols = {
    INR: "&#8377;",
    EUR: "&euro;",
    GBP: "&pound;",
    USD: "&dollar;",
    CNY: "&#165;",
  };

  const currencyIcon = () => {
    return currencySymbols[formValues?.currency];
  };
  const Region2 = [
    { name: "APAC", value: "APAC" },
    { name: "AU", value: "AU" },
    { name: "GER", value: "GER" },
    { name: "UK", value: "UK" },
    { name: "NA", value: "NA" },
  ];

  const CurrencyOption = [
    { name: "INR", value: "INR" },
    { name: "USD", value: "USD" },
    { name: "EUR", value: "EUR" },
    { name: "GBP", value: "GBP" },
  ];

  const CustomerType = [
    { name: "OEM", value: "OEM" },
    { name: "System Supplier", value: "System Supplier" },
    {
      name: "Technology Platform or Solution Providers",
      value: "Technology Platform or Solution Providers",
    },
    { name: "Semiconductor Suppliers", value: "Semiconductor Suppliers" },
    { name: "Not Applicable", value: "Not Applicable" },
  ];
  const [budgetDataApi, setBudgetDataApi] = useState([
    {
      budget_type: "",
      budget_total: 0,
      item_description: "",
      cost_center: "",
      entries: [
        { budgetMonth: "10", year: "24", estimatedBudget: "" },
        { budgetMonth: "11", year: "24", estimatedBudget: "" },
        { budgetMonth: "12", year: "24", estimatedBudget: "" },
      ],
      month_1: "",
      month_2: "",
      month_3: "",
      // budget_total: "",
      remarks: "",
    },
  ]);

  const [formValues, setFormValues] = useState({
    region: "",
    business_function: "",
    cost_center_owner: "",
    project_name: "",
    practice_name: "",
    // customer: "",
    currency: "",
    // customer_type: "",
    financial_year: "2024-2025",
    f_quarter: "3",
  });

  const [BusinessFunction, setBusinessFunction] = useState([]);
  const [practiceNameApi, setPracticeApiData] = useState([]);
  const [customerNameApi, setCustomerApiData] = useState([]);

  const [businessName, setBusinessName] = useState([]);

  //Api Calls
  useEffect(() => {
    getDepartmentData()
      .then((res) => {
        if (res.status === 200 && res.data) {
          let deptDetails = res.data?.department?.map(function (obj, i) {
            obj["label"] = obj["unitname"];
            obj["name"] = obj["unitname"];
            obj["value"] = obj["unitname"];
            return obj;
          });
          setBusinessFunction(deptDetails);
          // setBusinessFunction(res.data.department);
        }
      })
      .catch((err) => err);
    getCustomerData()
      .then((res) => {
        if (res.status === 200 && res.data) {
          // setCustomerApiData(res.data.customer);
          let cusDetails = res.data?.customer?.map(function (obj, i) {
            obj["label"] = obj["client_name"];
            obj["name"] = obj["client_name"];
            obj["value"] = obj["client_name"];
            return obj;
          });
          setCustomerApiData(cusDetails);
        }
      })
      .catch((err) => err);
  }, []);

  // filter Practice api data
  useEffect(() => {
    let fdata = BusinessFunction?.filter(
      (item) => item.id === businessName[0]?.id
    );
    getPracticeData(fdata[0]?.id)
      .then((res) => {
        if (res.status === 200 && res.data) {
          // setPracticeApiData(res.data.practice);
          let practiceDetails = res.data?.practice?.map(function (obj, i) {
            obj["label"] = obj["deptname"];
            obj["name"] = obj["deptname"];
            obj["value"] = obj["deptname"];
            return obj;
          });
          setPracticeApiData(practiceDetails);
        }
      })
      .catch((err) => err);
  }, [formValues.business_function]);

  console.log("formValues", formValues);
  console.log("budgetDataApi", budgetDataApi);
  console.log("BusinessFunction", BusinessFunction);
  console.log("practiceNameApi", practiceNameApi);
  console.log("customerNameApi", customerNameApi);
  console.log("formErr", formErr);

  // Handler for select box changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "business_function") {
      let d = BusinessFunction.filter((item) => item.unitname === value);
      setBusinessName(d);
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const months = ["Oct-24", "Nov-24", "Dec-24"];
  // const [nextId, setNextId] = useState(1);

  //Add more rows
  const handleAddMore = () => {
    let template = {
      budget_type: "",
      item_description: "",
      cost_center: "",
      // currency: "",
      entries: [
        { budgetMonth: "10", year: "24", estimatedBudget: "" },
        { budgetMonth: "11", year: "24", estimatedBudget: "" },
        { budgetMonth: "12", year: "24", estimatedBudget: "" },
      ],
    };
    setBudgetDataApi([...budgetDataApi, template]);
  };

  // Form submit handler - popup
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsChildError(true);
    const validated = formValidation(formValues);
    let isChildDataFilled = budgetDataApi.some((item) => {
      let isValid = true;
      if (!item.budget_type) {
        isValid = false;
      }
      if (!item.item_description) {
        isValid = false;
      }
      if (!item.cost_center) {
        isValid = false;
      }
      return isValid;
    });
    if (Object.keys(validated)?.length > 0 || !isChildDataFilled) {
      setFormErr(validated);
      //   // toast.dismiss();
      let msg = "Please fill all the mandatory fields.";
      //   // if (Object.keys(validated)?.length < 2) {
      //   //   let fieldMsg = Object?.values(validated)
      //   //     .map((item) => item)
      //   //     .toString();
      //   //   // msg = `Please enter the ${fieldName?.split("_").join(" ")} field.`;
      //   //   msg = fieldMsg;
      //   // }
      toast.error(msg);
    } else {
      setIsSubmit(true);
    }
  };

  //popup OK button
  const handleConfirmSubmit = () => {
    // let updateTotal = budgetDataApi.map((item) => {
    //   return { ...item, budget_total: parseFloat(budgetTotal) };
    // });
    // setBudgetDataApi(updateTotal);
    let postData = { ...formValues, child: budgetDataApi };
    // navigate(routePath.budgetView);

    saveBudgetData(postData)
      .then((res) => {
        if (res.status === 200) {
          console.log("res", res);
          toast.success("Form has been submitted successfully");
          navigate(routePath.budgetView);
        } else {
          toast.error("something went wrong");
        }
        console.log("res", res);
      })
      .catch((err) => err);
    console.log("postData", postData);
    setIsSubmit(false);
  };

  const handleDeleteRow = (idx) => {
    let filteredData = budgetDataApi.filter((item, i) => i !== idx);
    setBudgetDataApi(filteredData);
  };

  //hanlde month change
  const handleMonthChange = (e, monthValue, rowIndex, idx, isActual) => {
    const newArray = [...budgetDataApi];
    if (!newArray[rowIndex]) {
      console.error(`Row index ${rowIndex} is out of bounds in newArray.`);
      return;
    }
    // Convert the input value to a number
    const newValue = parseFloat(e.target.value) || 0;
    // -----------------
    if (idx === 0) {
      newArray[rowIndex].month_1 = newValue;
    }
    if (idx === 1) {
      newArray[rowIndex].month_2 = newValue;
    }
    if (idx === 2) {
      newArray[rowIndex].month_3 = newValue;
    }
    const total =
      (parseFloat(newArray[rowIndex].month_1) || 0) +
      (parseFloat(newArray[rowIndex].month_2) || 0) +
      (parseFloat(newArray[rowIndex].month_3) || 0);
    newArray[rowIndex].budget_total = total;

    // -----------------

    let monthName = monthValue?.split("-")[0]; //"Jan,Feb",..
    const monthNumber = monthMap[monthName]; //"04","05",..

    const month = monthNumber.toString();
    const yearShort = monthValue?.split("-")[1]; // "2024"

    // Find the index of the entry to update or remove
    const entryIndex = newArray[rowIndex]?.entries?.findIndex(
      // (entry) => entry.budgetMonth === month && entry.budgetYear === yearShort
      (entry) => entry.budgetMonth === month
    );
    if (newValue > 0) {
      if (entryIndex !== -1) {
        // If the entry exists, update the estimatedBudget
        newArray[rowIndex].entries[entryIndex] = {
          ...newArray[rowIndex].entries[entryIndex],
          estimatedBudget: newValue,
        };
      } else {
        // If the entry does not exist, create a new one
        const newEntry = {
          budgetMonth: month,
          budgetYear: yearShort,
          componentId: newArray[rowIndex].UUID, // Component ID from the row
          budgetId: null,
          estimatedBudget: newValue,
        };
        newArray[rowIndex].entries.push(newEntry);
      }
    } else {
      if (entryIndex !== -1) {
        newArray[rowIndex].entries.splice(entryIndex, 1);
      }
    }
    setBudgetDataApi(newArray);
  };

  let totals = calculateTotals(budgetDataApi, months, monthMap, "R");

  // calc total entered budget
  // useEffect(() => {
  //   let bdgtTotal = totals
  //     .reduce((acc, curr) => acc + curr.value, 0)
  //     .toFixed(2);
  //   setBudgetTotal(bdgtTotal);
  // }, [totals]);

  //Validation field
  useEffect(() => {
    let errorMsg = { ...formErr };

    if (formValues.region !== "" && formValues.region !== undefined) {
      delete errorMsg.region;
    }
    if (
      formValues.business_function !== "" &&
      formValues.business_function !== undefined
    ) {
      delete errorMsg.business_function;
    }
    if (
      formValues.practice_name !== "" &&
      formValues.practice_name !== undefined
    ) {
      delete errorMsg.practice_name;
    }
    if (
      formValues.cost_center_owner !== "" &&
      formValues.cost_center_owner !== undefined
    ) {
      delete errorMsg.cost_center_owner;
    }
    // if (
    //   formValues.project_name !== "" &&
    //   formValues.project_name !== undefined
    // ) {
    //   delete errorMsg.project_name;
    // }
    // if (
    //   formValues.customer_type !== "" &&
    //   formValues.customer_type !== undefined
    // ) {
    //   delete errorMsg.customer_type;
    // }
    // if (formValues.customer !== "" && formValues.customer !== undefined) {
    //   delete errorMsg.customer;
    // }
    if (formValues.currency !== "" && formValues.currency !== undefined) {
      delete errorMsg.currency;
    }
    setFormErr(errorMsg);
  }, [formValues]);

  return (
    <div className="bb-main-con">
      <div className="bb-main-body">
        <ConfirmPopup
          headerTitle="Budget planner"
          title="Are you sure want to submit ?"
          isModalOpen={isSubmit}
          handleCancel={setIsSubmit}
          handleSubmitConfirm={handleConfirmSubmit}
        />
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            {/* Region --1 */}
            <div
              className={`field-con form-col-sec select-search-container-section ${
                formErr?.region && "field-error"
              }`}
              // className="field-con form-col-sec select-search-container-section"
            >
              <label className="required">
                Region<small className="mandatory-small">*</small>
              </label>
              <SelectSearch
                options={Region2}
                value={formValues.region}
                onChange={(value) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    region: value,
                  }));
                }}
                name="projectType"
                placeholder="Select Region"
                search={true}
              />
              <img src={DropdownIcon} alt="dropdown" />
            </div>

            {/* Business Function --2 */}
            <div
              // className="field-con form-col-sec select-search-container-section"
              className={`field-con form-col-sec select-search-container-section ${
                formErr?.business_function && "field-error"
              }`}
            >
              <label className="required">
                Business Function<small className="mandatory-small">*</small>
              </label>
              <SelectSearch
                options={BusinessFunction}
                value={formValues.business_function}
                onChange={(value) => {
                  let d = BusinessFunction.filter(
                    (item) => item.unitname === value
                  );
                  setBusinessName(d);
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    business_function: value,
                  }));
                }}
                name="projectType"
                placeholder="Select Business Function"
                search={true}
              />
              <img src={DropdownIcon} alt="dropdown" />
            </div>

            {/* Practice Name  --3 */}
            <div
              // className="field-con form-col-sec select-search-container-section"
              className={`field-con form-col-sec select-search-container-section ${
                formErr?.practice_name && "field-error"
              }`}
            >
              <label className="required">
                Department/Practice Name
                <small className="mandatory-small">*</small>
              </label>
              <SelectSearch
                options={practiceNameApi}
                value={formValues.practice_name}
                onChange={(value) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    practice_name: value,
                  }));
                }}
                name="projectType"
                placeholder="Select Department/Practice Name"
                search={true}
              />
              <img src={DropdownIcon} alt="dropdown" />
            </div>

            {/* Cost Center Owner  --4 */}
            <div className="field-con">
              <label htmlFor="cost_center_owner">
                Cost Center Owner<small className="mandatory-small">*</small>
              </label>
              <input
                className={formErr?.cost_center_owner && "field-error"}
                type="text"
                name="cost_center_owner"
                value={formValues.cost_center_owner}
                onChange={handleChange}
                placeholder="Enter cost center owner name"
              />
            </div>

            {/* Project Name  --5 */}
            <div className="field-con">
              <label htmlFor="project_name">Project Name</label>
              <input
                className={formErr?.project_name && "field-error"}
                type="text"
                name="project_name"
                placeholder="Enter project name"
                value={formValues.project_name}
                onChange={handleChange}
              />
            </div>

            {/* Customer Type --6 */}
            {/* <div
              className="field-con form-col-sec select-search-container-section"
              // className={`field-con form-col-sec select-search-container-section ${
              //   formErr?.customer_type && "field-error"
              // }`}
            >
              <label className="required">Customer Type </label>
              <SelectSearch
                options={CustomerType}
                value={formValues.customer_type}
                onChange={(value) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    customer_type: value,
                  }));
                }}
                name="projectType"
                placeholder="Select Customer Type"
                search={true}
              />
              <img src={DropdownIcon} alt="dropdown" />
            </div> */}

            {/* Customer --7 */}
            {/* {isAddingNew ? (
              <div className="field-con">
                <label htmlFor="project_name">Customer</label>
                <span
                  className="add-new-customer"
                  onClick={(e) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      customer: "",
                    }));
                    setIsAddingNew(!isAddingNew);
                  }}
                >
                  Select Customer
                </span>
                <input
                  // className={formErr?.customer && "field-error"}
                  type="text"
                  name="project_name"
                  placeholder="Enter customer name"
                  value={formValues.customer}
                  onChange={(e) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      customer: e.target.value,
                    }));
                  }}
                />
              </div>
            ) : (
              <div
                className="field-con form-col-sec select-search-container-section"
                // className={`field-con form-col-sec select-search-container-section ${
                //   formErr?.customer && "field-error"
                // }`}
              >
                <label className="required">Customer </label>
                <span
                  className="add-new-customer"
                  onClick={() => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      customer: "",
                    }));
                    setIsAddingNew(!isAddingNew);
                  }}
                >
                  Add New Customer
                </span>
                <SelectSearch
                  options={customerNameApi}
                  value={formValues.customer}
                  onChange={(value) => {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      customer: value,
                    }));
                  }}
                  name="projectType"
                  placeholder="Select Customer"
                  search={true}
                />
                <img src={DropdownIcon} alt="dropdown" />
              </div>
            )} */}

            {/* Currency */}
            <div
              className={`field-con form-col-sec select-search-container-section ${
                formErr?.currency && "field-error"
              }`}
            >
              <label className="required">
                Currency<small className="mandatory-small">*</small>
              </label>
              <SelectSearch
                options={CurrencyOption}
                value={formValues.currency}
                onChange={(value) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    currency: value,
                  }));
                }}
                name="projectType"
                placeholder="Select Currency"
                search={true}
                // disabled={projectId && !access?.super_access}
              />
              <img src={DropdownIcon} alt="dropdown" />
            </div>

            {/* child component */}
            <div className="child-con">
              <div className="child-body">
                <>
                  <div className="custom-table-con">
                    <table className="custom-table">
                      <thead>
                        <tr className="">
                          <th className="header-th" colSpan="12">
                            <div>
                              TOTAL Q3 BUDGET:
                              <span>
                                {/* {decode(currencyIcon(), { level: 'html5' })}
                                {totals
                                  .reduce((acc, curr) => acc + curr.value, 0)
                                  .toFixed(2)} */}
                                {`${decode(currencyIcon(), {
                                  level: "html5",
                                })} ${totals
                                  .reduce((acc, curr) => acc + curr.value, 0)
                                  .toFixed(2)}`}
                              </span>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <th>
                            Budget Type
                            <small className="mandatory-small">*</small>
                          </th>
                          <th>
                            Item Description
                            <small className="mandatory-small">*</small>
                          </th>
                          <th>
                            Cost Center
                            <small className="mandatory-small">*</small>
                          </th>
                          {/* <th>Currency</th> */}
                          {/* Months - header th */}
                          {months.map((month) => (
                            <th>{month}</th>
                          ))}

                          <th>Total</th>
                          <th>Remarks</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {budgetDataApi.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {/* Budget Type */}
                            <td>
                              <div>
                                <select
                                  style={{ padding: "12px" }}
                                  value={row.budget_type}
                                  onChange={(e) => {
                                    const newRows = [...budgetDataApi];
                                    newRows[rowIndex].budget_type =
                                      e.target.value;

                                    setBudgetDataApi(newRows);
                                    setIsChildError(false);
                                  }}
                                  className={
                                    !budgetDataApi[rowIndex]?.budget_type &&
                                    isChildError &&
                                    "field-error"
                                  }
                                >
                                  <option value="">--Select--</option>
                                  <option value="Resources">Resources</option>
                                  <option value="Capex">Capex</option>
                                  <option value="Opex">Opex</option>
                                  <option value="Travel">Travel</option>
                                  <option value="Pass Through">
                                    Pass Through
                                  </option>
                                  <option value="others">Others</option>
                                </select>
                              </div>
                            </td>
                            {/* Item Description */}
                            <td>
                              <div>
                                <input
                                  type="text"
                                  name="item_description"
                                  className={
                                    !budgetDataApi[rowIndex]
                                      ?.item_description &&
                                    isChildError &&
                                    "field-error"
                                  }
                                  value={row.item_description}
                                  onChange={(e) => {
                                    const newRows = [...budgetDataApi];
                                    newRows[rowIndex].item_description =
                                      e.target.value;

                                    setBudgetDataApi(newRows);
                                    setIsChildError(false);
                                  }}
                                />
                              </div>
                            </td>
                            {/* Cost Center */}
                            <td>
                              <div>
                                <input
                                  type="text"
                                  name="cost_center"
                                  className={
                                    !budgetDataApi[rowIndex]?.cost_center &&
                                    isChildError &&
                                    "field-error"
                                  }
                                  value={row.cost_center}
                                  onChange={(e) => {
                                    const newRows = [...budgetDataApi];
                                    newRows[rowIndex].cost_center =
                                      e.target.value;

                                    setBudgetDataApi(newRows);
                                    setIsChildError(false);
                                  }}
                                />
                              </div>
                            </td>
                            {/* Currency */}
                            {/* <td>
                              <div>
                                <select
                                  name="currency"
                                  value={row.currency}
                                  onChange={(e) => {
                                    const newRows = [...budgetDataApi];
                                    newRows[rowIndex].currency = e.target.value;

                                    setBudgetDataApi(newRows);
                                  }}
                                >
                                  <option value="INR">INR</option>
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                  <option value="EUR">GBP</option>
                                </select>
                              </div>
                            </td> */}

                            {/* Months */}
                            {months.map((monthValue, idx) => (
                              <td key={idx}>
                                <div className="month-td-div">
                                  <input
                                    type="number"
                                    value={getMonthValue(row, monthValue, idx)}
                                    onChange={(e) =>
                                      handleMonthChange(
                                        e,
                                        monthValue,
                                        rowIndex,
                                        idx,
                                        "estimateBudget"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            ))}
                            {/* Total Row values */}
                            <td>
                              <div className="total-row-cal">
                                <input
                                  type="text"
                                  value={calculateRowTotal(
                                    row,
                                    "estimateBudget"
                                  )}
                                  readOnly
                                />
                              </div>
                            </td>

                            {/* Remarks */}
                            <td>
                              <div className="">
                                <input
                                  type="text"
                                  name="remarks"
                                  value={row.remarks}
                                  onChange={(e) => {
                                    const newRows = [...budgetDataApi];
                                    newRows[rowIndex].remarks = e.target.value;

                                    setBudgetDataApi(newRows);
                                  }}
                                />
                              </div>
                            </td>
                            {/* Delete Icon */}
                            <td className="delete-row">
                              <img
                                className={
                                  budgetDataApi.length < 2 &&
                                  "delete-icon-disable"
                                }
                                onClick={() =>
                                  budgetDataApi.length > 1
                                    ? handleDeleteRow(rowIndex)
                                    : null
                                }
                                src={deleteIcon}
                                alt="delete"
                              />
                            </td>
                          </tr>
                        ))}

                        <tr>
                          <td colSpan="12">
                            <div className="btn-grp">
                              <button type="button" onClick={handleAddMore}>
                                Add More
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Planned Total */}
                        <tr className="total-month-tr">
                          <td colSpan="3">
                            <div className="total-month-div">
                              Total per month
                            </div>
                          </td>
                          {totals.map((total, index) => (
                            <td style={{ textAlign: "end" }} key={index}>
                              {total.value}
                            </td> // Format to two decimal places
                          ))}
                          <td style={{ textAlign: "end" }}>
                            {totals
                              .reduce((acc, curr) => acc + curr.value, 0)
                              .toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* <div className="total-budget">
                    <span>TOTAL Q3 BUDGET:</span>
                    <span>&#8377;&nbsp;10</span>
                    <span>----</span>
                  </div>
                  {budgetData?.map((row, i) => (
                    <div className="row-data" key={i}>
                      {row.rowData.map((item, idx) => (
                        <>
                          <div className="select-filed" title={item.label}>
                            <label htmlFor="">{item.label}</label>
                            <input
                              type="text"
                              name={`val${idx}`}
                              value={budgetData.value}
                              placeholder="write.."
                              onChange={handleChangeInput}
                            />
                          </div>
                        </>
                      ))}
                      {budgetData.length > 1 && (
                        <div className="btn-delete">
                          <img
                            onClick={() => handleDeleteRow(row.id)}
                            src={deleteIcon}
                            alt="delete"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="total-row-calc">
                    <span>Total</span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span>0</span>
                    <span>0</span>
                    <span>0</span>
                    <span>0</span>
                  </div> */}
                </>
              </div>
              {/* <div className="btn-grp">
                <button type="button" onClick={handleAddMore}>
                  Add More
                </button>
              </div> */}
            </div>
          </div>
          <div className="btn-submit-con">
            <button className="btn-submit" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BbForm;
