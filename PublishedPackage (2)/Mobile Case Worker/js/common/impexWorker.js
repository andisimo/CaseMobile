﻿//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
importScripts("../../openSource/unmodified/jszip/jszip.js", "../../openSource/unmodified/jszip/jszip-deflate.js", "../../openSource/unmodified/jszip/jszip-inflate.js", "../../openSource/unmodified/jszip/jszip-load.js", "/js/common/collectionZipUtilities.js"),
function(Core) {"use strict";
    var ImpexWorker = Core.Class.define(function ImpexWorker_ctor(){}, {
            createZip: function(root) {
                return AppMagic.Data.createZip(root)
            }, loadZip: function(args) {
                    return AppMagic.Data.loadZip(args)
                }
        }, {});
    Core.Namespace.define("AppMagic.Common", {ImpexWorker: ImpexWorker})
}(WinJS);