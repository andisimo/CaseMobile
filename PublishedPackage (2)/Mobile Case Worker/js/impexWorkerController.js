//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var ImpexWorkerController = Core.Class.define(function ImpexWorkerController_ctor(dispatcher) {
            this._workerHandle = dispatcher.createWorker(["AppMagic", "Common", "ImpexWorker"], [], "/js/common/impexWorker.js")
        }, {
            _workerHandle: null, createZip: function(root) {
                    return this._workerHandle.invokeWorker("createZip", [root]).then(function(zipResult) {
                            return zipResult.result
                        })
                }, loadZip: function(buffer, impexID) {
                    var base64String = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer),
                        params = [{
                                base64String: base64String, impexID: impexID
                            }];
                    return this._workerHandle.invokeWorker("loadZip", params).then(function(loadResult) {
                            return loadResult.result
                        })
                }
        }, {});
    Core.Namespace.define("AppMagic.Common", {ImpexWorkerController: ImpexWorkerController})
})(WinJS);