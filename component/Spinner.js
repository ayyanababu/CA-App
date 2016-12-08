/**
 * Created by sumeetbhalla on 5/30/16.
 */
import React from 'react';
import {Actions,NavBar,DefaultRenderer} from "react-native-router-flux";
import SpinnerComp from 'react-native-loading-spinner-overlay';

export default class  Spinner extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return(
            <SpinnerComp visible={this.props.visible} color="white"/>
        )
    }
}
/*
export default new Spinner();*/
