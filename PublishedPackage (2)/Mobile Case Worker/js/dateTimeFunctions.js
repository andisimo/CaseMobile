//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    Core.Namespace.define("AppMagic.Functions", {
        defaultYearValue: 1900, defaultMonthValue: 1, defaultDayValue: 0, defaultHourValue: 0, defaultMinuteValue: 0, defaultSecondValue: 0, defaultDateSeparator: "/", epochYear: 1970, epochMonth: 0, epochDay: 1, date: function(year, month, day) {
                if (year === null || month === null || day === null || typeof year != "number" || !isFinite(year) || typeof month != "number" || !isFinite(month) || typeof day != "number" || !isFinite(day) || year < 0 || year >= 1e4)
                    return null;
                month = month - 1;
                year < 1900 && (year += 1900);
                var dt = new Date(0);
                return dt.setHours(0, 0, 0, 0), dt.setFullYear(year, month, day), dt.valueOf()
            }, time: function(hour, minute, second) {
                if (hour === null && (hour = AppMagic.Functions.defaultHourValue), minute === null && (minute = AppMagic.Functions.defaultMinuteValue), second === null && (second = AppMagic.Functions.defaultSecondValue), typeof hour != "number" || !isFinite(hour) || typeof minute != "number" || !isFinite(minute) || typeof second != "number" || !isFinite(second))
                    return null;
                var dt = new Date(0);
                return dt.setHours(hour, minute, second, 0), dt.setFullYear(AppMagic.Functions.epochYear, AppMagic.Functions.epochMonth, AppMagic.Functions.epochDay), dt.getTime()
            }, year: function(date) {
                return date === null ? AppMagic.Functions.defaultYearValue : typeof date != "number" || !isFinite(date) ? null : new Date(date).getFullYear()
            }, month: function(date) {
                return date === null ? AppMagic.Functions.defaultMonthValue : typeof date != "number" || !isFinite(date) ? null : new Date(date).getMonth() + 1
            }, day: function(date) {
                return date === null ? AppMagic.Functions.defaultDayValue : typeof date != "number" || !isFinite(date) ? null : new Date(date).getDate()
            }, hour: function(date) {
                return date === null ? AppMagic.Functions.defaultHourValue : typeof date != "number" || !isFinite(date) ? null : new Date(date).getHours()
            }, minute: function(date) {
                return date === null ? AppMagic.Functions.defaultMinuteValue : typeof date != "number" || !isFinite(date) ? null : new Date(date).getMinutes()
            }, second: function(date) {
                return date === null ? AppMagic.Functions.defaultSecondValue : typeof date != "number" || !isFinite(date) ? null : new Date(date).getSeconds()
            }, now: function() {
                return Date.now()
            }, today: function() {
                var dt = new Date;
                return dt.setHours(0, 0, 0, 0), dt.getTime()
            }, _datePlusDay: function(date, days) {
                if (typeof date != "number" || !isFinite(date) || typeof days != "number" || !isFinite(days))
                    return null;
                var newdate = date + days * AppMagic.Functions._millisecondsPerDay;
                return newdate + (new Date(newdate).getTimezoneOffset() - new Date(date).getTimezoneOffset()) * 6e4
            }, dateAdd: function(date, delta, units) {
                if ((typeof units == "undefined" && (units = "days"), typeof date != "number" || !isFinite(date)) || typeof delta != "number" || !isFinite(delta) || typeof units != "string")
                    return null;
                delta = delta < 0 ? Math.ceil(delta) : Math.floor(delta);
                var dt = new Date(date),
                    year = dt.getFullYear(),
                    month = dt.getMonth();
                switch (units.toLowerCase()) {
                    case"years":
                        year += delta;
                        break;
                    case"quarters":
                        month += delta * 3;
                        (month >= 12 || month < 0) && (year += Math.floor(month / 12), month %= 12, month < 0 && (month += 12));
                        break;
                    case"months":
                        month += delta;
                        (month >= 12 || month < 0) && (year += Math.floor(month / 12), month %= 12, month < 0 && (month += 12));
                        break;
                    case"days":
                        var newdate = date + delta * AppMagic.Functions._millisecondsPerDay;
                        return newdate + (new Date(newdate).getTimezoneOffset() - new Date(date).getTimezoneOffset()) * 6e4;
                    default:
                        return null
                }
                var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                    maxDay = daysInMonth[month];
                month !== 1 || (year & 3) != 0 || year % 100 == 0 && year % 400 != 0 || maxDay++;
                var day = dt.getDate();
                return day > maxDay && (day = maxDay), dt.setFullYear(year, month, day), dt.getTime()
            }, dateAdd_T: function(dates, delta, unit) {
                var zipArg0 = dates,
                    zipArg1 = delta,
                    zipArg2 = unit;
                if (dates === null)
                    zipArg0 = function() {
                        return {date: dates}
                    };
                else if (!(dates instanceof Array))
                    if (typeof dates == "number" && isFinite(dates))
                        zipArg0 = function() {
                            return {date: dates}
                        };
                    else
                        return null;
                if (delta === null)
                    zipArg1 = function() {
                        return {d: delta}
                    };
                else if (!(delta instanceof Array))
                    if (typeof delta == "number" && isFinite(delta))
                        zipArg1 = function() {
                            return {d: delta}
                        };
                    else
                        return null;
                if (unit === null || typeof unit == "undefined")
                    zipArg2 = function() {
                        return {u: unit}
                    };
                else if (typeof unit != "string")
                    return null;
                else
                    zipArg2 = function() {
                        return {u: unit}
                    };
                if (dates instanceof Array && dates.length === 0 || delta instanceof Array && delta.length === 0)
                    return [];
                var operator = function(arg0, arg1, arg2) {
                        var row = {},
                            keys0 = Object.keys(arg0);
                        var keys1 = Object.keys(arg1);
                        var keys2 = Object.keys(arg2);
                        var result = AppMagic.Functions.dateAdd(arg0[keys0[0]], arg1[keys1[0]], arg2[keys2[0]]);
                        return row[AppMagic.Functions._resultColumnName] = result, row
                    };
                return AppMagic.Functions._zip(operator, zipArg0, zipArg1, zipArg2)
            }, dateDiff: function(start, end, units) {
                if ((typeof units == "undefined" && (units = "days"), typeof start != "number" || !isFinite(start)) || typeof end != "number" || !isFinite(end) || typeof units != "string")
                    return null;
                var result,
                    startdate = new Date(start),
                    enddate = new Date(end);
                switch (units.toLowerCase()) {
                    case"years":
                        result = enddate.getFullYear() - startdate.getFullYear();
                        break;
                    case"quarters":
                        result = (enddate.getFullYear() - startdate.getFullYear()) * 4 + Math.floor(enddate.getMonth() / 3) - Math.floor(startdate.getMonth() / 3);
                        break;
                    case"months":
                        result = (enddate.getFullYear() - startdate.getFullYear()) * 12 + enddate.getMonth() - startdate.getMonth();
                        break;
                    case"days":
                        result = Math.floor((end - enddate.getTimezoneOffset() * AppMagic.Functions._millisecondsPerMinute) / AppMagic.Functions._millisecondsPerDay) - Math.floor((start - startdate.getTimezoneOffset() * AppMagic.Functions._millisecondsPerMinute) / AppMagic.Functions._millisecondsPerDay);
                        break;
                    default:
                        result = null;
                        break
                }
                return result
            }, dateDiff_T: function(start, end, unit) {
                var zipArg0 = start,
                    zipArg1 = end,
                    zipArg2 = unit;
                if (start === null)
                    zipArg0 = function() {
                        return {startDate: start}
                    };
                else if (!(start instanceof Array))
                    if (typeof start == "number" && isFinite(start))
                        zipArg0 = function() {
                            return {startDate: start}
                        };
                    else
                        return null;
                if (end === null)
                    zipArg1 = function() {
                        return {endDate: end}
                    };
                else if (!(end instanceof Array))
                    if (typeof end == "number" && isFinite(end))
                        zipArg1 = function() {
                            return {endDate: end}
                        };
                    else
                        return null;
                if (unit === null || typeof unit == "undefined")
                    zipArg2 = function() {
                        return {u: unit}
                    };
                else if (typeof unit != "string")
                    return null;
                else
                    zipArg2 = function() {
                        return {u: unit}
                    };
                if (start instanceof Array && start.length === 0 || end instanceof Array && end.length === 0)
                    return [];
                var operator = function(arg0, arg1, arg2) {
                        var row = {},
                            keys0 = Object.keys(arg0);
                        var keys1 = Object.keys(arg1);
                        var keys2 = Object.keys(arg2);
                        var result = AppMagic.Functions.dateDiff(arg0[keys0[0]], arg1[keys1[0]], arg2[keys2[0]]);
                        return row[AppMagic.Functions._resultColumnName] = result, row
                    };
                return AppMagic.Functions._zip(operator, zipArg0, zipArg1, zipArg2)
            }, _dateParse: function(dateString) {
                return /^\s*[0-9]{4,4}(-[0-1][0-9](-[0-3][0-9]){0,1}){0,1}\s*$/.test(dateString) && (dateString += "T00:00:00"), Date.parse(dateString)
            }, dateValue: function(dateString) {
                if (dateString === null || typeof dateString != "string")
                    return null;
                var t = AppMagic.Functions._dateParse(dateString);
                if (isNaN(t))
                    return null;
                var dt = new Date(t);
                return dt.getFullYear() < 0 ? null : (dt.setHours(0, 0, 0, 0), dt.getTime())
            }, timeValue: function(timeString) {
                if (timeString === null || typeof timeString != "string")
                    return null;
                var dt = AppMagic.Functions._dateParse(timeString);
                return isNaN(dt.valueOf()) ? null : dt
            }, _dateTimeFormat: function(number, format) {
                if (typeof number != "number" || !isFinite(number) || typeof format != "string")
                    return null;
                var dt = new Date(number);
                if (!isFinite(dt.valueOf()))
                    return null;
                var formatInUtc = format.replace(/utc/ig, dt.toISOString());
                if (formatInUtc !== format)
                    return formatInUtc;
                format = format.replace(/[aA][mM]\/[pP][mM]/g, "\x01").replace(/[aA]\/[pP]/g, "\x02");
                for (var posMin = format.search(/m[^dyhH]+s/); posMin >= 0; )
                    format = format.substring(0, posMin) + "\n" + format.substring(posMin + 1),
                    posMin = format.search(/m[^dyhH]+s/);
                for (posMin = format.search(/[hH][^dym]+m/); posMin >= 0; )
                    posMin += format.substring(posMin).indexOf("m"),
                    format = format.substring(0, posMin) + "\n" + format.substring(posMin + 1),
                    posMin = format.search(/[hH][^dym]+m/);
                format = format.replace(/m/g, "\x03").replace(/d/g, "\x04").replace(/y/g, "\x05").replace(/h/g, "\x06").replace(/H/g, "\x07").replace(/s/g, "\b");
                var dayOfWeekNames = AppMagic.Globalization.dayNames,
                    monthNames = AppMagic.Globalization.monthNames,
                    dow = dayOfWeekNames[dt.getDay() % 7],
                    day = dt.getDate(),
                    monthName = monthNames[dt.getMonth() % 12],
                    month = dt.getMonth() + 1,
                    yearStr = dt.getFullYear().toString(),
                    hasAmPm = format.search(/[\u0001]/) >= 0 || format.search(/[\u0002]/) >= 0,
                    hr24 = dt.getHours(),
                    hr = hasAmPm ? hr24 % 12 : hr24;
                hasAmPm && hr === 0 && (hr = 12);
                var min = dt.getMinutes(),
                    sec = dt.getSeconds();
                return format = format.replace(/[\u0004][\u0004][\u0004][\u0004]+/g, dow).replace(/[\u0004][\u0004][\u0004]/g, dow.substring(0, 3)).replace(/[\u0004][\u0004]/g, AppMagic.Functions._intPartFormat(day, "00")).replace(/[\u0004]/g, day.toString()), format = format.replace(/[\u0003][\u0003][\u0003][\u0003]+/g, monthName).replace(/[\u0003][\u0003][\u0003]/g, monthName.substring(0, 3)).replace(/[\u0003][\u0003]/g, AppMagic.Functions._intPartFormat(month, "00")).replace(/[\u0003]/g, month.toString()), format = format.replace(/[\u0005][\u0005][\u0005]+/g, yearStr).replace(/[\u0005]+/g, yearStr.substr(yearStr.length - 2, 2)), format = format.replace(/[\u0007][\u0007]+/g, AppMagic.Functions._intPartFormat(hr, "00")).replace(/[\u0007]/g, hr.toString()).replace(/[\u0006][\u0006]+/g, AppMagic.Functions._intPartFormat(hr, "00")).replace(/[\u0006]/g, hr.toString()), format = format.replace(/[\u000A][\u000A]+/g, AppMagic.Functions._intPartFormat(min, "00")).replace(/[\u000A]/g, min.toString()), format = format.replace(/[\u0008][\u0008]+/g, AppMagic.Functions._intPartFormat(sec, "00")).replace(/[\u0008]/g, sec.toString()), format.replace(/[\u0001]/g, hr24 < 12 ? "AM" : "PM").replace(/[\u0002]/g, hr24 < 12 ? "a" : "p")
            }
    })
})(WinJS);