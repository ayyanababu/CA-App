var React = require('react-native');
import Icon1 from '../utils/CAPP';
import Icon from 'react-native-vector-icons/Ionicons';
import Store from '../utils/store.js';
import Communications from 'react-native-communications';

var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Component,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  DeviceEventEmitter,
  Image
} = React;

class ContactButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      callerNumber: props.callerNumber,
      callerMail: props.callerMail
    };
  }

  onTap(actionElement){
     if(actionElement=="CALL"){
       //alert(this.state.callerNumber)
       Communications.phonecall(this.state.callerNumber, false)
     }

     else {
        var subject = ``;
        if(this.props.customerName != undefined) {
          subject = `Reg: ${this.props.customerName}`
        }
        if(this.props.currentTrackKey != undefined) {
          subject = subject + ` - ${this.props.currentTrackKey}`
        }
        Communications.email([this.state.callerMail], null, null, subject, null)
      }
  }

  render() {

    this.state.callerNumber = this.props.callerNumber
    this.state.callerMail = this.props.callerMail
    return (
    <View style={contactButtonViewStyle.contactOuterView}>
      <TouchableHighlight style={contactButtonViewStyle.contactButtonStyle} onPress={() => this.onTap(this.props.actionElement)} underlayColor="#ffffff">
          <View style={contactButtonViewStyle.iconndTextStyle}>
          <Icon1 style={contactButtonViewStyle.iconStyle} name={this.props.iconName} size={22} color="#2BADE6"/>
          <Text style={contactButtonViewStyle.contatButtonTextStyle} numberOfLines={1}>{this.props.actionElement}</Text>
          </View>
      </TouchableHighlight>
    </View>
    );
  }
}

class ContactModel extends Component {

  constructor(props){
    super(props);
    this.state = {
      animationType: false,
      transparent: false,
      info: {
        isContactModelVisible: props.contactModelVisibility,
        callerName: '',
        callerNumber: '',
        callerMail: '',
      },
      customerName: props.customerName,
      currentTrackKey: props.currentTrackKey
    };
    this.state.transparent = true
  }

  _setModalVisible(visible) {
    this.state.info.isContactModelVisible = visible
    this.props.onClose(this.state.info.isContactModelVisible)
  }


  render() {

    this.state.customerName = this.props.customerName
    this.state.currentTrackKey = this.props.currentTrackKey

    this.state.info.isContactModelVisible = this.props.contactModelVisibility
    if(Object.keys(this.props.callerObject).length>0){
    this.state.info.callerName = Object.keys(this.props.callerObject)[0]
    this.state.info.callerNumber = this.props.callerObject[this.state.info.callerName].phone_number
    this.state.info.callerMail = this.props.callerObject[this.state.info.callerName].email
  }
    return (
         <Modal
           animationType={this.state.animationType}
           transparent={this.state.transparent}
           visible={this.state.info.isContactModelVisible}
           onRequestClose={() => {this._setModalVisible(false)}}
         >
            <View style={contactModelStyle.outerContainer}>
            <View style={contactModelStyle.innerContainer}>

            <View style={contactModelStyle.topContainerStyle}>
               <TouchableHighlight style={contactModelStyle.closeIconStyle} onPress={this._setModalVisible.bind(this, false)} underlayColor="#2BADE6">
                 <Icon1 name="icon-Cancel-01" color="#ffffff" size={22}/>
               </TouchableHighlight>
               <View style={contactModelStyle.contactIconndTextStyle}>
               <Icon1 style={contactButtonViewStyle.iconStyle} name="icon-account_circle-01" size={150} color="#ffffff"/>
               <Text style={contactModelStyle.contactTextStyle}>{this.state.info.callerName}</Text>
               </View>
           </View>

          <View style={contactModelStyle.callndMailStyle}>
              <ContactButton style={contactModelStyle.callStyle} actionElement={"CALL"} iconName={"icon-phone-01"} callerNumber={this.state.info.callerNumber} customerName={this.state.customerName} currentTrackKey={this.state.currentTrackKey}/>
              <View style={contactModelStyle.emptyView}></View>
              <ContactButton style={contactModelStyle.mailStyle} actionElement={"MAIL"} iconName={"icon-markunread-01"} callerMail={this.state.info.callerMail} customerName={this.state.customerName} currentTrackKey={this.state.currentTrackKey}/>
          </View>

        </View>
        </View>

        </Modal>
       );
   }

}

var contactModelStyle = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'rgba(52,52,52,1)',
  },
  innerContainer: {
    backgroundColor: '#ffffff',
  },
  topContainerStyle: {
    flex: 0.8,
    backgroundColor: '#2BADE6',
    padding: 10,
  },
  closeIconStyle : {
    alignSelf: 'flex-end',
    padding: 8
  },
  contactIconndTextStyle: {
    alignItems: 'center',
  },
  contactIconStyle: {

  },
  contactTextStyle : {
      fontFamily: 'Lato-Regular',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 26,
    color:'#ffffff',
    padding:8,
  },
  callndMailStyle: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 40,
    paddingRight: 40,
  },
  callStyle: {

  },
  mailStyle: {

  },
  emptyView: {
  
  },
});

var contactButtonViewStyle = StyleSheet.create({
  contactOuterView: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 4,
    paddingLeft: 4,
  },
  contactButtonStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2BADE6',
    borderWidth: 1.5,
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    height: 35,
  },
  contatButtonTextStyle: {
      fontFamily: 'Lato-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2BAEE9',
    marginLeft: 8
  },
  iconndTextStyle:{
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconStyle: {
    marginRight: 8
  }
});

module.exports = ContactModel
