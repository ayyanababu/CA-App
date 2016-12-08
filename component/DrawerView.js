/**
 * Created by sumeetbhalla on 6/10/16.
 */
'use strict';


import React, {
    Component,
} from 'react';

import {
    Image,
    ListView,
    TouchableHighlight,
    StyleSheet,
    RecyclerViewBackedScrollView,
    Text,
    View,
    ScrollView,
    UIExplorerPage,
    AsyncStorage
} from 'react-native';

import Icon from '../utils/CAPP';
import Store from '../utils/store.js';
import {Scene, Reducer, Router, Switch, TabBar, Modal, Actions} from 'react-native-router-flux'
var Subscribable = require('Subscribable');
var reactMixin = require('react-mixin');
class DrawerView extends Component{
    constructor(props) {
    super(props)
        this.state={
            currentStatus:null,
            reload:false,
            currentRole:"Sales Status"
        }
    }

    componentDidMount() {
        //console.log("component did load");
        this.updateAccountNumbers();
        this.addListenerOn(this.props.events,'setTickFOrDrawer', this.updateTick.bind(this,this));
    }

    updateAccountNumbers() {
        this.setState({reload:true});
    }

    updateTick(that,obj) {
        if(obj.filterColor != this.state.currentStatus)
            this.setState({currentStatus:obj.filterColor});
        else
            this.setState({currentStatus:null});
    }

    filterIssueOnColor(color,count){
        //console.log("apply filter on "+color);
        if(count !=0) {
            this.updateAccountNumbers();
            this.props.events.emit("filterCustomersBasedOnStatus", {filterColor: color});
        }
        this.props.events.emit("closeDrawer");
    }
    showHideTick(obj) {
        if(obj == this.state.currentStatus) {
            return '#2fbced'
        }
        else {
            return '#ffffff'
        }
    }
    changeOverallStatusBasedOnRole(role) {
        this.state.currentStatus = null;
        this.props.events.emit("changeStatusOfCustomersBasedOnRole",{role:role});
        this.props.events.emit("closeDrawer");
        this.setState({currentRole:role});
    }

    getRoleSelectedStatus(role) {
        if(role == this.state.currentRole) {
            return '#2fbced'
        }
        else {
            return '#ffffff'
        }
    }

    logout(){
        this.props.events.emit('logoutTrigerred');
        this.props.events.emit("closeDrawer");
    }

    render(){
        var that = this;
        return(
            <ScrollView contentContainerStyle= {styles.mainContainer}>
                <View style= {styles.user}>
                    <Text numberOfLines={2} style= {styles.username}>{Store.getUserFullName()}</Text>
                </View>
                <View style= {styles.accounts}>
                    <TouchableHighlight onPress={() => that.filterIssueOnColor("red",Store.getRedAccountsCount())} underlayColor="transparent">
                        <View style={styles.row}>
                            <Text style= {styles.accountType}>Red Accounts</Text>
                            <View style= {styles.checkmark}>
                                <Icon name="icon-Selected-01" size={20} color={that.showHideTick("red")}/>
                            </View>
                            <View style={styles.buttonRed}>
                                <Text style= {styles.buttonText}>{Store.getRedAccountsCount()}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => that.filterIssueOnColor("yellow",Store.getYellowAccountsCount())} underlayColor="transparent">
                        <View style={styles.row}>
                            <Text style= {styles.accountType}>Yellow Accounts</Text>
                            <View style= {styles.checkmark}>
                                <Icon name="icon-Selected-01" size={20} color={that.showHideTick("yellow")}/>
                            </View>
                            <View style={styles.buttonYellow}>
                                <Text style= {styles.buttonText}>{Store.getYellowAccountsCount()}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => that.filterIssueOnColor("green",Store.getGreenAccountsCount())} underlayColor="transparent">
                        <View style={styles.row}>
                            <Text style= {styles.accountType}>Green Accounts</Text>
                            <View style= {styles.checkmark}>
                                <Icon name="icon-Selected-01" size={20} color={that.showHideTick("green")}/>
                            </View>
                            <View style={styles.buttonGreen}>
                                <Text style= {styles.buttonText}>{Store.getGreenAccountsCount()}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                                       <TouchableHighlight onPress={() => that.filterIssueOnColor("black",Store.getBlackAccountsCount())} underlayColor="transparent">
                        <View style={styles.row}>
                            <Text style= {styles.accountType}>No Status</Text>
                            <View style= {styles.checkmark}>
                                <Icon name="icon-Selected-01" size={20} color={that.showHideTick("black")}/>
                            </View>
                            <View style={styles.buttonBlack}>
                                <Text style= {styles.buttonText}>{Store.getBlackAccountsCount()}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style= {styles.mode}>
                    <View style= {styles.preview}>
                        <Text style= {styles.previewText}>Preview Mode</Text>
                    </View>
                    <TouchableHighlight onPress={() => that.changeOverallStatusBasedOnRole("CE Status")} style={{flex:0.1}} underlayColor="transparent">
                        <View style={styles.cerow}>
                            <View style= {styles.row}>
                                <View style={styles.ce}>
                                    <Text style= {styles.modeText}>CE Preview</Text>
                                </View>
                                <View style= {styles.checkmark}>
                                    <Icon name="icon-Selected-01" size={20} color={that.getRoleSelectedStatus("CE Status")} />
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => that.changeOverallStatusBasedOnRole("PE/PS Status")} style={{flex:0.1}} underlayColor="transparent">
                        <View style={styles.pepsrow}>
                            <View style= {styles.row}>
                                <View style={styles.peps}>
                                    <Text style= {styles.modeText}>PE/PS Preview</Text>
                                </View>
                                <View style= {styles.checkmark}>
                                    <Icon name="icon-Selected-01" size={20} color={that.getRoleSelectedStatus("PE/PS Status")} />
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => that.changeOverallStatusBasedOnRole("Sales Status")} underlayColor="transparent" style={{flex:0.1}}>
                        <View style={styles.salesrow}>
                            <View style= {styles.row}>
                                <View style={styles.sales}>
                                    <Text style= {styles.modeText}>Sales Preview</Text>
                                </View>
                                <View style= {styles.checkmark}>
                                    <Icon name="icon-Selected-01" size={20} color={that.getRoleSelectedStatus("Sales Status")} />
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style= {styles.logout} underlayColor="transparent" onPress={() => this.logout()}>
                    <Text style= {styles.accountType}>Logout</Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({

    mainContainer: {
        flex:1,
        flexDirection:"column",
    },

    user: {
        backgroundColor:'#1d3557',
        flex:0.2,
        /*flexDirection:"column",*/
        alignItems:'center',
    },

    accounts: {
        backgroundColor:'#ffffff',
        flex:0.4,
        /*flexDirection:"column",*/
        borderBottomColor : "#f2f2f2",
        borderBottomWidth: 2,
        paddingTop:5,
        marginBottom:0,

    },

    mode: {
        backgroundColor:'#ffffff',
        flex:0.3,
        borderBottomColor : "#f2f2f2",
        borderBottomWidth: 2,
        /*flexDirection:"column",*/

    },

    logout: {
        backgroundColor:'#ffffff',
        flex:0.15,
        justifyContent:'center'
        /*flexDirection:"column"*/
    },

    username: {
        fontFamily: 'Lato-Regular',
        fontSize:25,
        fontStyle:'normal',
        /*fontFamily: 'Lato',*/
        fontWeight:'bold',
        color:"#ffffff",
        marginTop:35,
        paddingBottom:10,
        marginLeft:10,
        marginRight:10

    },

    accountType: {
        fontFamily: 'Lato-Regular',
        flex:0.5,
        fontSize:18,
        fontStyle:'normal',
        /*fontFamily: 'Lato',*/
        fontWeight:'normal',
        color:"#231f20",
        marginLeft:10,
        marginTop:15,
        marginBottom:15,
    },

    previewText: {
        fontFamily: 'Lato-Regular',
        flex:0.4,
        fontSize:18,
        fontStyle:'normal',
        /*fontFamily: 'Lato',*/
        fontWeight:'normal',
        color:"#2fbced",
        marginLeft:15,
        marginTop:10,
        marginBottom:0
    },

    modeText: {
        fontFamily: 'Lato-Regular',
        //flex:0.6,
        fontSize:18,
        fontStyle:'normal',
        /*fontFamily: 'Lato',*/
        fontWeight:'normal',
        color:"#231f20",
        marginTop:0,
        marginBottom:0
    },

    buttonRed: {
        flex:0.2,
        marginLeft:0,
        borderRadius: 40,
        backgroundColor: "#fc5a49",
        width:55,
        height:30,
        marginTop:10,
        marginRight:20,
        alignItems:'center',
        justifyContent:'center',
    },

    buttonYellow: {
        flex:0.2,
        marginLeft:0,
        borderRadius: 20,
        backgroundColor: "#fcca50",
        width:55,
        height:30,
        marginTop:10,
        marginRight:20,
        alignItems:'center',
        justifyContent:'center',
    },

    buttonGreen: {
        flex:0.2,
        marginLeft:0,
        borderRadius: 20,
        backgroundColor: "#3ad86f",
        width:55,
        height:30,
        marginTop:10,
        marginRight:20,
        alignItems:'center',
        justifyContent:'center',
    },

        buttonBlack: {
        flex:0.2,
        marginLeft:0,
        borderRadius: 20,
        backgroundColor: "black",
        width:55,
        height:30,
        marginTop:10,
        marginRight:20,
        alignItems:'center',
        justifyContent:'center',
    },


    buttonText:{
        fontFamily: 'Lato-Regular',
        //alignSelf:"center",
        color:"#f1f2f2",
        fontWeight:"bold",
        fontSize:20
    },
    row : {
        flexDirection:"row",
        flex:1,
        alignItems:'center',
    },
    checkmark : {
        flex:0.1,
        marginTop:0,
        marginBottom:0,
        alignItems:'center',
        justifyContent:'center',
        marginRight:10
    },

    preview: {
        backgroundColor:'#ffffff',

        /*flexDirection:"column",*/
    },

    cerow: {
        backgroundColor:'#ffffff',

        flex:1,
        /*flexDirection:"column",*/
        borderBottomColor : "#f2f2f2",
        borderBottomWidth: 1,
        marginLeft:40,
        paddingTop:10,

    },

    pepsrow: {
        backgroundColor:'#ffffff',
        flex:3,
        /*flexDirection:"column",*/
        borderBottomColor : "#f2f2f2",
        borderBottomWidth: 1,
        marginLeft:40,
        paddingTop:10
    },

    salesrow: {
        backgroundColor:'#ffffff',
        flex:0.3,
        marginLeft:40,
        paddingTop:10
    },
    ce: {
        backgroundColor:'#ffffff'
    },

    peps: {
        backgroundColor:'#ffffff',
    },

    sales: {
        backgroundColor:'#ffffff',
    },

    LogoutPopupView: {
      backgroundColor:"red",
      position: "absolute",
    }
});

reactMixin(DrawerView.prototype,Subscribable.Mixin);
module.exports = DrawerView;
