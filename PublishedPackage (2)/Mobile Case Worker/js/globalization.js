//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core, Platform) {"use strict";
    var Globalization = Core.Class.define(function Globalization_ctor(){}, {
            _currencySymbol: null, _currentLocaleName: null, _dayNames: null, _decimalSymbol: null, _digitGroupingSymbol: null, _language: null, _monthNames: null, _negativeSymbol: null, _positiveSymbol: null, _shortDate: null, _shortTime: null, language: {get: function() {
                        return this._language === null && (this._language = AppMagic.Strings.StringsLanguage), this._language
                    }}, currentLocaleName: {get: function() {
                        return this._currentLocaleName === null && (this._currentLocaleName = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleName), this._currentLocaleName
                    }}, decimalSymbol: {get: function() {
                        return this._decimalSymbol === null && (this._decimalSymbol = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleDecimalSeparator), this._decimalSymbol
                    }}, digitGroupingSymbol: {get: function() {
                        return this._digitGroupingSymbol === null && (this._digitGroupingSymbol = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleThousandsSeparator), this._digitGroupingSymbol
                    }}, currencySymbol: {get: function() {
                        return this._currencySymbol === null && (this._currencySymbol = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleCurrencySymbol), this._currencySymbol
                    }}, positiveSymbol: {get: function() {
                        return this._positiveSymbol === null && (this._positiveSymbol = Microsoft.AppMagic.Common.LocalizationHelper.currentLocalePositiveSymbol), this._positiveSymbol
                    }}, negativeSymbol: {get: function() {
                        return this._negativeSymbol === null && (this._negativeSymbol = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleNegativeSymbol), this._negativeSymbol
                    }}, shortDate: {get: function() {
                        return this._shortDate === null && (this._shortDate = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleShortDatePattern), this._shortDate
                    }}, shortTime: {get: function() {
                        if (this._shortTime === null) {
                            var platformDatePattern = Platform.Globalization.DateTimeFormatting.DateTimeFormatter("shorttime").patterns[0],
                                hourMatch = platformDatePattern.match(/\{hour\.(.*?)\}/i),
                                minuteMatch = platformDatePattern.match(/\{minute\.(.*?)\}/i),
                                periodMatch = platformDatePattern.match(/\{period\.(.*?)\}/i),
                                hourPattern,
                                minutePattern,
                                qualificationRegEx = /\([\d+]\)/i;
                            hourPattern = qualificationRegEx.test(hourMatch[1]) ? "hh" : "h";
                            minutePattern = qualificationRegEx.test(minuteMatch[1]) ? "mm" : "m";
                            this._shortTime = platformDatePattern.replace(hourMatch[0], hourPattern).replace(minuteMatch[0], minutePattern);
                            periodMatch !== null && (this._shortTime = this._shortTime.replace(periodMatch[0], "am/pm"))
                        }
                        return this._shortTime
                    }}, dayNames: {get: function() {
                        return this._dayNames === null && (this._dayNames = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleDayNames), this._dayNames
                    }}, monthNames: {get: function() {
                        return this._monthNames === null && (this._monthNames = Microsoft.AppMagic.Common.LocalizationHelper.currentLocaleMonthNames), this._monthNames
                    }}
        }, {});
    Core.Namespace.define("AppMagic", {Globalization: new Globalization})
})(WinJS, Windows);