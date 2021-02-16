"use strict";

const Database = use("Database");
const date = new Date();

class StatController {
  async index({ response }) {
    let startDate = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    ).toISOString();
    let endDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).toISOString();
    let projects = await Database.table("projects").whereBetween("created_at", [
      startDate,
      endDate,
    ]);
    let users = await Database.table("users").whereBetween("created_at", [
      startDate,
      endDate,
    ]);
    let executions = await Database.table(
      "executions"
    ).whereBetween("created_at", [startDate, endDate]);
    let testCases = await Database.table(
      "test_cases"
    ).whereBetween("created_at", [startDate, endDate]);
    // let savedDrinks = await Database.table(
    //   "saved_drinks"
    // ).whereBetween("created_at", [startDate, endDate]);
    // let redemptions = await Database.table('redemptions').whereBetween('redeemed_at', [startDate, endDate]);
    // let userDevices = await Database.table(
    //   "user_devices"
    // ).whereBetween("created_at", [startDate, endDate]);
    let projectData = this._projectStats(projects);
    // let salesData = this._salesStats(projects);
    let userStats = this._userStats(users);
    let drinkStats = this._projectStats(testCases);
    let executionStats = this._projectStats(executions);
    // let drinkStats = this._drinkStats(savedDrinks);
    // let deviceStats = this._deviceStats(userDevices);
    // let redemptionStats = this._redemptionStats(redemptions);
    let monthlySalesStats = this._monthlySalesStats(projects);

    return response.json({
      smallStats: [
        {
          label: "Total Projects",
          value: projectData.totalOrders,
          percentage: projectData.orderPercentDiff + "%",
          increase: projectData.orderIncrease,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "6", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgba(0, 184, 216, 0.1)",
              borderColor: "rgb(0, 184, 216)",
              data: projectData.orderCountPerDay,
            },
          ],
        },
        {
          label: "Total Test Cases",
          value: drinkStats.totalOrders,
          percentage: drinkStats.orderPercentDiff + "%",
          increase: drinkStats.orderIncrease,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "6", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgba(23,198,113,0.1)",
              borderColor: "rgb(23,198,113)",
              data: drinkStats.orderCountPerDay,
            },
          ],
        },
        {
          label: "Total Executions",
          value: executionStats.totalOrders,
          percentage: executionStats.orderPercentDiff + "%",
          increase: executionStats.orderIncrease,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "4", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgba(255,180,0,0.1)",
              borderColor: "rgb(255,180,0)",
              data: executionStats.orderCountPerDay,
            },
          ],
        },
      ],
      chartData: {
        labels: Array.from(
          new Array(this._daysInMonth(date.getMonth() + 1)),
          (_, i) => (i === 0 ? 1 : i + 1)
        ),
        datasets: [
          {
            label: "Current Month",
            fill: "start",
            data: monthlySalesStats.orderSalesPerDayCurrentMonth,
            backgroundColor: "rgba(0,123,255,0.1)",
            borderColor: "rgba(0,123,255,1)",
            pointBackgroundColor: "#ffffff",
            pointHoverBackgroundColor: "rgb(0,123,255)",
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 3,
          },
          {
            label: "Past Month",
            fill: "start",
            data: monthlySalesStats.orderSalesPerDayPreviousMonth,
            backgroundColor: "rgba(255,65,105,0.1)",
            borderColor: "rgba(255,65,105,1)",
            pointBackgroundColor: "#ffffff",
            pointHoverBackgroundColor: "rgba(255,65,105,1)",
            borderDash: [3, 3],
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 2,
            pointBorderColor: "rgba(255,65,105,1)",
          },
        ],
      },
      //   deviceData: {
      //     datasets: [
      //       {
      //         hoverBorderColor: "#ffffff",
      //         data: [
      //           deviceStats.iOSCount,
      //           deviceStats.androidCount,
      //           deviceStats.unknownCount,
      //         ],
      //         backgroundColor: [
      //           "rgba(0, 136, 204, 0.9)",
      //           "rgba(164, 198, 57, 0.9)",
      //         ],
      //       },
      //     ],
      //     labels: ["iOS", "Android", "Others"],
      //   },
    });
  }

  _userStats(users) {
    users = JSON.parse(JSON.stringify(users));
    let seventhDay = new Date(this._nthDay(7));
    let fourteenthDay = new Date(this._nthDay(14));
    let lastSevenDayData = users.filter((ul7) => {
      return new Date(ul7.created_at).getTime() >= seventhDay.getTime();
    });
    let previousSevenDayData = users.filter((ul14) => {
      return (
        new Date(ul14.created_at).getTime() >= fourteenthDay.getTime() &&
        new Date(ul14.created_at).getTime() < seventhDay.getTime()
      );
    });
    var countPerDay = this._lastSevenDaysData(users, "created_at");
    let percentDiff = this._percentDiff(
      lastSevenDayData.length,
      previousSevenDayData.length
    );
    let increase =
      lastSevenDayData.length < previousSevenDayData.length ? false : true;
    return { percentDiff, increase, lastSevenDayData, countPerDay };
  }

  _projectStats(orders) {
    let seventhDay = new Date(this._nthDay(7));
    let fourteenthDay = new Date(this._nthDay(14));
    let lastSevenDayData = orders.filter((or7) => {
      return new Date(or7.created_at).getTime() >= seventhDay.getTime();
    });
    let previousSevenDayData = orders.filter((or14) => {
      return (
        new Date(or14.created_at).getTime() >= fourteenthDay.getTime() &&
        new Date(or14.created_at).getTime() < seventhDay.getTime()
      );
    });
    let orderCountPerDay = this._lastSevenDaysData(orders, "created_at");
    let orderPercentDiff = this._percentDiff(
      lastSevenDayData,
      previousSevenDayData
    );
    let orderIncrease =
      lastSevenDayData.length < previousSevenDayData.length ? false : true;
    // var orderIds = lastSevenDayData.map(d => d.id);
    // const totalOrders = lastSevenDayData.length;
    const totalOrders = orders.length;
    return {
      totalOrders,
      orderPercentDiff,
      orderIncrease,
      orderCountPerDay,
    };
  }

  _salesStats(orders) {
    let seventhDay = new Date(this._nthDay(7));
    let lastSevenDayData = orders.filter((or7) => {
      return new Date(or7.placed_at).getTime() >= seventhDay.getTime();
    });
    let orderSalesPerDay = this._lastNDaysSalesData(orders, 6, 0);
    let salesPercentData = this._salesPercentDiff(orders);
    let salesPercentDiff = salesPercentData.percentDiff;
    let saleIncrease = salesPercentData.increase;
    let totalSales = 0;
    lastSevenDayData.map((obj) => {
      totalSales += obj.subtotal;
    });
    totalSales = Math.round(totalSales);
    return {
      totalSales,
      orderSalesPerDay,
      salesPercentDiff,
      saleIncrease,
    };
  }

  _drinkStats(savedDrinks) {
    let seventhDay = new Date(this._nthDay(7));
    let lastSevenDayData = savedDrinks.filter((sd7) => {
      return new Date(sd7.created_at).getTime() >= seventhDay.getTime();
    });
    let drinksPerDay = this._lastNDaysDrinksData(savedDrinks, 6, 0);
    let drinksPercentData = this._drinksPercentDiff(savedDrinks);
    let drinksPercentDiff = drinksPercentData.percentDiff;
    let drinkIncrease = drinksPercentData.increase;
    let totalDrinks = 0;
    lastSevenDayData.map((obj) => {
      totalDrinks += obj.drinks;
    });
    totalDrinks = Math.round(totalDrinks);
    return {
      totalDrinks,
      drinksPerDay,
      drinksPercentDiff,
      drinkIncrease,
    };
  }

  _redemptionStats(redemptions) {
    redemptions = JSON.parse(JSON.stringify(redemptions));
    let seventhDay = new Date(this._nthDay(7));
    let fourteenthDay = new Date(this._nthDay(14));
    let lastSevenDayData = redemptions.filter((rd7) => {
      return new Date(rd7.created_at).getTime() >= seventhDay.getTime();
    });
    let previousSevenDayData = redemptions.filter((rd14) => {
      return (
        new Date(rd14.created_at).getTime() >= fourteenthDay.getTime() &&
        new Date(rd14.created_at).getTime() < seventhDay.getTime()
      );
    });
    let countPerDay = this._lastSevenDaysData(redemptions, "created_at");
    let percentDiff = this._percentDiff(
      lastSevenDayData.length,
      previousSevenDayData.length
    );
    let increase =
      lastSevenDayData.length < previousSevenDayData.length ? false : true;
    return { percentDiff, increase, lastSevenDayData, countPerDay };
  }

  _deviceStats(devices) {
    devices = JSON.parse(JSON.stringify(devices));
    let iOSCount = 0;
    let androidCount = 0;
    let unknownCount = 0;
    devices.filter((d) => {
      switch (d.platform) {
        case "ios":
          iOSCount++;
          break;
        case "android":
          androidCount++;
          break;
        default:
          unknownCount++;
          break;
      }
    });
    return { iOSCount, androidCount, unknownCount };
  }

  _monthlySalesStats(orders) {
    let startDatePreviousMonth = new Date(
      new Date(date.getFullYear(), date.getMonth() - 1, 1)
    ).toLocaleDateString();
    let endDatePreviousMonth = new Date(
      new Date(date.getFullYear(), date.getMonth(), 0)
    ).toLocaleDateString();
    let today = new Date().toLocaleDateString();
    let daysSinceStartofPreviousMonth = this._daysCount(
      startDatePreviousMonth,
      today
    );
    let daysSinceEndOfPreviousMonth = this._daysCount(
      endDatePreviousMonth,
      today
    );
    let orderSalesPerDayPreviousMonth = this._lastNDaysSalesData(
      orders,
      daysSinceStartofPreviousMonth - 1,
      daysSinceEndOfPreviousMonth - 1
    );
    let orderSalesPerDayCurrentMonth = this._lastNDaysSalesData(
      orders,
      daysSinceEndOfPreviousMonth - 2,
      0
    );
    return { orderSalesPerDayPreviousMonth, orderSalesPerDayCurrentMonth };
  }

  _daysCount(d0, d1) {
    var d = new Date(d0);
    var n = 0;
    while (d < new Date(d1)) {
      d.setDate(d.getDate() + 1);
      n++;
    }
    return n + 1;
  }

  _daysInMonth(month) {
    return new Date(0, month, 0).getDate();
  }

  _lastSevenDaysData(items, key) {
    var countPerDay = [];
    var index = 0;
    for (var i = 6; i >= 0; i--) {
      let dt = new Date().setDate(new Date().getDate() - i);
      let itemIndex = 0;
      switch (key) {
        case "created_at":
          items.filter((item) => {
            if (
              new Date(dt).getMonth() + "" + new Date(dt).getDate() ==
              new Date(item.created_at).getMonth() +
                "" +
                new Date(item.created_at).getDate()
            ) {
              itemIndex++;
            }
          });
          break;

        case "placed_at":
          items.filter((item) => {
            if (new Date(dt).getDate() == new Date(item.placed_at).getDate()) {
              itemIndex++;
            }
          });
          break;
      }

      countPerDay[index] = itemIndex;
      index++;
    }
    return countPerDay;
  }

  _lastNDaysSalesData(items, fromDaysAgo, tillDaysAgo) {
    var countPerDay = [];
    var index = 0;
    for (var i = fromDaysAgo; i >= tillDaysAgo; i--) {
      let dt = new Date().setDate(new Date().getDate() - i);
      let dailySale = 0;
      items.filter((item) => {
        if (
          new Date(dt).getMonth() + "" + new Date(dt).getDate() ==
          new Date(item.placed_at).getMonth() +
            "" +
            new Date(item.placed_at).getDate()
        ) {
          dailySale += item.receipt_total;
        }
      });
      countPerDay[index] = dailySale.toFixed(2);
      index++;
    }
    return countPerDay;
  }

  _lastNDaysDrinksData(items, fromDaysAgo, tillDaysAgo) {
    var countPerDay = [];
    var index = 0;
    for (var i = fromDaysAgo; i >= tillDaysAgo; i--) {
      let dt = new Date().setDate(new Date().getDate() - i);
      let dailyDrinks = 0;
      items.filter((item) => {
        if (new Date(dt).getDate() == new Date(item.created_at).getDate()) {
          dailyDrinks += item.drinks;
        }
      });
      countPerDay[index] = dailyDrinks;
      index++;
    }
    return countPerDay;
  }

  _percentDiff(lastSeven, previousSeven) {
    let diff =
      lastSeven > previousSeven
        ? lastSeven - previousSeven
        : previousSeven - lastSeven;

    let percentDiff =
      previousSeven == 0 && lastSeven == 0
        ? 0
        : previousSeven > 0
        ? (diff / previousSeven) * 100
        : 100;
    if (percentDiff < 10) {
      return percentDiff.toFixed(2);
    } else if (percentDiff < 100) {
      return percentDiff.toFixed(1);
    } else {
      return percentDiff.toFixed(0);
    }
  }

  _salesPercentDiff(orders) {
    let lastSeven = this._lastNDaysSalesData(orders, 7, 0);
    let previousSeven = this._lastNDaysSalesData(orders, 14, 7);
    const lastSevenSum = lastSeven.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const previousSevenSum = previousSeven.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    let percentDiff = this._percentDiff(lastSevenSum, previousSevenSum);
    let increase = lastSevenSum < previousSevenSum ? false : true;

    return { percentDiff, increase };
  }

  _drinksPercentDiff(savedDrinks) {
    let lastSeven = this._lastNDaysDrinksData(savedDrinks, 6, 0);
    let previousSeven = this._lastNDaysDrinksData(savedDrinks, 13, 7);
    const lastSevenSum = lastSeven.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const previousSevenSum = previousSeven.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    let percentDiff = this._percentDiff(lastSevenSum, previousSevenSum);
    let increase = lastSevenSum < previousSevenSum ? false : true;
    return { percentDiff, increase };
  }

  _nthDay(n) {
    return new Date().setDate(new Date().getDate() - n);
  }

  _localDate() {
    if (!Date.prototype.toLocalISOString) {
      (function () {
        function pad(number) {
          if (number < 10) {
            return "0" + number;
          }
          return number;
        }

        Date.prototype.toLocalISOString = function () {
          return (
            this.getFullYear() +
            "-" +
            pad(this.getMonth() + 1) +
            "-" +
            pad(this.getDate()) +
            "T" +
            pad(this.getHours()) +
            ":" +
            pad(this.getMinutes()) +
            ":" +
            pad(this.getSeconds()) +
            "." +
            (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            "Z"
          );
        };
      });
    }
  }
}

module.exports = StatController;
