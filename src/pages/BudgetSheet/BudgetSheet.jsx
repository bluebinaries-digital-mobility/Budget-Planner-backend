import React, { useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import { toast } from "react-toastify";
import deleteIcon from "../../assets/images/delete.png";
import DropdownIcon from "../../assets/images/down-arrow.png";

import {
  getQuarter,
  returnColumnValue,
  returnTotalRowValue,
  returnTotalsBudget,
} from "../../utils/helpers";
import { formValidation, handleFocusFormData } from "../../utils/validation";
import {
  getCustomerData,
  getDepartmentData,
  getPracticeData,
  saveBudgetData,
} from "../../services/budgetSheet.services";
import { useNavigate } from "react-router-dom";
import routePath from "../../routes/routePath";
import { decode } from "html-entities";
import ConfirmPopup from "../../components/SubmitPopup/SubmitPopup/ConfirmPopup";
import FullpageLoader from "../../components/FullPageLoader/FullPageLoader";

import * as Yup from "yup";
import { useFormik } from "formik";

const BudgetSheet = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isChildError, setIsChildError] = useState(false);
  const [formErr, setFormErr] = useState();
  const [loader, setLoader] = useState(false);

  // const months = ["Jan-25", "Feb-25", "Mar-25"];
  let currentQuarter = getQuarter();

  console.log("currentQuarter", currentQuarter);

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

  const [budgetDataApi, setBudgetDataApi] = useState([
    {
      budget_type: "", //resource, capex..
      item_description: "",
      cost_center: "",
      budget_total: 0,
      // entries: [
      //   { budgetMonth: "10", year: "24", estimatedBudget: "" },
      //   { budgetMonth: "11", year: "24", estimatedBudget: "" },
      //   { budgetMonth: "12", year: "24", estimatedBudget: "" },
      // ],
      month_1: "",
      month_2: "",
      month_3: "",
      remarks: "",
    },
  ]);

  const [formValues, setFormValues] = useState({
    region: "",
    business_function: "",
    cost_center_owner: "",
    project_name: "",
    practice_name: "",
    currency: "",
    financial_year: currentQuarter?.financial_year,
    f_quarter: currentQuarter?.quarter,
    // financial_year: "2024-2025",
    // f_quarter: "4",
  });
  console.log("formValues", formValues);
  console.log("budgetDataApi", budgetDataApi);

  const [BusinessFunction, setBusinessFunction] = useState([]);
  const [practiceNameApi, setPracticeApiData] = useState([]);
  const [customerNameApi, setCustomerApiData] = useState([]);

  const [businessName, setBusinessName] = useState([]);

  //formik starts
  const formValidationSchema = Yup.object({
    group: Yup.string().required("Field is required."),
  });
  const {
    values,
    errors,
    handleChange: handleFormikChangee,
    handleSubmit: handleFormikSubmit,
    touched,
  } = useFormik({
    initialValues: { group: "" },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      console.log("valuessss", values);
    },
  });

  //formik ends

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
        }
      })
      .catch((err) => err);
    getCustomerData()
      .then((res) => {
        if (res.status === 200 && res.data) {
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
          if (practiceDetails.length < 1) {
            practiceDetails = [
              {
                name: "Not Applicable",
                value: "Not Applicable",
                label: "Not Applicable",
              },
            ];
          }
          if (fdata[0]?.id === 11 || fdata[0]?.id === 12) {
            practiceDetails = [
              ...practiceDetails,
              {
                name: "Future Business",
                value: "Future Business",
                label: "Future Business",
              },
            ];
          }
          setPracticeApiData(practiceDetails);
        }
      })
      .catch((err) => err);
  }, [formValues.business_function]);

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

  //Add more rows
  const handleAddMore = () => {
    let template = {
      budget_type: "",
      budget_total: 0,
      item_description: "",
      cost_center: "",
      // entries: [
      //   { budgetMonth: "10", year: "24", estimatedBudget: "" },
      //   { budgetMonth: "11", year: "24", estimatedBudget: "" },
      //   { budgetMonth: "12", year: "24", estimatedBudget: "" },
      // ],

      month_1: "",
      month_2: "",
      month_3: "",
      remarks: "",
    };
    setBudgetDataApi([...budgetDataApi, template]);
  };

  // Form submit handler - open popup
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsChildError(true);
    const validated = formValidation(formValues);

    let isChildDataFilled = budgetDataApi.every((item) => {
      let isValid = true;
      if (item.budget_total === 0) {
        isValid = false;
      }
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
      let msg = "Please complete all the fields.";

      toast.error(msg);
    } else {
      setIsSubmit(true);
    }
  };

  //popup OK button
  const handleConfirmSubmit = () => {
    setLoader(true);
    // let updateTotal = budgetDataApi.map((item) => {
    //   delete item.entries;
    //   return item;
    // });
    // let postData = { ...formValues, child: updateTotal };
    let postData = { ...formValues, child: budgetDataApi };
    console.log("postData", postData);

    saveBudgetData(postData)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Form has been submitted successfully");
          setTimeout(() => {
            setLoader(false);
            navigate(routePath.budgetView);
          }, 1000);
        } else {
          toast.error("Something went wrong");
          setLoader(false);
        }
      })
      .catch((err) => {
        toast.error("Network Error");
        setLoader(false);
      });
    setIsSubmit(false);
  };

  const handleDeleteRow = (idx) => {
    let filteredData = budgetDataApi.filter((item, i) => i !== idx);
    setBudgetDataApi(filteredData);
  };

  //Validation field for parents data - handle focus
  useEffect(() => {
    let errorFields = handleFocusFormData(formErr, formValues);
    setFormErr(errorFields);
  }, [formValues]);

  //handleChangeBudgetInput
  const handleChangeBudgetInput = (e, rowIndex) => {
    let { name, value } = e.target;

    const newRows = [...budgetDataApi];

    newRows[rowIndex][name] = value;

    const totalBudget =
      (parseFloat(newRows[rowIndex].month_1) || 0) +
      (parseFloat(newRows[rowIndex].month_2) || 0) +
      (parseFloat(newRows[rowIndex].month_3) || 0);

    newRows[rowIndex].budget_total = totalBudget;

    setBudgetDataApi(newRows);
    setIsChildError(false);
  };
  return (
    <div className="home-main-con">
      <div className="home-main-wrapper">
        <div className="bb-main-con">
          <div className="bb-main-body">
            <ConfirmPopup
              headerTitle="Budget planner"
              title="Are you sure want to submit ?"
              isModalOpen={isSubmit}
              handleCancel={setIsSubmit}
              handleSubmitConfirm={handleConfirmSubmit}
            />
            <FullpageLoader isOpen={loader} />

            <form onSubmit={handleSubmit}>
              <div className="form-div">
                {/* Region --1 */}
                <div
                  className={`field-con form-col-sec select-search-container-section ${
                    formErr?.region && "field-error"
                  }`}
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
                  className={`field-con form-col-sec select-search-container-section ${
                    formErr?.business_function && "field-error"
                  }`}
                >
                  <label className="required">
                    Business Function
                    <small className="mandatory-small">*</small>
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
                    Cost Center Owner
                    <small className="mandatory-small">*</small>
                  </label>
                  <input
                    className={formErr?.cost_center_owner && "field-error"}
                    type="text"
                    autoComplete="off"
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
                    autoComplete="off"
                    name="project_name"
                    placeholder="Enter project name"
                    value={formValues.project_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Currency --6 */}
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
                                  {`TOTAL Q${currentQuarter?.quarter} BUDGET:`}
                                  <span>
                                    {`${decode(currencyIcon(), {
                                      level: "html5",
                                    })} 
                                    ${returnTotalsBudget(budgetDataApi)}
                                      
                                      `}
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

                              {currentQuarter?.quarter_months?.map((month) => (
                                <th>{`${month}-${currentQuarter?.year
                                  ?.toString()
                                  .slice(-2)}`}</th>
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
                                      name="budget_type"
                                      onChange={(e) =>
                                        handleChangeBudgetInput(e, rowIndex)
                                      }
                                      className={
                                        !budgetDataApi[rowIndex]?.budget_type &&
                                        isChildError &&
                                        "field-error"
                                      }
                                    >
                                      <option value="">--Select--</option>
                                      <option value="Resources">
                                        Resources
                                      </option>
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
                                      autoComplete="off"
                                      name="item_description"
                                      className={
                                        !budgetDataApi[rowIndex]
                                          ?.item_description &&
                                        isChildError &&
                                        "field-error"
                                      }
                                      value={row.item_description}
                                      onChange={(e) =>
                                        handleChangeBudgetInput(e, rowIndex)
                                      }
                                    />
                                  </div>
                                </td>
                                {/* Cost Center */}
                                <td>
                                  <div>
                                    <input
                                      autoComplete="off"
                                      type="text"
                                      name="cost_center"
                                      className={
                                        !budgetDataApi[rowIndex]?.cost_center &&
                                        isChildError &&
                                        "field-error"
                                      }
                                      value={row.cost_center}
                                      onChange={(e) =>
                                        handleChangeBudgetInput(e, rowIndex)
                                      }
                                    />
                                  </div>
                                </td>

                                {/* Months */}

                                <td>
                                  <div className="month-td-div">
                                    <input
                                      autoComplete="off"
                                      type="number"
                                      name="month_1"
                                      value={row?.month_1}
                                      onChange={(e) =>
                                        handleChangeBudgetInput(e, rowIndex)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="month-td-div">
                                    <input
                                      autoComplete="off"
                                      type="number"
                                      name="month_2"
                                      value={row?.month_2}
                                      onChange={(e) =>
                                        handleChangeBudgetInput(e, rowIndex)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="month-td-div">
                                    <input
                                      autoComplete="off"
                                      type="number"
                                      name="month_3"
                                      value={row?.month_3}
                                      onChange={(e) =>
                                        handleChangeBudgetInput(e, rowIndex)
                                      }
                                    />
                                  </div>
                                </td>

                                {/* Total Row values */}
                                <td>
                                  <div className="total-row-cal">
                                    <input
                                      className={
                                        budgetDataApi[rowIndex]
                                          ?.budget_total === 0 &&
                                        isChildError &&
                                        "field-error"
                                      }
                                      type="text"
                                      value={returnTotalRowValue(row)}
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
                                      autoComplete="off"
                                      value={row.remarks}
                                      onChange={(e) =>
                                        handleChangeBudgetInput(e, rowIndex)
                                      }
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

                              {currentQuarter?.quarter_months.map(
                                (month, index) => (
                                  <td style={{ textAlign: "end" }} key={index}>
                                    {
                                      returnColumnValue(budgetDataApi)[
                                        "month" + (index + 1)
                                      ]
                                    }
                                  </td>
                                )
                              )}
                              <td style={{ textAlign: "end" }}>
                                {returnTotalsBudget(budgetDataApi)}
                              </td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  </div>
                </div>
              </div>
              <div className="btn-submit-con">
                <button className="btn-submit" type="submit">
                  Submit
                </button>
              </div>
            </form>
            {/* <form onSubmit={handleFormikSubmit}>
           
              <div className="field-con">
                <label htmlFor="project_name">Group Name</label>
                <input
                  // className={formErr?.project_name && "field-error"}
                  type="text"
                  autoComplete="off"
                  name="group"
                  placeholder="Enter group name"
                  value={values.group}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Send</button>
            </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSheet;
