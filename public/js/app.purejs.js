(function() {
  'use strict';

  const MONTH_NAMES    = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const WEEKDAY_NAMES  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAYS_IN_WEEK   = WEEKDAY_NAMES.length;

  let beginningOfMonth = function(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  let daysInMonth = function(date) {
    let month = date.getMonth();
    if ([0, 2, 4, 6, 7, 9, 11].includes(month))  { // Jan, Mar, May, Jul, Aug, Oct, Dec
      return 31;
    } else if ([3, 5, 8, 10].includes(month)) { // Apr, Jun, Sep, Nov
      return 30;
    } else if ([1].includes(month)) { // Feb
      return 28;
    } else {
      throw new UserException('OutOfBounds');
    }
  };
  
  let leftPad = function(date) {
    return beginningOfMonth(date).getDay();
  };

  let rightPad = function(date) {
    let daysInLastWeek = (leftPad(date) + daysInMonth(date)) % DAYS_IN_WEEK;
    if (daysInLastWeek > 0) {
      return DAYS_IN_WEEK - daysInLastWeek;
    } else {
      return 0;
    }
  };

  let previousMonth = function(date) {
    return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  };

  let followingMonth = function(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  };

  let render = function(el, date) {
    el.innerHTML = '';

    let year  = date.getFullYear();
    let month = date.getMonth();
    let day   = date.getDay();

    let lpad  = leftPad(date);
    let days  = daysInMonth(date);
    let rpad  = rightPad(date);
    
    let container = document.createElement('div');
    container.setAttribute('class', 'cal-container');
    el.appendChild(container);
    
    let header = document.createElement('header');
    header.setAttribute('class', 'cal-header');
    container.appendChild(header);
    
    let title = document.createElement('h1');
    title.setAttribute('class', 'title');
    title.innerHTML = `${MONTH_NAMES[month]} ${year}`
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
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      let th = document.createElement('th');
      thr.appendChild(th);
      th.innerHTML = WEEKDAY_NAMES[i];
    }

    let tbody = document.createElement('tbody');
    table.appendChild(tbody);

    let tr;
    let index = 0;
    for (let i = 0; i < lpad; i++, index++) {
      if (index % DAYS_IN_WEEK === 0) {
        tr = document.createElement('tr');
        tbody.appendChild(tr);
      }
      let td = document.createElement('td');
      td.setAttribute('class', 'blank');
      tr.appendChild(td);
    }
    for (let i = 0; i < days; i++, index++) {
      if (index % DAYS_IN_WEEK === 0) {
        tr = document.createElement('tr');
        tbody.appendChild(tr);
      }
      let td = document.createElement('td');
      td.innerHTML = i + 1;
      tr.appendChild(td);
    }
    for (let i = 0; i < rpad; i++, index++) {
      if (index % DAYS_IN_WEEK === 0) {
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
    lastMonth.addEventListener('click', function() {
      render(el, previousMonth(date));
    });
    nav.appendChild(lastMonth);

    let thisMonth = document.createElement('button');
    thisMonth.innerHTML = 'This Month';
    thisMonth.addEventListener('click', function() {
      render(el, new Date());
    });
    nav.appendChild(thisMonth);

    let nextMonth = document.createElement('button');
    nextMonth.innerHTML = 'Next Month >';
    nextMonth.addEventListener('click', function() {
      render(el, followingMonth(date));
    });
    nav.appendChild(nextMonth);
  };

  document.addEventListener('DOMContentLoaded', function() {
    let el = document.getElementById('calendar');
    let today = new Date();
    render(el, today);
  });
})();
