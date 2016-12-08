    var appDispatcher = require("./appDispatcher");
    var actions = {
        changeUrl: function (params) {
            if (history && params.href) {
                var dispatch = function () {
                    appDispatcher.dispatch ({
                        actionType: "appURLChange",
                        params: params
                    });
                };
                if (params.href === -1) {
                    
                        var changeUrl="";
                        if (location.pathname.match (/index.html/ig)) {
                            navigator.app.exitApp();
                        }
                        else if(location.pathname.match (/customerList/ig)) {
                           changeUrl="/index.html";
                        }
                        else if(location.pathname.match (/detailCustomerView/ig)){
                            changeUrl="/customerList"
                        }
                        else if(location.pathname.match (/customerTimeline/ig)){
                            changeUrl="/detailCustomerView/0"    
                        }
                         var setTimeOutId = setTimeout(function () {
                                params.href = changeUrl;
                                dispatch();
                            }, 100);
                            history.go (-1);
                }
                else {
                    history.pushState (params, "CAPP- " + params.href, params.href);
                    history.pushState (params, "CAPP- " + params.href, params.href);
                    dispatch();
                }
            }
        }
    };
    module.exports=actions;