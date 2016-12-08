/**
 * Created by sumeetbhalla on 5/31/16.
 */
import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Image, Component, Navigator} from "react-native";
import {Actions,NavBar,DefaultRenderer} from "react-native-router-flux";
import Icon from '../utils/CAPP';

var styles = StyleSheet.create({
    messageText: {
        fontFamily: 'Lato-Regular',
        fontSize: 17,
        fontWeight: '500',
        padding: 15,
        marginTop: 50,
        marginLeft: 15,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CDCDCD',
    },
    buttonText: {
        fontFamily: 'Lato-Regular',
        fontSize: 17,
        fontWeight: '500',
    },
    navBar: {
        backgroundColor: '#1e3656',
    },
    navBarText: {
        fontFamily: 'Lato-Regular',
        fontSize: 16,
        marginVertical: 10,
    },
    navBarTitleText: {
        fontFamily: 'Lato-Regular',
        color: 'white',
        fontWeight: '500',
        marginVertical: 9,
    },
    navBarLeftButton: {
        paddingLeft: 10,
    },
    navBarRightButton: {
        paddingRight: 10,
    },
    navBarButtonText: {
        color: '#5890FF',
    },
    scene: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#EAEAEA',
    },
});


export default class TopNavBar extends React.Component {



    constructor(props) {
        super(props);
    }
    render() {
        var that = this;
        var NavigationBarRouteMapper = {

            LeftButton: function(route, navigator, index, navState) {
                if(that.props.leftButton == "hamburger") {
                    return (
                        <View style={styles.navBarLeftButton}>
                            <Icon name="icon-Menu-01" size={25} color="#ffffff"/>
                        </View>
                    );
                }
            },

            RightButton: function(route, navigator, index, navState) {
                if(that.props.rightButton == "search") {
                    return (
                        <View style={styles.navBarRightButton}>
                            <Icon name="icon-Search-01" size={25} color="#ffffff"/>
                        </View>
                    );
                }
            },

            Title: function(route, navigator, index, navState) {
                return (
                    <Text style={[styles.navBarText, styles.navBarTitleText]}>
                        {that.props.title}
                    </Text>
                );
            },

        };

        return (
            <Navigator.NavigationBar
                style={styles.navBar}
                routeMapper={NavigationBarRouteMapper}
            />
        );
    }
}
