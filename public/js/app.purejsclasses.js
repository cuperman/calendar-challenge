(function() {
  'use strict';

  class Month {
    constructor(month, year) {
      let today = new Date();
      this.month = month || today.getMonth();
      this.year  = year  || today.getFullYear();
    }
    
    static get MONTH_NAMES() {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
    
    getMonthName() {
      return this.constructor.MONTH_NAMES[this.month];
    }
    
    getYear() {
      return this.year;
    }

    beginningOfMonth() {
      return new Date(this.year, this.month, 1);
    }

    previousMonth() {
      return new Month(this.month - 1, this.year);
    }

    followingMonth() {
      return new Month(this.month + 1, this.year);
    }

    numberOfDays() {
      if ([0, 2, 4, 6, 7, 9, 11].includes(this.month))  { // Jan, Mar, May, Jul, Aug, Oct, Dec
        return 31;
      } else if ([3, 5, 8, 10].includes(this.month)) { // Apr, Jun, Sep, Nov
        return 30;
      } else if ([1].includes(this.month)) { // Feb
        return 28;
      } else {
        throw 'MonthOutOfBounds';
      }
    }
  };

  class Calendar {
    constructor(el, month = new Month()) {
      this.el    = el;
      this.month = month;
    }
    
    static get WEEKDAY_NAMES() {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }
    static get DAYS_IN_WEEK() {
      return this.WEEKDAY_NAMES.length
    };

    leftPad() {
      return this.month.beginningOfMonth().getDay();
    }

    rightPad() {
      let daysInLastWeek = (this.leftPad() + this.month.numberOfDays()) % this.constructor.DAYS_IN_WEEK;
      if (daysInLastWeek > 0) {
        return this.constructor.DAYS_IN_WEEK - daysInLastWeek;
      } else {
        return 0;
      }
    }

    render() {
      this.el.innerHTML = '';

      let lpad  = this.leftPad();
      let days  = this.month.numberOfDays();
      let rpad  = this.rightPad();

      let container = document.createElement('div');
      container.setAttribute('class', 'cal-container');
      this.el.appendChild(container);

      let header = document.createElement('header');
      header.setAttribute('class', 'cal-header');
      container.appendChild(header);

      let title = document.createElement('h1');
      title.setAttribute('class', 'title');
      title.innerHTML = `${this.month.getMonthName()} ${this.month.getYear()}`
      header.appendChild(title);

      let body = document.createElement('section');
      body.setAttribute('class', 'cal-body');
      container.appendChild(body);

      let table = document.createElement('table');
      table.setAttribute('class', 'cal-table');
      body.appendChild(table);

      let thead = document.createElement('thead');
      table.appendChild(thead);

      let thr = document.createElement('tr');
      thead.appendChild(thr);
      for (let i = 0; i < this.constructor.DAYS_IN_WEEK; i++) {
        let th = document.createElement('th');
        thr.appendChild(th);
        th.innerHTML = this.constructor.WEEKDAY_NAMES[i];
      }

      let tbody = document.createElement('tbody');
      table.appendChild(tbody);

      let tr;
      let index = 0;
      for (let i = 0; i < lpad; i++, index++) {
        if (index % this.constructor.DAYS_IN_WEEK === 0) {
          tr = document.createElement('tr');
          tbody.appendChild(tr);
        }
        let td = document.createElement('td');
        td.setAttribute('class', 'blank');
        tr.appendChild(td);
      }
      for (let i = 0; i < days; i++, index++) {
        if (index % this.constructor.DAYS_IN_WEEK === 0) {
          tr = document.createElement('tr');
          tbody.appendChild(tr);
        }
        let td = document.createElement('td');
        td.innerHTML = i + 1;
        tr.appendChild(td);
      }
      for (let i = 0; i < rpad; i++, index++) {
        if (index % this.constructor.DAYS_IN_WEEK === 0) {
          tr = document.createElement('tr');
          tbody.appendChild(tr);
        }
        let td = document.createElement('td');
        td.setAttribute('class', 'blank');
        tr.appendChild(td);
      }

      let nav = document.createElement('nav');
      nav.setAttribute('class', 'cal-nav');
      container.appendChild(nav);

      let lastMonth = document.createElement('button');
      lastMonth.innerHTML = '< Last Month';
      lastMonth.addEventListener('click', () => {
        this.month = this.month.previousMonth();
        this.render();
      });
      nav.appendChild(lastMonth);

      let thisMonth = document.createElement('button');
      thisMonth.innerHTML = 'This Month';
      thisMonth.addEventListener('click', () => {
        this.month = new Month();
        this.render();
      });
      nav.appendChild(thisMonth);

      let nextMonth = document.createElement('button');
      nextMonth.innerHTML = 'Next Month >';
      nextMonth.addEventListener('click', () => {
        this.month = this.month.followingMonth();
        this.render();
      });
      nav.appendChild(nextMonth);
    };
  };

  document.addEventListener('DOMContentLoaded', function() {
    let el = document.getElementById('calendar');
    let calendar = new Calendar(el);
    calendar.render();
  });
})();
