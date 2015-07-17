//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var ProgressIndicatorViewModel = Core.Class.define(function ProgressIndicatorViewModel_ctor() {
            this._actionsInProgress = {};
            this._numberOfActionsInProgress = ko.observable(0)
        }, {
            _actionCounter: 0, _usedActionIds: null, _actionsInProgress: null, url: {get: function() {
                        return "/controls/common/progressIndicator/progressIndicator.html"
                    }}, numberOfActionsInProgress: {get: function() {
                        return this._numberOfActionsInProgress()
                    }}, addProgressAction: function() {
                    var actionId = this._actionCounter;
                    this._actionCounter++;
                    this._actionsInProgress[actionId] = !0;
                    var numInProgess = this._numberOfActionsInProgress();
                    return this._numberOfActionsInProgress(numInProgess + 1), actionId
                }, completeProgressAction: function(actionId) {
                    var isInProgress = this._actionsInProgress[actionId];
                    delete this._actionsInProgress[actionId];
                    var numberInProgress = this._numberOfActionsInProgress();
                    this._numberOfActionsInProgress(numberInProgress - 1)
                }
        }, {});
    Core.Namespace.define("AppMagic.AuthoringTool.ViewModels", {ProgressIndicatorViewModel: ProgressIndicatorViewModel})
})(WinJS);