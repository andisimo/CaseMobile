//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core, Platform) {"use strict";
    var StringResources = Core.Class.define(function StringResources_ctor(resource) {
            this._resourceTree = resource;
            this._loadStringsInNamespace()
        }, {_loadStringsInNamespace: function() {
                var resources = Platform.ApplicationModel.Resources.Core.ResourceManager.current.mainResourceMap.getSubtree(this._resourceTree);
                for (var property in resources)
                    resources.hasOwnProperty(property) && (this[property] = Core.Resources.getString("/" + this._resourceTree + "/" + property).value);
                if (resources !== null && resources.first().hasCurrent) {
                    var languageResource = resources.first().current.value.candidates[0].qualifiers;
                    for (var qualifier in languageResource)
                        if (languageResource.hasOwnProperty(qualifier) && languageResource[qualifier].qualifierName === "Language") {
                            this[this._resourceTree.concat("Language")] = languageResource[qualifier].qualifierValue;
                            typeof Microsoft != "undefined" && typeof Microsoft.AppMagic != "undefined" && typeof Microsoft.AppMagic.Common != "undefined" && typeof Microsoft.AppMagic.Common.LocalizationHelper != "undefined" && typeof Microsoft.AppMagic.Common.LocalizationHelper.currentUILanguageName != "undefined" && (Microsoft.AppMagic.Common.LocalizationHelper.currentUILanguageName = languageResource[qualifier].qualifierValue);
                            break
                        }
                }
            }}, {});
    Core.Namespace.define("AppMagic", {
        Strings: new StringResources("Strings"), AuthoringStrings: new StringResources("AuthoringStrings"), ControlStrings: new StringResources("ControlStrings")
    })
})(WinJS, Windows);