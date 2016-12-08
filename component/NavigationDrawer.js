/**
 * Created by sumeetbhalla on 6/2/16.
 */
import React, { PropTypes } from 'react';
import Drawer from 'react-native-drawer';
import { DefaultRenderer } from 'react-native-router-flux';
import {AppRegistry, Navigator, StyleSheet, Text, View,TouchableHighlight, AsyncStorage} from 'react-native'
var Subscribable = require('Subscribable');
var reactMixin = require('react-mixin');
import DrawerView from './DrawerView';

const propTypes = {
    navigationState: PropTypes.object,
};

class NavigationDrawer extends React.Component {
    /*navigateViews() {
        console.log("reload drawer initialted");
        this.props.events.emit("reloadDrawer");
        this.props.onNavigate();
    }*/
    componentWillMount() {
        this.addListenerOn(this.props.events, 'closeDrawer', this.closeDrawer.bind(this,this))
    }
    closeDrawer(that) {
        that.refs.navigation.close()
    }
    openControlPanel = () => {
        this.refs.navigation.open()
    };
    render() {
        const children = this.props.navigationState.children;
        return (
            <Drawer
                ref="navigation"
                type="static"
                content={<DrawerView events={this.props.events}/>}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                tweenHandler={(ratio) => ({
          main: { opacity: Math.max(0.54, 1 - ratio) },

        })}
            >
                <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
            </Drawer>
        );
    }
}

NavigationDrawer.propTypes = propTypes;
reactMixin(NavigationDrawer.prototype,Subscribable.Mixin);
module.exports = NavigationDrawer;
