import React from 'react';
var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
import {AppRegistry, Navigator, StyleSheet,ToastAndroid,BackAndroid, Text, View,TouchableHighlight, TouchableOpacity, AsyncStorage} from 'react-native'
import Login from './component/Login'
import CustomerList from './component/CustomerList'
import Icon from './utils/CAPP';
import Filter from './component/Filter';
import CustomerDetails from './component/CustomerDetails'
import LeftView from './component/TopNavBarLeftView'
import RightView from './component/TopNavBarRightView'
import NavigationDrawer from './component/NavigationDrawer'
import Comments from "./component/Comments"
import SplashPage from "./component/SplashPage"
import Store from './utils/store.js';
var DeviceEventManager = require('NativeModules').DeviceEventManager;
import {Scene, Reducer, Router, Switch, TabBar, Modal, Actions} from 'react-native-router-flux'

var loginCredential = {};
var exitButton=true;

const styles = StyleSheet.create({
    container: {flex:1, backgroundColor:"transparent",justifyContent: "center",
        alignItems: "center",}

});

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        return defaultReducer(state, action);
    }
};

export default class CAAppContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isRaciPage : false } ;
        this.state.isRaciPage = this.props.raci;
    }
    backButtonFunction() {
        return (
            <TouchableOpacity style={[{
        width: 100,
        height: 37,
        position: 'absolute',
        bottom: 20,
        left: 2,
        padding: 8,
        /*paddingBottom:5,*/
        justifyContent:'center',
    }]} onPress={Actions.pop}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Icon name="icon-Back-01" size={25} color={'#ffffff'} style={{marginTop:2,paddingRight:6}} />
                </View>
            </TouchableOpacity>
        );
    };
    drawerIcon() {
        return (
            <TouchableOpacity style={[{
        width: 100,
        height: 37,
        position: 'absolute',
        bottom: 4,
        left: 2,
        padding: 8,
        justifyContent:'center',
    }]} >
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Icon name="icon-Menu-01" size={25} color={'#ffffff'} style={{marginTop:2,paddingRight:6}} />
                </View>
            </TouchableOpacity>
        );
    };

    componentWillMount() {
        this.eventEmitter = new EventEmitter();
    }

    back() {
        Actions.pop();
    }

    /* To switch between comments and Raci component */

    goToCommentsPage() {
        this.eventEmitter.emit('switchCustomerDetailsContent');
    }



    render() {

        BackAndroid.addEventListener('hardwareBackPress', function() {
            if (!Actions.pop()) {
                setTimeout (() => {
                    {exitButton=!exitButton;};
                }, 3000);
                exitButton=!exitButton;
                if(exitButton==true){
                    DeviceEventManager.invokeDefaultBackPressHandler();
                    return true;
                }
                else{
                    ToastAndroid.show('Press again to exit', ToastAndroid.SHORT)
                    return true;
                }


                return true;

            }
            else{

                return true;
            }

        });

        var that = this;
        return <Router createReducer={reducerCreate}>
            <Scene key="modal" component={Modal} >
                <Scene key="root" hideNavBar={true} renderBackButton={that.backButtonFunction}>
                    <Scene type="reset" key="login"  direction="vertical"  >
                        <Scene key="loginModal" component={Login} hideNavBar={true} />
                    </Scene>

                    <Scene type="replace" key="navbar" /*initial={true}*/  component={NavigationDrawer} events={that.eventEmitter} >
                        <Scene key="main" drawerImage={require('./images/hamburger_icon.png')}>
                            <Scene key="customerList" initial={true} hideNavBar={false} component={CustomerList} events={that.eventEmitter} title="Customer Status (Sales)" navigationBarStyle={{backgroundColor:'#1e3656'}} titleStyle={{color:'white',textAlign:'left',marginLeft:60}} />
                            <Scene key="customerDetail" renderBackButton={that.backButtonFunction} hideNavBar={false} events={that.eventEmitter} component={CustomerDetails}  navigationBarStyle={{backgroundColor:'#1e3656',flex: 1,height:80,flexDirection: 'row',alignItems: 'center',justifyContent: 'center',flexWrap:'wrap'}} titleStyle={{color:'white',textAlign:'left',marginLeft:45,paddingRight:50,marginRight:50,paddingBottom:0,marginBottom:0, textOverflow:"clip", fontSize: 16}} renderRightButton={()=><RightView rightAction={that.goToCommentsPage.bind(this,this)}/>}/>
                            <Scene key="comments" renderBackButton={that.backButtonFunction} component={Comments}  events={that.eventEmitter} title="Headline" navigationBarStyle={{backgroundColor:'#1e3656'}} titleStyle={{color:'white',textAlign:'left',marginLeft:60}} leftImage={<Icon name="md-menu" size={25} color="#ffffff"/>} />
                        </Scene>
                    </Scene>


                    <Scene key="filter" /*initial={true} */events={that.eventEmitter} component={Filter}/>
                </Scene>
            </Scene>
        </Router>;
    }
}
