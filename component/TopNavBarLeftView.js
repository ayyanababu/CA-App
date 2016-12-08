/**
 * Created by sumeetbhalla on 6/2/16.
 */
import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View,TouchableHighlight, AsyncStorage} from 'react-native'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Actions} from 'react-native-router-flux'
import Icon from '../utils/CAPP';

export default class LeftButton extends React.Component {
    leftButtonClick(){
        this.props.leftAction();
    }
    render(){
        var iconName;
        if(this.props.presentView == "landing") {
            iconName = "icon-Menu-01";
        }
        else if(this.props.presentView == "details") {
            iconName = "icon-Back-01";
        }
        return (
            <TouchableHighlight
                style={{ position: "absolute",padding:8,color:"#ffffff",height:40,width:40,paddingTop:25,left: 4}}
                onPress={() => this.leftButtonClick()} underlayColor="transparent">
                <Icon name={iconName} size={25} color="#ffffff"/>
            </TouchableHighlight>
        )
    }
}
