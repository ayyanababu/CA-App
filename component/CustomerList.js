import React from 'react';
var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
var reactMixin = require('react-mixin');
import {View, Text,TextInput,TouchableOpacity, StyleSheet,Dimensions,TouchableHighlight,ScrollView,Image,ListView,Component,ActivityIndicatorIOS} from "react-native";
import Button from "react-native-button";
import {Actions,NavBar,DefaultRenderer} from "react-native-router-flux";
import Drawer from 'react-native-drawer';
var Popover = require('react-native-popover');
import Store from '../utils/store.js';
import Popup from 'react-native-popup';
import Spinner from './Spinner.js';
import ContactModel from './ContactModel';
import Icon from '../utils/CAPP';
var styles = StyleSheet.create({
    landingView: {
        flex:1,
    },

    parentContainer: {
        flex:1
    },
    
    outsideContainer: {
        paddingBottom:50,
        marginBottom:40
    },
    container: {
        backgroundColor:'#ffffff',
        borderRadius:15,
        flex:1,
        marginBottom:5,
        marginLeft:5,
        marginRight:5,
        /* backgroundColor:'yellow'*/
    },
    listView: {
        marginBottom:65,
        overflow:"hidden"
    },
    weekImage: {
        width: 20,
        height: 20,
        marginLeft:20,
        marginRight:20,
        alignItems:'center',
        borderRadius:25,
        /*backgroundColor:'red',*/
        justifyContent:'center',
    },
    custName: {
        fontFamily: 'Lato-Regular',
        fontSize:25,
        fontStyle:'normal',
        fontWeight:'bold',
        color:"#414042",
        justifyContent:'flex-start',
        alignItems:'flex-start',
        marginRight:0,
        marginLeft:15,
        /*width:250,*/
        flex:0.8,
        marginBottom:5,
        /*backgroundColor:'cyan'*/
    },
    custStatus: {
        flex:0.2,
        alignItems:'center',
        justifyContent:'center',
        /*backgroundColor:'orange',*/
        paddingRight:10,
    },
    divider: {
        backgroundColor:'#e9e9ef',
        /*width:320,*/
        flex:0.9,
        height:2,
        marginBottom:10,
        borderRadius:15,
    },
    row0: {
        flexDirection: 'row',
        flex:0.8,
        alignItems:'center',
        borderRadius:15,
        /*backgroundColor:'green'*/
    },
    popover: {
        flexDirection: 'row',
        //backgroundColor:'white',
        position: 'relative',
        elevation:0.8,
        borderColor:"gray",
        paddingTop:5,
        paddingLeft:5,
    },
    row1: {
        flexDirection: 'row',
        /*backgroundColor:'white',*/
        /*flex:0.05,*/
        justifyContent:'center',
        marginTop:3,
        marginBottom:3,
        paddingLeft: 10
        //backgroundColor:'cyan',
        /*borderRadius:15,*/
    },
    row1dept: {
        flex:0.2,
        //backgroundColor:'green',
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        textAlign:'left',
        paddingTop:0,
        paddingBottom:10,
        marginLeft:20,
        fontWeight:'normal',
        /*borderRadius:25,*/
    },
    row1nameTouch: {
        borderRadius:18,
        borderWidth:2,
        borderStyle:'solid',
        borderColor:'#13b6ec',
        flex:0.4,
        height:35,
        paddingTop:5,
        color:'#13b6ec',
        marginBottom:10,
        marginRight:15,
    },
    row1name: {
        fontWeight:'normal',
        fontSize:17,
        marginBottom:15,
        fontFamily: 'Lato-Regular',
        textAlign:'center',
        color:'#13b6ec',
        paddingLeft:5,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center'
    },
    weekName: {
        fontFamily: 'Lato-Regular',
        fontSize:10,
        paddingTop:5,
        fontWeight:'bold',
    },
    weekView: {
        alignItems:'center',
    },
    topIssues: {
        flexDirection: 'row',
        marginTop:65,
        marginLeft:0,
        marginRight:0,
        marginBottom:5,
        alignItems: 'center',
    },
    col: {
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    footer: {
        position: 'absolute',
        flex:0.1,
        left: 0,
        right: 0,
        bottom: 0,
        /*top:Dimensions.get('window').height-83,*/
        backgroundColor:'#385b84',
        flexDirection:'row',
        height:60,
        alignItems:'center',
    },
    footerText: {
        fontFamily: 'Lato-Regular',
        color:'white',
        fontWeight:'bold',
        alignItems:'center',
        fontSize:20,
        marginLeft:15,
    },
    bottomButtons: {
        alignItems:'center',
        justifyContent: 'center',
        flex:1,
        height:60,
    },
    verticalDivider: {
        height:60,
        width:2,
        backgroundColor:'white'
    },
    serachBarView: {
        marginLeft:5,
        marginRight:5,
        marginBottom:5,
        backgroundColor:'white',
        borderRadius:15,
        flexDirection:'row'
    },
    searchBar: {
        paddingLeft:15,
        height: 35,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius:15,
        flex:0.9,
    }
});

class CustomerList extends React.Component {
    constructor(props) {
        super(props);
        //create our customer JSON
        var newJson = Store.getNewJson();
        this.state = {
            isLoading:false,
            custDetails:newJson,
            filteredCustDetails:newJson,
            contactModelVisibility:false,
            callerObject:{},
            custName:""
        }
        filterListCopy=newJson;
        filterApplied=false;
        console.disableYellowBox = true;
    }

    handleFilteredCustomerList (that,list) {
        //that.openControlPanel();
        if(list && list.length>0) {
            filterListCopy = list;
            that.setState({filteredCustDetails: list});
        }
    }

    componentDidMount(){
        this.addListenerOn(this.props.events,'changeStatusOfCustomersBasedOnRole', this.changeCustomerStatus.bind(this,this));
        this.addListenerOn(this.props.events, 'getupdatedJson', this.getupdatedJson.bind(this,this));
        this.addListenerOn(this.props.events, 'filterApplied', this.applyFilter.bind(this,this));
        this.addListenerOn(this.props.events,'startSpinner', this.isSpinnerVisibleComments.bind(this,this));
    }

    componentWillMount(){
        this.addListenerOn(this.props.events,'startSpinner', this.isSpinnerVisibleComments.bind(this,this));
        this.addListenerOn(this.props.events,'stopSpinner', this.isSpinnerVisibleComments.bind(this,this));
        this.addListenerOn(this.props.events, 'logoutTrigerred', this.LogoutPopup.bind(this,this));
    }

    isSpinnerVisibleComments(that,paramObj){
        that.setState({isLoading:paramObj.state})
    }

    LogoutPopup(that){
        that.popup.confirm({
            title: 'Logout',
            content: ['Are you sure you want to Logout?'],
            ok: {
                text: 'OK',
                callback: () => {
                    Store.logout();
                },
            },
            cancel: {
                text: 'Cancel'
            },
        });
    }

    changeCustomerStatus(that,obj) {
        var subTitle;
        var title;
        Store.updateJson(obj);
        that.setState({custDetails:Store.getNewJson()});
        that.setState({filteredCustDetails:Store.getNewJson()});
        this.props.events.emit("resetTopBarFilter");
        subTitle = Store.getKeyTitle();
        title = "Customer Status " + "(" +subTitle.val.substr(0, subTitle.val.indexOf(" ")) + ")"

        Actions.refresh({title:title})


    }
    applyFilter(that,obj) {
        filterApplied = obj.filterApplied;
        that.getupdatedJson(that);

    }

    getupdatedJson(that) {
        var newJson = Store.getNewJson();
        filterListCopy = newJson;
        that.setState({filteredCustDetails:newJson});
        this.props.events.emit("changeMainArrayAfterFilterApplied",{filteredJson:newJson});
    }

    setLoadingState(that, state) {
        //that.setState({isLoading:true});
    }

    handleChangeText(obj) {
        var tempArray=[];

        for(var x=0;x<filterListCopy.length;x++) {
            var keys= Object.keys(filterListCopy[x]);
            if(keys[0].toUpperCase().indexOf(obj.text.toUpperCase()) != -1) {
                tempArray.push(filterListCopy[x]);
            }
        }
        this.setState({filteredCustDetails:tempArray});
        _listView.scrollTo({y:0, animated:true})
    }

    getUserDetails(that,name,custName) {
        that.setState({isLoading:true});
        this.state.custName = custName;
        if(name != ""){
            Store.getSelectedUserContact(name,
                function(data) {
                    if (Object.keys(data).length>0) {
                        that.state.isLoading = false;
                        that.state.contactModelVisibility = true;
                        that.setState({callerObject: data});
                    }
                    else {
                        alert("The User Details could not be fetched at this time. Please try again in some time.");
                        that.setState({isLoading:false});
                    }
                },function(err){
                    that.setState({isLoading:false});
                    alert("The User Details could not be fetched at this time. Please try again in some time.");
                })
        }
    }
    updateContactModelVisibility(that) {
        that.setState({contactModelVisibility:false});
    }
    onClear(TextFeild){
        var text="";
        this.refs[TextFeild].clear(0);
        //this.searchText.clear(0);
        this.handleChangeText({text});
    }

    render(){
        var that=this;
        return (

            <View style={styles.landingView}>
                <Spinner visible={this.state.isLoading} size="large" color="red"/>
                <TopBar  custDetails={this.state.filteredCustDetails} events={this.props.events} filterApplied={filterApplied} loadingStatus={this.setLoadingState.bind(this,this)} onIssueClick={this.handleFilteredCustomerList.bind(this,this)}/>
                <View style={styles.serachBarView}>
                    <TextInput ref="searchBarCustomer" style={styles.searchBar} underlineColorAndroid="white"  onChangeText={(text) => this.handleChangeText({text})} placeholder="Search Customer Name"/>
                    <TouchableOpacity onPress={() =>  this.onClear('searchBarCustomer')} style={{flex:0.1,justifyContent:'center',alignItems:'center',margin:5,padding:5}}  underlayColor="transparent">
                        <Icon name="icon-Cancel-01" size={9} color='grey' />
                    </TouchableOpacity>
                </View>
                <CustomerTile  custDetails={this.state.filteredCustDetails} events={this.props.events} filterApplied={filterApplied} onNameClick={this.getUserDetails.bind(this,this)}/>
                <BottomBar custDetails={this.state.filteredCustDetails} events={this.props.events} filterApplied={filterApplied} totalCustomers={this.state.custDetails.length} loadingStatus={this.setLoadingState.bind(this,this)} onSort={this.handleFilteredCustomerList.bind(this,this)}/>
                <ContactModel contactModelVisibility={this.state.contactModelVisibility}
                              callerObject={this.state.callerObject}
                              onCustomerTap={""}
                              customerName={this.state.custName}
                              onClose={this.updateContactModelVisibility.bind(this,this)}
                />
                <Popup ref={(popup) => { this.popup = popup }}/>
            </View>

        );
    }
}

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            issueTabClicked: "",
            custDetails : props.custDetails,
        }
        console.disableYellowBox = true;
    }

    setIssueTileColor(tileclicked) {
        this.getTopIssueBackgroundCss(tileclicked,true);
        this.getTopIssueTextCss(tileclicked,true);
    }

    componentWillMount() {
        this.eventEmitter = new EventEmitter();
        this.addListenerOn(this.props.events,'filterCustomersBasedOnStatus', this.sortTiles.bind(this,this));
        this.addListenerOn(this.props.events, 'changeMainArrayAfterFilterApplied', this.changeMainArray.bind(this,this));
        this.addListenerOn(this.props.events, 'resetTopBarFilter', this.resetTopBarFilter.bind(this,this));

    }
    resetTopBarFilter(that) {
        that.setState({issueTabClicked:null});
    }
    changeMainArray(that,obj) {
        that.setState({custDetails:obj.filteredJson});
    }

    sortTiles(that,obj){
        if(obj && obj.filterColor)
            that.sortCustomerTiles(obj.filterColor);
    }

    sortCustomerTiles(tileclicked) {
        //AlertIOS.alert("Sort Issues based on "+tileclicked);
        this.props.loadingStatus(true);
        var tempArray=[];
        var customerListArr=[];
        if(this.props.filterApplied)
            customerListArr = this.props.custDetails;
        else
            customerListArr = this.state.custDetails;
        if(this.state.issueTabClicked == "" || this.state.issueTabClicked != tileclicked) {
            this.state.issueTabClicked = tileclicked;
            //filter the tiles on color

            for(var x=0; x<customerListArr.length;x++)
            {
                var tempKeys = Object.keys(customerListArr[x]);
                if(customerListArr[x][tempKeys[0]].overallStatus.toLowerCase() == tileclicked)
                {
                    tempArray.push(customerListArr[x]);
                }
            }
            this.props.events.emit("setTickFOrDrawer",{filterColor:tileclicked});
        }
        else {
            this.state.issueTabClicked = "";
            //if(this.props.filterApplied)
            //    tempArray = this.props.custDetails;
            //else
            tempArray = this.state.custDetails;
            this.props.events.emit("setTickFOrDrawer",{filterColor:null});
        }
        this.setIssueTileColor(tileclicked);
        this.props.onIssueClick(tempArray);

    }

    getTopIssueBackgroundCss(status) {
        var color;
        if(status.toLowerCase()=="red") {
            color = "#fc6452"
        }
        else if(status.toLowerCase()=="yellow"){
            color = "#ffcc00"
        }
        else if(status.toLowerCase()=="black"){
            color = "black";
        }
        else {
            color = "#44d673"
        }
        if(this.state.issueTabClicked != "" && status == this.state.issueTabClicked){
            return{
                backgroundColor:color,
                alignItems: 'center',
                flex:1,
                borderStyle:'solid',
                borderWidth:1,
                borderColor:'#e6e7e8'
            }
        }
        return {
            backgroundColor:'white',
            alignItems: 'center',
            flex:1,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#e6e7e8'
        }
    }

    getTopIssueTextCss(status) {
        var color;
        if(status.toLowerCase()=="red") {
            color = "#fc6452"
        }
        else if(status.toLowerCase()=="yellow"){
            color = "#ffcc00"
        }
        else if(status.toLowerCase()=="black"){
            color = "black";
        }
        else {
            color = "#44d673"
        }
        if(this.state.issueTabClicked != "" && status == this.state.issueTabClicked){
            return{
                fontSize:30,
                color:'white',
                alignItems: 'center',
                fontWeight:'bold'
            }
        }
        return {
            color:color,
            alignItems: 'center',
            fontSize:30,
            fontWeight:'bold'
        }
    }

    getIssueCount(color) {
        return Store.getIssueCount(color,this.state.custDetails);
    }

    render(){

        var that = this;

        return (<View style={styles.topIssues}>
            <TouchableHighlight style={this.getTopIssueBackgroundCss("red")} onPress={() => that.sortCustomerTiles("red")} underlayColor="transparent">
                <View style={styles.col}>
                    <Text style={this.getTopIssueTextCss("red")}>{this.getIssueCount("red")}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={this.getTopIssueBackgroundCss("yellow")} onPress={() => that.sortCustomerTiles("yellow")} underlayColor="transparent">
                <View style={styles.col}>
                    <Text style={this.getTopIssueTextCss("yellow")}>{this.getIssueCount("yellow")}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={this.getTopIssueBackgroundCss("green")} onPress={() => that.sortCustomerTiles("green")} underlayColor="transparent">
                <View style={styles.col}>
                    <Text style={this.getTopIssueTextCss("green")}>{this.getIssueCount("green")}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={this.getTopIssueBackgroundCss("black")} onPress={() => that.sortCustomerTiles("black")} underlayColor="transparent">
                <View style={styles.col}>
                    <Text style={this.getTopIssueTextCss("black")}>{this.getIssueCount("black")}</Text>
                </View>
            </TouchableHighlight>
        </View>);
    }
}

class CustomerTile extends React.Component {
    constructor(props) {
        super(props);
        ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isVisible: [],
            buttonRect: [],
            currentStatusClicked:-1,
            custDetails:props.custDetails,
            dataSource: ds.cloneWithRows(props.custDetails),
        };
        //intializing for week popover
        for(var i=0;i<this.state.custDetails.length;i++) {
            this.state.isVisible.push(false);
            this.state.buttonRect.push({});
        }
        console.disableYellowBox = true;
    }

    componentDidMount(){
    }

    showPopover(index) {
        var a="statusbutton"+index;
        var that=this;
        //check if week status is available or not.
        //this.requestAnimationFrame(() => {
        var customerKey = Object.keys(this.props.custDetails[index]);
        if(this.props.custDetails[index][customerKey[0]].weekStatus.length == 0) {
            this.closeAllPopover();
            return;
        }
        if(index != this.state.currentStatusClicked)
            this.closeAllPopover();
        // this.refs[a].measure((ox, oy, width, height, px, py) => {
        //that.state.buttonRect[index]={x: px-35, y: py-height-18, width: width, height: height};
        that.state.buttonRect[index]={x: 280, y: 5, width: 200, height: 50};
        this.state.isVisible[index]=!this.state.isVisible[index];
        that.setState({
            currentStatusClicked:index,
        });
        //});
    }

    closeAllPopover(index) {
        var tempArr =[];
        for(var i=0;i<this.state.custDetails.length;i++) {
            tempArr.push(false);
        }
        this.state.isVisible= tempArr;
        this.setState({currentStatusClicked:-1});
    }

    setIssueTileColor(tileclicked) {
        this.getTopIssueBackgroundCss(tileclicked,true);
        this.getTopIssueTextCss(tileclicked,true);
        this.setState({currentStatusClicked:0});
    }
    getColor(status) {
        if(status == "none")
            status = 'lightgray';
        else {
            if(status.toLowerCase()=="red") {
                status = "#fc6452"
            }
            else if(status.toLowerCase()=="yellow"){
                status = "#ffcc00"
            }
            else if(status.toLowerCase()=="green") {
                status = "#44d673"
            }
            else {
                status='black';
            }
        }
        return status;
    }

    getCustomerStatus(status) {
        status = this.getColor(status);
        return {
            borderRadius: 30,
            backgroundColor: status,
            width: 40,
            height: 40,
            marginTop: 10,
            marginBottom: 10,
            marginLeft:20,
        };
    }

    handleScroll(self,event) {
    }

    /* Navigate to Comments or Raci scene based on Raci variable value */
    successMethod(index, raci) {
        this.props.events.emit('stopSpinner', {state:false});
        var trackData = this.props.custDetails[index];
        var keys = Object.keys(this.props.custDetails[index]);
        var title=keys[0];
        Actions.customerDetail({title: title,"tracks":trackData[keys[0]].tracks, "raci":raci});
    }

    failuremethod() {
        this.props.events.emit('stopSpinner', {state:false});
        alert("Could not fetch customer details. Try again after sometime");
    }

    showCustomerDetails(index,raci) {
        this.props.events.emit('startSpinner', {state:true});
        var trackData = this.props.custDetails[index];
        var keys = Object.keys(this.props.custDetails[index]);
        //set the length of customer name based on length
        var title=keys[0];
        Store.setCurrentView(raci);
        Store.setSelectedCustomer(title);
        Store.setSelectedTrack(Object.keys(trackData[keys[0]].tracks)[0]);
        //alert(Store.getSelectedTrack());
        Store.getComments(() => this.successMethod(index,raci),() => this.failuremethod())
        if(keys[0].length>25)
            title = keys[0].substr(0,25) + "...";
    }

    fetchUserDetails(userType,item,tempKeys,temptrackKeys){
        if(userType == "accountable") {
            if(tempKeys[0] && item[tempKeys[0]] && temptrackKeys[0] && item[tempKeys[0]].tracks && item[tempKeys[0]].tracks[temptrackKeys[0]] && item[tempKeys[0]].tracks[temptrackKeys[0]].accountable)
                this.props.onNameClick(item[tempKeys[0]].tracks[temptrackKeys[0]].accountable[0],item[tempKeys[0]].customername)
        }
        else if(userType == "sales") {
            if(tempKeys[0] && item[tempKeys[0]] && temptrackKeys[0] && item[tempKeys[0]].tracks && item[tempKeys[0]].tracks[temptrackKeys[0]] && item[tempKeys[0]].tracks[temptrackKeys[0]].sales)
                this.props.onNameClick(item[tempKeys[0]].tracks[temptrackKeys[0]].sales,item[tempKeys[0]].customername);
        }
    }

    _renderRow(that,item, sectionID, index){
        //console.log("render row");
        var tempKeys = Object.keys(item);
        var temptrackKeys = Object.keys(item[tempKeys[0]]["tracks"]);
        return(
            <TouchableHighlight  ref={"tile"+index} style={{overflow:'hidden'}} onPress={() => that.showCustomerDetails(index, true)} underlayColor="transparent">
                <View ref={"tileview"+index} style={styles.container}>
                    <View style={styles.row0}>
                        <Text numberOfLines={2} style={styles.custName}>
                            {item[tempKeys[0]].customername}
                        </Text>
                        <TouchableHighlight style={styles.custStatus} ref={"statusbutton"+index} onPress={() => this.showPopover(index)} underlayColor="transparent">
                            <View style={this.getCustomerStatus(item[tempKeys[0]].overallStatus)}></View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.row1}>
                        <TouchableHighlight style={styles.row1nameTouch} onPress={() => that.showCustomerDetails(index, true)} underlayColor="transparent">
                            <Text numberOfLines={1} style={styles.row1name}>
                                <Icon name="icon-Comments" size={15} />
                                <Text style={styles.name}> Headline</Text>
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.row1nameTouch} onPress={() => that.showCustomerDetails(index, false)} underlayColor="transparent">
                            <Text numberOfLines={1} style={styles.row1name}>
                                <Icon name="icon-account_circle-01" size={17} />
                                <Text style={styles.name}> RACI</Text>
                            </Text>
                        </TouchableHighlight>
                    </View>
                    <Popover isVisible={that.state.isVisible[index]}  fromRect={that.state.buttonRect[index]} onClose={() => that.closeAllPopover(index)}>
                        <View style={styles.popover} >
                            {item[tempKeys[0]].weekStatus.map(function(item2,index){
                                var weekColor = that.getColor(item2.weekStatus);
                                return(
                                    <View style={styles.weekView}>
                                        <View style={[styles.weekImage,{backgroundColor:weekColor}]}></View>
                                        <Text style={styles.weekName}>{item2.weekName}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </Popover>
                </View>
            </TouchableHighlight>
        );
    }

    render(){
        var that = this;
        this.state.dataSource = ds.cloneWithRows(this.state.custDetails);
        if(this.state.dataSource._dataBlob.s1 != this.props.custDetails || this.state.currentStatusClicked != -1) {
            this.state.dataSource = ds.cloneWithRows([]);
            if(this.props.custDetails.length>0)
                this.state.dataSource = ds.cloneWithRows(this.props.custDetails);
        }
        return(
            <View style={styles.parentContainer}>
                <Spinner visible={this.state.isLoading} size="large" color="red"/>

                <ListView
                    ref={(listView) => { _listView = listView; }}
                    dataSource={this.state.dataSource}
                    initialListSize={10}
                    renderRow={that._renderRow.bind(this,this)}
                    style={styles.listView}
                />
            </View>
        )
    }
}

class BottomBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            issueTabClicked: "",
            custDetails : props.custDetails,
            sortType:"desc",
            sortText:"Z-A",

        }
        iconName = "icon-Sort-01",
            console.disableYellowBox = true;
    }

    sortCustomers() {
        this.props.loadingStatus(true);
        var tempArray = this.props.custDetails;
        for(var i=0;i<tempArray.length;i++) {
            for(var j=i+1;j<tempArray.length;j++) {
                var tempKeys = Object.keys(tempArray[i]);
                var tempKeys2 = Object.keys(tempArray[j]);
                if(tempArray[i][tempKeys[0]].customername.toLowerCase().localeCompare(tempArray[j][tempKeys2[0]].customername.toLowerCase()) >0) {
                    var temp = tempArray[i];
                    tempArray[i] = tempArray[j];
                    tempArray[j] = temp;
                }
            }
        }

        if(this.state.sortType == "asc") {
            this.props.onSort(tempArray);
            this.state.sortText="Z-A";
            this.setState({sortType:"desc"});
            iconName = "icon-Sort-01";

        }
        else {
            this.props.onSort(tempArray.reverse());
            this.state.sortText="A-Z";
            this.setState({sortType:"asc"});
            iconName = "icon-Sort-01";
        }
    }


    filterCustomers() {
        Actions.filter();
    }

    getBottomButtonStyling() {
        //add condition here to know if filter was applied or not
        if(this.props.filterApplied) {
            return ({
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: 60,
                backgroundColor:'#1e3656'
            });
        }
        else {
            return ({
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: 60,
                backgroundColor:'#385b84'
            });
        }
    }

    render() {
        return (
            <View style={styles.footer}>
                <TouchableHighlight style={this.getBottomButtonStyling(false)} onPress={() => this.filterCustomers()} underlayColor="transparent">
                    <View style={{flexDirection:'row'}}>
                        <View style={{marginTop:5}}>
                            <Icon name="icon-Filter-01" size={35} color="#ffffff" />
                        </View>
                        <View style={{flexDirection:'column'}}>
                            <Text style={styles.footerText}>Filter</Text>
                            <Text style={{color:'white',fontWeight:'bold',marginLeft:15,fontSize:12}}>{this.props.custDetails.length} of {this.props.totalCustomers}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={styles.verticalDivider}></View>
                <TouchableHighlight style={styles.bottomButtons} onPress={() => this.sortCustomers()} underlayColor="transparent">
                    <View style={{flexDirection:'row'}}>
                        <View style={{marginTop:5}}>
                            <Icon name={iconName} size={35} color="#ffffff" />
                        </View>
                        <View style={{flexDirection:'column'}}>
                            <Text style={styles.footerText}>Sort</Text>
                            <Text style={{color:'white',fontWeight:'bold',marginLeft:15,fontSize:12}}>{this.state.sortText}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

reactMixin(CustomerList.prototype,Subscribable.Mixin);
reactMixin(TopBar.prototype,Subscribable.Mixin);
module.exports = CustomerList;
