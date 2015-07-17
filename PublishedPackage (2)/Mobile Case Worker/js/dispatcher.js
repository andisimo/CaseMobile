//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var nextMarkerId = 0,
        Dispatcher = Core.Class.define(function Dispatcher_ctor() {
            this._markerId = "disp" + (nextMarkerId++).toString()
        }, {
            _cid: 0, _pendingCalls: {}, _initialize: function(workerScript, tableScript) {
                    Markers.mark(this._markerId, "disp_init_start");
                    var that = this;
                    return new Core.Promise(function(complete, error) {
                            var worker = new Worker(workerScript),
                                init = that._notifyInit.bind(that);
                            worker.addEventListener("error", function worker_onerror(err) {
                                Log.writeln(["ERROR: Line ", err.lineno, " in ", err.filename, ": ", err.message].join(""))
                            }, !1);
                            worker.addEventListener("message", init, !1);
                            var util = AppMagic.Utility;
                            util.createPrivateImmutable(that, "_worker", worker);
                            util.createOrSetPrivate(that, "_init", init);
                            util.createOrSetPrivate(that, "_initComplete", complete);
                            util.createOrSetPrivate(that, "_initError", error);
                            Markers.mark(that._markerId, "disp_worker_post_init");
                            that._worker.postMessage(tableScript)
                        })
                }, _notifyInit: function(ev) {
                    Markers.mark(this._markerId, "disp_worker_init_complete");
                    var resp = ev.data;
                    if (resp.id === 0) {
                        if (resp.status === AppMagic.Constants.Dispatch.status.error)
                            if (this._initError)
                                this._initError(resp.message);
                            else
                                throw new Error(AppMagic.Strings.DispatcherInitFailure);
                        else
                            resp.status === AppMagic.Constants.Dispatch.status.success && (this._worker.removeEventListener("message", this._init, !1), this._worker.addEventListener("message", this._notifyPost.bind(this), !1), this._initComplete && this._initComplete(this));
                        var util = AppMagic.Utility;
                        util.createOrSetPrivate(this, "_init", null);
                        util.createOrSetPrivate(this, "_initComplete", null);
                        util.createOrSetPrivate(this, "_initError", null)
                    }
                    Markers.mark(this._markerId, "disp_init_complete");
                    Dispatcher._dumpMarkers(this._markerId, resp.debug)
                }, _notifyPost: function(ev) {
                    Markers.mark(this._markerId, "disp_worker_op_complete");
                    var resp = ev.data;
                    var pending = this._pendingCalls[resp.id];
                    if (pending && delete this._pendingCalls[resp.id], resp.status === AppMagic.Constants.Dispatch.status.error)
                        if (pending && pending.error)
                            pending.error(resp.message);
                        else
                            throw new Error(resp.message);
                    else
                        resp.status === AppMagic.Constants.Dispatch.status.success && (pending && pending.complete ? pending.complete(resp.result) : this.dispatchEvent("unknown", resp.result));
                    Markers.mark(this._markerId, "disp_op_complete");
                    Dispatcher._dumpMarkers(this._markerId, resp.debug)
                }, _getNextId: function() {
                    for (var id = ++this._cid; this._pendingCalls[id]; )
                        this._cid === Number.MAX_VALUE && (this._cid = 0),
                        id = ++this._cid;
                    return id
                }, post: function(op, payload) {
                    Markers.mark(this._markerId, "disp_op_start");
                    var that = this;
                    return new Core.Promise(function(complete, error) {
                            var id = that._getNextId();
                            that._pendingCalls[id] = {
                                complete: complete, error: error
                            };
                            Markers.mark(that._markerId, "disp_worker_post_op");
                            that._worker.postMessage({
                                id: id, op: op, payload: payload
                            })
                        })
                }
        }, {_dumpMarkers: function(id, worker_marks) {
                var marks = Markers.get(id);
                if (worker_marks instanceof Array && (marks = marks.concat(worker_marks)), marks = marks.sort(function(x, y) {
                    return x.timestamp - y.timestamp
                }), Markers.clear(id), marks.length > 0) {
                    Log.writeln(marks[0].tag);
                    for (var total = 0, lastStamp = marks[0].timestamp, i = 1, len = marks.length; i < len; i++) {
                        var thisStamp = marks[i].timestamp,
                            delta = marks[i].timestamp - lastStamp;
                        lastStamp = thisStamp;
                        total += delta;
                        Log.writeln(marks[i].tag + ": " + delta.toString() + " ms")
                    }
                    Log.writeln("Total time: " + total.toString() + " ms")
                }
            }});
    Core.Class.mix(Dispatcher, Core.Utilities.eventMixin);
    var WORKER_SCRIPT = AppMagic.Config.Worker.dispatchWorkerjs,
        createWorker = function(tableScript) {
            var disp = new Dispatcher;
            return disp._initialize(WORKER_SCRIPT, tableScript)
        };
    Core.Namespace.define("AppMagic.Workers", {create: createWorker})
})(WinJS);