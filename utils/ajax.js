    var actions = require("./actions");

    var Ajax = {
        doCall: function (parameters) {
            parameters = parameters || {};
            var callbackSuccess = parameters.callbackSuccess
            var callbackFailure = parameters.callbackFailure
            var thisObj = parameters.thisObj || this;
            $.ajax({
                type: parameters.type,
                data: parameters.data,
                url: parameters.url,
                dataType: "json",
                async: true,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                success: function (data) {
                    if (data.error) {
                        Server.ShowMessage(true, data.error);
                    }
                    else if (callbackSuccess) {
                        callbackSuccess(data);
                    }
                }.bind(thisObj),
                error: function (jqXHR) {
                    if (callbackFailure) {
                        callbackFailure(jqXHR);
                    }
                }.bind(thisObj)
            });
        },
        onXHRError: function (jqXHR) {
            var response;
            response = jqXHR.responseJSON;
            if (response) {
                var message = "", messageType = typeof response.message;
                if ("string" === messageType) {
                    message = response.message;
                }
                else {
                    message = response.message[0];
                }
                Server.showErrorMessage(message);
            }
        }
    };
    module.exports=Ajax;