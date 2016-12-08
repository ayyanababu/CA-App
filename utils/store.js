import React from 'react';
//delete GLOBAL.XMLHttpRequest;
import {AppRegistry, Navigator, StyleSheet, Text, View, AsyncStorage} from 'react-native'
import {Actions} from "react-native-router-flux";
var loginCredential={};
var filterListJson={};
var userFullname="";
var userType="";
var currentTrackSalesPersonName = ""
var customerJson2={};
var redAccountsCount=0;
var yellowAccountsCount=0;
var greenAccountsCount=0;
var blackAccountsCount=0;
var customerJsonNew = {
    }
};
var salesColor;
var pepsColor;
var ceColor;
var keyTitle = {};
var newJson={};
var selectedCustomer="";
var selectedTrack="";
var commentsJson={};
var customFilterJson={};
var baseURL = "";
var productionURL = "";
productionURL = baseURL;
class Store {

    getKeyTitle()
    {
        return keyTitle;
    }

    setKeyTitle(key){
        keyTitle['val']= key;
    }
    setLoginCredential(key, value) {
        loginCredential[key] = value;
    }

    getLoginCredential(){
        return loginCredential;
    }

    getCustomerJson() {
        return customerJson;
    }
    getUserFullName() {
        return userFullname;
    }
    getUserType() {
        return userType;
    }

    getRedAccountsCount() {
        return redAccountsCount;
    }

    getYellowAccountsCount() {
        return yellowAccountsCount;
    }

    getGreenAccountsCount() {
        return greenAccountsCount;
    }

    getBlackAccountsCount() {
        return blackAccountsCount;
    }
    setSalesStausColor(color){
        salesColor = color
    }

    setPspeStatusColor(color){
        pepsColor = color
    }

    setCustomerExecStatus(color){
        ceColor = color
    }

    getSalesStausColor(){
        return salesColor
    }

    getPspeStatusColor(){
        return pepsColor
    }

    getCustomerExecStatus(){
        return ceColor
    }
    getCustomFilterJson() {
        /*AsyncStorage.getItem("filterData", (err, result) => {
            if(result){
                return result;
            }
            else {
                return {};
            }
        });*/
        return customFilterJson;
    }
    setCustomFilterJson(obj) {
        //AsyncStorage.setItem("filterData",obj)
        customFilterJson = obj;
    }
    getNewJson() {

        //for demo data
        // if(newJson.length==undefined )
         //  this.createOurJson(customerJsonNew);
         return newJson;
     }
    getCommentsJson() {
        return commentsJson;
    }
    setCommentJson(commentJson) {

        commentsJson[this.getSelectedCustomer()]={};
        commentsJson[this.getSelectedCustomer()][this.getSelectedTrack()]=[];
        commentsJson[this.getSelectedCustomer()][this.getSelectedTrack()].push(commentJson);
    }

    getFilterListJson() {
        return filterListJson;
    }

    setSelectedCustomer(custname) {
        selectedCustomer = custname;
    }
    getSelectedCustomer() {
     return selectedCustomer;
    }

    getCurrentView() {
        return currentView;
    }

    setCurrentView(raci) {
        currentView = raci;
    }

    setSelectedTrack(trackname) {
        selectedTrack = trackname;
    }

    setcurrentTrackSalesPersonName(salePersonName){
      currentTrackSalesPersonName = salePersonName
    }

    getcurrentTrackSalesPersonName(){
      return currentTrackSalesPersonName;
    }

    getSelectedTrack() {
        return selectedTrack;
    }

    setLatestSalesComment(latestComment){
        latestSalesComment = latestComment;
    }
    setLatestPEPSComment(latestComment){
        latestPEPSComment = latestComment;
    }
    getLatestSalesComment(){
        return latestSalesComment;
    }
    getLatestPEPSComment(){
        return latestPEPSComment;
    }

    getCurrentCustomerStatus(name,json,role) {
        if(json) {
            var keys = Object.keys(json);
            for (var i = 0; i < keys.length; i++) {
                if (name == keys[i]) {
                    var weekObj = json[keys[i]];
                    return weekObj[role];
                    //return weekObj;
                }
            }
        }
        return -1;
    }

    ifAlreadyExists(newJsonArray,obj) {
        for(var i=0;i<newJsonArray.length;i++) {
            var keys = Object.keys(newJsonArray[i]);
            if(newJsonArray[i][keys[0]].customername == obj.customername)
                return i;
        }
        return -1;
    }

    makeWeekArray(weekObj,role) {
        // get all the week status
        if(!weekObj) {
            // if the week data does not exist
            return -1;
        }
        var tempArr=[];
        var weekJson={};
        var statusKeys = Object.keys(weekObj);
        for(var x=0;x<statusKeys.length;x++) {
           if(statusKeys[x] == role) {
                var weekKeys = Object.keys(weekObj[statusKeys[x]]);
                for(var i=0;i<weekKeys.length;i++) {
                    var key = weekKeys[i];
                    if(weekKeys[i]=="week_1")
                        weekJson["weekName"] = "This Week ";
                    else if(weekKeys[i]=="week_2")
                        weekJson["weekName"] = "Last Week ";
                    else if(weekKeys[i]=="week_3")
                        weekJson["weekName"] = "<<<";
                    else
                        weekJson["weekName"] = "<<<<";
                    weekJson["weekStatus"] =  weekObj[statusKeys[x]][key]?weekObj[statusKeys[x]][key]:'black';
                    tempArr.push(weekJson);
                    weekJson={};
                }
            }
        }
        if(baseURL == productionURL)
        return tempArr;
        //production
        return tempArr.reverse();
    }

    sortAndRemoveRedundancy(Arr) {
        var finalArr = [];
        var sortedArr = Arr.sort();
        for(i=0;i<sortedArr.length;i++){
            if(sortedArr[i]==sortedArr[i+1]) {continue}
            finalArr[finalArr.length]=sortedArr[i];
        }
        return finalArr;
    }
    changeNameToCamelCase(str) {
        var words = str.split(" ");
        var finalStr="";
        for(var i=0;i<words.length;i++) {
            finalStr=finalStr+words[i].substr(0,1).toUpperCase()+words[i].substr(1).toLowerCase()+" ";
        }
        return finalStr;
    }

    createOurJson (json) {
        //add only unique entries for customers and their overall status.
        var newJsonArray = [];
        var accountable = [];
        var sales = [];
        var region = [];
        var stage = [];
        var bu = [];
        var customerJson = json.ProjectDetails;
        var dummyWeekTrend = [{}, {}, {}, {}]
        for (var i = 0; i < customerJson.length; i++) {
            //add only single entries of objects and merge similar objects data
            var index = this.ifAlreadyExists(newJsonArray, customerJson[i]);
            var tempTrackJson = {};
            tempTrackJson[customerJson[i].track] = customerJson[i];
            //var custNameInCamelCase = this.changeNameToCamelCase(customerJson[i].customername);
            var custNameInCamelCase = customerJson[i].customername;
            if (index == -1) {
                //get the overAll default status- week 1
                var tempJson = {};
                var tempJson2 = {};
                var temparr = [];
                tempJson['customername'] = custNameInCamelCase;
                var weekObj = this.getCurrentCustomerStatus(customerJson[i].customername, json.status, this.getJsonKeyForWeekTrend("Sales Status"));
                var status = weekObj["week_1"] ? weekObj["week_1"] : 'black';
                //if week trens does not exist
                if (weekObj == -1)
                    status = "none";
                tempJson["overallStatus"] = status;
                // add condition if status is not available in the json for that customer
                //temparr.push(tempTrackJson);
                tempJson['tracks'] = tempTrackJson;
                var weekStatus = this.makeWeekArray((json.status[customerJson[i].customername]), this.getJsonKeyForWeekTrend("Sales Status"));
                tempJson['weekStatus'] = weekStatus != -1 ? weekStatus : [];
                tempJson2[custNameInCamelCase] = tempJson;
                newJsonArray.push(tempJson2);
            }
            else {
                //if customer already present find it and add another entry in the tracks
                newJsonArray[index][custNameInCamelCase].tracks[customerJson[i].track] = customerJson[i];
            }
            accountable.push.apply(accountable, customerJson[i].accountable);
            sales.push(customerJson[i].sales);
            region.push(customerJson[i].state);
            stage.push(customerJson[i].stage);
            bu.push(customerJson[i].bu);
        }
        newJson = newJsonArray;
        //creating the array for filters
        var filteredJson = {};
        var tempJson = {};
        tempJson["BU"] = this.sortAndRemoveRedundancy(bu);
        tempJson["Stage"] = this.sortAndRemoveRedundancy(stage);
        tempJson["Region"] = this.sortAndRemoveRedundancy(region);
        tempJson["Sales Contact"] = this.sortAndRemoveRedundancy(sales);
        tempJson["Accountable"] = this.sortAndRemoveRedundancy(accountable);

        filterListJson = tempJson;

        //saving user details
        if (json.user) {
            if (json.user["name"])
                userFullname = json.user["name"];
            userType = !!json.user["isSuperUser"];
        }
    }
    getIssueCount(color,jsonArr) {
        var count = 0;
        var countNull = 0;
        for(var i=0;i<jsonArr.length;i++){
            var tempKeys = Object.keys(jsonArr[i]);
            if(jsonArr[i][tempKeys[0]].overallStatus.toLowerCase() == color)
                count++;
            else if(jsonArr[i][tempKeys[0]].overallStatus.toLowerCase() !='black' && jsonArr[i][tempKeys[0]].overallStatus.toLowerCase() != 'red' && jsonArr[i][tempKeys[0]].overallStatus.toLowerCase() != 'green' && jsonArr[i][tempKeys[0]].overallStatus.toLowerCase() != 'yellow')
                countNull++;
        }
        if(color == "red")
            redAccountsCount = count;
        else if(color == "green")
            greenAccountsCount = count;
        else if(color == "black"){
            blackAccountsCount = count + countNull;
        }
        else
            yellowAccountsCount = count;
        if (color == 'black'){
            return count + countNull
        }
        else
            return count;
    }
    getJsonKeyForWeekTrend(key){
        this.setKeyTitle(key);
        if(key == "CE Status")
            return "ce_status";
        else if(key == "PE/PS Status")
             return "pe_ps";
        else
            return "sales";
    }

    updateJson(personType) {
        //update JSON based o nthe role of the user selected
        //change overall Status and Week status for each customer
        var key = this.getJsonKeyForWeekTrend(personType.role);

        for(var i=0;i<newJson.length;i++) {
            var keys = Object.keys(newJson[i]);
            var weekObj = this.getCurrentCustomerStatus(keys[0],customerJson2.status,key)
            var status = weekObj["week_1"] ? weekObj["week_1"]:'black';
            //if week trens does not exist
            if(weekObj == -1)
                status = "none";
            newJson[i][keys[0]]["overallStatus"] = status;
            var weekStatus = this.makeWeekArray((customerJson2.status[newJson[i][keys[0]]["customername"]]),key);
            newJson[i][keys[0]]["weekStatus"] = weekStatus;
        }
    }
    ifPresent(name, arr) {
        if(!arr || arr.length == 0)
            return true;
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i] == name)
                return true;
        }
        return false;
    }
    applyFilters(filterValuesJson) {
        var tempArray=[];
        //using demo JSON
        //this.createOurJson(customerJsonNew);
        //using actual data
        this.createOurJson(customerJson2);
        for(var i=0;i<newJson.length;i++) {
            var keys = Object.keys(newJson[i]);
            //check if name exists in the filter Array or not
            var trackaArr=[];
            var trackKeys=[];
            if(keys && keys[0] && newJson[i][keys[0]] && newJson[i][keys[0]].tracks)
                trackaArr = newJson[i][keys[0]].tracks;
            if(trackaArr.length != 0)
                trackKeys = Object.keys(trackaArr);
            for(var j=0;j< trackKeys.length;j++) {
                if (trackaArr[trackKeys[j]]["accountable"] && this.ifPresent(trackaArr[trackKeys[j]]["accountable"][0], filterValuesJson["Accountable"]) && this.ifPresent(trackaArr[trackKeys[j]]["sales"], filterValuesJson["Sales Contact"]) && this.ifPresent(trackaArr[trackKeys[j]]["state"], filterValuesJson["Region"]) && this.ifPresent(trackaArr[trackKeys[j]]["stage"], filterValuesJson["Stage"]) && this.ifPresent(trackaArr[trackKeys[j]]["bu"], filterValuesJson["BU"])) {
                    tempArray.push(newJson[i]);
                    break;
                }
            }
        }
        newJson = tempArray;
        if(filterValuesJson["Accountable"].length==0 && filterValuesJson["Sales Contact"].length==0 && filterValuesJson["Region"].length==0 && filterValuesJson["Stage"].length==0 && filterValuesJson["BU"].length==0) {
            this.createOurJson(customerJson2);
        }
    }

    onSendUpdateJson(name, track, status, color, comment) {
       var tempJson = this.getNewJson();
       //alert("customerName: " + customerName + "\n" + "CustomerTrack: " + customerTrack + "\n" + "status: " + status  + "\n" + "Color: "+ color + "\n" + "Comment: " + comment)
       for(var i=0; i<tempJson.length; i++) {
         var customerObj = tempJson[i];
         if(Object.keys(customerObj)[0] == name){
           var customerTrack = customerObj[Object.keys(customerObj)[0]].tracks[track]
           customerTrack[status] = color
           break;
         }
       }

        newJson = tempJson;
        var weekKey="";
        if(status == "ps_pe_status")
            weekKey = "pe_ps";
        else if(status == "customer_execution_status")
            weekKey = "ce_status";
        else
            weekKey = "sales";
        //also changing the status for Week trend
        var weekStatus = customerJson2.status[name][weekKey];
        weekStatus["week_1"]=color;
    }

    getCustomerList(sucessCallBack,failureCallback) {
        loginCredential=this.getLoginCredential();
        var that=this;

        if(loginCredential.username == null || loginCredential.password ==null)
        {
            failureCallback();
        }

        else if(loginCredential.username.toLocaleLowerCase()=="" && loginCredential.password==""){
            customerJson2 = customerJsonNew;
            this.createOurJson(customerJsonNew);
            sucessCallBack();
        }


        else  {
            if
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            myHeaders.append("username", userName)
            myHeaders.append("password", loginCredential.password)
            var obj = {method: 'POST', headers: myHeaders, body: JSON.stringify(loginCredential)}
            fetch(productionURL + "/v2/login", obj)


                .then((response) => response.json())
                .then((responseData) => {
                    AsyncStorage.setItem("username", loginCredential.username, ()=> {
                    })
                    customerJson2 = responseData;
                    //customerJson = customerJson2;
                    //Create the new JSON with this customer JSON
                    that.createOurJson(customerJson2);
                    sucessCallBack();
                    //Actions.navbar("");
                })
                .catch((error) => {
                    //console.log("Server call error is:",error);
                    failureCallback();
                })
                .done();
        }
    }

    getSelectedUserContact(ldapUserName, sucessCallBack, errorCallback){

        var inputParams = {};
        inputParams["ldap_username"] = ldapUserName
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("username", userName)
        myHeaders.append("password", loginCredential.password)

        var obj = {method: 'POST',headers:myHeaders,body: JSON.stringify(inputParams)}

        fetch(productionURL+"/person", obj)
            .then((response) => response.json())
            .then((responseData) => {
              sucessCallBack(responseData);
            })
            .catch((error) => {
                //console.log("Server call error is:",error);
                errorCallback(error);
             })
            .done();

    }

    getEmailIDsOfRACIUsers(raciNames, sucessCallBack, errorCallback){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("username", userName)
        myHeaders.append("password", loginCredential.password)

      var obj = {method: 'POST',headers:myHeaders, body: JSON.stringify(raciNames)}

      fetch(productionURL+"/persons", obj)
          .then((response) => response.json())
          .then((responseData) => {
            sucessCallBack(responseData);
          })
          .catch((error) => {
              //console.log("Server call error is:",error);
              errorCallback(error);
           })
          .done();
    }

    createOwnCommentsArray(commentsArray){
        var newCommentsJson = [];
        var insideJson = {};
        var insideCommentArray = [];
        var finalJson={};
        for(var i=0;i<commentsArray.length;i++){
            insideCommentArray=[];
            if(finalJson[commentsArray[i].track])
                insideCommentArray=finalJson[commentsArray[i].track];
            insideCommentArray.push(commentsArray[i]);
            //insideJson[commentsArray[i].track]=commentsArray[i];
            finalJson[commentsArray[i].track] = insideCommentArray;
        }
        var tempJson={};
        tempJson[this.getSelectedCustomer()]=finalJson;
        commentsJson = tempJson;
        console.log(commentsJson);
    }

    getComments(successCallback,failureCallback){
        var that = this;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("username", userName);
        myHeaders.append("password", loginCredential.password);
        var obj = {method: 'POST',headers:myHeaders}

        if(!this.getCommentsJson()[this.getSelectedCustomer()]) {
            fetch(productionURL+"/v2/comments?account=" + "'"+encodeURI(that.getSelectedCustomer())+"'",obj)
                .then((response) => response.json())
                .then((responseData) => {
                    this.createOwnCommentsArray(responseData)
                    successCallback();
                })
                .catch((error) => {
                    //console.log("Server call error is:",error);
                    failureCallback();
                })
                .done();
        }
        else
        {
            successCallback();
        }
    }

    logout(){
        //AsyncStorage.removeItem("username");
        loginCredential={};
        //clearing the filter data
        customFilterJson={};
        //clearing the comments json
        commentsJson={};

        newJson={};
        selectedCustomer="";
        selectedTrack="";
        //Actions.pop();
        Actions.login({type: 'push'});
        Actions.login({type: 'reset'});

    }
    updateComments(commentsJson,successCallback,failureCallback){
        var updateCommentJson = {};
        updateCommentJson["pv_account"]=this.getSelectedCustomer();
        updateCommentJson["pv_track"]=this.getSelectedTrack();
        updateCommentJson["pv_user"]=this.getUserFullName();
        updateCommentJson["pv_status"]=commentsJson.status;
        /*var i = 0;
        commentsJson.newComment = commentsJson.newComment.replace(/\n/g, function () {
            return ++i == 4 ? "" : "\n";
        });*/
        updateCommentJson["pv_comment"]=commentsJson.newComment;
        updateCommentJson["pv_type"]=commentsJson.type;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("username", userName);
        myHeaders.append("password", loginCredential.password);

        var obj = {method: 'POST', headers:myHeaders, body: JSON.stringify(updateCommentJson)}
        fetch(productionURL+"/v2/comments/update", obj)
            .then((response) => response.json())
            .then((responseData) => {
                successCallback(commentsJson.newComment);
            })
            .catch((error) => {
                //console.log("Server call error is:",error);
                failureCallback();
            })
            .done();
    }
}
export default new Store();
