import React from 'react';
import {AppRegistry,Component,Image,Dimensions, View} from 'react-native'
import { Actions} from 'react-native-router-flux'

class SplashPage extends Component {

    componentDidMount () {
        setTimeout (() => {
             Actions.login("");
        }, 2000); // Time until it jumps to "MainView" 
    }
    render () {
        var {height, width} = Dimensions.get('window');
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image  source={require('../images/screen.png')} style={{position: 'absolute', left: 0, top: 0, width:width, height:height}} />
            </View>
        );
    }
}

module.exports = SplashPage;
