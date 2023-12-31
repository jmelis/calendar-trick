let WINS, ATTEMPTS, tTemp, totalTime;
totalTime = 0;
tTemp = 0;
WINS = 0;
ATTEMPTS = 0;

const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function getMonthDays(year, month) {
  if (month == 2) {
    if (isLeapYear(year)) {
      return 29;
    } else {
      return 28;
    }
  } else if ([1, 3, 5, 7, 8, 10, 12]) {
    return 31;
  } else {
    return 30;
  }
}

class CalendarDay {
  constructor(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;

    this.century = Math.floor(this.year / 100);
    this.centuryYear = (this.year - this.century * 100) % 28;
    this.prevLeapYear = Math.floor(this.centuryYear / 4) * 4;
  }

  dayCode() {
    return this.day % 7;
  }

  monthCode() {
    let codes = {
      1: 6,
      2: 2,
      3: 2,
      4: 5,
      5: 0,
      6: 3,
      7: 5,
      8: 1,
      9: 4,
      10: 6,
      11: 2,
      12: 4,
    };

    if (isLeapYear(this.year)) {
      codes[1] = 5;
      codes[2] = 1;
    }

    return codes[this.month];
  }

  prevLeapYearCode() {
    return [0, 5, 3, 1, 6, 4, 2][this.prevLeapYear / 4];
  }

  remCode() {
    return this.centuryYear % 4;
  }

  prevLeapYearCode() {
    return [0, 5, 3, 1, 6, 4, 2][this.prevLeapYear / 4];
  }

  centuryCode() {
    return [0, 5, 3, 1][this.century % 4];
  }

  codes() {
    return {
      prevLeapYear: this.prevLeapYearCode(),
      rem: this.remCode(),
      century: this.centuryCode(),
      month: this.monthCode(),
      day: this.dayCode(),
    };
  }

  code() {
    return Object.values(this.codes()).reduce((a, b) => a + b) % 7;
  }

  weekday() {
    return WEEKDAY[this.code() % 7];
  }
}

function listToUl(list) {
  let ul = document.createElement("ul");
  list.forEach((e) => {
    let li = document.createElement("li");
    li.innerText = e;
    ul.appendChild(li);
  });
  return ul;
}

function generate() {
  tTemp = new Date();
  updateScore();
  // Activate all buttons
  document
    .querySelectorAll("#solutions button")
    .forEach((e) => (e["disabled"] = false));

  // hide help
  document.getElementById("help").style.display = "none";

  // Generate date
  let yearsList = [];
  const years = document.getElementById("years").value;
  window.location.hash = "#" + years;
  years.split(",").forEach((segment) => {
    if (segment.includes("-")) {
      const [yf, yt] = segment.split("-");
      for (i = parseInt(yf); i <= parseInt(yt); i++) {
        yearsList.push(i);
      }
    } else {
      yearsList.push(parseInt(segment));
    }
  });

  year = randomElement(yearsList);
  month = randomIntFromInterval(1, 12);
  day = randomIntFromInterval(1, getMonthDays(year, month));

  calday = new CalendarDay(year, month, day);

  document.getElementById("date").innerText = `${year}-${month}-${day}`;
  document.getElementById("solution").innerText = calday.weekday();

  document.getElementById("help").innerHTML = `<p>Equivalent year is ${
    calday.centuryYear
  }, ${isLeapYear(year) ? "" : "not"} a LY.</p>
    <p>Previous LY is  ${
      calday.prevLeapYear
    }: code ${calday.prevLeapYearCode()}.</p>
    <p>Years since LY: code ${calday.remCode()}.</p>
    <p>Century ${calday.century}00: code ${calday.centuryCode()}.</p>
    <p>Month: code ${calday.monthCode()}.</p>
    <p>Day: code ${calday.dayCode()}.</p>
    <p>Code: ${calday.code()} therefore it is a ${calday.weekday()}.</p>`;
}

function updateScore() {
  document.getElementById("score").innerText = `${WINS}/${ATTEMPTS}`;
}

function showHelp() {
  document.getElementById("help").style.display = "block";
}

function check(btn) {
  const weekday = document.getElementById("solution").innerText;
  const val = btn.innerText;
  if (weekday == val) {
    WINS++;
    ATTEMPTS++;

    updateScore();

    const lastTime = (new Date() - tTemp) / 1000;

    totalTime += lastTime;
    document.getElementById("last-time").innerText = lastTime.toFixed(1);
    document.getElementById("avg-time").innerText = (totalTime / WINS).toFixed(
      1
    );

    document.getElementById("btn-go").click();
  } else {
    ATTEMPTS++;
    updateScore();
    btn["disabled"] = true;
  }
}

function checkAlgorithm() {
  // verify algorithm works
  for (y = 1600; y <= 2400; y++) {
    for (m = 1; m <= 12; m++) {
      for (d = 1; d <= getMonthDays(y, m); d++) {
        const calday = new CalendarDay(y, m, d);
        const checkdate = new Date(y, m - 1, d);
        if (calday.code() != checkdate.getDay()) {
          alert(
            `error! ${y}-${m}-${d}: ${calday.code()} vs ${checkdate.getDay()}`
          );
          return;
        }
      }
    }
  }
}

if (window.location.hash) {
  document.getElementById("years").value = window.location.hash.substring(1);
}

checkAlgorithm();
generate();
