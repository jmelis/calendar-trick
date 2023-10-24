const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const LEAP_YEAR_CODE = { 0: 0, 4: 5, 8: 3, 12: 1, 16: 6, 20: 4, 24: 2 };

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

function getMonthCode(year, month) {
  let code;

  if ([1, 10].includes(month)) {
    code = 6;
  } else if ([4, 7].includes(month)) {
    code = 5;
  } else if ([9, 12].includes(month)) {
    code = 4;
  } else if ([6].includes(month)) {
    code = 3;
  } else if ([2, 3, 11].includes(month)) {
    code = 2;
  } else if ([8].includes(month)) {
    code = 1;
  } else {
    code = 0;
  }

  // adjust for leap year
  if ([1, 2].includes(month) && isLeapYear(year)) {
    code -= 1;
  }

  return code;
}

function getDayCode(day) {
  return day % 7;
}

function getYearCode(year) {
  // 19xx is century 19
  // 20xx is century 20
  century = Math.floor(year / 100);

  y2k = year - century * 100;
  y2k %= 28;

  prevLeap = Math.floor(y2k / 4);

  prevLeapCode = LEAP_YEAR_CODE[prevLeap * 4];
  y2kcode = prevLeapCode + (y2k % 4);

  // century correction
  yearcode = y2kcode + [0, 5, 3, 1][century % 4];

  return yearcode;
}

function getYearCodeMod28(year) {
  century = Math.floor(year / 100);
  y2k = year - century * 100;
  y2k %= 28;
  return y2k;
}

function getYearCodePrevLeapYear(y2k) {
  return Math.floor(y2k / 4);
}

function generate() {
  // Generate date
  year = randomIntFromInterval(2023, 2023);
  month = randomIntFromInterval(1, 6);
  day = randomIntFromInterval(1, getMonthDays(year, month));

  document.getElementById("day").innerText = day;
  document.getElementById("month").innerText = month;
  document.getElementById("year").innerText = year;
  if (isLeapYear(year)) document.getElementById("year").innerText += "*";

  const dayCode = getDayCode(day);
  const monthCode = getMonthCode(year, month);
  const yearCode = getYearCode(year);

  document.getElementById("day_code").innerText = dayCode;
  document.getElementById("month_code").innerText = monthCode;
  document.getElementById("year_code").innerText = yearCode;

  const code = (dayCode + monthCode + yearCode) % 7;

  document.getElementById(
    "code"
  ).innerHTML = `${dayCode} + ${monthCode} + ${yearCode} &Congruent; ${code}<br/>${WEEKDAY[code]}`;

  century = Math.floor(year / 100);
  y2k = getYearCodeMod28(year);
  prevLeapYear = getYearCodePrevLeapYear(y2k);
  rem = y2k % 4;
  prevLeapYearCode = LEAP_YEAR_CODE[prevLeapYear * 4];
  centCode = [0, 5, 3, 1][century % 4];

  document.getElementById("year_code_mod28").innerText = `${
    century * 100 + prevLeapYear * 4
  } + ${rem} => ${prevLeapYearCode} (ly) + ${rem} (rem) + ${centCode} (cent)`;
}

generate();
