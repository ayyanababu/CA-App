/**
 * Created by sumeetbhalla on 6/1/16.
 */
import React from 'react-native';
var Subscribable = require('Subscribable');
var reactMixin = require('react-mixin');
import BottomContainer from './BottomContainer';
import CommentModel from './CommentModel';
import Comments from './Comments'
import ContactModel from './ContactModel';
import Store from '../utils/store.js';
import Spinner from './Spinner.js';
import Icon from '../utils/CAPP';
import Communications from 'react-native-communications';
import {
    Scene,
    Reducer,
    Router,
    Switch,
    Actions
} from 'react-native-router-flux'


var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Component,
    ScrollView,
    Modal,
    TextInput
    } = React;

var output = {
    "accountable": [{
        "personName": "AB1",
        "email": "accountableAB1@metricstream.com"
    }, {
        "personName": "AB2",
        "email": "accountableAB2@metricstream.com"
    }],
    "responsible": [{
        "personName": "AB3",
        "email": "responsibleAB3@metricstream.com"
    }, {
        "personName": "AB4",
        "email": "responsibleAB4@metricstream.com"
    }],
    "consulted": [{
        "personName": "AB5",
        "email": "consultedAB5@metricstream.com"
    }, {
        "personName": "AB6",
        "email": "consultedAB6@metricstream.com"
    }],
    "informed": [{
        "personName": "AB7",
        "email": "informedAB7@metricstream.com"
    }, {
        "personName": "AB8",
        "email": "informedAB8@metricstream.com"
    }],
    "sales": [{
        "personName": "AB8",
        "email": "salesAB8@metricstream.com"
    }, {
        "personName": "AB9",
        "email": "salesAB9@metricstream.com"
    }]
}

/* Home Component */
class CustomerDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerTrack: {},
            customerTrackKeys: [],
            customerName: '',
            currentTrackKey: "",
            currentRACIItem: {},
            visibility: false,
            chosenColor: '',
            isStatusModuleVisible: false,
            commentText: '',
            contactModelVisibility: false,
            callerObject: {},
            isLoading: false,
            iscustomerExecEnable: false,
            isPSPEEnable: false,
            isSalesEnable: false,
            selectedStatus: '',
            commentModelTitle: '',
            commentTextInputHeight: 150,
            commentText: undefined,
            isRaciPage: undefined,
            customerTrackStage:[],
            userTypeSu:false,
        };
        this.state.customerTrack = this.props.tracks
        this.state.customerTrackKeys = Object.keys(this.state.customerTrack);
        for(var x=0;x<this.state.customerTrackKeys.length;x++) {
            this.state.customerTrackStage.push(this.state.customerTrack[this.state.customerTrackKeys[x]].stage)
        }
        this.state.currentTrackKey = this.state.customerTrackKeys[0];
        this.state.visibility = false;
        this.state.isStatusModuleVisible = true;
        this.state.commentText = '';
        this.state.contactModelVisibility = false;
        this.state.callerObject = {}
        this.state.isLoading = false
        this.state.commentTextInputHeight = 150
        this.state.commentText = undefined
        this.state.isRaciPage = this.props.raci;
        this.state.userTypeSu = Store.getUserType()
        console.disableYellowBox=true;
    }

    /* To switch between comments and Raci component */
    togglePage(that) {
        Store.setCurrentView(!this.state.isRaciPage);
        Actions.refresh();
        that.setState({isRaciPage: !this.state.isRaciPage});
    }

    componentWillMount(){
        this.addListenerOn(this.props.events,'startSpinner', this.isSpinnerVisibleComments.bind(this,this));
        this.addListenerOn(this.props.events,'stopSpinner', this.isSpinnerVisibleComments.bind(this,this));
        this.addListenerOn(this.props.events,'switchCustomerDetailsContent', this.togglePage.bind(this,this));
    }
    componentDidMount(){
        this.addListenerOn(this.props.events,'stopSpinner', this.isSpinnerVisibleComments.bind(this,this));
    }


    isSpinnerVisibleComments(that,paramObj){
        that.setState({isLoading:paramObj.state})
    }

    enableStatusModules(userName){

        this.state.iscustomerExecEnable = false;
        this.state.isPSPEEnable = false;
        this.state.isSalesEnable = false;

        if(Store.getUserType()){
            this.state.iscustomerExecEnable = true;
            this.state.isPSPEEnable = true;
            this.state.isSalesEnable = true;
            return
        }

        var raciItem = this.state.currentRACIItem
        var raciKeys = ["accountable", "responsible", "consulted", "informed", "sales"];
        var raciContactDetaills = []

        userName = Store.getUserFullName();

        raciContactDetaills["Accountable"] = raciItem[raciKeys[0]];
        raciContactDetaills["Responsible"] = raciItem[raciKeys[1]];
        raciContactDetaills["Consulted"] =   raciItem[raciKeys[2]];
        raciContactDetaills["Informed"] =    raciItem[raciKeys[3]];
        raciContactDetaills["Sales"] =       raciItem[raciKeys[4]];

        var keys = Object.keys(raciContactDetaills)
        var trackContacts = raciContactDetaills;
        var that = this

        keys.map(function(key, i) {

            var items = trackContacts[key];
            var itemValue = [];

            if(items!=null)
            {
                if(typeof items === 'string')
                {
                    if(userName==items){
                        if(key=="Accountable" || key == "Responsible"){
                            that.state.isPSPEEnable = true
                        }
                        if(key=="Sales"){
                            that.state.isSalesEnable = true
                        }
                    }
                }
                else
                {
                    for(var j=0; j<items.length; j++) {
                        if(userName==items[j]){
                            if(key=="Accountable" || key == "Responsible" || key == "Informed" || key == "Consulted"){
                                that.state.isPSPEEnable = true
                            }
                            if(key=="Sales"){
                                that.state.isSalesEnable = true
                            }
                        }
                    }
                }
            }

        }, this)

    }

    updateCurrentTrackKey(incomingTrackKey) {
        this.setState({currentTrackKey:incomingTrackKey});
    }

    //TopContainer: This call back is called when user taps on status change on customerDetails Screen.
    updateCommentModelProps(deptStatus){
        this.setState({selectedStatus: deptStatus.selectedStatus})
        this.setState({chosenColor:deptStatus.color})
        this.setState({visibility:deptStatus.visibility});
    }

    updateCommentModelVisibility(incomingVisibility){
        this.setState({visibility:incomingVisibility});
    }

    closeCommentModel(that){
        this.setState({visibility:false})
    }

    updateCommentModelStatus(incomingChosenColor){
        this.setState({chosenColor: incomingChosenColor})
        // alert(this.state.chosenColor)
        //console.log(this.state.chosenColor)
    }
    getColorName(colorCode) {
        if (colorCode=="#FCCA50") {
            return "Yellow";
        }
        else if (colorCode=="#3AD86F") {
            return 'Green';
        }
        else if (colorCode == "#FC5A49") {
            return 'Red';
        }
    }

    getFormattedDate() {
        var curDate = new Date();
        var dd = curDate.getDate();
        var mm = curDate.getMonth() + 1
        var yy = curDate.getFullYear();
        var hh = curDate.getHours();
        var min = curDate.getMinutes();
        var ss = curDate.getSeconds();

        if(mm.toString().length == 1){
            mm = '0' + mm.toString()
        }

        if(dd.toString().length == 1){
            dd = '0' + dd.toString()
        }
        return (yy+"-"+mm+"-"+dd+" "+hh+":"+min+":"+ss+".0");
    }

    updateCommentModelText(incomingText){
        this.props.events.emit('startSpinner',{state:true})
        this.setState({commentText: incomingText});
        //  alert(this.state.commentText)
        //console.log(this.state.commentText)
        var commentJson = {};
        commentJson["newComment"] = incomingText;
        if(this.state.selectedStatus == "ps_pe_status")
            commentJson["type"] = "PEPS";
        else if(this.state.selectedStatus == "customer_execution_status")
            commentJson["type"] = "CE";
        else
            commentJson["type"] = "SALES";
        commentJson["status"] = this.getColorName(this.state.chosenColor);
        Store.updateComments(commentJson,this.successCallback.bind(this,this),this.failureCallback.bind(this,this));

    }
    successCallback(that,newComment){
        var updateJson = {}
        var commentType;
        Store.onSendUpdateJson(this.state.customerName, this.state.currentTrackKey, this.state.selectedStatus, this.getColorName(this.state.chosenColor), this.state.commentText);
        this.props.events.emit("getupdatedJson");
        //for updating the UI after change
        if(this.state.selectedStatus == "ps_pe_status"){
            commentType = "PE/PS";
            Store.setPspeStatusColor(this.getColorName(this.state.chosenColor))
        }
        else if(this.state.selectedStatus == "customer_execution_status"){
            commentType = "Ce";
            Store.setCustomerExecStatus(this.getColorName(this.state.chosenColor))
        }
        else{
            commentType = "Sales";
            Store.setSalesStausColor(this.getColorName(this.state.chosenColor))
        }
        updateJson["track"] = Store.getSelectedTrack();
        updateJson["comment"] = newComment;
        updateJson["comm_date"] = this.getFormattedDate();
        updateJson["user"] = Store.getUserFullName();
        updateJson["comment_type"] = commentType;
        updateJson["status"] = Store.getSalesStausColor()
        updateJson["ce_status"] = Store.getCustomerExecStatus()
        updateJson["pspe_status"] = Store.getPspeStatusColor()

        if(Store.getCommentsJson() &&  Store.getCommentsJson()[Store.getSelectedCustomer()] && Store.getCommentsJson()[Store.getSelectedCustomer()][Store.getSelectedTrack()]){
            Store.getCommentsJson()[Store.getSelectedCustomer()][Store.getSelectedTrack()].unshift(updateJson);
        }
        else{
            Store.setCommentJson(updateJson);
        }
        this.setState({commentText: newComment});
        this.props.events.emit('stopSpinner',{state:false})
    }

    failureCallback(){
        this.props.events.emit('stopSpinner',{state:false})
        alert("Status Change not submitted");
    }
    updateContactModelProps(info){
        this.updateContactModelVisibility(info.isContactModelVisible)
        this.setState({callerObject:info.callerObject})
    }

    updateContactModelVisibility(isContactModelVisible){
        this.setState({contactModelVisibility:isContactModelVisible});
    }

    isSpinnerVisible(isSpinnerVis){
        this.setState({isLoading:isSpinnerVis})
    }

    getRACINames(){
        var raciItem = this.state.currentRACIItem

        var raciKeys = ["accountable", "responsible", "consulted", "informed", "sales"];
        var raciContactDetaills = {}

        raciItem[raciKeys[0]]?raciContactDetaills["accountable"] = raciItem[raciKeys[0]]:raciContactDetaills["accountable"]=[];
        raciItem[raciKeys[1]]?raciContactDetaills["responsible"] = raciItem[raciKeys[1]]:raciContactDetaills["responsible"]=[];
        raciItem[raciKeys[2]]?raciContactDetaills["consulted"] = raciItem[raciKeys[2]]:raciContactDetaills["consulted"]=[];
        raciItem[raciKeys[3]]?raciContactDetaills["informed"] = raciItem[raciKeys[3]]:raciContactDetaills["informed"]=[];
        raciItem[raciKeys[4]]?raciContactDetaills["sales"] = raciItem[raciKeys[4]]:raciContactDetaills["sales"]=[];

        var keys = Object.keys(raciContactDetaills)
        var trackContacts = raciContactDetaills;
        var that = this;

        keys.map(function(key, i) {

            var items = trackContacts[key];
            var itemValue = [];

            if(items!=null)
            {
                if(typeof items === 'string')
                {
                    raciContactDetaills[key] = [items];
                }
            }

        }, this)

        return raciContactDetaills;
    }

    getToandCCIDs(responseData) {
        var mailAll = {}
        var raciItem = responseData
        var toArray = []
        var ccArray = []
        var raciKeys = ["accountable", "responsible", "consulted", "informed", "sales"];
        var raciContactDetaills = {}

        raciContactDetaills["accountable"] = raciItem[raciKeys[0]];
        raciContactDetaills["responsible"] = raciItem[raciKeys[1]];
        raciContactDetaills["consulted"] =   raciItem[raciKeys[2]];
        raciContactDetaills["informed"] =    raciItem[raciKeys[3]];
        raciContactDetaills["sales"] =       raciItem[raciKeys[4]];

        var keys = Object.keys(raciContactDetaills)
        var trackContacts = raciContactDetaills;
        var that = this;

        keys.map(function(key, i) {

            var items = trackContacts[key];
            var itemValue = [];

            if(items!=null)
            {
                for(var j=0; j<items.length; j++) {
                    if(key=="accountable" || key == "responsible" || key == "sales"){
                        toArray.push(items[j].email)
                    }
                    if(key=="consulted" || key == "informed"){
                        ccArray.push(items[j].email)
                    }
                }
            }

        }, this)

        mailAll ={toArray, ccArray}

        return mailAll;
    }

    //Ashok
    sendEmail(){

        var raciNames = this.getRACINames()

        var subject = `Reg: ${this.state.customerName} - ${this.state.currentTrackKey}`
        this.setState({isLoading:true})
        that = this;
        Store.getEmailIDsOfRACIUsers(raciNames,

            //sucess callback Method capturing
            function(responseData){
                if (Object.keys(responseData).length>0) {
                    var mailAll = that.getToandCCIDs(responseData);
                    that.setState({isLoading: false});
                    Communications.email(mailAll.toArray, mailAll.ccArray, null, subject, null);
                }
                else {
                    alert("The User Details could not be fetched at this time. Please try again in some time.");
                    that.setState({isLoading:false});
                }
            },

            //Error callback Method capturing
            function(errormessage){
                alert("The User Details could not be fetched at this time. Please try again in some time.");
                that.setState({isLoading:false})
            })
    }




    render() {
        this.state.commentText = undefined
        this.state.customerName = this.props.tracks[this.state.currentTrackKey].customername
        if(this.state.customerName)
            Store.setSelectedCustomer(this.state.customerName);
        if(this.state.currentTrackKey)
            Store.setSelectedTrack(this.state.currentTrackKey);
        this.state.currentRACIItem = this.state.customerTrack[this.state.currentTrackKey];
        this.enableStatusModules('')
        if (this.state.isRaciPage == true)
        {
            var raciK = ["accountable", "responsible", "consulted", "informed", "sales"]

            if(this.state.currentRACIItem[raciK[4]]!=undefined && this.state.currentRACIItem[raciK[4]]!=null){
                Store.setcurrentTrackSalesPersonName(this.state.currentRACIItem[raciK[4]]);
            }
            page = <Comments events={this.props.events}/>;
            emailAll = null;

        }
        else
        {
            page =  <MiddleContainer raciItem={this.state.currentRACIItem} onCustomerTap={this.updateContactModelProps.bind(this)} isSpinnerVisible={this.isSpinnerVisible.bind(this)}/>;
            emailAll =         <TouchableHighlight style={homeStyles.iconContainer} onPress = {()=>this.sendEmail()} >
                <View style={{width:30, alignItems: 'center'}} >
                    <Icon name="icon-Mailall-01" size={30} color="#ffffff" />
                </View>
            </TouchableHighlight> ;
         
        }

        //var someValue = Store.getFilterArrayList();
        return(
            <View style = {homeStyles.mainView}>
                <Spinner visible={this.state.isLoading} size="large" color="red"/>
                <TopContainer style={homeStyles.firstElementStyle}
                              onTrackTap={this.updateCommentModelProps.bind(this)}
                              raciItem={this.state.currentRACIItem}
                              iscustomerExecEnable={this.state.iscustomerExecEnable}
                              isPSPEEnable={this.state.isPSPEEnable}
                              isSalesEnable={this.state.isSalesEnable}
                />

                    {page}

                <BottomContainer
                    trackKeys={this.state.customerTrackKeys}
                    trackStageKeys={this.state.customerTrackStage}
                    onTrackTap={this.updateCurrentTrackKey.bind(this)}
                    isLeftNavVisible = {true}
                    isRightNavVisible = {true}
                />

                {emailAll}

                <CommentModel visibility={this.state.visibility}
                              isStatusModuleVisible={this.state.isStatusModuleVisible}
                              chosenColor={this.state.chosenColor}
                              customerName={this.state.customerName}
                              commentModelTitle="Reason for change:"
                              commentTextInputHeight = {this.state.commentTextInputHeight}
                              currentTrackKey={this.state.currentTrackKey}
                              selectedStatus={this.state.selectedStatus}
                              onTrackTap={this.updateCommentModelVisibility.bind(this)}
                              onClose={this.closeCommentModel.bind(this)}
                              onStatusChange={this.updateCommentModelStatus.bind(this)}
                              onEndEditing={this.updateCommentModelText.bind(this)}
                              commentText = {this.state.commentText}
                              changeCustomerType = {this.state.userTypeSu}
                              events={this.props.events}>
                </CommentModel>

                <ContactModel contactModelVisibility={this.state.contactModelVisibility}
                              callerObject={this.state.callerObject}
                              customerName={this.state.customerName}
                              currentTrackKey={this.state.currentTrackKey}
                              onCustomerTap={this.updateContactModelProps.bind(this)}
                              onClose={this.updateContactModelVisibility.bind(this)}
                />
            </View>
        );
    }
}

/* TopContainer Component */
class TopContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            raciItem: props.raciItem,
            customerExecStatus: "",
            psPEStatus: "",
            salesStatus: "",
            deptStatus: {
                visibility: true,
                color: '',
                selectedStatus: ''
            }
        };
    }
    getStatusColor(incomingColorCode){
        var colorCode = ""
        if (incomingColorCode!=null && incomingColorCode!="NA"){
            if (incomingColorCode.toLowerCase()=="yellow") {
                colorCode = "#FCCA50"
            }
            else if (incomingColorCode.toLowerCase()=="green") {
                colorCode = '#3AD86F'
            }
            else if (incomingColorCode.toLowerCase() == "red") {
                colorCode = '#FC5A49'
            }
            else {
                colorCode = "#231f20"
            }
        }
        else {
            colorCode = "#231f20"
        }
        return colorCode;
    }



    trackTapEvent(colorCode, statusCode) {
        this.state.deptStatus.color = colorCode
        this.state.deptStatus.selectedStatus = statusCode
        this.props.onTrackTap(this.state.deptStatus);
    }

    render() {
        this.state.raciItem = this.props.raciItem;

        this.state.customerExecStatus = this.getStatusColor(this.state.raciItem.customer_execution_status);
        this.state.psPEStatus = this.getStatusColor(this.state.raciItem.ps_pe_status);
        this.state.salesStatus = this.getStatusColor(this.state.raciItem.status);

    Store.setSalesStausColor(this.state.raciItem.status)
    Store.setPspeStatusColor(this.state.raciItem.ps_pe_status)
    Store.setCustomerExecStatus(this.state.raciItem.customer_execution_status)

    return(
      <View style={topBarStyle.tcRowStyle}>

                <TouchableHighlight style={topBarStyle.top}  onPress={this.props.iscustomerExecEnable?() => this.trackTapEvent(this.state.customerExecStatus, "customer_execution_status"):null} underlayColor="transparent">
                    <View>
                        <View style={[topBarStyle.circleStyle, {backgroundColor: this.state.customerExecStatus}]}></View>
                        <Text style={[topBarStyle.textStyle, {color: this.props.iscustomerExecEnable==true?'#2BAEE9':'#A9A9A9'}]}>CE</Text>
                    </View>
                </TouchableHighlight>

                <View style={topBarStyle.itemSeparator}></View>

                <TouchableHighlight style={topBarStyle.top} onPress={this.props.isPSPEEnable?() => this.trackTapEvent(this.state.psPEStatus, "ps_pe_status"):null} underlayColor="transparent">
                    <View>
                        <View style={[topBarStyle.circleStyle, {backgroundColor: this.state.psPEStatus}]}></View>
                        <Text style={[topBarStyle.textStyle, {color: this.props.isPSPEEnable==true?'#2BAEE9':'#A9A9A9'}]}>PE/PS</Text>
                    </View>
                </TouchableHighlight>

                <View style={topBarStyle.itemSeparator}></View>

                <TouchableHighlight style={topBarStyle.top} onPress={this.props.isSalesEnable?() => this.trackTapEvent(this.state.salesStatus, "status"):null} underlayColor="transparent">
                    <View>
                        <View style={[topBarStyle.circleStyle, {backgroundColor: this.state.salesStatus}]}></View>
                        <Text style={[topBarStyle.textStyle, {color: this.props.isSalesEnable==true?'#2BAEE9':'#A9A9A9'}]}>SALES</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}


/* ContactButton Component*/
class ContactButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            info: {
                isContactModelVisible: false,
                callerObject: null
            }
        };
        this.state.info.isContactModelVisible = false
        this.state.info.callerObject = null
    }

    setCallerInfo(callerName){
        this.props.isSpinnerVisible(true)
        that = this
        Store.getSelectedUserContact(callerName,

            //sucess callback Method capturing
            function(responseData){
                if (Object.keys(responseData).length>0) {
                    that.state.info.isContactModelVisible = true
                    that.state.info.callerObject = responseData
                    that.props.isSpinnerVisible(false)
                    that.props.onCustomerTap(that.state.info);
                }
                else {
                    that.props.isSpinnerVisible(false)
                    alert("The User Details could not be fetched at this time. Please try again in some time.");
                }
            },

            //Error callback Method capturing
            function(errormessage){
                that.props.isSpinnerVisible(false)
                alert("The User Details could not be fetched at this time. Please try again in some time.");
            })

    }

    render() {
        return (
            <View style={contactButtonViewStyle.contactOuterView}>
                <TouchableHighlight style={contactButtonViewStyle.contactButtonStyle} onPress={() => this.setCallerInfo(this.props.items)} underlayColor="transparent">
                    <Text style={contactButtonViewStyle.contatButtonTextStyle} numberOfLines={1}>
                        {this.props.items}
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

/* MiddleContainer Component */
class MiddleContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            raciKeys: [],
            raciItem: props.raciItem,
            raciContactDetaills: []
        };
        raciKeys = ["accountable", "responsible", "consulted", "informed", "sales"];
    }



    render() {
        this.state.raciItem = this.props.raciItem
        this.state.raciContactDetaills["Accountable"] = this.state.raciItem[raciKeys[0]];
        this.state.raciContactDetaills["Responsible"] = this.state.raciItem[raciKeys[1]];
        this.state.raciContactDetaills["Consulted"] = this.state.raciItem[raciKeys[2]];
        this.state.raciContactDetaills["Informed"] = this.state.raciItem[raciKeys[3]];
        this.state.raciContactDetaills["Sales"] = this.state.raciItem[raciKeys[4]];
        var salePersonName =     this.state.raciContactDetaills["Sales"];

        if(salePersonName!=undefined && salePersonName!=null){
            Store.setcurrentTrackSalesPersonName(salePersonName);
        }

        var keys = Object.keys(this.state.raciContactDetaills)
        var trackContacts = this.state.raciContactDetaills;

        return (
            <View style={middle.parentContainer}>
                <ScrollView style={middle.Scrollcontainer}>
                <View style={middle.containerStyle}>
                    {

                        keys.map(function(key, i) {
                            var items = trackContacts[key];

                            if(items!=null) {
                                var itemValue = [];
                                var itemField = [];
                                var twoItems = [];

                                if(typeof items === 'string') {
                                    itemValue.push(<ContactButton items = {items} onCustomerTap={this.props.onCustomerTap} isSpinnerVisible={this.props.isSpinnerVisible}/>)
                                }
                                else {
                                    var lastIndex = items.length-1;
                                    for(var j=0; j<items.length; j++) {
                                        itemValue.push(<ContactButton items = {items[j]} onCustomerTap={this.props.onCustomerTap} isSpinnerVisible={this.props.isSpinnerVisible}/>)
                                    }
                                }

                                var numOfButtonPerRow = 0;
                                for(var k=0; k<itemValue.length; k+=2){
                                    twoItems.push(<View style={middle.evenViewStyle}><View style={middle.evenViewStyle1}>{itemValue[k]}</View><View style={middle.evenViewStyle2}>{itemValue[k+1]}</View></View>)
                                }

                                itemField.push(<Text style = {middle.titleStyle}>{key}</Text>)

                                return (
                                    <View style={middle.eachViewStyle}>

                                        <View style ={middle.bothView}>
                                            <View style ={middle.titleViewStyle}>
                                                {itemField}
                                            </View>
                                            <View>
                                                {twoItems}
                                            </View>
                                        </View>

                                        <View style = {middle.separatorStyle}></View>

                                    </View>
                                );
                            }
                        }, this)
                    }
                </View>
                    </ScrollView>
            </View>
        );
    }
}


/* Home Style */
var homeStyles = StyleSheet.create({
    homeStyle: {
        flex: 1
    },
    contactRowViewStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    contactColumnViewStyle: {
        flex: 1,
        flexDirection: 'column'
    },
    blankView: {
        flex: 1
    },
    mainView: {
        flex: 1,
        marginTop: 80,
        backgroundColor:"white"
    },
    scrollViewStyle: {
        flex: 1,
    },
    firstElementStyle: {
        flex: 0.2,
    },
    verticalDivider: {
        height:80,
        width:2,
        backgroundColor:'white'
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 48/2,
        backgroundColor: "#1d3557",
        paddingTop:9,
        paddingLeft:9,
        position:"absolute",
        bottom:88,
        right:20,
    }
});

/* TopContainer Style */
var topBarStyle = StyleSheet.create({
    top: {
        flex: 1/3,
        paddingTop: 8,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 8,
        alignItems: 'center',
        backgroundColor:'white'
    },
    tcRowStyle: {
        flexDirection: 'row',
        borderWidth: 1.0,
        borderColor: '#e6e7e8',
    },
    circleStyle: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignSelf: 'center'
    },
    textStyle: {
        fontFamily: 'Lato-Regular',
        fontSize: 15,
        fontWeight:'bold',
        paddingTop: 4,
        alignSelf: 'center'
    },
    itemSeparator: {
        width: 1,
        height: 50,
        borderWidth: 0.5,
        borderColor: '#e6e7e8',
        alignSelf: 'center',
    },
});

/* ContactButton Style */
var contactButtonViewStyle = StyleSheet.create({
    contactOuterView: {
        flex: 1,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 4,
        paddingLeft: 4,
    },
    contactButtonStyle: {
        backgroundColor: '#FFFFFF',
        borderColor: '#2BADE6',
        borderWidth: 1.5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        height: 35,
    },
    contatButtonTextStyle: {
        fontFamily: 'Lato-Regular',
        fontSize: 14,
        fontWeight:'normal',
        color: '#2BAEE9',
        alignSelf: 'center',
    }
});

/* MiddleContainer Style */
var middle = StyleSheet.create({
    containerStyle: {
        flex: 1,
        marginTop:0,
        marginBottom: 64,
        backgroundColor: '#FFFFFF',
    },
    parentContainer: {
        flex:1
    },

    Scrollcontainer: {
        backgroundColor:'#ffffff',
        flex:1,
        flexDirection:"column",
    },

    evenViewStyle: {
        flex: 1,
        flexDirection: 'row',
    },
    evenViewStyle1: {
        flex: 0.5,
        flexDirection: 'row',
    },
    evenViewStyle2: {
        flex: 0.5,
        flexDirection: 'row',
    },
    titleStyle: {
        fontFamily: 'Lato-Regular',
        fontSize: 16,
        fontWeight:'bold',
        paddingBottom: 10,
    },
    eachViewStyle: {

    },
    bothView: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 4,
        marginRight: 4,
        // borderWidth: 1.0,
        // borderColor: 'green'
    },
    titleViewStyle: {
        flex: 1,
        paddingLeft: 4,
        paddingRight: 4,
        // borderWidth: 1.0
    },
    separatorStyle: {
        flex: 1,
        color: '#EDEFEF',
        borderWidth: 1,
        borderColor: '#EDEFEF'
    },
});
reactMixin(CustomerDetails.prototype,Subscribable.Mixin);
module.exports = CustomerDetails;
