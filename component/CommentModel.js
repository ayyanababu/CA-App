var React = require('react-native');
var DismissKeyboard = require('dismissKeyboard');
import Icon from '../utils/CAPP';
import Store from '../utils/store.js';
var KeyboardHandler = require('./KeyboardHandler');

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
  DeviceEventEmitter
} = React;

var previousCommentText="";

/* CommentModel Component */
class CommentModel extends Component {

  constructor(props){
    super(props);
    this.state = {
      animationType: false,
      modalVisible: props.visibility,
      chosenColor: props.chosenColor,
      transparent: false,
      colors: [],
      isStatusModuleVisible: props.isStatusModuleVisible,
      commentText: '',
      isUserEnteredComment: false,
      isUserChangedTheStatus: false,
      selectedStatus: '',
      userType: props.changeCustomerStatus,
      stat:[],
      chosenStatus: 'PE/PS'
    };
  }

  _setModalVisible(that) {
      that.state.isUserEnteredComment = false
      that.state.isUserChangedTheStatus = false
      that.props.onClose()
  }

  //For now when user click on status i am informing Parent Controller to hold chosenColor.
  changeStatus(color){
   this.setState({chosenColor:color})
   if(this.props.chosenColor==color){
     this.setState({isUserChangedTheStatus: false})
   }
   else{
     this.setState({isUserChangedTheStatus: true})
   }
  }

  updateText(text) {
    this.state.commentText = text
 }

 onChange(text){
   if(text.length>0) {
     this.state.commentText = text
     this.setState({isUserEnteredComment: true})
   }
   else {
       this.state.commentText = ""
       this.setState({isUserEnteredComment: true})
   }
 }

 getColor(code) {
   if(code == "#3AD86F")
        return "Green"
   else if(code=="#FCCA50")
        return "Yellow"
   else if(code == "#FC5A49")
        return "Red"
   else {
        //alert("inValidColor Code")
        return null
    }
 }


 onSubmitStatusNdComment(){
   /*
   var subject = `Customer Name: ${this.props.customerName} \nTrack Key: ${this.props.currentTrackKey}\n`
   alert(subject + `Color: ${this.getColor(this.state.chosenColor)}` + "\n" + `Comment: ${this.state.commentText}` + `\nStatus: ${this.props.selectedStatus}`)
   */
   if(this.props.isStatusModuleVisible) {
     var color = this.getColor(this.state.chosenColor)
     //Store.onSendUpdateJson(this.props.customerName, this.props.currentTrackKey, this.props.selectedStatus, color, this.state.commentText)
     //this.props.events.emit("getupdatedJson");
     this.props.onStatusChange(this.state.chosenColor)
     this.props.onEndEditing(this.state.commentText, this.state.chosenStatus);
   }
   else {
    this.props.onEndEditing(this.state.commentText, this.state.chosenStatus);
   }
     this._setModalVisible(this);
 }

 inputFocused(_this, refName) {

 }
 componentWillReceiveProps(){
    this.setState({chosenColor:this.props.chosenColor})
 }

 isSendButtonEnabled(){
   if(this.state.isStatusModuleVisible){
     if(this.state.isUserEnteredComment && this.state.isUserChangedTheStatus)
       return true
     else
       return false
   }
   else{
     if(this.state.isUserEnteredComment)
        return true
     else if(previousCommentText)
         return true
     else
        return false
   }
 }

 setSelectedStatus() {
   if(this.props.selectedStatus!=null && this.props.selectedStatus!=undefined && this.props.selectedStatus!=""){
     if(this.props.selectedStatus == "status")
       this.state.selectedStatus = "Sales"
     else if (this.props.selectedStatus == "ps_pe_status")
       this.state.selectedStatus = "PE/PS"
     else
       this.state.selectedStatus = "CE"
   }
   else
     this.props.selectedStatus = undefined
 }
 //newly added
changeColorStatus(key) {
    if(this.props.commentText && this.state.userType){
        this.state.isUserEnteredComment = ''
    }
  this.setState({chosenStatus: key})
}


  render() {
    var statusComponent;
    this.state.stat = ['PE/PS', 'Sales']
    if(this.state.selectedStatus == "CE") {
      this.state.colors = ["#3AD86F", "#FC5A49"]
    }
    else {
      this.state.colors = ["#3AD86F", "#FCCA50", "#FC5A49"]
    }
    this.setSelectedStatus();
    if(this.props.changeStatus && this.props.changeCustomerStatus){
      raciComponent = <View>
                        <Text style={commentStyle.titleStyle}>Change the status as: </Text>
                         <View style={commentStyle.rowStyle}>
                            {
                              this.state.stat.map(function(key, i) {
                                return (
                                        <View style={commentStyle.itemStyle}>
                                          <TouchableHighlight style={[commentStyle.row1nameTouch, {backgroundColor: this.state.chosenStatus==key? '#13b6ec' : 'white'}]} onPress={() => this.changeColorStatus(key)} underlayColor='white'>
                                            <Text style={[commentStyle.row1name, {color: this.state.chosenStatus==key?'white':'#13b6ec'}]}>{key}</Text>
                                          </TouchableHighlight>
                                       </View>
                                    );
                           }, this)
                         }
                         </View>
                    </View>
    }
    else{
       raciComponent = null
    }
    if(this.props.isStatusModuleVisible) {
      statusComponent = <View style={commentStyle.statusTextndCircleViewWrapperStyle}>
                            <Text style={commentStyle.titleStyle}>Change {this.state.selectedStatus} status to: </Text>
                            <View style={commentStyle.rowStyle}>
                            {
                              this.state.colors.map(function(key, i) {
                                return (
                                        <View style={commentStyle.itemStyle}>
                                          <TouchableHighlight style={[commentStyle.outerCircleStyle, {backgroundColor: '#FFFFFF'}, {borderColor: this.state.chosenColor==key? key : '#FFFFFF' }]} onPress={() => this.changeStatus(key)} underlayColor={key}>
                                            <View style={[commentStyle.circleStyle, {backgroundColor: key}]}></View>
                                          </TouchableHighlight>
                                       </View>
                                    );
                           }, this)
                         }
                         </View>
                     </View>
    }
    else {
      statusComponent = null;
    }
      if(this.state.userType && this.props.commentText){
          if(this.state.isUserEnteredComment)
              previousCommentText = this.state.commentText;
          else{
              if(this.state.chosenStatus == 'Sales'){
                  previousCommentText = Store.getLatestSalesComment()
                  this.state.commentText = previousCommentText
              }
              else{
                  previousCommentText = Store.getLatestPEPSComment()
                  this.state.commentText = previousCommentText
              }
          }
          this.state.isUserEnteredComment = ''
      }
      else{
          if(this.state.isUserEnteredComment)
              previousCommentText = this.state.commentText;
          else
              previousCommentText = this.props.commentText;
      }

      return (
         <Modal
           animationType={this.state.animationType}
           transparent={this.state.transparent}
           visible={this.props.visibility}
           onRequestClose={this._setModalVisible.bind(this,this)}
         >
        <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
         <View style={commentStyle.container}>
            <View style={commentStyle.innerContainer}>
             <View style={commentStyle.level}>

               <TouchableHighlight style={commentStyle.levelA1} onPress={this._setModalVisible.bind(this,this)} underlayColor="#ffffff">
                 <Icon name="icon-Cancel-01" color="#a7a9ac" size={18}/>
               </TouchableHighlight>

               <View style={commentStyle.StatusndCommentComponentStyle}>
                
                  {raciComponent}
                 {statusComponent}
                 <View style={commentStyle.commentTextndTextInputViewWrapperStyle}>
                 <View style={commentStyle.levelB1}>
                    <Text style={commentStyle.titleStyle}>{this.props.commentModelTitle}</Text>

                    <View style = {{flex:1, borderColor: 'gray', borderWidth: 1, borderRadius: 10}}>
                      <TextInput
                        ref='username'
                        style={{height: this.props.commentTextInputHeight, padding: 10, textAlignVertical: 'top',
                        fontSize: 18}}
                        multiline={true}
                        placeholder='Mandatory'
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#a7a9ac'
                        onEndEditing={(event) => this.updateText(event.nativeEvent.text)}
                        value={previousCommentText}
                        onChange={(event) => this.onChange(event.nativeEvent.text)}
                        onFocus={()=>this.inputFocused(this,'username')}/>
                    </View>

                </View>

                <View style={commentStyle.levelC1}>
                  <View style={commentStyle.rowStyle}>
                    <TouchableHighlight style={commentStyle.itemStyle} onPress={this.isSendButtonEnabled()?() => this.onSubmitStatusNdComment():null} underlayColor='#FFFFFF'>
                      <View style={[commentStyle.sendCircleStyle, {backgroundColor: this.isSendButtonEnabled()?'#2B517F':'#A9A9A9'}]}>
                        <Icon name="icon-Send-01" color="#ffffff" size={30}/>
                      </View>
                    </TouchableHighlight>
                 </View>
                </View>
                </View>

              </View>

             </View>
            </View>
         </View>
         </TouchableWithoutFeedback>
        </Modal>
       );
   }
}


/* CommentModel Style*/
var commentStyle = StyleSheet.create({
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
   row1nameTouch: {
        borderRadius:18,
        borderWidth:2,
        borderStyle:'solid',
        borderColor:'#13b6ec',
        flex:0.7,
        height:35,
        width:100,
        paddingTop:5,
        color:'#13b6ec',
        marginBottom:10,
        marginRight:15,
    },
    row1name: {
        fontFamily: 'Lato-Regular',
        textAlign:'center',
        fontWeight:'normal',
        paddingLeft:5,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center'
    },
   row1: {
        flexDirection: 'row',
        /*backgroundColor:'white',*/
        /*flex:0.05,*/
        justifyContent:'center',
        marginTop:3,
        marginBottom:3,
        //backgroundColor:'cyan',
        /*borderRadius:15,*/
    },
  buttonText: {
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'rgba(52,52,52,1)',
    padding: 20,
    borderWidth: 1
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 10,
    borderWidth: 1
  },
  level: {
    flex: 1,
    alignSelf: 'stretch',
  },
  levelA1 : {
    alignSelf: 'flex-end',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom:12,
    // borderWidth: 1,
  },
  levelB1: {
    marginTop: 3.0,
    paddingTop: 0,
    paddingBottom: 20,
    // borderWidth: 1,
    // borderColor: 'orange'
  },
  levelC1: {
    marginTop: 3.0,
    padding: 10
  },
  titleStyle: {
    fontFamily: 'Lato-Regular',
    color: 'black',
    fontSize: 18,
    paddingBottom: 20
  },
  rowStyle: {
    flexDirection: 'row',
  },
  itemStyle: {
    flex: 1/3,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  outerCircleStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2.0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleStyle: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  sendCircleStyle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentTextndTextInputViewWrapperStyle: {
    // borderWidth: 1.0,
    // borderColor: 'green'
  },
  statusTextndCircleViewWrapperStyle: {
    // borderWidth: 1.0,
    // borderColor: 'blue',
    paddingBottom: 25
  },
  StatusndCommentComponentStyle:{
    padding: 10,
    marginLeft: 0
  }
});

module.exports = CommentModel
