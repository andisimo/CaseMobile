//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
importScripts("//Microsoft.WinJS.2.0/js/base.js", "/js/config.worker.js");
importScripts(AppMagic.Config.Worker.constantsjs, AppMagic.Config.Worker.contractsjs, AppMagic.Config.Worker.debugjs);
importScripts("/js/common/stringResources.js"),
function(Core) {"use strict";
    var dispatchInit = function(ev) {
            Markers.mark(0, "disp_init_start");
            var script = ev.data;
            try {
                importScripts(script)
            }
            catch(ex) {
                AppMagic.Dispatch.postError(0, AppMagic.Strings.InvalidDispatchScript);
                return
            }
            AppMagic.Dispatch.table ? (self.removeEventListener("message", dispatchInit, !1), self.addEventListener("message", dispatchRoute, !1), AppMagic.Dispatch.postResult(0, !0)) : AppMagic.Dispatch.postError(0, AppMagic.Strings.InvalidDispatchTable)
        },
        dispatchRoute = function(ev) {
            Markers.mark(ev.data.id, "disp_worker_op_start");
            var req = ev.data;
            var fn = AppMagic.Dispatch.table[req.op];
            if (typeof fn != "function")
                AppMagic.Dispatch.postError(req.id, AppMagic.Strings.InvalidOperationError);
            else
                try {
                    fn(req.id, req.payload)
                }
                catch(ex) {
                    AppMagic.Dispatch.postError(req.id, ex.toString())
                }
        };
    Core.Namespace.define("AppMagic.Dispatch", {
        postError: function(id, msg) {
            self.postMessage({
                id: id, status: AppMagic.Constants.Dispatch.status.error, message: msg
            })
        }, postResult: function(id, result) {
                Markers.mark(id, "disp_worker_post_result");
                var marks = Markers.get(id);
                Markers.clear(id);
                self.postMessage({
                    id: id, status: AppMagic.Constants.Dispatch.status.success, result: result, debug: marks
                })
            }
    });
    self.addEventListener("message", dispatchInit, !1)
}(WinJS);