//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    Core.Namespace.define("Markers", {
        _marks: [], mark: function(id, tag) {
                this._marks.push({
                    id: id, tag: tag, timestamp: Date.now()
                })
            }, clear: function(id) {
                this._marks = this._marks.filter(function(v) {
                    return v.id !== id
                })
            }, clearAll: function() {
                this._marks = []
            }, get: function(id) {
                return this._marks.filter(function(v) {
                        return v.id === id
                    })
            }
    })
})(WinJS);