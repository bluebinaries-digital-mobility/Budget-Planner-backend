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

export const getMonthValue = (row, monthValue, idx) => {
  let month = monthValue.split("-")[0]; //"Jan-24",... ---> "Jan"
  const monthNumber = monthMap[month]; //"01","02",..
  let val = 0;
  row.entries?.filter((item) => {
    if (item?.budgetMonth === monthNumber?.toString()) {
      val = parseFloat(item.estimatedBudget);
      // return item;
    }
  });

  // return value[0]?.estimatedBudget;
  return val;
};

export const calculateRowTotal = (row, isActual) => {
  let totalHour = 160; //20 days * 8 hours = 160 Hour Rate
  return row.entries?.reduce(
    (acc, curr) => acc + (parseFloat(curr?.estimatedBudget) || 0),

    0
  );
};
export const calculateTotals = (data, months, commonMonthMap, tabName) => {
  let totalHour = 160; //20 days * 8 hours = 160 Hour Rate
  let totals = [];
  for (let month of months) {
    let monthNo = commonMonthMap[month.split("-")[0]];
    totals.push({ month: monthNo, value: 0 });
  }

  data?.forEach((row) => {
    row.entries?.forEach((monthValue, index) => {
      let colMonth = Object.values(commonMonthMap)
        ?.filter((val) => monthValue.budgetMonth === val)
        ?.toString();
      totals = totals.map((item) => {
        if (item.month === colMonth) {
          item.value += parseFloat(monthValue.estimatedBudget) || 0;
          // if (row.costCenter === "R") {
          //   item.value +=
          //     parseFloat(monthValue.estimatedBudget) *
          //       totalHour *
          //       row.hrRate || 0;
          // } else if (row.costCenter === "C") {
          //   item.value +=
          //     parseFloat(monthValue.estimatedBudget * row.quantity) || 0;
          // } else {
          //   item.value += parseFloat(monthValue.estimatedBudget) || 0;
          // }
        }
        return item;
      });
    });
  });

  return totals;
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

  let quarterData = {
    // month: "",
    quarter: "",
    quarter_months: [],
    year: "",
  };

  const getNextQuarter = (q, months, year) => {
    quarterData = {
      quarter: q,
      quarter_months: months,
      year: year,
    };
  };

  //Q-4
  if (currMonth >= 1 && currMonth <= 3) {
    let lastYear = currYear - 1; //current Quarter of the FY
    quarterData = {
      quarter: 4,
      quarter_months: quarterMonths["q4"],
      year: lastYear,
    };
    //if last month of the quarter, shows next quarter
    if (currMonth === 3) {
      getNextQuarter(1, quarterMonths["q1"], currYear);
    }
  }
  //Q-1
  if (currMonth > 3 && currMonth <= 6) {
    quarterData = {
      quarter: 1,
      quarter_months: quarterMonths["q1"],
      year: currYear,
    };
    if (currMonth === 6) {
      getNextQuarter(2, quarterMonths["q2"], currYear);
    }
  }
  //Q-2
  if (currMonth > 6 && currMonth <= 9) {
    quarterData = {
      quarter: 2,
      quarter_months: quarterMonths["q2"],
      year: currYear,
    };
    if (currMonth === 9) {
      getNextQuarter(3, quarterMonths["q3"], currYear);
    }
  }
  //Q-3
  if (currMonth > 9 && currMonth <= 12) {
    quarterData = {
      quarter: 3,
      quarter_months: quarterMonths["q3"],
      year: currYear,
    };
    if (currMonth === 12) {
      let nextYear = currYear + 1; //showing next year in Dec month.
      getNextQuarter(4, quarterMonths["q4"], nextYear);
    }
  }

  return quarterData;
};
