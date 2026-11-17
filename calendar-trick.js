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
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let calday = null;
let answered = false;

function pad(n) {
  return String(n).padStart(2, "0");
}

function parseYears(text) {
  let yearsList = [];
  text.split(",").forEach((segment) => {
    if (segment.includes("-")) {
      const [yf, yt] = segment.split("-").map((s) => parseInt(s));
      for (let i = yf; i <= yt; i++) {
        yearsList.push(i);
      }
    } else {
      yearsList.push(parseInt(segment));
    }
  });
  return yearsList.filter((y) => y >= 1583 && y <= 9999);
}

function generate() {
  const input = document.getElementById("years");
  let yearsList = parseYears(input.value);
  document.getElementById("years-error").hidden = yearsList.length > 0;
  if (!yearsList.length) {
    return;
  }
  window.location.hash = "#" + input.value;

  const year = randomElement(yearsList);
  const month = randomIntFromInterval(1, 12);
  const day = randomIntFromInterval(1, getMonthDays(year, month));
  calday = new CalendarDay(year, month, day);
  answered = false;

  document.querySelectorAll("#solutions button").forEach((b) => {
    b.disabled = false;
    b.classList.remove("right", "wrong");
  });
  document.getElementById("date").innerText = `${day} ${MONTHS[month - 1]} ${year}`;
  document.getElementById("help").hidden = true;
  document.getElementById("help-btn").innerText = "Show the working";
  renderHelp();
  updateScore();
  tTemp = new Date();
}

function renderHelp() {
  const codes = calday.codes();
  const yy = calday.year % 100;
  const eq = pad(calday.centuryYear);
  const prev = pad(calday.prevLeapYear);
  const leapNote =
    isLeapYear(calday.year) && calday.month <= 2 ? " (leap year)" : "";
  const rows = [
    ["Day", `${calday.day} mod 7`, codes.day],
    ["Month", MONTHS[calday.month - 1] + leapNote, codes.month],
    [
      "Leap year",
      `${yy >= 28 ? `${pad(yy)} → ${eq}, ` : ""}last leap year ${prev}`,
      codes.prevLeapYear,
    ],
    ["Extra years", `${eq} − ${prev}`, codes.rem],
    ["Century", `${calday.century}00s`, codes.century],
  ];
  const sum = Object.values(codes).reduce((a, b) => a + b);
  const link = `learn.html?date=${calday.year}-${calday.month}-${calday.day}#walk`;

  document.getElementById("help").innerHTML = `
    <ol class="working-steps">${rows
      .map(
        ([label, text, value]) =>
          `<li><span class="w-label">${label}</span><span class="w-text">${text}</span><span class="w-val">+${value}</span></li>`
      )
      .join("")}</ol>
    <p class="w-total">Total ${sum}${sum >= 7 ? ` → ${calday.code()}` : ""}, so it's a <b>${calday.weekday()}</b>.</p>
    <a href="${link}">Walk through this date step by step</a>`;
}

function toggleHelp() {
  const help = document.getElementById("help");
  help.hidden = !help.hidden;
  document.getElementById("help-btn").innerText = help.hidden
    ? "Show the working"
    : "Hide the working";
}

function updateScore() {
  document.getElementById("score").innerText = `${WINS}/${ATTEMPTS}`;
}

function check(btn) {
  if (answered || btn.disabled) {
    return;
  }
  ATTEMPTS++;
  if (Number(btn.dataset.day) == calday.code()) {
    WINS++;
    answered = true;
    btn.classList.add("right");

    const lastTime = (new Date() - tTemp) / 1000;
    totalTime += lastTime;
    document.getElementById("last-time").innerText = lastTime.toFixed(1) + "s";
    document.getElementById("avg-time").innerText =
      (totalTime / WINS).toFixed(1) + "s";

    updateScore();
    setTimeout(generate, 450);
  } else {
    btn.classList.add("wrong");
    btn.disabled = true;
    updateScore();
  }
}

function checkAlgorithm() {
  // verify algorithm works
  for (let y = 1600; y <= 2400; y++) {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= getMonthDays(y, m); d++) {
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

// Number keys 0-6 answer with the weekday that has that code.
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input") || e.metaKey || e.ctrlKey || e.altKey) {
    return;
  }
  if (/^[0-6]$/.test(e.key)) {
    check(document.querySelector(`#solutions button[data-day="${e.key}"]`));
  }
});

if (window.location.hash) {
  document.getElementById("years").value = decodeURIComponent(
    window.location.hash.substring(1)
  );
}

checkAlgorithm();
generate();
