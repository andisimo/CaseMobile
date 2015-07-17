//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var RequirementsManager = Core.Class.define(function RequirementsManager_ctor() {
            this._injectionCache = {}
        }, {
            _injectionCache: null, _shouldInclude: function(req) {
                    return !req.authoringOnly && req.shouldInclude
                }, ensureRequirements: function(requirements) {
                    var asyncRequirements = [],
                        count;
                    typeof requirements == "object" && (typeof requirements.length == "number" ? count = requirements.length : typeof requirements.size == "number" && (count = requirements.size));
                    for (var i = 0; i < count; i++) {
                        var req = requirements[i];
                        this._shouldInclude(req) && asyncRequirements.push(this.loadRequirement(req))
                    }
                    return Core.Promise.join(asyncRequirements)
                }, loadRequirement: function(req) {
                    if (this._injectionCache[req.resource])
                        return this._injectionCache[req.resource];
                    var promise;
                    switch (req.requirementType) {
                        case Microsoft.AppMagic.Authoring.ControlRequirementType.javaScript:
                            promise = AppMagic.AuthoringTool.DomUtil.injectScript(req.resource);
                            break;
                        case Microsoft.AppMagic.Authoring.ControlRequirementType.css:
                            promise = AppMagic.AuthoringTool.DomUtil.injectCss(req.resource);
                            break;
                        case Microsoft.AppMagic.Authoring.ControlRequirementType.markup:
                            promise = AppMagic.AuthoringTool.DomUtil.injectMarkup(req.resource);
                            break;
                        default:
                            break
                    }
                    return promise ? (this._injectionCache[req.resource] = WinJS.Promise.as(promise), this._injectionCache[req.resource]) : Core.Promise.wrapError("The requirementManager class was called incorrectly")
                }
        });
    Core.Namespace.define("AppMagic.Controls", {RequirementsManager: RequirementsManager})
})(WinJS);