//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
(function(Core) {"use strict";
    var PromiseQueue = Core.Class.define(function PromiseQueue_ctor() {
            this._jobs = [];
            this._currentRunningJob
        }, {
            _jobs: null, _currentRunningJob: null, _isCanceling: !1, cancelAll: function() {
                    if (this._jobs.length > 0) {
                        this._isCanceling = !0;
                        for (var i = 0, len = this._jobs.length; i < len; i++)
                            this._jobs[i].promise.cancel();
                        this._isCanceling = !1;
                        this._jobs.splice(0, this._jobs.length)
                    }
                    this._currentRunningJob !== null && this._currentRunningJob.promise.cancel()
                }, getJobsCount: function() {
                    return (this._currentRunningJob === null ? 0 : 1) + this._jobs.length
                }, pushJob: function(fnThatReturnsPromise) {
                    var newJob = {},
                        promise = new Core.Promise(function(start) {
                            newJob.start = start
                        });
                    return this._jobs.push(newJob), promise = promise.then(fnThatReturnsPromise).then(function(result) {
                            return this._shiftJobsAndStartNextJobIfExists(), result
                        }.bind(this), function(error) {
                            if (this._isCanceling || this._shiftJobsAndStartNextJobIfExists(), AppMagic.Utility.isCanceledError(error))
                                throw error;
                            throw error;
                        }.bind(this)), newJob.promise = promise, this._currentRunningJob === null && this._shiftJobsAndStartNextJobIfExists(), promise
                }, _shiftJobsAndStartNextJobIfExists: function() {
                    this._jobs.length > 0 ? (this._currentRunningJob = this._jobs.shift(), this._currentRunningJob.start()) : this._currentRunningJob = null
                }
        }, {});
    Core.Namespace.define("AppMagic.Services", {PromiseQueue: PromiseQueue})
})(WinJS);