/**
 * Created by sumeetbhalla on 6/2/16.
 */
import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View,TouchableHighlight, AsyncStorage} from 'react-native'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Actions} from 'react-native-router-flux'
import Icon from '../utils/CAPP';
import Store from '../utils/store';
export default class extends React.Component {
    rightButtonClick(obj){
        this.props.rightAction(obj);
    }
    render(){
        var iconName;
        if(Store.getCurrentView() == false) {
            iconName = "icon-Comments";
        }
        else if (Store.getCurrentView() == true) {
            iconName = "icon-account_circle-01";
        }
        return (
            <TouchableHighlight
                style={{ position: "absolute", padding:8,color:"#ffffff",height:40,width:40,paddingTop:28,paddingBottom:28,paddingRight:5,right: 3,alignSelf:'center',alignItems:'center'}}
                onPress={() => this.rightButtonClick()} underlayColor="transparent">
                <Icon name={iconName} size={25} color="#ffffff"/>
            </TouchableHighlight>
        )
    }
}
