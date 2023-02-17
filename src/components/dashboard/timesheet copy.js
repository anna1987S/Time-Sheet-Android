import React, { useState } from 'react';
import { Agenda } from 'react-native-calendars';
import {
    Container,
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Icon,
    List,
    Content,
    Text,
    H3, Form ,Item,
    Card, CardItem,
    Subtitle,Fab,Input
    ,Thumbnail,Textarea
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,View,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal,TouchableWithoutFeedback
 } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const initialLayout = {width: Dimensions.get('window').width}
import CSIcon from '../../icon-font';
import RBSheet from "react-native-raw-bottom-sheet";
import RBSheetNew from "react-native-raw-bottom-sheet";
// import BottomView from './actionSheetView';
import NoRecordsFound from '../noRecordFound';
import Status from '../status'
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import ListItem, { Separator } from '../request/swipeList/ListItem';
import { ScrollView } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as Api from '../../services/api/approval';
import * as Apirequest from '../../services/api/request';
import Picker from '@gregfrench/react-native-wheel-picker';
import _ from 'underscore';
import { CommonData } from '../../utils';
import CustomMenuIcon from '../../navigation/customMenu/customMenuIcon';
import SideBar from '../../navigation/sidebar'
import { Validate, Constants } from '../../utils';
import { FlatList } from 'react-native';
import { TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { ActivityIndicator } from 'react-native';
var PickerItem = Picker.Item;

const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const BottomModalView = (props) =>{
    console.log("Bottom model view")
    return(
        <View style={{alignItems:'flex-end'}}>
{/* 
            <Button style={{marginRight:10}} onPress={()=> props.done()}>
                <Text style={{textAlign:'center',alignItems:'center'}}>Done</Text>
            </Button> */}

            <Picker style={{width: SCREEN_WIDTH, height: 200}}
                selectedValue={props.selectedItem}
                itemStyle={{color:"#000", fontSize:18}}
                onValueChange={(value) => props.onPickerSelect(value)}>
                    {props.itemList.map((value, i) => (
                        // console.log('Label',value.TASK_SUBTYPE,"value",value.TASK_SUBTYPE_ID)
                        <PickerItem label={String(value.TASK_SUBTYPE)} value={Number(value.TASK_SUBTYPE_ID)} key={i}/>
                    ))}
            </Picker>

        </View>
    )
}

const RejectinfoModel = (props) => {
    var screen = Dimensions.get('window');
    return(
        <Modal 
        animationType="fade"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
            props.showrejectionModal("","",[],false)
    }}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                <View padder style={{width: SCREEN_WIDTH-80, height: 175, backgroundColor: '#fff', borderRadius: 5, justifyContent: 'center'}}>
                    <Text style={{marginTop:10, marginLeft:10}}>Enter reason for Rejection :</Text>
                    <View style={[{width: SCREEN_WIDTH-100,marginLeft:10, height:60, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                        <Textarea rowSpan={2} placeholderTextColor='#ccc'  placeholder="Comments"
                                 onChangeText={(value) => props.onChangeData(value)} />
                    </View>
                    <View style={{flex:1,flexDirection: 'row', justifyContent: 'center',marginTop:5}}>
                        <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                            <Button style={{width:'70%'}}onPress={() =>  props.rejectService(props.typeReject)} >
                                <Text style={{ color: 'white',marginLeft:30 }}>Ok</Text>
                            </Button>
                        </View>
                        <View style={{ width:  '50%', alignItems: 'center', justifyContent: 'center' }}>
                            <Button style={{width:'70%'}} onPress={() => props.showrejectionModal("","",[],false)}>
                                <Text style={{ color: 'white',marginLeft:15 }}>Cancel</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View> 
        </Modal>
    )
} 

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
  );
  
  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
  );

 class ExpandableComponent extends React.Component {

    constructor() {
        super();
        this.state = {
          layoutHeight: 0,
          natureOfWork:[],
          selectedNature : 0,
          selectedNatureVal : '',
          IspickerValue : false,
          selectedDuration : '',
          selectedComments: null,
          userInfo : {},
          naturePicker : []

        };
        console.log("Log calling")
    }

    async componentWillReceiveProps(nextProps) {
        let UserInfo = await AsyncStorage.getItem('userInfo');
        var Date = nextProps.NatureofWork
        this.setState({
            natureOfWork : nextProps.NatureofWork,
            naturePicker : nextProps.natureList,
            userInfo : JSON.parse(UserInfo)
        })
        if (nextProps.taskList.IsSelect) {
            if(nextProps.taskType === "AppliedTask"){
                this.setState(() => {
                    return {
                        layoutHeight: null,
                        selectedNature : nextProps.taskList.TASK_SUB_TYPE_ID,
                        selectedNatureVal : nextProps.taskList.TASK_SUB_TYPE,
                        selectedDuration : nextProps.taskList.DURATION,
                        selectedComments: nextProps.taskList.COMMENTS,
                    };
                  });
            }else{
                this.setState(() => {
                    return {
                      layoutHeight: null,
                    };
                  });
            }
          
        } else {
          this.setState(() => {
            return {
              layoutHeight: 0,
            };
          });
        //   console.log("Work Data",this.state.natureOfWork)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.layoutHeight !== nextState.layoutHeight) || (this.state.natureOfWork !== nextState.natureOfWork) || (this.state.naturePicker !== nextState.natureList)
            ||(this.state.selectedNature !== nextState.selectedNature) || (this.state.IspickerValue !== nextState.IspickerValue)
            || (this.state.selectedNatureVal !== nextState.selectedNatureVal) || (this.state.selectedDuration !== nextState.selectedDuration)
            || (this.state.selectedComments !== nextState.selectedComments)) {
          return true;
        }
        return false;
    }

    onValueChange = (value) => {
        // console.log("Values nature",value)
        var selectVal = this.state.naturePicker.filter((item,index)=>{
             return(item.TASK_SUBTYPE_ID === value)
        })
        // console.log("selected Value is",selectVal[0].TASK_SUBTYPE)
        this.setState({
            selectedNature: value,
            selectedNatureVal : selectVal[0].TASK_SUBTYPE,

        });
    }

    pickerValueChange =(value) =>{
        // console.log("Picker value is Clicked",value);
        this.setState({
            IspickerValue : value
        })
    }

    onChangeDuration = (value) => {
        var t = value;
        var char = value.toString().split(".")
        // console.log("Val: ", char.length)
        if (char.length <= 2) {
            if (value.toString()[2] === ".") {
                // console.log("Value point1", value)
                this.setState({ selectedDuration: value });
            } else if (value.toString().length <= 2) {
                // console.log("Value point2", value)
                this.setState({ selectedDuration: value });
            } else if (value.toString().includes(".")) {
                if (value.toString()[3] !== "." && value.toString()[3] !== "-" && value.toString()[3] !== ","
                    && value.toString()[3] !== "") {
                    value = (t.indexOf(".") >= 0) ? ((t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3))) : t;
                    console.log("Values: ", value)
                    this.setState({ selectedDuration: value });
                }
            }
        }
    }

    onChangeTextArea = (value) => {
        this.setState({ selectedComments: value });
    }

    
    _saveTaskInfo = (stateData) => {
        // console.log("state data", this.props.mailID ,"And",this.props.dateInfo)
        var checkValidation = this.checkFormValidation(stateData);
        if (checkValidation.isValid) {
            this.setState({
                // isLoading: true,
                errorMessage: '',
            }, () => {
                var saveCredentials = {
                    selectedDuration: this.state.selectedDuration,
                    selectedComments: this.state.selectedComments,
                    selectedNature: this.state.selectedNature,
                    taskID: stateData.TASK_ID,
                    date: this.props.dateInfo,
                    mailID: this.props.mailID,
                    extend_Id: stateData.TEAM_EXTN_ID
                }
                // console.log("Saved async", saveCredentials)
                Apirequest.SaveTaskInfo(saveCredentials, async function (response) {
                    // console.log("SignIN async", response)
                    var Data = response.data;
                    if (response.success) {
                        CommonData.toastSuccessAlert("Your time is Booked!!!")
                        this.props.refreshScreen();

                    }
                    else {
                        this.setState({
                            // isLoading: false,
                            errorMessage: response.errorMessage
                        })
                        CommonData.toastFailureAlert(response.errorMessage)

                    }
                }.bind(this));
            })
        }
        else {
            CommonData.toastWarningAlert(checkValidation.message)
        }
    };


    _updateTaskInfo = (stateData) => {
        // console.log("state data", this.props.mailID ,"And",this.props.dateInfo)
        var checkValidation = this.checkFormValidation(stateData);
        if (checkValidation.isValid) {
            this.setState({
                // isLoading: true,
                errorMessage: '',
            }, () => {
                var saveCredentials = {
                    selectedDuration: this.state.selectedDuration,
                    selectedComments: this.state.selectedComments,
                    timeSheet_LineID: stateData.TIMESHEET_LINE_ID,
                    taskID: stateData.TASK_ID,
                    date: this.props.dateInfo,
                    mailID: this.props.mailID,
                }
                console.log("Update async", saveCredentials)
                Apirequest.UpdateTaskInfo(saveCredentials, function (response) {

                    if (response.success) {
                        // var Data = response.data;
                        console.log("Success", stateData.date)
                        CommonData.toastSuccessAlert("Your time is Updated!")
                        this.props.refreshScreen();
                        // this.props.navigation.navigate('Request',{ScheduledTask: response.data,Date:stateData.date});
                    }
                    else {
                        this.setState({
                            // isLoading: false,
                            errorMessage: response.errorMessage
                        })
                        CommonData.toastFailureAlert(response.errorMessage)
                    }
                }.bind(this));
            })
        }
        else {
            CommonData.toastWarningAlert(checkValidation.message)
        }
    };
    
    checkFormValidation(stateData) {
        var duration = 0;
        var existDuration = parseFloat(stateData.REMAINING_HOURS)
        // console.log("Duration Check", existDuration)
        if (this.state.selectedDuration != null) {
            duration = parseFloat(this.state.selectedDuration)

        }
        if (this.state.selectedComments == null || this.state.selectedComments.trim() === '' || this.state.selectedDuration == '' || this.state.selectedDuration == null) {
            return {
                isValid: false,
                message: this.state.selectedDuration == '' ? "Enter the Duration of work" : "Enter the comments"
            };
        }
        else if (duration <= 0) {
            return {
                isValid: false,
                message: "You can not enter timesheet for zero hours or Less then zero"
            };
        } else if (duration <= 0 || isNaN(duration)) {
            return {
                isValid: false,
                message: "Invalid Time Duration"
            };
        } else if (duration > existDuration) {
            return {
                isValid: false,
                message: "Your Timesheet duration limit exceeded for the task " + stateData.TASK_NUMBER
            };
        }
        else {
            
            this.setState({
                selectedDuration: duration
            })

            return {
                isValid: true
            };
        }
    }


    render() {  
        var value = this.props.taskList;
        var id = this.props.taskId;
        var {userInfo} = this.state
        console.log("Task information",this.props.taskList)
        return (
            
            <View style={{width:SCREEN_WIDTH-20,marginLeft:10,marginTop:-25,flexDirection:'column'}}>
                {
                    this.props.taskType === "MyTask" ?
                    <Card padder style={{width:SCREEN_WIDTH-30,borderRadius:20}}>    
                        <CardItem style={{margin:10,marginRight:10}}>
                            <TouchableOpacity activeOpacity={0.8} onPress = {() => this.props.updateValue(id,value)}>
                                <View padder style={{flexDirection: 'row',flex:1, width: SCREEN_WIDTH-30}}>
                                    {/* <View style={{ flexDirection:'row',width:'100%'}}> */}
                                    {
                                    Validate.isNotNull(userInfo.employeeImageUri)
                                            ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} style={{width:53,height:53}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{width:53,height:53}} />
                                        </View>
                                    }
                                    <View style={{flex:.65}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, textAlign: 'left',color: '#7666fe' }}> {value.TASK_NUMBER} </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2,fontWeight:'bold', color: '#434a54' }}>{value.PROJECT_TITLE}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#959595' }}>{value.TASK_TITLE} - {value.TASK_DEVELOPMENT_TYPE} </Text>
                                    </View>
                                    {/* </View> */}
                                    <View style={{flex:.1,justifyContent:'flex-start'}}>
                                        { !value.IsSelect 
                                            ?
                                            // <View style={{ height:65, borderRadius:10,backgroundColor:'#59b7d3',padding:5, borderWidth:2, marginTop:5,borderColor:'transparent'}}>
                                                <Text style={{color:'#000',fontWeight:'600',textAlign:'center',fontSize:10,marginTop:5}}>{value.REMAINING_HOURS} Hrs </Text>
                                            // </View>
                                                // <Icon type="AntDesign" name="checkcircle" style={{ fontSize: 16, color: '#c0c0c0' }} />
                                            : 
                                            // <View style={{ height:65, borderRadius:10,backgroundColor:'#006fb1',padding:5, borderWidth:2, marginTop:5,borderColor:'transparent'}}>
                                                <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:10,marginTop:5}}>{value.REMAINING_HOURS} Hrs</Text>
                                            // </View>
                                                // <Icon type="AntDesign" name="checkcircle" style={{ fontSize: 16, color: '#7666fe' }} />
                                        }    
                                    </View>
                                </View>
                                <View style={value.IsSelect ? {
                                    height: this.state.layoutHeight,
                                    overflow: 'visible',marginBottom:40}: {height: this.state.layoutHeight,
                                    overflow: 'hidden'}}>
                                    <View>
                                        <View style={{ flexDirection: 'row',marginTop:30 }}>
                                            <View style={{flex :0.42}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Nature of Work </Text>
                                            </View>
                                            <View style={{flex :0.6}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Hours </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row',marginTop:5 }}>
                                            <TouchableOpacity style={{flex :0.45}} onPress={()=>this.RBSheet.open()}>
                                                <View style={[{ height:45, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                                    <Text numberOfLines={1}  style={{marginTop:2}}>{this.state.selectedNatureVal}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{flex :0.45}}>
                                                <View style={[{ height:45, borderRadius:5,backgroundColor:'#edebeb',padding:0, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                                <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} maxLength={5} placeholder='0.0 hrs' keyboardType='numeric'
                                                    onChangeText={this.onChangeDuration} value={`${this.state.selectedDuration}`}
                                                />
                                                </View>
                                            </View>
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,marginTop:10, padding: 2, color: '#000' }}>Description </Text>
                                        <View style={[{width: SCREEN_WIDTH-80, height:60, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                        <Textarea rowSpan={2} placeholderTextColor='#ccc'  placeholder="Comments" 
                                            onChangeText={this.onChangeTextArea} 
                                            value={this.state.selectedComments} 
                                            />
                                        </View>
                                    </View>
                                    
                                    <Button rounded style={{marginTop:20,marginRight:'20%',justifyContent:'center',backgroundColor:'#580073'}}
                                    onPress={() => this._saveTaskInfo(value)}>
                                        <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}>Book Your Time</Text>
                                    </Button>
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>  
                :
                <Card padder style={{width:SCREEN_WIDTH-30,borderRadius:20}}>
                    <CardItem style={{margin:10,marginRight:10}}>
                        <TouchableOpacity activeOpacity={0.8} onPress = {()=> this.props.updateValue(id,value)}>
                            <View padder style={{flexDirection: 'row',flex:1, width: SCREEN_WIDTH}}>
                                {/* <View style={{ flexDirection:'row',width:'100%'}}> */}
                                <View style={{flex:.8,flexDirection:'row'}}>
                                    <View style={{marginTop:5,flexDirection:'row'}}>
                                        {
                                            Validate.isNotNull(userInfo.employeeImageUri)
                                            ?
                                            
                                            <View style={(value.LINE_APPROVAL_FLAG == 'Y') ? styles.approvedcircle : (value.LINE_REJECTION_FLAG == 'Y') ? styles.rejectedcircle : styles.pendingcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} style={{width:52,height:52}}/>
                                            </View>
                                            :
                                            <View style={(value.LINE_APPROVAL_FLAG == 'Y') ? styles.approvedcircle : (value.LINE_REJECTION_FLAG == 'Y') ? styles.rejectedcircle : styles.pendingcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{width:50,height:50}} />
                                            </View>
                                        }
                                    </View>
                                    <View style={{flexDirection:"column",marginTop:5,marginLeft:10}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, margin: 2,textAlign: 'left',color: '#7666fe' }}> {value.TASK_NUMBER} </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> { value.PROJECT_TITLE } </Text>
                                        <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{ value.COMMENTS} </Text>
                                        <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                            <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> { value.TASK_SUB_TYPE } </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* </View> */}
                                <View style={{width:'10%',justifyContent:'flex-start'}}>
                                    { !value.IsSelect 
                                        ?
                                        // <View style={{ height:65, borderRadius:10,backgroundColor:'#59b7d3',padding:5, borderWidth:2, marginTop:-35,borderColor:'transparent'}}>
                                            <Text style={{color:'#000',fontWeight:'600',textAlign:'center',fontSize:10,marginTop:5}}>{value.DURATION} Hrs</Text>
                                        // </View>
                                            // <Icon type="AntDesign" name="checkcircle" style={{ fontSize: 16, color: '#c0c0c0' }} />
                                        : 
                                        // <View style={{ height:65, borderRadius:10,backgroundColor:'#006fb1',padding:5, borderWidth:2, marginTop:-35,borderColor:'transparent'}}>
                                            <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:10,marginTop:5}}>{value.DURATION} Hrs</Text>
                                        // </View>
                                            // <Icon type="AntDesign" name="checkcircle" style={{ fontSize: 16, color: '#7666fe' }} />
                                    }    
                                </View>
                            </View>
                            <View style={value.IsSelect ? {
                                height: this.state.layoutHeight,
                                overflow: 'visible',marginBottom:40}: {height: this.state.layoutHeight,
                                overflow: 'hidden'}}>
                                <View>
                                    <View style={{ flexDirection: 'row',marginTop:30 }}>
                                        <View style={{flex :0.42}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Nature of Work </Text>
                                        </View>
                                        <View style={{flex :0.6}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Hours </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row',marginTop:5 }}>
                                        <TouchableOpacity disabled style={{flex :0.42}} onPress={()=>this.RBSheet.open()}>
                                            <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                                <Text>{this.state.selectedNatureVal}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{flex :0.4}}>
                                            <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                            <Input placeholderTextColor='#ccc' style={{ color: '#000' }} maxLength={5} placeholder='0.0 hrs' keyboardType='numeric'
                                                onChangeText={this.onChangeDuration} value={`${this.state.selectedDuration}`}
                                            />
                                            </View>
                                        </View>
                                    </View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,marginTop:10, padding: 2, color: '#000' }}>Description </Text>
                                    <View style={[{width: SCREEN_WIDTH-80, height:60, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                    <Textarea rowSpan={2} placeholderTextColor='#ccc'  placeholder="Comments" 
                                        onChangeText={this.onChangeTextArea} 
                                        value={this.state.selectedComments} 
                                        />
                                    </View>
                                </View>
                                {(value.LINE_APPROVAL_FLAG != 'Y') && (value.LINE_REJECTION_FLAG != 'Y') &&
                                <Button rounded style={{marginTop:20,marginRight:'20%',justifyContent:'center',backgroundColor:'#580073'}}
                                onPress={() => this._updateTaskInfo(value)}>
                                    <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}>Update Your Time</Text>
                                </Button>
                                }
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                }            
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}

                    height= {250}
                    animationType = "slide"
                    openDuration={250}
                    customStyles={{
                        
                        container: {
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius:15
                        }
                    }}
                    >
                    <BottomModalView 
                       selectedItem = {this.state.selectedNature}
                       itemList = {this.state.naturePicker}
                       onPickerSelect = {this.onValueChange.bind(this)}
                       done = {()=>this.RBSheet.close()}
                    />
                </RBSheet>
            </View>
        );
    }
 }   

 
 const VisibleItem = props =>{
     var {data} = props;
    console.log("Data val",data)
    var screen = Dimensions.get('window');
     return(
         <View>
            <Card padder style={{width:SCREEN_WIDTH-20,borderRadius:15,marginLeft:10}}>
                    <CardItem style={{margin:2,marginRight:10}}>
            {/* <TouchableWithoutFeedback > */}
                <View style={styles.standaloneRowFront}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width }}>
                        <View style={  styles.header}>
                            <Text style={styles.hours}> 
                            Muni
                            </Text>
                        </View>
                        <View style={{flexDirection: 'column',width:'80%',}}>
                            <View  style={ styles.content }>
                            <View style={{ width: '100%',  flexDirection: 'column' }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, margin: 2,textAlign: 'left',color: '#7666fe' }}> {data.item.TASK_NUMBER} </Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {data.item.PROJECT_TITLE} </Text>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{data.item.COMMENTS} </Text>
                                <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                    <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> {data.item.TASK_SUBTYPE} </Text>
                                </View>
                            </View>
                            <View style={{width:'20%',justifyContent:'center'}}>
                                <Text style={{fontWeight:'bold',color:'#434a54',textAlign:'center',fontSize:14}}> {data.item.DURATION} Hrs</Text>    
                            </View>
                            </View>
                        </View>
                    </View>
                </View>
            {/* </TouchableWithoutFeedback> */}
            </CardItem>
            </Card>
        </View>
     )
 }

 const FirstTab = props => {
     console.log("Props values for pages",props)
     var {sateInfo} = props
     return (
            <ScrollView>
                {/* <ActivityIndicator size="large" color="#580073" /> */}
                <View>
                <View style={{width:SCREEN_WIDTH,marginTop:50}}>
                    {
                        
                        sateInfo.taskList.map((item,key)=>(
                        <ExpandableComponent 
                            taskType= {"MyTask"}
                            taskList= {item} 
                            taskId = {key}
                            updateValue = {props.updateValue}
                            NatureofWork = {sateInfo.natureofWorkData}
                            natureList = {sateInfo.naturePicker}
                            mailID = {sateInfo.mailID}
                            dateInfo = {sateInfo.selected}
                            refreshScreen = {props.refreshScreen}
                        />
                    ))}
                </View>
                {
                    sateInfo.listType
                    &&
                    <View style={{width:SCREEN_WIDTH,marginTop:50}}>
                    {
                        sateInfo.TimesheetItems.length > 0 &&
                        Object.entries(sateInfo.TimesheetItems)
                        .map(([key, item], i) => (
                            <React.Fragment  key={i}>
                                <ExpandableComponent
                                    taskType= {"AppliedTask"} 
                                    taskList= {item} 
                                    taskId = {key}
                                    updateValue = {props.updateAppliedLayout}
                                    NatureofWork = {sateInfo.natureofWorkData}
                                    natureList = {sateInfo.naturePicker}
                                    mailID = {sateInfo.mailID}
                                    dateInfo = {sateInfo.selected}
                                    refreshScreen = {props.refreshScreen}
                                />
                                {/* <ListItem
                                    itemVal = {item}
                                    // onSwipeFromLeft={(item,i) => this.approveService(item,i)}
                                    // onRightPress={(item) => this.rowDelete(item)}
                                    Login={true}
                                /> */}
                        </React.Fragment>
                        ))
                        
                    }
                    </View>
                }
                </View>
            </ScrollView>
     )
 }

 const TeamTab = props => {
     var {sateInfo} = props;
     return(
        <ScrollView>
        <View style={{width:SCREEN_WIDTH,marginTop:20}}>
        {
        sateInfo.scheduleItems.length > 0 ?
            // this.renderDateItem(scheduleItems)
        // scheduleItems
        //     .map((item,i) => (
        //             <React.Fragment  key={i}>
                    //  <ListItem
                    //     itemVal = {item}
                    //     index = {i}
                    //     onSwipeFromLeft={() => this.approveService(item,i)}
                    //     onRightPress={() => this.showrejectionModal(item,i,true)}
                    //     Login={false}
                    // />
                    <SwipeListView 
                    data ={sateInfo.scheduleItems}
                    rightOpenValue={-100} 
                    disableRightSwipe={true} 
                    renderItem = {props.renderItem}
                    renderHiddenItem = {props.renderHiddenItem}
                    >
                        
                </SwipeListView>

                //  </React.Fragment> 
            // ))
            
            :
            <NoRecordsFound/>
        }
    </View>
    </ScrollView>
     )
 }

 const HiddenItemWithAction =  props => {

    var {onApprove,onReject,data} = props
    return(
        <View style={styles.standaloneRowBack} icon>
                                      
            <TouchableOpacity disabled={data.item.IsSuccess !== '' ? true : false } transparent style={styles.rejectButton} onPress={onReject} >
                <View>
                    {/* <Icon iconLeft style={{ color: '#fff' }} type="Feather" name="check" /> */}
                    <CSIcon name={"Artboard-18"} size={26} color={'#fff'}  style={{justifyContent:'center',alignItems:'center'}}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity transparent disabled={data.item.IsSuccess !== '' ? true : false } style={styles.approveButton } onPress={onApprove} >
                <View>
                    {/* <Icon iconLeft style={{ color: '#fff' }} type="AntDesign" name="close" /> */}
                    <CSIcon name={"Artboard-17"} size={26} color={'#fff'}  style={{justifyContent:'center',alignItems:'center'}}/>
                </View>
            </TouchableOpacity>
            
        </View>
    )
 }

class Timesheet extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            pickerValue : undefined,
            myDate: new Date(),
            selected: this.ChangeUrlDate(moment()),
            scheduleItems: [],
            TimesheetItems: [],
            mailID:'',
            taskList: [],
            isLoading: false,
            natureofWorkData : [],
            naturePicker:[],
            showRejectionview : false,
            onChangeTextArea: '',
            typeReject: {},
            markedDateinfo: [],
            showMonthHead: true,
            month: '',
            sysDate: undefined,
            dateCount: null,
            dateList: [],
            scheduleList: false,
            navigateData: {},
            userInfo : {},
            listType : true,
            rejectSwiped : [],
            key : "",
            rowMap: '',
            index: 0,
            route : [
                { key: 'first', title: 'Muni' },
                { key: 'second', title: 'Team' },
            ]
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
          }
        this.dateLockcall = this.dateLockcall.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
        this.updateAppliedLayout = this.updateAppliedLayout.bind(this);
    }

    async componentDidMount() {

        var {selected} = this.state;
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        var MailID = await AsyncStorage.getItem('loginEmail');
        var UserInfo = await AsyncStorage.getItem('userInfo');
        var dataValues = {
            mailID: MailID,
            date: selected
        }
        this.setState({
            mailID: MailID,
            userInfo : JSON.parse(UserInfo),
            selected
        }, () => {
            this.GetApproveReqListData(MailID, selected);
            this.getTaskSheetDetails(dataValues);
            this.GetTimesheetListData(MailID,selected);
            this.dateLockcall(MailID);
        })
    }

    getDateOfPastYear() {
        var d = new Date();
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var pastYear = d.getFullYear() - 1;
        d.setFullYear(pastYear);
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    getDateOfNextYear() {
        var d = new Date();
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var pastYear = d.getFullYear();
        d.setFullYear(pastYear);
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    MarkedDatePass(StringDate) {
        var d = new Date(StringDate);
        var beforeChange = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + d.getDate()).slice(-2).toString();
        return beforeChange;
    }
    
    getMarkedDates(mailID) {
        var startDate = this.getDateOfPastYear();
        var endDate = this.getDateOfNextYear();
        var RequestedData = {
            email: mailID,
            startDate: startDate,
            endDate: endDate
        }
        Apirequest.TimeSheetRequests(RequestedData, function (response) {
            if (response.success) {
                var data = response.data;
                var markedDates = [];
                var DatesList;
                if(data.length > 0){
                    for (let i = 0; i < data.length; i++) {
                        var markedval = {
                            date:'',
                            dots:[]
                        }
                        if (data[i]["STATUS"] == "BOTH") {
                            // var date = new Date(data[i]['TIMESHEET_DATE'].toString());
                            markedval.date = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                            // markedval.date = date
                            markedval.dots = [{
                                    color: '#ffa500',
                             selectedColor:'#ffa500'
                            }]
                        }else if (data[i]["STATUS"] == "APPROVED") {
                            markedval.date = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                            // markedval.date = date
                            // markedval.dots.color = 'blue'
                            // markedval.dots.selectedColor = 'blue'
                            markedval.dots = [{
                                color: 'green',
                                selectedColor:'green'
                            }]
                        }else if (data[i]["STATUS"] == "REJECTED") {
                            markedval.date = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                            // markedval.date = date
                            // markedval.dots.color = 'red'
                            // markedval.dots.selectedColor = 'red'
                            markedval.dots = [{
                                color: 'red',
                                selectedColor:'red'
                            }]
                        }
                        markedDates.push(markedval)
                    }
                }

                // if (data.length > 0) {
                //     for (let i = 0; i < data.length; i++) {
                //         if (data[i]["STATUS"] == "BOTH") {
                //             DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                //             // console.log("DateInfo: ", DatesList)
                //             markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                //                 marked: true,
                //                 dotColor: '#ffa500'
                //             }
                //         }
                //         else if (data[i]["STATUS"] == "APPROVED") {
                //             DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                //             // console.log("DateInfo: ", DatesList)
                //             markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                //                 marked: true,
                //                 dotColor: 'blue'
                //             }
                //         }
                //         else if (data[i]["STATUS"] == "REJECTED") {
                //             DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                //             // console.log("DateInfo: ", DatesList)
                //             markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                //                 marked: true,
                //                 dotColor: 'red'
                //             }
                //         }
                //     }
                // }
                this.setState({
                    markedDateinfo: markedDates,
                }
                , () => {
                }
                )
            }
            else {
                CommonData.toastWarningAlert(response.errorMessage);
            }
        }.bind(this));
    }
    

    refreshScreen=() => { 
        console.log("Refresh screen call")
        var dataValues = {
            mailID: this.state.mailID,
            date: this.state.selected
        }
        this.GetApproveReqListData(this.state.mailID, this.state.selected);
        this.getTaskSheetDetails(dataValues);
        this.GetTimesheetListData(this.state.mailID,this.state.selected);
        this.dateLockcall(this.state.mailID);
    }

    
    GetApproveReqListData(mailID, selectedDate) {
    
        var TimesheetList = {
            MailID: mailID,
            startDate: this.ChangeUrlDate(selectedDate),
            endDate:this.ChangeUrlDate(selectedDate),
            usersID:""
        }
        this.setState({
            navigateData: TimesheetList,
            // selectedList: []
        })
        // console.log("TimeSheet list Data: ", TimesheetList);
        Api.approvalRequestList(TimesheetList, function (response) {
            console.log("Approve Response", response);
            var items = {};
            if (response.success) {
                if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i]['IsSelect']= true;
                        response.data[i]['IsSuccess'] = '';
                        response.data[i]['Message'] = '';
                        response.data[i]['key'] = `${i}`;
                    }
                    // var groupedVal = _.groupBy(response.data,'EMPLOYEE_NAME');
                    items = response.data;
                    
                    var data_info = items.map((data,index)=> ({
                        key: `${index}`,
                        comments: data.COMMENTS,
                        DURATION:data.DURATION,
                        EMPLOYEE_NAME:data.EMPLOYEE_NAME,
                        TASK_NUMBER : data.TASK_NUMBER,
                        PROJECT_TITLE: data.PROJECT_TITLE,
                        TASK_SUBTYPE: data.TASK_SUBTYPE,
                    }))
                    console.log("Item datas", items,"arrayVal",data_info);
                }
                else {
                    items = [];
                    // console.log("Item datas empty", items);

                }
                this.setState({
                    scheduleItems: items,
                    selectDate: selectedDate
                })
            }
            else {
                console.log("Else info call")
                // this.props.navigation.navigate('Auth');
                items = []
                this.setState({
                    scheduleItems: items,
                    selected : selectedDate
                })
                

            }
            
        }.bind(this))
    }


    GetTimesheetListData(mailID, selectedDate) {
        var TimesheetList = {
            MailID: mailID,
            date: selectedDate
        };
        this.setState({
            TimesheetItems: [],
            isLoading: false,
        })
        Apirequest.TimeSheetSummaryList(TimesheetList, function (response) {
            var items = {};
            var List = false;
            if (response.success) {
                if (response.data.length > 0) {
                    for(let i = 0; i < response.data.length; i++){
                        response.data[i]['IsSelect'] = false;
                    }
                    items = response.data;
                    List = true;
                    console.log("Timesheet datas", items);
                }
                else {
                    items[selectedDate] = [];
                    List = false;
                }
                this.setState({
                    TimesheetItems: items,
                    scheduleList: List,
                    navigateData: TimesheetList,

                })
            }
            else {
                items = []
                this.setState({
                    TimesheetItems: items,
                    scheduleList: List,
                    navigateData: TimesheetList
                })

            }
        }.bind(this))
    }


    getTaskSheetDetails(dataValues) {
        this.setState({
            taskList: [],
            isLoading: false,
        })
        Apirequest.TaskSheetList(dataValues, function (response) {
            // console.log("Result Response", response);
            if (response.success) {
                var items = [];
                if (response.data.length > 0) {
                    for(let i = 0; i< response.data.length;i++){
                        response.data[i]['ID'] = i+1;
                        response.data[i]['IsSelect'] = false;
                    }
                    items = response.data;
                }
                else {
                    items = [];
                    // console.log("Item datas empty", items);

                }
                this.setState({
                    taskList: items,
                    isLoading: false,
                })
            }
            else {
                var items = []
                this.setState({
                    taskList: items,
                    isLoading: false,
                })
                // CommonData.toastFailureAlert(response.errorMessage);
            }
        }.bind(this))
    }

    updateLayout = (index,value) => {
        var { dateList, navigateData, scheduleList, dateCount } = this.state;
        var dateCheck = [];
        dateCheck = dateList;
            console.log("index in update Layout",index)
            if (dateCheck.includes(navigateData.date) || dateCount === undefined || scheduleList === true) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                const array = [...this.state.taskList];
                array.map((value, placeindex) =>
                placeindex === index
                    ? (array[placeindex]['IsSelect'] = !array[placeindex]['IsSelect'])
                    : (array[placeindex]['IsSelect'] = false)
                );
                this.setState(() => {
                return {
                    taskList: array,
                };
                });
                this.natureofWorkdata(array[index]['TASK_ID'])
            }   
            else {
                CommonData.toastWarningAlert("You cannot create timesheet older than "
                    + dateCount
                    + " days from current date,please contact your Manager.")
            }
         
      };

      updateAppliedLayout = (index,item) => {
        var { dateList, navigateData, scheduleList, dateCount } = this.state;
        var dateCheck = [];
        dateCheck = dateList;
        // if (item.LINE_APPROVAL_FLAG != 'Y') {
        //     if ((item.LINE_REJECTION_FLAG != 'Y')){
                console.log("update check")
                if (dateCheck.includes(navigateData.date) || dateCount === undefined || scheduleList === true) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                console.log("Timesheet List",this.state.TimesheetItems,"Index",index)
                const array = [...this.state.TimesheetItems];
                console.log("Is update click",array)
                array.map((value, placeindex) =>
                    placeindex == index ? (array[placeindex]['IsSelect'] = !array[placeindex]['IsSelect'])
                    : (array[placeindex]['IsSelect'] = false)
                );
                this.setState(() => {
                return {
                    TimesheetItems: array,
                };
                },        
                );
                // this.natureofWorkdata(array[index]['TASK_ID'])
                }else {
                CommonData.toastWarningAlert("You cannot create timesheet older than "
                    + dateCount
                    + " days from current date,please contact your Manager.")
                }
        //     }
        // }
      };

      natureofWorkdata(task) {
            
        var {mailID} = this.state
        var requestData = {};
        requestData = {
            taskID: task,
            mailID: mailID
        }
        Apirequest.NatureOfWork(requestData, function (response) {

            if (response.success) {
                var items = [];
                var natureVal = [];
                if (response.data.length > 0) {
                    
                    for(let i=0;i<response.data.length;i++){
                        let arrayVal ={}
                        response.data[i]["text"] ="#969696";
                        response.data[i]["color"] ="#eaeaea";
                        arrayVal['TASK_SUBTYPE_ID']= Number(response.data[i]["TASK_SUBTYPE_ID"]);
                        arrayVal['TASK_SUBTYPE'] = response.data[i]["TASK_SUBTYPE"]
                        natureVal.push(arrayVal)
                    }
                    items = response.data;
                    
                }
                else {
                    items = [];
                    
                }
                this.setState({
                    natureofWorkData: items,
                    isTaskselect: true,
                    naturePicker: natureVal
                })
            }
            else {
                alert(response.errorMessage);
            }
        }.bind(this))
    }

    handleChange(selectedDate) { 
        var selectedvalDate = selectedDate._d
        console.log("Valuesselected",selectedvalDate)
        var {mailID,} = this.state;
        var selectedVal = this.ChangeUrlDate(selectedvalDate);
        let selectVal = new Date(selectedVal);
        let CurrentDate = new Date();
        console.log("Current Date",CurrentDate,"Selected Date",selectVal)
        if(selectVal <= CurrentDate){
        // console.log("val date info",selectedVal, moment().format('DD-MMM-YYYY'))
        var dataValues = {
            mailID: mailID,
            date: selectedVal
        }
        this.setState({
          selected: selectedVal
        });
        this.GetApproveReqListData(mailID, selectedVal);
        this.getTaskSheetDetails(dataValues);
        this.GetTimesheetListData(mailID,selectedVal);
        this.dateLockcall(mailID);
        }else{
            alert(" Not allow to enter Timesheet for Future Date...");
            var dataValues = {
                mailID: mailID,
                date: selectedVal
            }
            this.setState({
              selected: selectedVal
            });
            this.GetApproveReqListData(mailID, selectedVal);
            this.getTaskSheetDetails(dataValues);
            this.GetTimesheetListData(mailID,selectedVal);
            this.dateLockcall(mailID);
            console.log("Testing success")
        }
      };

    ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }


    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    cleanFromScreen(id) {
        const data = this.state.data.filter(item => {
            return item.id !== id;
        });
        this.setState({ data });
    }

    approveService =(rowMap,key,item) => {
        
        var {selectedList,mailID,selectDate,scheduleItems} = this.state
        console.log(" Item to Approve",scheduleItems)
        // for(let i = 0;i<item.length ; i++){
            var payload = {
                sheetNumber: item.TIMESHEET_NUMBER,
                lineId: item.TIMESHEET_LINE_ID,
                MailID: mailID
            }
            
            Api.apporveSheet(payload,function(response){
                if (response.success) {
                    // if (response.data.length > 0) {
                        this.deleteRow(rowMap,key,item)                        // this.refreshScreen();
                        CommonData.toastSuccessAlert("Time is Approved!")

                    // }
                    }else{
                        CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                        this.setState({
                            scheduleItems,
                        })
                    }
            }.bind(this))
        // }
    }

    showrejectionModal(rowMap,key,item,Isvisible){
        console.log("Item to rejection",this.state.scheduleItems);
        this.setState({
            showRejectionview: Isvisible,
            typeReject : item,
            rowMap : rowMap,
            key : key
        })
        if(!Isvisible){
            this.refreshScreen();
        }
    }

    onChangeData(Data){
        this.setState({
            onChangeTextArea: Data
        })
    }

    rejectService =(item) => {

        var {mailID,onChangeTextArea,selectDate,showRejectionview,scheduleItems} = this.state
        // for(let i = 0;i<item.length ; i++){
            var payload = {
                sheetNumber: item.TIMESHEET_NUMBER,
                lineId: item.TIMESHEET_LINE_ID,
                MailID: mailID,
                reason:onChangeTextArea
            }
            // var empName = Object.entries(scheduleItems)[0][0];
            console.log("Reject Values",payload)
            Api.rejectionSheet(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        this.deleteRow(this.state.rowMap,this.state.key,item)   
                            // this.setState({
                            //     scheduleItems: updatedQuotes,
                            //     showRejectionview: false,
                            // })
                            // this.refreshScreen();

                        CommonData.toastSuccessAlert(" Time is Rejected!")
                    }
                }else{
                    CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                    for(let j=0;j<scheduleItems.length;j++){
                        if(scheduleItems[j]['TIMESHEET_LINE_ID'] === item.TIMESHEET_LINE_ID){
                            scheduleItems[j]['IsSuccess'] = 'N';
                            scheduleItems[j]['Message'] = response.errorMessage;
                            scheduleItems[j]['IsSelect'] = false;
                        }
                    }
                    this.setState({
                        showRejectionview: false,
                        selectedList:[],
                        scheduleItems
                    })
                    this.refreshScreen();
                }
                
            }.bind(this))
        // }
    }
    
    getMonth(date, year) {
        const month = date - 1;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        this.setState({ month: "" + monthNames[month] + " " + year, showMonthHead: true });
    }

    onCalendarToggled() {
        this.setState({
            showMonthHead: true
        })
    }

    loadItems(selectedDate) {
        console.log("Load items")
        var { mailID } = this.state;
        this.GetTimesheetListData(mailID, selectedDate.dateString);
        this.getMonth(selectedDate.month, selectedDate.year);
        this.refreshScreen();
    }

    renderDay(day, item) {
        return (
            <List></List>
        )
    }
    renderEmptyDate() {
        return (
            <NoRecordsFound />
        );
    }

    rowHasChanged(r1, r2) {
        return r1 == r2;
    }
    
    dateLockcall(mailID) {
        console.log("Date Lock Check")
        Apirequest.DateLockInfo(mailID,  function (response) {
            console.log("Date Lock val", response)
            if (response.success) {
                var count = parseInt(response.data);
                var currentInfo = response.sysDate.toString().split(" ")[0];
                var CurrentDate = new Date(currentInfo)
                const month = CurrentDate.getMonth() + 1;
                const year = CurrentDate.getFullYear();
                var dt = new Date();
                var datelist = [];
                var changedList = [];
                for (let i = 0; i < count; i++) {
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    datelist.push(dt.getDate().toString() + "-" + months[dt.getMonth()] + "-" + dt.getFullYear().toString());
                    dt.setDate(dt.getDate() - 1);
                }
                console.log("Check Log Date: ", CurrentDate)
                this.setState({
                    sysDate: this.timeToString(CurrentDate),
                    dateList: datelist,
                    dateCount: response.data,
                    myDate: this.timeToString(CurrentDate)
                }, () => {
                    this.getMarkedDates(this.state.mailID);
                    this.getMonth(month, year)
                })
            } else {
                CommonData.toastWarningAlert(response.errorMessage);
            }
        }.bind(this))

    }

    dateLockValidation() {
        var { dateList, navigateData, scheduleList, dateCount } = this.state;
        var dateCheck = [];
        dateCheck = dateList;
        if (dateCheck.includes(navigateData.date) || dateCount === undefined || scheduleList === true) {
            console.log("Date Info", dateCount)
            this.props.navigation.navigate('AddTask',
                {
                    EmailID: navigateData.MailID,
                    SelectedDate: navigateData.date,
                }
            )
        } else {
            CommonData.toastWarningAlert("You cannot create timesheet older than "
                + dateCount
                + " days from current date,please contact your Manager.")
        }
    }
    timeToString(time) {
        var d = new Date(time);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    changeListType(value){
        this.setState({
            listType : value
        })
    }

    renderItem = (data,rowMap) => {
        console.log("data calendar info",data)
        return <VisibleItem 
        data = {data}
        />
    }

    closeRow=(rowMap,rowKey,data) => {
        if(rowMap[rowKey]){
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow = (rowMap,rowKey,data) =>{
        console.log("Values rowMap",rowMap,"Key",rowKey,"data",data)
        this.closeRow(rowMap,rowKey,data)
        const newData = [...this.state.scheduleItems];
        const prevIndex = this.state.scheduleItems.findIndex(item => item.key === rowKey ) 
        newData.splice(prevIndex,1);
        this.setState({
            scheduleItems : newData
        })
    }

    renderHiddenItem = (data,rowMap) =>{
        return <HiddenItemWithAction
        data = {data}
        rowMap ={rowMap}
        onApprove ={()=>this.approveService(rowMap,data.item.key,data.item)}
        onReject ={()=>this.showrejectionModal(rowMap,data.item.key,data.item,false)}
        />
    }

    renderScene = ({ route, data}) => {
        switch (route.key) {
            case 'first':
                return <FirstTab 
                            taskType= {"MyTask"}
                            taskList= {this.state.taskList} 
                            updateValue = {this.updateLayout}
                            sateInfo = {this.state}
                            mailID = {this.state.mailID}
                            dateInfo = {this.state.selected}
                            refreshScreen = {this.refreshScreen}
                            updateAppliedLayout = {this.updateAppliedLayout}
                             />;
            case 'second':
                return <TeamTab 
                sateInfo = {this.state}
                renderItem = {this.renderItem}
                renderHiddenItem = {this.renderHiddenItem}

                />;
        }
    }

    agendaRendar(item){
        console.log("Log_val",item)
        return(
            <Text>Calendar View display</Text>
            // <TabView
            //     navigationState={{index: item.index, routes: item.route}}
            //     renderScene={this.renderScene}
            //     renderTabBar={props => 
            //     <TabBar {...props} 
            //     indicatorStyle={ {backgroundColor: '#580073'}}
            //     indicatorContainerStyle = {{backgroundColor:'#f4ebf9'}}
            //     style={{ backgroundColor: '#fff' }}
            //     activeColor = {"#580073"}
            //     inactiveColor = {'black'}
            //     />}
            //     onIndexChange={index => this.setState({index})}
            //     initialLayout={SCREEN_WIDTH}
            //     style={styles.tabcontainer}
            //     swipeEnabled ={false}
            // /> 
        )
    }


    render(){

          var {selected,scheduleItems,markedDates,TimesheetItems,taskList,natureofWorkData,myDate,month,naturePicker} = this.state;
          var screen = Dimensions.get('window');
          var { route, index } = this.state 
          console.log("route info",route)
        return(
            // <ImageBackground source={require('../../assets/background.png')} style={styles.background}> 
            <Container >
                 {/* <ImageBackground source={require('../../assets/background.png')} style={styles.background}>  */}
                    <Header  style={{ backgroundColor: 'white' }}>
                        <Left>
                            {/* <TouchableOpacity 
                             onPress ={() => {this.props.navigation.navigate('Settings')}} 
                            > */}
                                <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 30, width: 50 }} />
                            {/* </TouchableOpacity> */}
                        </Left>
                        <Body>
                            <HeaderTitle title="Timesheet" />
                            {/* {   this.state.showMonthHead === true &&
                                <Subtitle>{month}</Subtitle>
                            } */}
                        </Body>
                        <Right>
                        <CustomMenuIcon
                            menutext="Menu"
                            menustyle={{
                                marginRight: 0,
                                flexDirection: 'row',
                                justifyContent:'flex-end',
                            }}
                            textStyle={{
                                color: 'white',
                            }}
                            option1Click={() => this.props.navigation.navigate('Settings')}
                            option2Click={() => this.props.navigation.navigate('Auth')}
                            employeeUrl = {this.state.userInfo.employeeImageUri}
                            // employeeId ={"1235"}
                        />
                            {/* <TouchableOpacity onPress ={() => this.props.navigation.navigate('Auth')}>
                                <Thumbnail square source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 30, width: 30 }} />
                            </TouchableOpacity> */}
                        </Right>
                    </Header>
                <Agenda
                    horizontal={true}
                    items={this.state}
                    onDayPress={this.handleChange.bind(this)}
                    selected={myDate}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    markedDates={markedDates}
                    renderDay={this.renderDay.bind(this)}
                    theme={{ backgroundColor: '#fff', agendaKnobColor: '#580073' }}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    hideKnob={false}
                    onCalendarToggled={this.onCalendarToggled.bind(this)}
                />
                
                {/* <CalendarStrip
                    scrollable
                    calendarAnimation={{type: 'sequence', duration: 30}}
                    daySelectionAnimation={{type: 'border', duration: 200,borderWidth: 1, borderHighlightColor: '#ccc' }}
                    style={{height: 150, paddingTop: 20, paddingBottom: 10}}
                    calendarHeaderStyle={{color: 'black'}}
                    calendarColor={'transparent'}
                    dateNumberStyle={{color: 'black'}}
                    selectedDate = {moment()}
                    onDateSelected = {(date) =>this.handleChange(date)}
                    dateNameStyle={{color: 'black'}}
                    highlightDateNumberStyle={{color: '#580073'}}
                    highlightDateNameStyle={{color: '#580073'}}
                    disabledDateNameStyle={{color: 'grey'}}
                    disabledDateNumberStyle={{color: 'grey'}}
                    iconContainer={{flex: 0.1}}
                    markedDates = {this.state.markedDateinfo}
                    // maxDate = {moment()}
                    
                /> */}
                {/* <ScrollView> */}

                    {/* {
                    this.state.taskList.length > 0 &&
                    <View>
                        <Text style={{textAlign:'center',color:'#59b7d3',fontWeight:'bold'}}> Task List</Text>
                    </View>
                    } */}

                        {/* <TabView
                            navigationState={{index: index, routes: route}}
                            renderScene={this.renderScene}
                            renderTabBar={props => 
                            <TabBar {...props} 
                            indicatorStyle={ {backgroundColor: '#580073'}}
                            indicatorContainerStyle = {{backgroundColor:'#f4ebf9'}}
                            style={{ backgroundColor: '#fff' }}
                            activeColor = {"#580073"}
                            inactiveColor = {'black'}
                            />}
                            onIndexChange={index => this.setState({index})}
                            initialLayout={SCREEN_WIDTH}
                            style={styles.tabcontainer}
                            swipeEnabled ={false}
                        /> */}

                    {/* <View style={{width:SCREEN_WIDTH,marginTop:50}}>
                    {
                        
                        this.state.taskList.map((item,key)=>(
                        <ExpandableComponent 
                            taskType= {"MyTask"}
                            taskList= {item} 
                            updateValue = {this.updateLayout.bind(this,key)}
                            NatureofWork = {natureofWorkData}
                            natureList = {naturePicker}
                            mailID = {this.state.mailID}
                            dateInfo = {this.state.selected}
                            refreshScreen = {this.refreshScreen.bind(this)}
                        />
                    ))}
                    </View> */}
                
                    {/* {
                    Object.keys(scheduleItems).length > 0 &&
                    <View>
                        <Text style={{textAlign:'center',marginTop:10,color:'#59b7d3',fontWeight:'bold'}}>approval List</Text>
                    </View>
                } */}
                

                {/* { <View  style={{flexDirection: 'row',flex:1, width: SCREEN_WIDTH,padding:5,paddingLeft:20}}>
                    <TouchableOpacity onPress ={()=> this.changeListType(true)}>   
                        <View>
                        { 
                        Validate.isNotNull(this.state.userInfo.employeeImageUri)
                        ?
                        <View style = { this.state.listType ? styles.selectedcircle : styles.unselectedcircle}>
                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + this.state.userInfo.employeeImageUri }} style={{width:52,height:52}}/>
                        </View>
                        :
                        <View style = { this.state.listType ? styles.selectedcircle : styles.unselectedcircle}>
                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{width:50,height:50}} />
                        </View>
                        }
                        </View>
                        <Text style={{textAlign:'center'}}>Me</Text>
                    </TouchableOpacity>
                    <View style={{margin: 20, backgroundColor:'#ccc', width:2, height:35}}></View>
                    <TouchableOpacity onPress ={()=> this.changeListType(false)}>
                        
                        <View style = { !this.state.listType ? styles.selectedcircle : styles.unselectedcircle}>
                            <CSIcon name={"Artboard-50"} size={50} color={'#59b7d3'}  style={{justifyContent:'center',alignItems:'center'}}/>
                        </View>
                        <Text style={{textAlign:'center'}}>Team</Text>
                    </TouchableOpacity>
                </View> } */}

                
                {/* { 
                    // !this.state.listType
                    // &&
                    <View style={{width:SCREEN_WIDTH,marginTop:20}}>
                        {
                        scheduleItems.length > 0 ?
                            // this.renderDateItem(scheduleItems)
                        // scheduleItems
                        //     .map((item,i) => (
                        //             <React.Fragment  key={i}>
                                    //  <ListItem
                                    //     itemVal = {item}
                                    //     index = {i}
                                    //     onSwipeFromLeft={() => this.approveService(item,i)}
                                    //     onRightPress={() => this.showrejectionModal(item,i,true)}
                                    //     Login={false}
                                    // />
                                    <SwipeListView 
                                    data ={scheduleItems}
                                    rightOpenValue={-100} 
                                    disableRightSwipe={true} 
                                    renderItem = {this.renderItem}
                                    renderHiddenItem = {this.renderHiddenItem}
                                    >
                                        
                                </SwipeListView>

                                //  </React.Fragment> 
                            // ))
                            
                            :
                            <NoRecordsFound/>
                        }
                    </View>
                } */}

                    {/* {
                        TimesheetItems.length > 0 &&
                        <View>
                            <Text style={{textAlign:'center',marginTop:10,marginBottom:30,color:'#59b7d3',fontWeight:'bold'}}>Applied List</Text>
                        </View>
                    } */}

                    
                    {/* {
                        this.state.listType
                        &&
                        <View style={{width:SCREEN_WIDTH,marginTop:50}}>
                            {
                            TimesheetItems.length > 0 ?
                            Object.entries(TimesheetItems)
                            .map(([key, item], i) => (
                                <React.Fragment  key={i}>
                                    <ExpandableComponent
                                        taskType= {"AppliedTask"} 
                                        taskList= {item} 
                                        updateValue = {this.updateAppliedLayout.bind(this,key,item)}
                                        NatureofWork = {natureofWorkData}
                                        natureList = {naturePicker}
                                        mailID = {this.state.mailID}
                                        dateInfo = {this.state.selected}
                                        refreshScreen = {this.refreshScreen.bind(this)}
                                    />
                                    {  
                                    // <ListItem 
                                        // itemVal = {item}
                                        // onSwipeFromLeft={(item,i) => this.approveService(item,i)}
                                        // onRightPress={(item) => this.rowDelete(item)}
                                        // Login={true}
                                    // /> 
                                    }
                            </React.Fragment>
                            ))
                            :
                            <NoRecordsFound/>
}
                        </View>
                    } */}
                {/* </ScrollView> */}

                <RejectinfoModel 
                modalVisible={this.state.showRejectionview} 
                showrejectionModal={this.showrejectionModal.bind(this)} 
                onChangeTextArea={this.state.onChangeTextArea}
                rejectService={this.rejectService.bind(this)} 
                onChangeData = {this.onChangeData.bind(this)}
                typeReject= {this.state.typeReject}
                />
                
                {/* </ImageBackground> */}
                
                {/* <Fab
                    active = "true"
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#580073' }}
                    onPress={() => {this.props.navigation.navigate("Status")}}
                    position="bottomRight"
                    >
                    <CSIcon name={"Artboard-641"}/>
                </Fab>   */}
            </Container>
            // {/* </View> */}
            // </ImageBackground>
        )
    }
}
export default Timesheet;

const styles = StyleSheet.create({
    tabcontainer: {
        marginTop: StatusBar.currentHeight,
      },
    background: {
        flex:1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        resizeMode: "cover",
        // justifyContent: "center"
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        width: '100%'
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    text: {
        color: "#D8D8D8",
        bottom: 6,
        marginTop: 5,
        color: "#000"
    },
    // header: {
    //     // backgroundColor: 'rgba(0,255,0,0.5)',
    //     paddingHorizontal:10,
    //     alignItems: 'center',
    //     alignContent: 'center',
    //     width: '20%',
    // },
    headerSucess: {
        // backgroundColor: '#cfe8fc',
        backgroundColor: 'rgba(0,255,0,0.7)',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
    },
    headerFail: {
        backgroundColor: '#cfe8fc',
        backgroundColor: 'rgba(255,0,0,0.7)',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
    },
    suceessContent:{ 
        width: '80%', 
        flexDirection: 'column',
        backgroundColor: 'rgba(0,255,0,0.7)' 
    },
    failContent:{ 
        width: '80%', 
        height: '100%', 
        flexDirection: 'column',
        backgroundColor: 'rgba(255,0,0,0.7)' 
    },
    content:{ 
        marginTop:5,
        marginBottom:5,
        width: '80%', 
        flexDirection: 'row',
        paddingHorizontal: 5
    },
    header1: {
        backgroundColor: 'lightgreen',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
    },
    header2: {
        backgroundColor: 'red',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
    },
    container: {
        flex: 1,
    },
    duration: {
        fontSize: 20,
        color: '#2962ff',
        textAlign: 'center',
        alignContent: 'space-between',
        marginTop: 40
    },
    // hours: {
    //     fontSize: 15,
    //     color: 'black',
    //     marginTop:20,
    //     textAlign: 'center',
    //     fontWeight:'bold',
    //     alignContent: 'space-between',
    // },
    header: {
        // alignItems: 'center',
        // alignContent: 'center',
        justifyContent:'center',
        width: '20%',
      },
      hours: {
        fontSize: 15,
        color: 'black',
        // marginTop:20,
        // textAlign: 'center',
        fontWeight:'bold',
        // alignContent: 'space-between',
      },
    standaloneRowFront: {
        backgroundColor: '#fff',
        paddingRight: 10,
        paddingLeft: 10,
        marginBottom:10,
        marginTop:10,
        elevation: 3,
        borderRadius:10,
        flex: 1,
        flexDirection: 'row'
    },
    standaloneRowBack: {
        backgroundColor: 'white',
        paddingRight: 10,
        marginBottom:10,
        marginTop:10,
        paddingLeft: 10,
        elevation: 3,
        borderRadius:10,
        flex: 1,
        flexDirection: 'row-reverse',
    },
    rejectButton: {
        justifyContent: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor:'red',
        borderTopRightRadius:20,
        borderBottomRightRadius:20
    },
    approveButton:{
        justifyContent: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor:'#00c853'
    },
    overlay: {
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        height:200
    },
    modalContent: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        
    },

    selectedcircle:{ borderColor: '#580073',
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'center'
    },

    unselectedcircle:{ borderColor: '#ccc',
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'center'
    },

    assignedcircle:{ borderColor: '#7666fe',
    justifyContent:'flex-start',
    flex:.15,
    marginRight:4,
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'center'
    },

    approvedcircle:{ borderColor: '#00c853',
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:1,
    backgroundColor:'#fff',
    alignItems:'center'
    },

    rejectedcircle:{ borderColor: '#f44336',
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'center'
    },
    // 90caf9
    
    pendingcircle:{ borderColor: 'orange',
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'center'
    },

    cancelcircle:{ borderColor: '#ff3d00',
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'center'
    },
    
});
