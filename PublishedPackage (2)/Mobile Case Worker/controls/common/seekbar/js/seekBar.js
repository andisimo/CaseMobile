//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var util = AppMagic.Utility,
        seekBarThumbSrcUrl = "controls/common/seekBar/images/seekBarThumb.svg",
        seekBarThumbSelectedSrcUrl = "controls/common/seekBar/images/seekBarThumbSelected.svg",
        seekBarTrackClassSelector = ".appmagic-seekbar-track",
        seekBarThumbClassSelector = ".appmagic-seekbar-thumb",
        seekBarFillSelector = ".appmagic-seekbar-fill",
        SeekBarView = Core.Class.define(function SeekBar_ctor(element) {
            this._element = element;
            this._seekBarTrack = this._element.querySelector(seekBarTrackClassSelector);
            this._seekBarThumb = this._element.querySelector(seekBarThumbClassSelector);
            this._seekBarFill = this._element.querySelector(seekBarFillSelector);
            this._onMSPointerEventHandler = this._onMSPointerEvent.bind(this);
            this._element.addEventListener("MSPointerDown", this._onMSPointerEventHandler, !0);
            this._element.addEventListener("MSPointerUp", this._onMSPointerEventHandler, !0);
            this._element.addEventListener("MSPointerMove", this._onMSPointerEventHandler, !0);
            this._seekBarThumbSrc = ko.observable(seekBarThumbSrcUrl);
            this._seekBarFillWidth = ko.observable();
            this._updateSeekBarFillWidth(element.value());
            this._element.value.subscribe(this._updateSeekBarFillWidth, this);
            this._element.min.subscribe(this._updateSeekBarFillWidth, this);
            this._element.max.subscribe(this._updateSeekBarFillWidth, this);
            ko.applyBindings(this, element.children[0])
        }, {
            _element: null, _seekBarTrack: null, _seekBarThumb: null, _seekBarThumbSrc: null, _seekBarFillWidth: null, _isManipulating: !1, _onMSPointerEventHandler: null, _updateSeekBarFillWidth: function(newValue) {
                    var min = this._element.min(),
                        max = this._element.max();
                    this._seekBarFillWidth(util.clamp((newValue - min) / (max - min) * 100, 0, 100).toString() + "%")
                }, seekBarFillWidth: {get: function() {
                        return this._seekBarFillWidth()
                    }}, seekBarThumbSrc: {get: function() {
                        return this._seekBarThumbSrc()
                    }}, _updateValue: function(e) {
                    var offsetX = e.offsetX;
                    e.target === this._seekBarThumb && (offsetX = this._seekBarThumb.offsetLeft - this._element.offsetLeft + e.offsetX);
                    var fractionWidth = offsetX / this._seekBarTrack.offsetWidth,
                        min = this._element.min(),
                        max = this._element.max();
                    this._element.value(util.clamp(fractionWidth * (max - min) + min, min, max))
                }, _onMSPointerEvent: function(e) {
                    var elt = this._element;
                    switch (e.type) {
                        case"pointerdown":
                            this._updateValue(e);
                            this._isManipulating = !0;
                            this._seekBarThumbSrc(seekBarThumbSelectedSrcUrl);
                            this._element.msSetPointerCapture(e.getCurrentPoint(e.currentTarget).pointerId);
                            break;
                        case"pointerup":
                        case"pointercancel":
                            this._isManipulating = !1;
                            e.cancelBubble = !0;
                            e.stopImmediatePropagation();
                            this._seekBarThumbSrc(seekBarThumbSrcUrl);
                            this._element.msReleasePointerCapture(e.getCurrentPoint(e.currentTarget).pointerId);
                            break;
                        case"pointermove":
                            this._isManipulating && this._updateValue(e);
                            e.cancelBubble = !0;
                            e.stopImmediatePropagation();
                            break
                    }
                }
        }, {});
    AppMagic.UI.Pages.define("/controls/common/seekBar/seekBar.html", SeekBarView)
})(WinJS);