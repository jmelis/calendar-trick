function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
    if ([1, 10].includes(this.month)) {
      return 6;
    } else if ([4, 7].includes(this.month)) {
      return 5;
    } else if ([9, 12].includes(this.month)) {
      return 4;
    } else if ([6].includes(this.month)) {
      return 3;
    } else if ([2, 3, 11].includes(this.month)) {
      return 2;
    } else if ([8].includes(this.month)) {
      return 1;
    } else {
      return 0;
    }
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

  leapYearCode() {
    return isLeapYear(this.year) && [1, 2].includes(this.month) ? -1 : 0;
  }

  codes() {
    return {
      prevLeapYear: this.prevLeapYearCode(),
      rem: this.remCode(),
      century: this.centuryCode(),
      leapYear: this.leapYearCode(),
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
  let ul = document.createElement('ul');
  list.forEach((e) => {
    let li = document.createElement('li');
    li.innerText = e;
    ul.appendChild(li);
  })
  return ul;
}

function generate() {
  // Activate all buttons
  document.querySelectorAll("#solutions button").forEach((e)=>{
    e["disabled"]=false;
    // console.log(e.style.pointerEvents);
    // e.style.pointerEvents = "none";
    // e.style.pointerEvents = "auto";
  });

  // document.getElementById("solution").style.display = "none";

  // Generate date
  const yearFrom = parseInt(document.getElementById("yearFrom").value);
  const yearTo = parseInt(document.getElementById("yearTo").value);
  year = randomIntFromInterval(yearFrom, yearTo);
  month = randomIntFromInterval(1, 12);
  day = randomIntFromInterval(1, getMonthDays(year, month));
  calday = new CalendarDay(year, month, day);

  document.getElementById("date").innerText = `${year}-${month}-${day}`;
  document.getElementById("solution").innerText = calday.weekday();
}


function check(btn) {
  const weekday = document.getElementById("solution").innerText;
  const val = btn.innerText;

  if (weekday == val) {
    generate()
  } else {
    btn["disabled"] = true;
  }
}

generate();
