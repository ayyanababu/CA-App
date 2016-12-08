import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {Actions,NavBar,DefaultRenderer} from "react-native-router-flux";
import BottomContainer from './BottomContainer.js';
import Store from '../utils/store.js';
import Icon from '../utils/CAPP';
var Subscribable = require('Subscribable');
var reactMixin = require('react-mixin');

var styles = StyleSheet.create({
    mainView:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'white',
    },
    listViewOuterShell: {
        flex:1,
    },
    listview: {
        marginTop:0,
        paddingLeft:10,
        paddingRight:10,
        flex:1,
        marginBottom:65
    },
    eachRow: {
        flexDirection:'row',
        flex:1,
        height:60,
        paddingRight:10,
        marginTop:0,
        borderBottomColor:"#f1f2f2",
        borderBottomWidth:1,
        //justifyContent:'center',
        alignItems:'center',
        //alignSelf:'center',
    },
    eachRowText: {
        fontFamily: 'Lato-Regular',
        flex:0.5,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
    },
    topBar: {
        height:65,
        flexDirection:'row',
        backgroundColor:"#1e3656",
    },
    backIcon: {
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        flex:0.1,
        paddingTop:15
    },
    filterHeading: {
        fontFamily: 'Lato-Regular',
        color:"white",
        fontSize:20,
        justifyContent:'center',
        textAlign:'left',
        marginLeft:20,
        marginTop:25,
        flex:0.3,
        /*backgroundColor:'blue',*/
    },
    topBarContents: {
        fontFamily: 'Lato-Regular',
        textAlign:'center',
        flexDirection:'row',
        flex:0.7,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        //backgroundColor:'green',
        paddingTop:10,
        marginRight:5
    },
    topBarText: {
        fontFamily: 'Lato-Regular',
        color:'white',
        fontSize:14,
        flex:0.6,
        height:40,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        //backgroundColor:'orange',
        marginTop:7,
        paddingBottom:3,
        marginRight:5
    },
    topBarTextApply:{
        fontFamily: 'Lato-Regular',
        borderColor:"white",
        backgroundColor:"white",
        borderRadius:15,
        borderWidth:2,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        paddingLeft:0,
        paddingRight:0,
        paddingBottom:5,
        paddingTop:3,
        margin:5,
        flex:0.4,
    },
    topBarTextApplyText: {
        fontFamily: 'Lato-Regular',
        color:"#1e3656",
        fontSize:14,
    }
});
var demoJson = {"Accountable":["Abhishek Savadatti","Alok Gupta","Alok S Chavan","Amirtha Devarajan","Andrew Chan","Anindo Banerjea","Anoop L","Antonios Perifanos","Bhanu Kumar","Chandrani Raha","Chandrashekar M B","David Williamson","Dawn Ward","Dheeraj Soni","Dinkar Hoskote","Enrique Wong","Geetha Sidda Reddy","Jagannatha Rao","Jnanendar Reddy","Joseph Arokiaraj","Joyeeta Pal","Kurt Reindl","Mallikarjun Kandkuru","Manoj K Nair","Maria Archana","Matthew Tolson","Mohamed Sharjeel","N S Rao","Nanda Ramanujam","Naveenkumar T V","Nilesh Dayanand Shastri","Phanindra Kishore B V Dokku","Praful Singh Thakur","Prashant bansal","Prashanth Krishnamurthy","Premangshu Kumar Nag","Raja Roy Chowdhury","Rajesh Raman","Rajiniganth M Daniel","Rakshita Devurkar","Rakshita Umesh Devurkar","Ramesh Kumar Yerra","Ruipeng Mai","Sahana V P","Sathiamoorthy Marichettiar","Satya Bobba","Shashi Harige","Shreenivas Bhat","Shyamsundar Balasubramanian","Srdjan Kovacevic","Steven Pulsipher","Surya Prakash","Vengatesh Pandari Nathan"],"Sales Contact":["Aanya Sharan","Aditya Sakhuja","Akshay Gahlot","Alana Foster","Anand Sundaram","Brenda Boultwood","Ed Park","Gaurav Kapoor","Jagdish Amin","Jeff DeZellar","John White","Jonathan Curtis","Keri L Dawson","Kristen Gantt","Kurt Reindl","Mark Mitchell","Mike Milton","Piyush Pant","Rakshita Umesh Devurkar","Roland Kelly","Ryan Howard","Ryan Rodriguez-Wiggins","Shankar Bhaskaran","Sid Deshpande","Sonal Sinha","Soumya Mukherjee","Sudeep Chatterjee","Susan Palm","Terence Lee","Timothy Schmutzler","Travis Darrow","Yo Delmar"],"Region":["CA","CO","CT","Canada","Colombia","Columbia","Ecuador","FL","GA","Honduras","IA","IL","IN","India","LA","MA","MD","MI","MN","Mexico","NC","NJ","NY","OH","OR","PA","PN","Puerto Rico","South Africa","Sweden","TN","TX","UT","VA","WA","WI",null,"qwqwq"]};
class Filter extends Component {
    constructor(props) {
        super(props);

        this.state={
            filterListJson:{},
            currentFilter:"BU",
            reload:false,
        }
        console.disableYellowBox = true;
    }
    componentWillMount() {
        this.state.filterListJson = this.createCustomJson();
        //this.state.filterListJson = Store.getCustomFilterJson();
    }
    createCustomJson() {
        var finalJson = {};
        //for demo data
        //var filterArrayJson = demoJson;
        //for actual data
        var filterArrayJson = Store.getFilterListJson();
        var filterKeys = Object.keys(filterArrayJson);
        for(var i=0;i<filterKeys.length;i++) {
            var tempArr =[];
            var filterArray = filterArrayJson[filterKeys[i]];
            for(var j=0;j<filterArray.length;j++) {
                var eachFilterObjectJson={};
                eachFilterObjectJson["value"]=filterArray[j];
                eachFilterObjectJson["isSelected"]=false;
                tempArr.push(eachFilterObjectJson);
            }
            finalJson[filterKeys[i]]=tempArr;
        }
        return finalJson;
    }
    updateCurrentTrackKey(that,name) {
        if(name) {
            this.setState({currentFilter: name});
            this.props.events.emit("bottomCategoryChanged");
        }
    }
    findItemInParentArray(item) {
        for(var i=0;i<this.state.filterListJson[this.state.currentFilter].length;i++) {
            if(item.value == this.state.filterListJson[this.state.currentFilter][i].value)
            return i;
        }
        return -1;
    }
    groupListItems() {
        //group selected and unselected
    }
    handleTap(that,item) {
        var index = that.findItemInParentArray(item);
        if(index != -1) {
            that.state.filterListJson[that.state.currentFilter][index].isSelected = !that.state.filterListJson[that.state.currentFilter][index].isSelected;
        }
        //that.setState({filterListJson:that.groupListItems()});
        this.setState({reload:!this.state.reload});
    }
    onClearClick(that) {
        var obj = that.createCustomJson();
        Store.setCustomFilterJson(obj);
        this.setState({filterListJson:obj});
        //this.setState({reload:!this.state.reload});
    }
    onApplyClick(that) {
        var selectedValuesJson={};
        var filterArrayJson;
        var isEmpty = true;
        //    filterArrayJson = Store.getFilterListJson();
        filterArrayJson = that.state.filterListJson;
        var filterKeys = Object.keys(filterArrayJson);
        for(var i=0;i<filterKeys.length;i++) {
            var tempArr =[];
            var filterArray = filterArrayJson[filterKeys[i]];
            for(var j=0;j<filterArray.length;j++) {
                if(filterArray[j].isSelected){
                    tempArr.push(filterArray[j].value)
                }
            }
            selectedValuesJson[filterKeys[i]] = tempArr;
            if(tempArr.length >0)
                isEmpty = false;
        }
        Store.applyFilters(selectedValuesJson);
        this.props.events.emit("filterApplied",{filterApplied:!isEmpty});
        Actions.pop();
        this.props.events.emit("resetTopBarFilter");
        this.props.events.emit("setTickFOrDrawer",{filterColor:null});
        Store.setCustomFilterJson(that.state.filterListJson);

    }
    goBack(that) {
        Actions.pop();
    }
    render() {
        var filterJson = Store.getCustomFilterJson();
        if(filterJson && filterJson[this.state.currentFilter])
            this.state.filterListJson = filterJson;
        return(
            <View style={styles.mainView}>
                <TopBar onClear={this.onClearClick.bind(this,this)} onApply={this.onApplyClick.bind(this,this)} events={this.props.events} onBack={this.goBack.bind(this,this)}/>
                <ItemList listToRender={this.state.filterListJson[this.state.currentFilter]} events={this.props.events} onSelect={this.handleTap.bind(this,this)}/>
                <BottomContainer trackKeys={Object.keys(this.state.filterListJson)} events={this.props.events} onTrackTap={this.updateCurrentTrackKey.bind(this,this)}             isLeftNavVisible = {true}
            isRightNavVisible = {true}/>
            </View>
        )
    }
}
class TopBar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <View style={styles.topBar}>
                <TouchableHighlight onPress={this.props.onBack} style={styles.backIcon} underlayColor="transparent">
                    <Icon name="icon-Back-01" size={25} color="#ffffff" />
                </TouchableHighlight>
                <Text style={styles.filterHeading}>Filter</Text>
                <View style={styles.topBarContents}>
                    <TouchableHighlight onPress={this.props.onClear} style={styles.topBarText} underlayColor="transparent">
                        <Text style={styles.topBarText}>Clear All</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.props.onApply} style={styles.topBarTextApply} underlayColor="white">
                        <Text style={styles.topBarTextApplyText}>Apply</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
class ItemList extends Component {
    constructor(props) {
        super(props);
        ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(props.listToRender),
            list:props.listToRender,
        };
        bottomCategoryChanged=false;
        searchActive = false;
    }
    componentWillMount() {
        this.addListenerOn(this.props.events,'bottomCategoryChanged', this.handleBottomCategoryChanged.bind(this,this));
    }
    handleBottomCategoryChanged() {
        this.setState({list:this.props.listToRender});
        this.refs["searchText"].clear();
    }
    getCheckMarkColor(item){
        if(item.isSelected)
            return "#39bdeb";
        else
            return "#ffffff";
    }
    onListItemClick(item) {
        this.props.onSelect(item);

    }
    getColor(isSelected) {
        if(isSelected)
            return "#39bdeb"
        else
            return "#000000";
    }
    _renderRow(that,item, sectionID, index) {
        //console.log(index);
        return (
          <TouchableHighlight style={styles.eachRow} onPress={() => that.onListItemClick(item)} underlayColor="transparent">
              <View style={styles.eachRow} >
                <Text style={[styles.eachRowText,{color:that.getColor(item.isSelected)}]}>{item.value}</Text>
                <Icon name="icon-Selected-01" size={25} color={that.getCheckMarkColor(item)} />
              </View>
          </TouchableHighlight>
        );
    }
    groupListValues() {
        var groupedArr=[];
        var selectedArr=[];
        var remainingArray=[];
        for(var i=0;i<this.state.list.length;i++){
            if(this.state.list[i].isSelected)
                selectedArr.push(this.state.list[i]);
            else
                remainingArray.push(this.state.list[i]);
        }
        groupedArr.push.apply(groupedArr,selectedArr);
        groupedArr.push.apply(groupedArr,remainingArray);
        this.state.list = groupedArr;
    }
    searchList(text) {
        var tempArray=[];
        searchActive=true;
        for(var i=0;i<this.props.listToRender.length;i++) {
            if(this.props.listToRender[i].value && this.props.listToRender[i].value.toUpperCase().indexOf(text.text.toUpperCase()) > -1)
                tempArray.push(this.props.listToRender[i]);
        }
        if(text.text == "") {
            tempArray = this.props.listToRender;
            searchActive=false;
        }
        this.setState({list:tempArray});
        _listView.scrollTo({y:0, animated:true})
    }
    onClear(TextFeild){
      var text="";
      this.refs[TextFeild].clear(0);
      //this.searchText.clear(0);
      this.searchList({text});
    }
    render() {
        var that = this;
        if(this.props.listToRender.length>0) {
            if(this.props.listToRender != this.state.list && !searchActive)
                this.state.list=this.props.listToRender;
            this.groupListValues();
            this.state.dataSource = ds.cloneWithRows(this.state.list);
        }
        return (
            <View style={styles.listViewOuterShell}>
            <View style={{  marginLeft:5,
              marginRight:5,
              marginBottom:5,
              marginTop:5,
              backgroundColor:'white',
              borderRadius:15,borderWidth:1,borderColor:"#e9e9ef",
              flexDirection:'row'}}>
              <TextInput ref="searchText" underlineColorAndroid="white" style={{borderRadius:5, height: 40, borderColor: '#FFFFFF', borderWidth: 1, flex:0.9, padding: 10}} placeholder="Search" onChangeText={(text) => this.searchList({text})}></TextInput>
              <TouchableOpacity onPress={() =>  this.onClear('searchText')} style={{flex:0.1,justifyContent:'center',alignItems:'center',margin:5,padding:5}} underlayColor="transparent">
                <Icon name="icon-Cancel-01"  size={10} color='gray' />
              </TouchableOpacity>
            </View>

                <ListView
                    ref={(listView) => { _listView = listView; }}
                    dataSource={that.state.dataSource}
                    initialListSize={20}
                    renderRow={that._renderRow.bind(this,this)}
                    style={styles.listview}
                />

                </View>
        )
    }
}
reactMixin(ItemList.prototype,Subscribable.Mixin);
module.exports = Filter;
