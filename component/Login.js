import React from 'react';
import {View, Text, StyleSheet,NetInfo,DeviceEventEmitter,TextInput,TouchableHighlight,TouchableWithoutFeedback,Image, AsyncStorage} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import Store from '../utils/store.js';
import Spinner from './Spinner.js';
var DismissKeyboard = require('dismissKeyboard');
import Popup from 'react-native-popup';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e3656",
    },
    topImage: {
        flexDirection:"column",
        flex:0.2,
        paddingTop:40,
    },
    appLogo: {
        width: 100,
        height: 100,
        alignSelf:"center",
    },
    middlecomponent: {
        flex: 0.5,
        flexDirection:"column",
    },
    loginFields: {
        //fontFamily: 'Lato-Regular',
        fontSize: 20,
        height:60,
        color:"#ffffff",
        flexDirection:"column",
    },
    loginButton: {
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center",
        paddingLeft:40,
        paddingRight:40,
        paddingTop:12,
        paddingBottom:12,
        borderRadius:30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ffffff",
        backgroundColor: "#ffffff",
        flexDirection:"column",
    },
    footerImage: {
        //flex:0.1,
        flexDirection:"column",
        marginBottom:20,
        alignSelf:"center"
    },
    LoginFooter: {
        width:180,
        height:48.96,
    },
    loginText: {
        fontFamily: 'Lato-Regular',
        fontSize:20,
        color:"#0B4F6C",
        textAlign:"center",
    },
    textInputView: {
        //fontFamily: 'Lato-Regular',

        flex:0.1,
        borderBottomColor:"#ffffff",
        borderBottomWidth:1,
        marginLeft:15,
        marginRight:15,
        marginTop:10
    },
    dummyView1: {
        flex:0.05
    },
    dummyView2: {
        flex:0.08
    },
    dummyView3: {
        flex:0.1
    },
    passwordfield: {

        fontFamily: 'Lato-Regular'
    }

});


export default class extends React.Component {

    constructor(props)
    { super(props);
        this.state =
        {
            isLoading:false
        };
        console.disableYellowBox = true;
    }
    componentWillMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if(!isConnected){
                this.popup.confirm({
                    title: 'Offline',
                    content: ['Seems you are not connected'],
                    ok: {
                        text: 'OK',


                    },
                    cancel: {
                        text: 'Cancel'
                    },
                });
            }
          });

        function handleFirstConnectivityChange(isConnected) {
            //  alert('Then, is ' + (isConnected ? 'online' : 'offline'));
            NetInfo.isConnected.removeEventListener(
                'change',
                handleFirstConnectivityChange
            );
        }

        NetInfo.isConnected.addEventListener(
            'change',
            handleFirstConnectivityChange
        );

        DeviceEventEmitter.addListener('keyboardDidHide', DismissKeyboard)
    }

    StopSpinner(){
        this.setState({isLoading:false});
    }

    StartSpinner(){
        this.setState({isLoading:true})
    }

    render(){
        return (
            <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
                <View style={styles.container}>
                    <Spinner visible={this.state.isLoading} size="large" color="white"/>
                    <Applogo/>
                    <LoginFields  StartSpinner={this.StartSpinner.bind(this,this)}  StopSpinner={this.StopSpinner.bind(this,this)}/>
                    <LoginFooter/>
                    <Popup ref={(popup) => { this.popup = popup }}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

//Child classes
class Applogo extends React.Component {

    render() {
        return (
            <View style={styles.topImage}>
                <Image source={require('../images/CaapLoginSmall.png')} style={styles.appLogo}/>
            </View>
        );
    }
}

class LoginFields extends React.Component {
    constructor(props)
    { super(props);
        this.state =
        {

            username: "",
            password: "",
        };
        console.disableYellowBox = true;
    }

    componentWillMount() {
        AsyncStorage.getItem("username", (err, result) => {
            if(result){
                //console.log("Username stored is:",result);
                this.setState(this.setState({username:result}));
            }
        });


    }

    sucessCallBack() {
        this.props.StopSpinner();
        Actions.navbar("");
    }

    failureCallback() {
        this.props.StopSpinner();
        alert("Please enter the right Credentials");
    }
    focusNextField(nextField) {
        this.refs[nextField].focus();
    }

    saveCredentials() {

        if((this.state.username)&&(this.state.password)){
            Store.setLoginCredential("username",this.state.username.toLowerCase());
            Store.setLoginCredential("password",this.state.password);
        }

        this.props.StartSpinner();
        Store.getCustomerList(this.sucessCallBack.bind(this,this),this.failureCallback.bind(this,this));
    }
    render(){
        var StoredUsername = "";
        return (
            <View style={styles.middlecomponent}>

                <View style={styles.dummyView1}></View>
                <View style={styles.textInputView}>

                    <TextInput

                        placeholder="Username"
                        ref= "username"
                        tintColor={"white"}
                        style={styles.loginFields}
                        placeholderTextColor = "#A6ACAF"
                        underlineColorAndroid = "transparent"
                        defaultValue  = {this.state.username}
                        returnKeyType="next"
                        onSubmitEditing={() =>  this.focusNextField('password')}
                        onChangeText={(username) => {this.setState({username:username})}}/>
                </View>
                <View style={styles.textInputView}>
                    <TextInput

                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderStyle={styles.passwordfield}
                        ref= "password"
                        tintColor={"white"}
                        style={styles.loginFields}
                        placeholderTextColor = "#A6ACAF"
                        underlineColorAndroid = "transparent"
                        returnKeyType="go"
                        onSubmitEditing={() =>  this.saveCredentials()}
                        onChangeText={(password) => {this.setState({password:password})}}/>
                </View>
                <View style={styles.dummyView2}></View>
                <TouchableHighlight style={styles.loginButton} underlayColor="#ffffff" onPress={() => this.saveCredentials()}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableHighlight>
                <View style={styles.dummyView3}></View>

            </View>

        );
    }

}

class LoginFooter extends React.Component {
    render() {
        return (
            <View style={styles.footerImage}>
                <Image source={require('../images/Version.png')} style={styles.LoginFooter}/>
            </View>
        );
    }

}
