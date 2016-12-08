var React = require('react-native');
import Icon from '../utils/CAPP';

var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Component,
} = React;

class BottomContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      trackKeys: props.trackKeys,
      selected: false,
      presentTrackKeys: [],
      startIndex: 0,
      endIndex: 2,
      pointing:{
        pointingIndex: 0,
        trackDirection: ""
      },
      isLeftNavVisible: props.isLeftNavVisible,
      isRightNavVisible: props.isRightNavVisible,
      leftArrowColor: '',
      rightArrowColor: ''
    };
  }

  trackTapEvent(incomingTrackKey, index) {
    this.state.pointing.pointingIndex = index
    this.props.onTrackTap(incomingTrackKey);
  }

  frontTrack() {
      var lastTrackIndex = this.state.trackKeys.length-1;
      if(this.state.endIndex<lastTrackIndex) {
        this.state.endIndex +=   1;
        this.state.startIndex += 1;

        var tempPresentTrackTrackKeys = [];
        var bottomContainerRef = this;
        this.state.trackKeys.map(function(key, index) {
            if(index>=bottomContainerRef.state.startIndex && index<=bottomContainerRef.state.endIndex) {
                  tempPresentTrackTrackKeys.push(key);
            }
            else {
              return;
            }
        });

        this.setState({presentTrackKeys:tempPresentTrackTrackKeys});
      }
  }

  backTrack() {
    var startTrackIndex = this.state.startIndex;
      if(startTrackIndex>0) {
        this.state.endIndex = this.state.endIndex - 1;
        this.state.startIndex = this.state.startIndex - 1;

        var tempPresentTrackTrackKeys = [];
        var bottomContainerRef = this;
        this.state.trackKeys.map(function(key, index){
            if(index>=bottomContainerRef.state.startIndex && index<=bottomContainerRef.state.endIndex){
                tempPresentTrackTrackKeys.push(key);
            }
            else {
              return;
            }
        });
        this.setState({presentTrackKeys:tempPresentTrackTrackKeys});
    }
  }

  updatePresentTrackKeys(pointing) {
    if(pointing.trackDirection=="Front") {
      this.frontTrack();
    } else if (pointing.trackDirection=="Back") {
      this.backTrack();
    }
    this.props.onTrackTap(this.state.presentTrackKeys[pointing.pointingIndex]);
  }

  trackChangeEvent(trackDirection) {
    this.state.pointing.trackDirection = trackDirection
    if(this.state.pointing.trackDirection=="Front"){
      if(this.state.endIndex<this.state.trackKeys.length-1){
        if(this.state.pointing.pointingIndex>0){
          this.state.pointing.pointingIndex-=1
        }
      }
    }
    else {
      if(this.state.endIndex>2){
        if(this.state.pointing.pointingIndex<2){
          this.state.pointing.pointingIndex+=1
        }
      }
    }
    this.updatePresentTrackKeys(this.state.pointing)
  }

  render() {
    this.state.leftArrowColor = '#ffffff'
    this.state.rightArrowColor = '#ffffff'

    this.state.isLeftNavVisible = this.props.isLeftNavVisible
    this.state.isRightNavVisible = this.props.isRightNavVisible

    //Get All the trackKeys and put it in presentTrackKeys Array show only three items can be visible
    this.state.trackKeys = this.props.trackKeys
    var bottomContainerRef = this;

    this.state.presentTrackKeys = [];
    this.state.trackKeys.map(function(key, index){
        if(index>=bottomContainerRef.state.startIndex && index<=bottomContainerRef.state.endIndex){
            bottomContainerRef.state.presentTrackKeys.push(key);
        }
        else {
          return;
        }
    });

    if(this.state.trackKeys.length > 3){
      if(this.state.startIndex==0){
        this.state.leftArrowColor='#A9A9A9'
      }
      if(this.state.endIndex==this.state.trackKeys.length-1){
        this.state.rightArrowColor='#A9A9A9'
      }
    }
    else{
      this.state.leftArrowColor = '#A9A9A9'
      this.state.rightArrowColor = '#A9A9A9'
    }

    var leftArrow;

    if(this.state.isLeftNavVisible){
      leftArrow =  <View style={bottomBarStyle.leftStyle}>
                      <TouchableHighlight style={bottomBarStyle.bottomButtons} underlayColor="#385b84" onPress={() => this.trackChangeEvent("Back")}>
                        <Icon name="icon-Previous-01" color={this.state.leftArrowColor} size={30}/>
                      </TouchableHighlight>
                  </View>
    }
    else {
      leftArrow = null
    }


    var rightArrow;

    if(this.state.isRightNavVisible){
      rightArrow =  <View style={bottomBarStyle.rightStyle}>
                      <TouchableHighlight style={bottomBarStyle.bottomButtons}
                             underlayColor="#385b84"
                             onPress={() => this.trackChangeEvent("Front")}>
                             <Icon name="icon-Next-01" color={this.state.rightArrowColor} size={30}/>
                      </TouchableHighlight>
                    </View>
    }
    else{
      rightArrow = null
    }

      //Draw BottomBar Container
       return (
           <View style={bottomBarStyle.footer}>

              {leftArrow}

              <View style={bottomBarStyle.middleViewStyle}>
              {
                this.state.presentTrackKeys.map(function(key, i) {
                  return (
                            <TouchableHighlight style={[bottomBarStyle.bottomButtons, {backgroundColor: this.state.pointing.pointingIndex==i? '#1d3557' : '#2b517f' }]} underlayColor="#1d3557" onPress={() => this.trackTapEvent(key, i)}>
                                <View>
                                    <Text style={bottomBarStyle.footerText} numberOfLines={1}>{key}</Text>
                                </View>
                            </TouchableHighlight>
                         );
                       }, this)
              }
              </View>

            {rightArrow}

           </View>
       );
   }
}


var bottomBarStyle = StyleSheet.create({
  footer: {
        position: 'absolute',
        flex:0.1,
        left: 0,
        right: 0,
        bottom: -10,
        backgroundColor:'#385b84',
        flexDirection:'row',
        height:80,
        alignItems:'center',
    },
    leftStyle: {
      flex: 0.1,
      backgroundColor:'#385b84',
    },
    bottomButtons: {
        alignItems:'center',
        justifyContent: 'center',
        flex:1,
        height: 80,
    },
    footerTextTop: {
        fontFamily: 'Lato-Regular',
        color:'white',
        fontWeight:'normal',
        alignItems:'center',
        fontSize:14,
        paddingLeft:5,
        paddingRight:5,
        textAlign: 'center',
        paddingBottom:5
    },
    footerText: {
        fontFamily: 'Lato-Regular',
        color:'white',
        fontWeight:'bold',
        alignItems:'center',
        fontSize:14,
        paddingLeft:5,
        paddingRight:5,
        textAlign: 'center',
        paddingBottom:20
    },
    middleViewStyle: {
      flexDirection: 'row',
      flex: 0.8,
    },
    rightStyle: {
      flex: 0.1,
      backgroundColor:'#385b84',
    },
});

module.exports = BottomContainer
