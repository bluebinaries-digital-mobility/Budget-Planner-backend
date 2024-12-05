export const monthMap = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

// export const getMonthValue = (row, monthValue, idx) => {
//   let month = monthValue.split("-")[0]; //"Jan-24",... ---> "Jan"
//   const monthNumber = monthMap[month]; //"01","02",..
//   let val = 0;
//   row.entries?.filter((item) => {
//     if (item?.budgetMonth === monthNumber?.toString()) {
//       val = parseFloat(item.estimatedBudget);
//     }
//   });

//   return val;
// };

// export const calculateRowTotal = (row, isActual) => {
//   let totalHour = 160; //20 days * 8 hours = 160 Hour Rate
//   return row.entries?.reduce(
//     (acc, curr) => acc + (parseFloat(curr?.estimatedBudget) || 0),

//     0
//   );
// };
export const returnTotalRowValue = (row) => {
  const total =
    (parseFloat(row.month_1) || 0) +
    (parseFloat(row.month_2) || 0) +
    (parseFloat(row.month_3) || 0);
  return total || 0;
};
// export const calculateTotals = (data, months, commonMonthMap, tabName) => {
//   let totalHour = 160; //20 days * 8 hours = 160 Hour Rate
//   let totals = [];
//   for (let month of months) {
//     let monthNo = commonMonthMap[month.split("-")[0]];
//     totals.push({ month: monthNo, value: 0 });
//   }

//   data?.forEach((row) => {
//     row.entries?.forEach((monthValue, index) => {
//       let colMonth = Object.values(commonMonthMap)
//         ?.filter((val) => monthValue.budgetMonth === val)
//         ?.toString();
//       totals = totals.map((item) => {
//         if (item.month === colMonth) {
//           item.value += parseFloat(monthValue.estimatedBudget) || 0;
//           // if (row.costCenter === "R") {
//           //   item.value +=
//           //     parseFloat(monthValue.estimatedBudget) *
//           //       totalHour *
//           //       row.hrRate || 0;
//           // } else if (row.costCenter === "C") {
//           //   item.value +=
//           //     parseFloat(monthValue.estimatedBudget * row.quantity) || 0;
//           // } else {
//           //   item.value += parseFloat(monthValue.estimatedBudget) || 0;
//           // }
//         }
//         return item;
//       });
//     });
//   });

//   return totals;
// };

export const returnTotalsBudget = (data) => {
  let total = data?.reduce(
    (acc, val) => acc + parseFloat(val?.budget_total),
    0
  );
  return total || 0;
};
export const returnColumnValue = (data) => {
  let quarterMonthsVal = { month1: 0, month2: 0, month3: 0 };
  let qm1 = 0;
  let qm2 = 0;
  let qm3 = 0;
  data?.forEach((item, i) => {
    qm1 += parseFloat(item?.month_1) || 0;
    qm2 += parseFloat(item?.month_2) || 0;
    qm3 += parseFloat(item?.month_3) || 0;
  });
  quarterMonthsVal = { month1: qm1, month2: qm2, month3: qm3 };
  return quarterMonthsVal;
};
//get current quarter month
export const getQuarter = () => {
  let quarterMonths = {
    q1: ["Apr", "May", "Jun"],
    q2: ["Jul", "Aug", "Sep"],
    q3: ["Oct", "Nov", "Dec"],
    q4: ["Jan", "Feb", "Mar"],
  };
  let currentDate = new Date();

  let getMonth = currentDate.getMonth(); //0 to 11
  let currMonth = getMonth + 1; //1 to 12
  let currYear = currentDate.getFullYear();
  let financialYear = `${currYear}-${currYear + 1}`; //eg, 2024-2025

  let quarterData = {
    quarter: "",
    quarter_months: [],
    year: "",
    financial_year: "",
  };

  const getNextQuarter = (q, months, year, FY) => {
    quarterData = {
      quarter: q,
      quarter_months: months,
      year: year,
      financial_year: FY,
    };
  };

  //Q-1 | Apr to Jun
  if (currMonth > 3 && currMonth <= 6) {
    quarterData = {
      quarter: 1,
      quarter_months: quarterMonths["q1"],
      year: currYear,
      financial_year: financialYear,
    };
    // if last month of the quarter, show next quarter
    if (currMonth === 6) {
      getNextQuarter(2, quarterMonths["q2"], currYear, financialYear);
    }
  }
  //Q-2 | Jul to Sep
  if (currMonth > 6 && currMonth <= 9) {
    quarterData = {
      quarter: 2,
      quarter_months: quarterMonths["q2"],
      year: currYear,
      financial_year: financialYear,
    };
    if (currMonth === 9) {
      getNextQuarter(3, quarterMonths["q3"], currYear, financialYear);
    }
  }
  //Q-3 | Oct to Dec
  if (currMonth > 9 && currMonth <= 12) {
    quarterData = {
      quarter: 3,
      quarter_months: quarterMonths["q3"],
      year: currYear,
      financial_year: financialYear,
    };
    if (currMonth === 12) {
      let nextYear = currYear + 1; //showing next year in Dec month.
      getNextQuarter(4, quarterMonths["q4"], nextYear, financialYear);
    }
  }
  //Q-4 | Jan to Mar
  if (currMonth >= 1 && currMonth <= 3) {
    let lastYear = currYear - 1; //current Quarter of the FY. 2025 -> 2024
    let FY = `${lastYear}-${currYear}`; //2024-2025
    quarterData = {
      quarter: 4,
      quarter_months: quarterMonths["q4"],
      year: lastYear,
      financial_year: FY, //"2024-2025"
    };
    if (currMonth === 3) {
      getNextQuarter(1, quarterMonths["q1"], currYear, FY);
    }
  }

  return quarterData;
};
