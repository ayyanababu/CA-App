/**
 * Created by sumeetbhalla on 6/3/16.
 */

import React from 'react';
import {View, Text, StyleSheet,TextInput,TouchableHighlight,Image,ScrollView,AsyncStorage} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import Icon from '../utils/CAPP';
import ActionButton from 'react-native-action-button';
import Store from '../utils/store.js';
var CommentModel = require('./CommentModel');
var FinalCommentsArray = [];
var SucommentStatus;

var SalesPerson = "Rakshita Umesh Devurkar";
/*
 &accountName=''&track=""

 */

export default class extends React.Component {

    constructor(props)
    { super(props);
        this.state =
        {
            expanded: 0,
            visibility:false,
            isStatusModuleVisible:false,
            commentsArray: [],
            CommentTitle: "Comments",
            commentTextInputHeight: 250,
            commentText:undefined,
            newComment:"",
            userTypeSu:false,
        };
        console.disableYellowBox = true;
        this.state.userType = Store.getUserType();
    }

    expandText(item){
        item.expand = !(item.expand);
        this.setState({expanded:this.state.expanded+1});
    }

    addComment(){
        //console.log("Adding the comment");
        this.setState({commentText:undefined});
        this.setState({visibility:true});
    }

    copyComment(){
        //this.setState({visibility:true});
        var LoginUser = Store.getUserFullName();
        var latestSalesComment="";
        var latestPEPSComment ="";
        for(i=0;i<FinalCommentsArray.length;i++){
            if(FinalCommentsArray[i].comment_type=="Sales"){
                latestSalesComment = FinalCommentsArray[i].comment;
                break;
            }
        }
        for(i=0;i<FinalCommentsArray.length;i++){
            if(FinalCommentsArray[i].comment_type=="PE/PS"){
                latestPEPSComment = FinalCommentsArray[i].comment;
                break;
            }
        }
        Store.setLatestSalesComment(latestSalesComment);
        Store.setLatestPEPSComment(latestPEPSComment);
        
        if(LoginUser==Store.getcurrentTrackSalesPersonName()){
            this.setState({commentText:latestSalesComment});
            this.setState({visibility:true});
        }
        else {
            this.setState({commentText:latestPEPSComment});
            this.setState( {visibility:true});
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



    updateCommentModelText(that,incomingText, changedStatus) {
        this.props.events.emit('startSpinner',{state:true})
        var statusType;
        this.setState({newComment:incomingText})
        var commentJson = {};
        SucommentStatus = changedStatus
        commentJson["newComment"] = this.state.newComment;

        if (!this.state.userTypeSu && changedStatus == 'PE/PS'){
            commentJson["type"] = "PEPS"
        }
        else if (!this.state.userTypeSu && changedStatus == 'Sales'){
            commentJson["type"] = "SALES"
        }
        else {
            if(Store.getUserFullName()==Store.getcurrentTrackSalesPersonName())
                commentJson["type"] = "SALES";
            else
                commentJson["type"] = "PEPS";
        }

        Store.updateComments(commentJson,this.successCallback.bind(this,this),this.failureCallback.bind(this,this));
    }

    successCallback(that,newComment){
        var updateJson = {};
        var comment_type;
        var LoginUser = Store.getUserFullName();
        // if(LoginUser==Store.getcurrentTrackSalesPersonName()){
        //     comment_type = 'Sales'
        // }
        // else {
        //     comment_type = 'PE/PS'
        // }

        if (!this.state.userTypeSu && SucommentStatus == 'PE/PS'){
            comment_type = "PE/PS"
        }
        else if (!this.state.userTypeSu && SucommentStatus == 'Sales'){
            comment_type = "Sales"
        }
        else {
            if(LoginUser==Store.getcurrentTrackSalesPersonName()){
                comment_type = 'Sales'
            }
            else {
                comment_type = 'PE/PS'
            }
        }
        updateJson["track"] = Store.getSelectedTrack();
        updateJson["comment"] = newComment;
        updateJson["comm_date"] = that.getFormattedDate();
        updateJson["user"] = Store.getUserFullName();
        updateJson["comment_type"] = comment_type;
        updateJson["status"] = Store.getSalesStausColor()
        updateJson["ce_status"] = Store.getCustomerExecStatus()
        updateJson["pspe_status"] = Store.getPspeStatusColor()

        if(Store.getCommentsJson() &&  Store.getCommentsJson()[Store.getSelectedCustomer()] && Store.getCommentsJson()[Store.getSelectedCustomer()][Store.getSelectedTrack()]){
            Store.getCommentsJson()[Store.getSelectedCustomer()][Store.getSelectedTrack()].unshift(updateJson);
        }
        else{
            Store.setCommentJson(updateJson);
        }
        that.closeCommentModel(that);
        this.props.events.emit('stopSpinner',{state:false})
    }

    failureCallback(){
        this.props.events.emit('stopSpinner',{state:false})
        alert("Comment not submitted.Please try again later.");
    }

    closeCommentModel(that){
        that.setState({visibility:false})
    }

    /* To get comment color from json */
    getColor(status) {
        if(status.toLowerCase()=="red") {
            status = "#fc6452"
        }
        else if(status.toLowerCase()=="yellow"){
            status = "#ffcc00"
        }
        else if(status.toLowerCase()=="green") {
            status = "#44d673"
        }
        else{
            status = 'black'
        }

        return status;
    }

    getCommentStatus (status) {

        var status = this.getColor(status);
        return {
            borderRadius: 10,
            backgroundColor: status,
            width: 10,
            height: 10,
            marginTop: 4,
            marginBottom: 10,
            marginLeft:20,
        };
    }

    render(){
        var that=this;

        var tempJson = Store.getCommentsJson();
        console.log("inside comments render");
        var CommentsJson = [];//tempJson[Store.getSelectedCustomer()][Store.getSelectedTrack()];
        if(tempJson[Store.getSelectedCustomer()][Store.getSelectedTrack()])
            CommentsJson = tempJson[Store.getSelectedCustomer()][Store.getSelectedTrack()];
        for(var i=0;i<CommentsJson.length;i++){
            if(!(CommentsJson[i]["expand"]))
                CommentsJson[i]["expand"]=false;
        }

        FinalCommentsArray = CommentsJson;
        var commentList=[];
        if(CommentsJson.length > 0) {
            commentList=<ScrollView style={styles.Scrollcontainer}>
                {CommentsJson.map(function(item,index){
                    if(item.expand){
                        var nooflines = null;
                    }
                    else {
                        var nooflines = 2;
                    }
                    var Comment_Date = item.comm_date.split(' ')[0];

                    /* Add current color beside each comment */
                    var commentStatus;
                    if (item.comment_type === 'PE/PS'){
                        commentStatus = item.pspe_status
                    }
                    else if(item.comment_type === 'Sales'){
                        commentStatus = item.status
                    }
                    else {
                        commentStatus = item.ce_status
                    }

                    if(commentStatus == null){
                        commentStatus = 'black'
                    }

                    return(
                        <View>
                            <View style={styles.row}>
                                <Text style={styles.UserName}>{item.user}</Text>
                                <Text style={styles.CommentDate}>{Comment_Date}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.UserType}>{item.comment_type}</Text>
                                <View style={that.getCommentStatus(commentStatus)}></View>
                            </View>
                            <Text numberOfLines={nooflines}  onPress = {()=>that.expandText(item)} style={styles.commentDesc}>{item.comment}</Text>
                            <View style = {styles.separator}></View>
                        </View>
                    );
                })}
            </ScrollView>;
        }
        else {
            commentList = <View style={{marginLeft:10,marginRight:10,backgroundColor:"white",alignItems:"center",borderRadius:10,justifyContent:"center"}}><Text style={{height:40,paddingLeft:30,paddingRight:30,fontSize:15,marginTop:10,backgroundColor:"white",color:"black",alignItems:"center",justifyContent:"center"}}>No Comments to Show</Text></View>
        }


        return (
            <View style={styles.mainContainer}>
                {commentList}
                <ActionButton buttonColor="rgba(29, 53, 87, 1)" offsetY={80}>
                    <ActionButton.Item buttonColor='#1d3557' style={{elevation:3,borderColor:"gray"}} title="New Comment" titleBgColor='#e9e9ef' onPress = {()=>this.addComment()}>
                        <Icon name="icon-Comments-new" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#1d3557' title="Copy previous Comment" titleBgColor='#e9e9ef' onPress = {()=>this.copyComment()}>
                        <Icon name="icon-Comments" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>

                <CommentModel visibility={this.state.visibility}
                              isStatusModuleVisible={this.state.isStatusModuleVisible}
                              onEndEditing={this.updateCommentModelText.bind(this,this)}
                              commentTextInputHeight = {this.state.commentTextInputHeight}
                              onClose={this.closeCommentModel.bind(this,this)}
                              commentText = {this.state.commentText}
                              changeCustomerStatus = {this.state.userType}
                              changeStatus = 'true'
                              commentModelTitle="Comments:" />
            </View>
        );
    }
}


const styles = StyleSheet.create({

    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 48/2,
        backgroundColor: "#1d3557",
        position:"absolute",
        bottom:10,
        right:10,
    },

    mainContainer: {
        flex:1,
        marginTop:20,
        justifyContent: 'space-around',
    },

    Scrollcontainer: {
        backgroundColor:'#ffffff',
        flex:1,
        marginBottom:60,
        flexDirection:"column"
    },

    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },

    addCommentsContainer: {
        flexDirection:"row",
        flex:0.1,
        backgroundColor:"green"
    },

    UserName : {
        fontFamily: 'Lato-Regular',
        flex:0.75,
        fontSize:20,
        color:"#2fbced",
        marginLeft:5,
        marginTop:3
    },

    UserType : {
        fontFamily: 'Lato-Regular',
        marginLeft:5,
        marginTop:2,
        fontSize:10

    },

    CommentDate : {
        fontFamily: 'Lato-Regular',
        flex:0.25,
        fontSize:12,
        color:"#000000",
        marginRight:1,
        marginTop:5,
        textAlign:"right",
        /*backgroundColor:'orange'*/
    },
    textEdit: {
        fontFamily: 'Lato-Regular',
        backgroundColor: '#ffffff',
        paddingLeft:10,
        flexDirection:"row",
        flex:0.8,
        fontStyle: 'italic',
    },
    submitComment: {
        flexDirection:"row",
        flex:0.2,
        backgroundColor:"#ffffff",
    },
    commentDesc : {
        fontFamily: 'Lato-Regular',
        fontSize:15,
        backgroundColor:'#ffffff',
        color:"#231f20",
        textAlign:"left",
        flex:0.8,
        flexDirection:"column",
        marginBottom: 20,
        marginTop: 15,
        marginLeft:10,
        marginRight:10
    },

    row : {
        flexDirection:"row",
        flex:1,
    },

    separator: {
        flex: 1,
        color: '#a7a9ac',
        borderWidth: 0.3,
        borderColor: '#a7a9ac'
    }
});
