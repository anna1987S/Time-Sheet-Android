import React from 'react';
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
    H3, 
    Card, CardItem,Thumbnail,
    Subtitle,Fab,
    Input,Textarea
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,View,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,TextInput,Modal,
    TouchableWithoutFeedback
 } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { TabView, SceneMap, TabBar} from 'react-native-tab-view';
import CSIcon from '../../icon-font';
import RBSheet from "react-native-raw-bottom-sheet";
import SessionRBSheet from "react-native-raw-bottom-sheet";
import DateRBSheet from "react-native-raw-bottom-sheet";
import ToRBSheet from 'react-native-raw-bottom-sheet';
import FromTimeRBSheet from 'react-native-raw-bottom-sheet';
import ToTimeRBSheet from 'react-native-raw-bottom-sheet';
// import BottomView from './actionSheetView';
import Status from '../status'
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import ListItem, { Separator } from '../request/swipeList/ListItem';
import { ScrollView } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import * as Api from '../../services/api/leave';
import _ from 'underscore';
import Picker from '@gregfrench/react-native-wheel-picker';
import DatePicker from 'react-native-date-picker';
import CustomMenuIcon from '../../navigation/customMenu/customMenuIcon';
import { CommonData,Validate, Constants } from '../../utils';
import { SwipeListView } from 'react-native-swipe-list-view';
import NoRecordsFound from '../noRecordFound';
import { ActivityIndicator } from 'react-native';
import ToastRej from 'react-native-easy-toast';
import ToastAppr from 'react-native-easy-toast';
import Toastinfo from 'react-native-easy-toast';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';

var PickerItem = Picker.Item;

const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const DATA = [
    { id: 1, message: 'Message #1' },
    { id: 2, message: 'Message #2' },
    { id: 3, message: 'Message #3' },
    { id: 4, message: 'Message #4' },
    { id: 5, message: 'Message #5' },
    { id: 6, message: 'Message #6' },
    { id: 7, message: 'Message #7' },
    { id: 8, message: 'Message #8' },
    ];


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
                <View padder style={{width: SCREEN_WIDTH-80, height: 120, backgroundColor: '#fff', borderRadius: 5, justifyContent: 'center'}}>
                    <Text style={{marginTop:10, marginLeft:10}}>Do you want reject this entry?</Text>
                    <View style={{flex:1,flexDirection: 'row', justifyContent: 'center',marginTop:5}}>
                        <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                            <Button style={{justifyContent:'center',width:'60%',alignSelf:'center'}}onPress={() =>  props.rejectService(props.typeReject)} >
                            {props.isLoading ? <ActivityIndicator /> :<Text style={{ color: 'white',textAlign:'center' }}>Ok</Text>}
                            </Button>
                        </View>
                        <View style={{ width:  '50%', alignItems: 'center', justifyContent: 'center' }}>
                            <Button style={{justifyContent:'center',width:'60%',alignSelf:'center'}} onPress={() => props.showrejectionModal("","",[],false)}>
                                <Text style={{ color: 'white',textAlign:'center' }}>Cancel</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View> 
        </Modal>
    )
} 


    const ModalInput = ({ onTextChange, onSubmit, visible, value, toggle,cancelEntryInfo }) => {
        console.log("modal val call")
        return (
          <Modal 
          animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
            toggle("",false)
    }}>
            {/* <View
              style={{
                height: 150,
                // flex: 1,s
                padding: 20,
                width: '80%',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                backgroundColor: 'white',
              }}> */}
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View padder style={{padding: 10, width: '80%', height: 180, backgroundColor: '#fff', borderRadius: 5, justifyContent: 'center'}}>
                { 
                    cancelEntryInfo.inputLeaveType == "PERMISSION" 
                    ?
                    <Text>Do you want to cancel the permission?</Text>
                    :
                    <Text>Do you want to cancel the leave?</Text>
                }
                <TextInput
                    value={value}
                    onChangeText={onTextChange}
                    placeholder={'Enter the reason'}
                    style={{marginTop:10}}
                />
                <View style={{width:'100%', flexDirection: 'row', alignSelf:'center',justifyContent: 'center',marginTop:30 }}>
                    <View style={{ width: '50%',padding:10, alignItems: 'center', justifyContent: 'center' }}>
                        <Button style={{width:'100%',justifyContent: 'center',padding:10}}onPress={() => onSubmit()} >
                            <Text style={{ textAlign:'center',color: 'white' }}>Yes</Text>
                        </Button>
                    </View>
                    <View style={{ width:  '50%', padding:10, justifyContent: 'center' }}>
                        <Button style={{width:'100%',justifyContent: 'center',padding:10}} onPress={() => toggle("",false)}>
                            <Text style={{textAlign:'center', color: 'white' }}>No</Text>
                        </Button>
                    </View>
                </View>
            </View>
            </View>
          </Modal>
        );
      };


    const BottomModalView = (props) =>{
        // console.log("Bottomvalue",props)
        return(
            <View style={{alignItems:'flex-end'}}>
    
                {/* <Button style={{marginRight:10}} onPress={()=> props.done()}>
                    <Text style={{textAlign:'center',alignItems:'center'}}>Done</Text>
                </Button> */}
    
                    <Picker style={{width: SCREEN_WIDTH, height: 200}}
                        selectedValue={props.selectedItem}
                        itemStyle={{color:"#000", fontSize:18}}
                        onValueChange={(value) => props.onPickerSelect(value)}
                        >
                         {props.itemList.map((value, i) => (
                                <PickerItem label={value} value={i} key={i}/>
                            ))}
                    </Picker>
    
            </View>
    
        )
    }
    
    const DateModalView = (props) =>{
        // console.log("Bottomvalue",props)
        return(
            <View style={{alignItems:'flex-end'}}>
    
                {/* <Button style={{marginRight:10}} onPress={()=> props.done()}>
                    <Text style={{textAlign:'center',alignItems:'center'}}>Done</Text>
                </Button> */}
                    <DatePicker style={{width: SCREEN_WIDTH, height: 200}}
                        mode="date"
                        date = {props.selectedItem}
                        onDateChange={(date) => props.onPickerSelect(date)}
                        // onValueChange={(value) => props.onPickerSelect(value)}
                    />
            </View>
    
        )
    }

    const TimeModalView = (props) =>{
        // console.log("Bottomvalue",props)
        return(
            <View style={{alignItems:'flex-end'}}>
    
                {/* <Button style={{marginRight:10}} onPress={()=> props.done()}>
                    <Text style={{textAlign:'center',alignItems:'center'}}>Done</Text>
                </Button> */}
                    <DatePicker style={{width: SCREEN_WIDTH, height: 200}}
                        mode="time"
                        date = {props.selectedItem}
                        onDateChange={(date) => props.onPickerSelect(date)}
                        // onValueChange={(value) => props.onPickerSelect(value)}
                    />
            </View>
    
        )
    }

    class ExpandableComponent extends React.Component {

        constructor() {
            super();
            this.state = {
              layoutHeight: 0,
              dayList : ["-- Select --","Half Day","Full Day"],
              sessionList : ["-- Select -- ","FN","AN"],
              selectedFrom: new Date(),
              selectedTo : new Date(),
              selectedInTime: "",
              selectedOutTime: "",
              inTime : new Date(),
              outTime : new Date(), 
              dateType : true,
              fromDate : '',
              toDate : '',
              selectedDay : '',
              selectedIndex : 0,
              sessionIndex : 0,
              selectedSession : '',
              selectedMobileNum: '',
              selectedReason: null,
              selectedDuration : '',
              selectedComments: null,
              userInfo : {},
              sessionData : '',
              isLoading: false,
              fileData: [],
              attachmentInfo: {}
            };
            
        }
    
        async componentWillReceiveProps(nextProps) {
            let UserInfo = await AsyncStorage.getItem('userInfo');
            let sessionKey = await AsyncStorage.getItem('sessionKey');
            this.setState({
                leaveInfo : nextProps.taskList,
                fromDate: this.ChangeUrlDate(nextProps.dateInfo),
                selectedTo : new Date(nextProps.dateInfo),
                // selectedIndex : 0,
                // sessionIndex : 0,
                // selectedSession : '',
                // selectedFrom: nextProps.dateInfo,
                // toDate : '',
                // selectedDay : '',
                
                // selectedMobileNum: '',
                // selectedReason: null,
                // selectedDuration : '',
                // selectedComments: null,
                userInfo : JSON.parse(UserInfo),
                sessionData : sessionKey
            },()=>{
    
            })
            if (nextProps.taskList.IsSelect) {
              this.setState(() => {
                return {
                  layoutHeight: null,
                };
              });
            } else {
              this.setState(() => {
                return {
                  layoutHeight: 0,
                };
              });
            }
        }
    
        shouldComponentUpdate(nextProps, nextState) {
            if ((this.state.layoutHeight !== nextState.layoutHeight) || (this.state.selectedIndex !== nextState.selectedIndex)|| (this.state.selectedFrom !== nextState.selectedFrom) ||
                (this.state.sessionIndex !== nextState.sessionIndex)|| (this.state.fromDate !== nextState.fromDate)|| (this.state.toDate !== nextState.toDate)|| (this.state.selectedTo !== nextState.selectedTo) ||
                (this.state.selectedDay !== nextState.selectedDay) || (this.state.selectedReason !== nextState.selectedReason)|| (this.state.selectedInTime !== nextState.selectedInTime) || (this.state.selectedOutTime !== nextState.selectedOutTime) ||
                (this.state.selectedSession !== nextState.selectedSession) || (this.state.selectedMobileNum !== nextState.selectedMobileNum) || (this.state.selectedDuration !== nextState.selectedDuration)
                || (this.state.selectedComments !== nextState.selectedComments) ||(this.state.attachmentInfo !== nextState.attachmentInfo) ) {
                return true;
              }
              return false;
        }
    
        onValueChange = (value) => {
            console.log("Values from picker",this.state.dayList)
            this.setState({
                selectedIndex : value,
                selectedDay : this.state.dayList[value],
                sessionIndex : 0,
                selectedSession : '',
            },()=>{
                console.log("Selected Day",this.state.selectedDay)
            });
        }

        onSessionChange = (value) => {
            console.log("Values from picker",this.state.dayList)
            this.setState({
                sessionIndex : value,
                selectedSession : this.state.dateType ? this.state.sessionList[value] : this.state.dayList[value] ,
                
            },()=>{
                console.log("Selected Day",this.state.selectedSession)
            });
        }

        onfromDateChange = (value) => {
            console.log("Values from picker",this.ChangeUrlDate(value))
            this.setState({
                selectedFrom : value,
                fromDate : this.ChangeUrlDate(value),
            },()=>{
                console.log("Selected Day",this.state.fromDate)
            });
            this.fromDateClose.bind(this);        
        }

        fromDateClose = () =>{
            this.DateRBSheet.close()
        }

        toDateClose = () =>{
            this.ToRBSheet.close()
        }

        ontoDateChange= (value) => {
            console.log("Values from picker",value,"from Date",this.state.fromDate)
            
            var dateinfo = this.ChangeUrlDate(value)
            var selected = false

            if(Date.parse(dateinfo) === Date.parse(this.state.fromDate)){
                selected = true
            }else
            {
                selected = false
            }
            this.setState({
                selectedTo: value,
                toDate : this.ChangeUrlDate(value),
                dateType : selected,
                selectedSession : '',
                sessionIndex : 0
                
            },()=>{
                console.log("Selected Day",this.state.toDate)
                this.toDateClose.bind(this)

            });
        }

        onChangeInTime= (value) => {
            var inTime =new Date(value)
            console.log("In Time values",this.ChangeTime(value));
            // var timeIn = value.getTime()
            this.setState({
                inTime : value,
                selectedInTime : this.ChangeTime(value)
            })
        }

        InTimepress = () =>{
            this.FromTimeRBSheet.open()
        }

        InTimeClose = () =>{
            this.FromTimeRBSheet.close()
        }

        onChangeOutTime= (value) =>{
            console.log("Out Time values",value)
            // var 
            this.setState({
                outTime: value,
                selectedOutTime : this.ChangeTime(value)
            })
        }

        OutTimepress = () =>{
            
            this.ToTimeRBSheet.open()
        }

        OutTimeClose = () =>{
            this.ToTimeRBSheet.close()
        }

        onChangeDuration = (value) => {
            this.setState({ selectedMobileNum : value });
        }

        onChangeTextArea = (value) => {
            this.setState({ selectedComments: value });
        }
    

        ChangeUrlDate(selectedDate) {
            var d = new Date(selectedDate);
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var timeToString =  ("0" + (d.getDate().toString())).slice(-2).toString()  + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
            return timeToString;
        }

        ChangeTime(selectedDate){
            var d= new Date(selectedDate);
            var timeString = ("0" + (d.getHours().toString())).slice(-2).toString()  + ":" + ("0" + (d.getMinutes().toString())).slice(-2).toString()  
            return timeString
        }
        
        async loadStorageData(){

            try {
                const res = await DocumentPicker.pick({
                  type: [DocumentPicker.types.allFiles],
                  readContent: true
                });
                console.log("REs info",res[0])

                RNFS.readFile(res[0].uri, 'base64') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
                .then((result) => {
                    // console.log("Read file",result)
                    var fileInfo = {
                        fileContent : result,
                        sourceTypeId : 0,
                        sourceType: "LEAVE",
                        fname : res[0].name,
                        fileSize: res[0].size
                    }
                    var attachmentInfo = {
                        fileContent : result,
                        sourceTypeId : 0,
                        sourceType: "LEAVE",
                        fname : res[0].name,
                        fileSize: res[0].size,
                        url: res[0].uri,
                    }
                    
                        Alert.alert (
                        'Confirm',
                        'Do you wish to add '+res[0].name + '?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'Add', 
                            // onPress: () => this.attachmentData(fileInfo)
                            onPress : () => 
                            this.setState({
                                fileData : [fileInfo],
                                attachmentInfo: attachmentInfo
                            },()=>{
                                console.log("attachmentInfo",this.state.attachmentInfo)
                            })
                         },
                        ],
                            { cancelable: false },
                        )
                })
                .catch((err) => {
                    Validate.toastAlert("file check",err.message)
                });
                
              } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                  // User cancelled the picker, exit any dialogs or menus and move on
                  Validate.toastAlert("Attachment cancelled");
                } else {
                  throw err;
                }
            }
        }
    
        async attachmentInfoView(data){
            var sessionKey = await AsyncStorage.getItem('sessionKey');
            var payload = {
                sessionKey: sessionKey,
                fileName: data
            }
            console.log("fileDetails",data)
            // var path = RNFS.DocumentDirectoryPath +"/"+ fileName.fname;
            FileViewer.open(data.url)
                // write the file
                // RNFS.writeFile(path, result.fileContent, 'base64')
                // .then((success) => {
                //     this.setState({
                //         isIndicate : false
                //     },()=>{
                //         FileViewer.open(path)
                //         .then(() => {
                //             // success
                //         })
                //         .catch(error => {
                //             // error
                //             Validate.toastAlert(error.message)
                //         });
                //     })
                // })
                // .catch((err) => {
                //     this.setState({
                //         isIndicate : false
                //     })
                //     Validate.toastAlert(err.message)
                // });  
        }


        _saveTaskInfo = (pickVal) => {
            console.log("Selected Val",pickVal)
            let start = new Date(this.state.fromDate)
            let end = new Date (this.state.toDate)
            let Difference_In_Time = end.getTime() - start.getTime();
            let dif_count = Difference_In_Time / (1000 * 3600 * 24); 
            let duration = dif_count + 1
            console.log("Date Duration", duration)
            var checkValidation = this.checkFormValidation(pickVal);
            if (checkValidation.isValid) {
                this.setState({
                    isLoading : true
                })
                if(this.state.selectedDay ==="Half Day"){
                    if(this.state.selectedSession === "Half Day"){
                        duration = duration - 1
                    }else{
                        duration = duration - 0.5
                    }
                }else if(this.state.selectedSession === "Half Day"){
                    duration = duration - 0.5
                }
                console.log("Duration Update", duration - 0.5)
                var leaveEntry = {
                    employeeId: this.state.userInfo.employeeId,
                    hrUnitId: pickVal.hrUnitId,
                    inputLeaveType: pickVal.leaveType,
                    periodStartDate: pickVal.eligibilityPeriodStartDate,
                    periodEndDate: pickVal.eligibilityPeriodEndDate,
                    leaveTypeId: pickVal.leaveTypeId,
                    leaveEligibilityPeriod: pickVal.leaveEligibilityPeriodId,
                    compoffFlag: "",
                    onDutyCompOffId: "",
                    compOffDuration: "",
                    compoffStartDate: "",
                    compoffEndDate: "",
                    clubMethod: "",
                    allowHalfDaySeries: "",
                    duration: duration,
                    fromDate: this.ChangeDate(this.state.fromDate),
                    leaveName: pickVal.displayLeaveType,
                    toDate: this.ChangeDate(this.state.toDate),
                    weekOffHolidayLeaveApplyFlag: "",
                    weekOffOrHolidayFlag: "",
                    sessionKey : this.state.sessionData
                  }
                console.log("Sucess entry validate",leaveEntry);
                Api.LeaveEntryValidation(leaveEntry, function (response) {
                    console.log("Leave entry list Response", response);
                    var items = [];
                    if (response.success) {
                        let ajaxString = response.ajaxResultString;
                        let message = response.TransactionMessage;
                        let confirm = response.confirmFlag;
                        var validationRes = {
                            ajaxString : response.ajaxResultString,
                            transMsg : response.TransactionMessage,
                            confirmFlg : response.confirmFlag,
                            attendanceDateList : response.attendanceDateList,
                        }
                        if(response.ajaxResultString === ""){
                            this.saveleaveEntry(pickVal,validationRes,duration);
                        }else if(response.ajaxResultString === "WEEKHOLIDAYCHECK"){
                            // CommonData.toastWarningAlert(message)
                            this.toastRej.show(message);
                        }else if(response.ajaxResultString === "ELIGIBILITYNOTAVAILABLE" && confirm ===""){
                            // CommonData.toastWarningAlert(message)
                            this.toastRej.show(message);
                        }else if(response.ajaxResultString ==="LOPCHECK"){
                            // CommonData.toastWarningAlert(message)
                            this.toastRej.show(message);
                        }else{
                            // CommonData.toastWarningAlert(message)
                            this.toastRej.show(message);
                        }
                        this.setState({
                            isLoading : false
                        })
                    }else{
                        this.setState({
                            isLoading : true
                        })
                    }
                }.bind(this))
            }   
            else {
                // CommonData.toastWarningAlert(checkValidation.message)
                this.toastRej.show(checkValidation.message);
            }
        }

        saveleaveEntry(pickVal,validationRes,duration){
            var LeaveEntry = {
                employeeId: this.state.userInfo.employeeId,
                hrUnitId: pickVal.hrUnitId,
                inputLeaveType: pickVal.leaveType,
                periodStartDate: pickVal.eligibilityPeriodStartDate,
                periodEndDate: pickVal.eligibilityPeriodEndDate,
                leaveTypeId: pickVal.leaveTypeId,
                leaveEligibilityPeriod: pickVal.leaveEligibilityPeriodId,
                compoffFlag: "",
                onDutyCompOffId: "",
                compOffDuration: "",
                compoffStartDate: "",
                compoffEndDate: "",
                clubMethod: "",
                allowHalfDaySeries: "",
                duration: duration,
                fromDate: this.ChangeDate(this.state.fromDate),
                leaveName: pickVal.displayLeaveType,
                toDate: this.ChangeDate(this.state.toDate),
                weekOffHolidayLeaveApplyFlag: "",
                leaveType: pickVal.leaveType,
                phoneNo: this.state.selectedMobileNum,
                reason: this.state.selectedComments,
                sessions: "",
                ajaxResultString: validationRes.ajaxString,
                attendanceDateList: validationRes.attendanceDateList,
                fromTime: this.state.selectedInTime,
                toTime: this.state.selectedOutTime,
                nullifyRemark: "",
                status: "I",
                halfDayCheckFlag: "",
                fromDay: "",
                fromHalfSession: "",
                toDay: "",
                toHalfSession: "",
                sessionKey : this.state.sessionData,
                attachArray:  this.state.fileData
              }

            console.log("Sucess entry info",LeaveEntry);
            Api.LeaveEntrySave(LeaveEntry,function (response) {
                console.log("Leave entry  save Response", response);
                    var items = [];
                    if (response.success) {
                        console.log("Leave entry save",response)
                        pickVal.leaveType == 'PERMISSION' ? this.toastAppr.show("Permission created Successfully !!!") : this.toastAppr.show("Leave created Successfully !!!") ;
                        this.props.updateValue(this.props.taskId,this.props.taskList);
                        this.setState({
                            isLoading: false
                        })
                        this.props.refreshScreen();
                    }else{
                        // CommonData.toastWarningAlert(response.errorMessage)
                        this.toastRej.show(response.errorMessage);
                    }
            }.bind(this))
        }

        toDatepress = () =>{
            this.setState({
                toDate : this.ChangeUrlDate(this.props.dateInfo),                
            })
            this.ToRBSheet.open()
        }

        toDatepressVal= (value) =>{
            if(value.leaveType == 'PERMISSION'){
                this.setState({
                    toDate : this.ChangeUrlDate(this.props.dateInfo)
                })
                return this.ChangeUrlDate(this.props.dateInfo)
            }else{
                return this.state.toDate
            }
        }

        ChangeDate(selectedDate){
            var d = new Date(selectedDate);
            var timeToString = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + d.getDate().toString();
            return timeToString;
        }

        checkFormValidation(pickVal){
            console.log("Validation Check todate",this.state.selectedInTime,"from Date",this.state.selectedOutTime,"pick val",pickVal);
            
            if (this.state.selectedComments == null || this.state.selectedComments.trim() === '' 
                || this.state.selectedMobileNum.trim() == '' || this.state.selectedMobileNum == null
                ) {
                return {
                    isValid: false,
                    message: this.state.selectedMobileNum == '' ? "Enter the Emergency number" : "Enter the reason"
                };
            }
            else if (this.state.selectedIndex === 0 && pickVal.leaveType != "PERMISSION" ) {
                return {
                    isValid: false,
                    message:  "Please select Day type " 
                };
            }
            else if(this.state.selectedIndex !== 2 && this.state.sessionIndex === 0 && pickVal.leaveType != "PERMISSION"){
                return {
                    isValid : false,
                    message : "Please select Session type" 
                }
            }
            else if((this.state.selectedInTime.trim() == "") && (pickVal.leaveType == "PERMISSION")){
                return {
                    isValid: false,
                    message:  "Please select from time " 
                };
            }else if((this.state.selectedOutTime.trim() == "") && (pickVal.leaveType == "PERMISSION")){
                return {
                    isValid: false,
                    message:  "Please select to time " 
                };
            }
            else if (this.state.fromDate.trim() == ''  || this.state.fromDate == null ||  this.state.toDate.trim() == '' || this.state.toDate == null) {
                return {
                    isValid: false,
                    message: this.state.fromDate == '' ? " Select from date" : " Select To date"
                };
            } else if (Date.parse(this.state.toDate) < Date.parse(this.state.fromDate)) {
                return {
                    isValid: false,
                    message: "To date must be greater then From date"
                };
            }
            
            else{
                return {
                    isValid: true
                };
            }
        }

        render() {
            
            var value = this.props.taskList;
            var id = this.props.taskId;
            console.log("ID data",id);
            return (
                
                <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
                 
                    <Card padder style={{width:'100%',borderRadius:20,padding:5,marginTop:-35,marginBottom:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress = {()=> this.props.updateValue(id,value)}>
                            {/* <React.Fragment  key={i}> */}
                                <View padder style={{flexDirection: 'row', width: '100%',padding:10,marginTop:10,marginBottom:10}}>
                                    {/* <View style={{ flexDirection:'row',width:'100%'}}> */}
                                    <View style={{width:'20%'}}>
                                        {
                                        value.leaveType == "CL" ?
                                        <CSIcon name={"a6"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                        // <Thumbnail square source={require('../../assets/casual.png')} style={{  height: 40, width: 40 }} />
                                        :
                                        value.leaveType == "ML" ?
                                        <CSIcon name={"a2"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                        // <Thumbnail square source={require('../../assets/sick.png')} style={{ height: 40, width: 40 }} />
                                        :
                                        value.leaveType == "EL" ?
                                        <CSIcon name={"a4"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                        // <Thumbnail square source={require('../../assets/El.png')} style={{ height: 40, width: 40 }} />
                                        :
                                        value.leaveType == "PERMISSION" ?
                                        <CSIcon name={"a7"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                        // <Thumbnail square source={require('../../assets/permission.png')} style={{ height: 40, width: 40 }} />
                                        :
                                        <Text>View</Text>
                                        // <CSIcon name={"a6"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                        // <Thumbnail square source={require('../../assets/casual.png')} style={{  height: 40, width: 40 }} />
                                        }
                                    </View>
                                    <View style={{width:'70%',justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14 ,padding: 2,fontWeight:'bold', color: '#434a54',textTransform:'capitalize' }}>{value.displayLeaveType}</Text>
                                    </View>
                                    {/* </View> */}
                                    <View style={{width:'10%',justifyContent:'center'}}>
                                        { 
                                        !value.IsSelect 
                                            ?
                                            // <View style={{ height:65, borderRadius:10,backgroundColor:'#59b7d3',padding:5, borderWidth:2, marginTop:-35,borderColor:'transparent'}}>
                                            <View style={styles.hourcircle}>
                                                <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:12,marginTop:5}}> {value.YtdDays} </Text>
                                            </View>
                                            : 
                                            // <View style={{ height:65, borderRadius:10,backgroundColor:'#006fb1',padding:5, borderWidth:2, marginTop:-35,borderColor:'transparent'}}>
                                            <View style={styles.hourcircle}>
                                                <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:12,marginTop:5}}> {value.YtdDays} </Text>
                                            </View>
                                        }    
                                    </View>
                                </View>
                                <View style={
                                    value.IsSelect ? 
                                {
                                    height: this.state.layoutHeight,
                                    overflow: 'visible',marginBottom:10}: 
                                    {height: this.state.layoutHeight,
                                    overflow: 'hidden'}}>
                                    <View>
                                        <View style={{ padding:5,flexDirection: 'row',marginTop:15 }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > From Date </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > To Date </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row',}}>
                                            <TouchableOpacity style={{width:'50%',padding:5}}>
                                                <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text> {this.state.fromDate}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> value.leaveType != 'PERMISSION' ? this.toDatepress() : null}>
                                                <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2, borderColor:'transparent'}]}>
                                                    <Text> {this.toDatepressVal(value) }</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        { ((value.leaveType == "CL") || (value.leaveType == "ML") || (value.leaveType == "EL")) && 
                                        
                                        <View>
                                            <View style={{ flexDirection: 'row',marginTop:5 }}>
                                                <View style={{width:'50%',padding:5}}>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Day </Text>
                                                </View>
                                                <View style={{width:'50%',padding:5}}>
                                                { this.state.dateType ?
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Session </Text>
                                                    :
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Day </Text>
                                                }
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row'}}>
                                                <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=>this.RBSheet.open()}>
                                                    <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2, borderColor:'transparent'}]}>
                                                        <Text> {this.state.selectedDay }</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {this.state.selectedDay === 'Half Day'  || !this.state.dateType ?
                                                    <TouchableOpacity style={{width:'50%',padding:5}}  onPress={()=>this.SessionRBSheet.open()}>
                                                        <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2, borderColor:'transparent'}]}>
                                                            <Text> {this.state.selectedSession} </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    
                                                    :

                                                    <TouchableOpacity style={{width:'50%',padding:5}}>
                                                        <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2, borderColor:'transparent'}]}>
                                                            <Text> {this.state.selectedSession} </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        </View>
                                        }
                                        { value.leaveType === 'PERMISSION' && 
                                        // value.leaveType === 'ONDUTY' 
                                            // <View>
                                            //     <View style={{ flexDirection: 'row',marginTop:30 }}>
                                            //         <View style={{flex :0.42}}>
                                            //             <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Day </Text>
                                            //         </View>
                                            //         <View style={{flex :0.6}}>
                                            //             <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Session </Text>
                                            //         </View>
                                            //     </View>
                                            //     <View style={{ flexDirection: 'row',marginTop:5 }}>
                                            //         <TouchableOpacity style={{flex :0.42}} onPress={()=>this.RBSheet.open()}>
                                            //             <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                            //                 <Text> {this.state.selectedDay }</Text>
                                            //             </View>
                                            //         </TouchableOpacity>
                                            //         <TouchableOpacity style={{flex :0.47}} onPress={()=>this.SessionRBSheet.open()}>
                                            //             <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                            //                 <Text> {this.state.selectedSession} </Text>
                                            //             </View>
                                            //         </TouchableOpacity>
                                            //     </View>
                                            // </View>
                                            // :
                                            <View>
                                                <View style={{ flexDirection: 'row',marginTop:10 }}>
                                                    <View style={{width:'50%',padding:5}}>
                                                    { 
                                                        value.leaveType === 'ONDUTY' ?
                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Start Time </Text>
                                                            :
                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > From Time </Text>
                                                    }
                                                    </View>
                                                    <View style={{width:'50%',padding:5}}>
                                                    { 
                                                        value.leaveType === 'ONDUTY' ?    
                                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > End Time </Text>
                                                        :
                                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > To Time </Text>
                                                    }
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row',marginTop:5 }}>
                                                    <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=>this.InTimepress()}>
                                                        <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2,borderColor:'transparent'}]}>
                                                            <Text> {this.state.selectedInTime }</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.OutTimepress() }>
                                                        <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2,borderColor:'transparent'}]}>
                                                            <Text> {this.state.selectedOutTime} </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }
                                        
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,marginTop:10, padding: 10, color: '#000' }}>Emergency Contact Number </Text>
                                        <View style={{flexDirection:'row',width:'97%'}}>
                                            <View style={ value.leaveType =="ML" ? [{width:'80%',marginLeft:5 ,height:45,justifyContent:'center', borderRadius:5,backgroundColor:'#edebeb',borderWidth:2,borderColor:'transparent'}] : [{width:'100%',marginLeft:5 ,height:45,justifyContent:'center', borderRadius:5,backgroundColor:'#edebeb',borderWidth:2,borderColor:'transparent'}]}>
                                                <Input placeholderTextColor='#ccc' style={{ color: '#000'}} maxLength={10} placeholder='contact number' keyboardType='numeric'
                                                        onChangeText={this.onChangeDuration} value={`${this.state.selectedMobileNum}`}
                                                    />
                                            </View>
                                            {
                                                value.leaveType =="ML" &&
                                            <TouchableOpacity onPress={()=> this.loadStorageData()} style={{width:'20%',justifyContent:'center'}}>
                                                <CSIcon name={"Artboard-2"} size={25} color={'#580073'}  style={{alignSelf:'center'}}/>
                                            </TouchableOpacity>
                                            }
                                        </View>
                                        {
                                            this.state.attachmentInfo !== null && 
                                        <TouchableWithoutFeedback onPress = {() => this.attachmentInfoView(this.state.attachmentInfo)}>
                                        <Body >
                                            <Text note style={[styles.bottomPading, { fontSize: 12 }]}>{this.state.attachmentInfo.fname}</Text>
                                        </Body>
                                        </TouchableWithoutFeedback>
                                        }
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,marginTop:10, padding:10, color: '#000' }}>Reason </Text>
                                        <View style={[{width: '97%',marginLeft:5 ,height:60, borderRadius:2,backgroundColor:'#edebeb', borderWidth:2, padding:2, borderColor:'transparent'}]}>
                                        <Textarea rowSpan={2} placeholderTextColor='#ccc'  placeholder="Reason" 
                                            onChangeText={this.onChangeTextArea} 
                                            value={this.state.selectedComments} 
                                            />
                                        </View>
                                    </View>
                                    {/* <View style={{width:200,marginLeft:60,justifyContent:'center',marginTop:20}}> */}
                                        <Button rounded style={{marginTop:20,padding:20,width:230,alignItems:'center',alignSelf:'center',justifyContent:'center',backgroundColor:'#580073'}}
                                        onPress={() => this._saveTaskInfo(value)}
                                        >
                                            {this.state.isLoading ? <ActivityIndicator /> 
                                            : 
                                            value.leaveType != 'PERMISSION' ?
                                            <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}>Apply Leave</Text>
                                            :
                                            <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}>Apply Permission</Text>
                                        }
                                        </Button>
                                    {/* </View> */}
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>  

                    <DateRBSheet
                        ref={ref => {
                            this.DateRBSheet = ref;
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
                        <DateModalView 
                           selectedItem = {this.state.selectedFrom}
                        //    itemList = {this.state.sessionList}
                           onPickerSelect = {this.onfromDateChange.bind(this)}
                           done = {this.fromDateClose.bind(this)}
                        />
                    </DateRBSheet>

                    <ToRBSheet
                        ref={ref => {
                            this.ToRBSheet = ref;
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
                        <DateModalView 
                           selectedItem = {this.state.selectedTo}
                           onPickerSelect = {this.ontoDateChange.bind(this)}
                           done = {this.toDateClose.bind(this)}
                        />
                    </ToRBSheet>

                    <FromTimeRBSheet
                    ref={ref => {
                        this.FromTimeRBSheet = ref;
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
                    <TimeModalView 
                       selectedItem = {this.state.inTime}
                       onPickerSelect = {this.onChangeInTime.bind(this)}
                       done = {this.InTimeClose.bind(this)}
                    />

                    </FromTimeRBSheet>

                    <ToTimeRBSheet
                    ref={ref => {
                        this.ToTimeRBSheet = ref;
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
                    <TimeModalView 
                       selectedItem = {this.state.outTime}
                       onPickerSelect = {this.onChangeOutTime.bind(this)}
                       done = {this.OutTimeClose.bind(this)}
                    />

                    </ToTimeRBSheet>


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
                           selectedItem = {this.state.selectedIndex}
                           itemList = {this.state.dayList}
                           onPickerSelect = {this.onValueChange.bind(this)}
                        />
                    </RBSheet>
                    <SessionRBSheet
                        ref={ref => {
                            this.SessionRBSheet = ref;
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
                           selectedItem = {this.state.sessionIndex}
                           itemList = { this.state.dateType ? this.state.sessionList : this.state.dayList}
                           onPickerSelect = {this.onSessionChange.bind(this)}
                        />
                    </SessionRBSheet>
                    <ToastRej
                        ref={(toastRej) => this.toastRej = toastRej}
                        style={{backgroundColor:'red'}}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={3000}
                        opacity={0.8}
                        textStyle={{color:'white'}}
                        />
                        <ToastAppr
                        ref={(toastAppr) => this.toastAppr = toastAppr}
                        style={{backgroundColor:'green'}}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{color:'white'}}
                        />
                </View>
                
                /* </View> */
            );
        }
    }
    
    const FirstTab = props =>{
        var {stateInfo,leaveTypes,selected,scheduleItems,userInfo} = props
        
        return(
            <ScrollView keyboardShouldPersistTaps={'handled'}>{
                leaveTypes.length > 0 ?
                <View style={{marginBottom:150}}>
                    <View style={{width:SCREEN_WIDTH,marginTop:50}}>
                        {
                            leaveTypes.length > 0 &&
                            leaveTypes.map((item,key)=>(
                                <ExpandableComponent 
                                    taskList= {item}
                                    taskId = {key} 
                                    dateInfo = {selected}
                                    updateValue = {props.updateValue}
                                    refreshScreen = {props.refreshScreen}
                                />
                            ))
                        }
                    </View>
                    <View style={{width:SCREEN_WIDTH,marginTop:10,padding:10}}>
                    {    
                        scheduleItems.length > 0 &&
                        scheduleItems.map((item,key)=>(
                        <Card padder style={{width:'100%',borderRadius:20,padding:10,marginBottom:5}}>
                            <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress = {()=> props.entryEdit(item,true)}>
                                <View  style={{flexDirection: 'row',width:'100%'}}>
                                    <View style={{width:'20%',padding:5,justifyContent:'center'}}>
                                        {
                                            Validate.isNotNull(userInfo.employeeImageUri)
                                            ?
                                            <View  style={(item.displayStatus === "Manual Entry" || item.displayStatus === "Leave Approved") ? styles.approveCircle 
                                                : (item.displayStatus === "Request Approval" ) ? styles.requestCircle : (item.displayStatus === "Request Cancelled") ? styles.cancelCircle 
                                                : (item.displayStatus === "Request Rejected" ) ? styles.rejectCircle : styles.cancelCircle}>
                                            <Thumbnail  circular  source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} style={{width:52,height:52}} />
                                            </View>
                                            :
                                            <View style={(item.displayStatus === "Manual Entry" || item.displayStatus === "Leave Approved") ? styles.approveCircle 
                                            : (item.displayStatus === "Request Approval" ) ? styles.requestCircle : (item.displayStatus === "Request Cancelled") ? styles.cancelCircle 
                                            : (item.displayStatus === "Request Rejected" ) ? styles.rejectCircle : styles.cancelCircle}>
                                            <Thumbnail style={{justifyContent:'center',margin:2}} circular  source={require('../../assets/avatar.png')} style={{width:50,height:50}} />
                                            </View>
                                        }
                                    </View>
                                    <View style={{width:'60%',padding:5}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14 ,padding: 2,fontWeight:'bold', color: '#434a54', textTransform:'capitalize' }}>{item.displayLeaveType} </Text>
                                            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14 ,padding: 2,fontWeight:'bold', color: '#434a54' }}> (Feb 14) </Text> */}
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12 ,padding: 2,fontWeight:'500', color: '#ccc' }}> {item.reason}  </Text>
                                        <View style={{flexDirection: 'row',marginTop:5}}>
                                            <View style={[{minWidth:40,maxWidth:140, height:35, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                            { item.inputLeaveType == "PERMISSION" ? 
                                            <Text style={{color:'#580073',textAlign:'center',fontSize:10}}> {item.leaveDuration} Hours </Text> 
                                            :    
                                            <Text style={{color:'#580073',textAlign:'center',fontSize:10}}> {item.leaveDuration} Day </Text>
                                            }
                                            </View>
                                            <View style={[{minWidth:40,maxWidth:140, height:35, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                <Text style={{color:'#580073',textAlign:'center',fontSize:10}}> {item.phoneNo} </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* </View> */}
                                    <View style={{width:'20%',padding:5,justifyContent:'center'}}>
                                    {
                                    item.inputLeaveType == "CL" ?
                                    <CSIcon name={"a6"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    // <Thumbnail square source={require('../../assets/casual.png')} style={{  height: 40, width: 40 }} />
                                    :
                                    item.inputLeaveType == "ML" ?
                                    <CSIcon name={"a2"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    // <Thumbnail square source={require('../../assets/sick.png')} style={{ height: 40, width: 40 }} />
                                    :
                                    item.inputLeaveType == "EL" ?
                                    <CSIcon name={"a4"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    // <Thumbnail square source={require('../../assets/El.png')} style={{ height: 40, width: 40 }} />
                                    :
                                    item.inputLeaveType == "PERMISSION" ?
                                    <CSIcon name={"a7"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    // <Thumbnail square source={require('../../assets/permission.png')} style={{ height: 40, width: 40 }} />
                                    :
                                    <CSIcon name={"a6"} size={40} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    // <Thumbnail square source={require('../../assets/casual.png')} style={{  height: 40, width: 40 }} />
                                    }
                                    </View>
                                </View>
                                </TouchableOpacity>
                            </CardItem>    
                        </Card>
                        ))
                    }
                    </View>
                </View>
                :
                <NoRecordsFound/>
                }
            </ScrollView>
        )
    }


const TeamTab = props => {
    var {leaveApprovalList} = props;
    return(
       <ScrollView keyboardShouldPersistTaps={'handled'}>
       <View style={{width:SCREEN_WIDTH,marginTop:20}}>
       {
       leaveApprovalList.length > 0 ?
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
                   data ={leaveApprovalList}
                   rightOpenValue={-130} 
                   disableRightSwipe={true} 
                   disableLeftSwipe={true}
                   renderItem = {props.renderItem}
                //    renderHiddenItem = {props.renderHiddenItem}
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
    

 const VisibleItem = props =>{
    var {data,onReject,onApprove,onAttachmentView} = props;

   var screen = Dimensions.get('window');
   console.log("Approval List ", data)
    return(
        <View style={{padding:10}}>
           <Card padder style={{width:'100%',borderRadius:15,padding:5}}>
                   <CardItem cardBody>
           {/* <TouchableWithoutFeedback > */}
               {/* <View style={styles.standaloneRowFront}> */}
                   <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: screen.width }}>
                       <View style={  styles.header}>
                           {/* <Text style={styles.hours}> 
                           {data.item.employeeName}
                           </Text> */}
                           {
                            Validate.isNotNull(data.item.images) ?
                            <View>   
                                <Thumbnail circular  source={{uri:'data:image/png;base64,'+data.item.images}} style={{width:60,height:60}} />
                                <View style={{minWidth:25,minHeight:25,backgroundColor:"#f4ebf9",borderRadius:15,position:"absolute",alignItems:'center',justifyContent:'center',right:2,top:2}}><Text style={{fontSize:12,color:"#000",fontWeight:'bold',textAlign:'center',marginTop:2 }}>{data.item.noOfDays.split(":")[0]}</Text></View>
                            </View>   
                            :
                            <View>   
                                <Thumbnail circular  source={require('../../assets/avatar.png')} style={{width:60,height:60}} />
                                <View style={{minWidth:25,minHeight:25,backgroundColor:"#f4ebf9",borderRadius:15,position:"absolute",alignItems:'center',justifyContent:'center',right:2,top:2}}><Text style={{fontSize:12,color:"#000",fontWeight:'bold',textAlign:'center',marginTop:2 }}>{data.item.noOfDays.split(":")[0]}</Text></View>
                            </View>
                           }
                           <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hours}> 
                           {data.item.employeeName}
                           </Text>
                        </View>
                       <View style={{flexDirection: 'column',width:'80%',}}>
                           <View  style={ styles.content }>
                                <View style={{ width: '70%',  flexDirection: 'column' }}>
                                    {data.item.Attachments.length > 0 ?
                                    <View style={{ustifyContent:'center',flexDirection:'row'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ width:'80%',fontSize: 14, margin: 2,textAlign: 'left',color: '#7666fe',textTransform:'capitalize' }}> {data.item.displayLeaveType} </Text>
                                        <TouchableOpacity onPress={onAttachmentView} style={{width:'20%',justifyContent:'center'}}>
                                                <CSIcon name={"Artboard-2"} size={20} color={'#580073'}  style={{alignSelf:'center'}}/>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize: 14, margin: 2,textAlign: 'left',color: '#7666fe',textTransform:'capitalize' }}> {data.item.displayLeaveType} </Text>
                                    }
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {data.item.leaveFromDate} to {data.item.leaveToDate}</Text>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{data.item.leaveRemarks} </Text>
                                    <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f1efff', borderWidth:2,borderColor:'transparent'}]}>
                                        <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> {data.item.PhoneNumber} </Text>
                                    </View>
                                </View>
                                <View style={{width:'30%',justifyContent:'center',flexDirection:'row'}}>
                                    <TouchableOpacity disabled={data.item.IsSuccess !== '' ? true : false } style={{width:'50%',justifyContent:'center'}} transparent  onPress={onReject} >
                                        <View >
                                            <CSIcon name={"Artboard-2-copy-3"} size={20} color={'red'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity transparent disabled={data.item.IsSuccess !== '' ? true : false } style={{width:'50%',justifyContent:'center'}} transparent onPress={onApprove} >
                                        <View>
                                            <CSIcon name={"Artboard-2-copy-2"} size={20} color={'#00c853'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                           </View>
                       </View>
                   </View>
               {/* </View> */}
           {/* </TouchableWithoutFeedback> */}
           </CardItem>
           </Card>
       </View>
    )
}


const HiddenItemWithAction =  props => {

    var {onApprove,onReject,data} = props
    return(
        <View style={styles.standaloneRowBack} icon>
                                      
            <TouchableOpacity  transparent style={styles.rejectButton} onPress={onReject} >
                <View>
                    {/* <Icon iconLeft style={{ color: '#fff' }} type="Feather" name="check" /> */}
                    <CSIcon name={"Artboard-18"} size={30} color={'#fff'}  style={{justifyContent:'center',alignItems:'center'}}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.approveButton } onPress={onApprove} >
                <View>
                    {/* <Icon iconLeft style={{ color: '#fff' }} type="AntDesign" name="close" /> */}
                    <CSIcon name={"Artboard-17"} size={30} color={'#fff'}  style={{justifyContent:'center',alignItems:'center'}}/>
                </View>
            </TouchableOpacity>
            
        </View>
    )
 }

class Leave extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            pickerValue : undefined,
            leaveTypes : [],
            selected: this.ChangeDate(new Date()),
            scheduleItems: [],
            markedDateinfo: [],
            sessionData : '',
            userInfo : {},
            isCancelEntry: false,
            cancelEntryInfo : {},
            cancelReason : '',
            index: 0,
            myDate : new Date(),
            route : [
                { key: 'first', title: 'User' },
                { key: 'second', title: 'Team' },
            ],
            leaveApprovalList: [],
            calData :[],
            showMonthHead: true,
            showRejectionview :false,
            isLoading:false,
            isMyLoading:false,
            isTeamLoading:false,
            // data: DATA
        }
        this.updateLayout = this.updateLayout.bind(this);
        this.entryEdit = this.entryEdit.bind(this);
        this.onChangeData = this.onChangeData.bind(this);
        this.cancelInfoCall = this.cancelInfoCall.bind(this);
        this.refreshScreen = this.refreshScreen.bind(this);
    }

    async componentDidMount() {
        var tabdata = [];
        var {selected} = this.state;
        // var MailID = await AsyncStorage.getItem('loginEmail')
        var seessionKey = await AsyncStorage.getItem('sessionKey');
        let UserInfo = await AsyncStorage.getItem('userInfo');
        var isNotification = this.props.navigation.getParam("filterType") == "Request_notification" ? true : false;
        console.log("isNotification",this.props.navigation.getParam("filterType"));
        let login = JSON.parse(UserInfo)
        tabdata =  [{ key: 'first', title: login.userName},{ key: 'second', title: 'Team' }]
        var changedIndex = isNotification ? 1 : 0;
        this.setState({
            sessionData: seessionKey,
            selected,
            route: tabdata,
            userInfo : JSON.parse(UserInfo),
            index : changedIndex,
        }, () => {
            this.GetleaveType(seessionKey,selected);
            this.GetLeavesummaryData(selected);
        })
    }

    GetleaveType(sessionData,date){

        var leaveval = [];
        var calinfo = [];

        this.setState({
            leaveTypes: [],
            isMyLoading: true,
        })

        Api.LeaveTypes(sessionData, function(response){
            if (response.success) {
                if (response.data.length > 0) {
                    console.log("LeaveTypes Response", response);
                    for(let i = 0; i< response.data.length;i++){
                        response.data[i]['IsSelect'] = false;
                    }
                    leaveval = response.data;
                    calinfo[date] = response.data;
                    console.log("response Tab",leaveval,"calData",calinfo[date])
                }else{
                    leaveval = [];
                    calinfo[date] = [];
                }
                this.setState({
                    leaveTypes: leaveval,
                    isMyLoading: false,
                    calData : calinfo
                },()=>{
                    this.GetLeaveList(date)
                })
            }else{
                calinfo[date] = [];
                this.setState({
                    leaveTypes: leaveval,
                    calData : calinfo,
                    isMyLoading: false,
                },()=>{
                    this.GetLeaveList(date)
                })
            }
        //  let natureofWorkData = [
        //     {
        //         leaveType : 'CL',
        //         displayLeaveType : 'CASUAL LEAVE',
        //         YtdDays : "24",
        //         IsSelect : false
        //     },
        //     {
        //         leaveType : 'ML',
        //         displayLeaveType : 'MEDICAL LEAVE',
        //         YtdDays : "14",
        //         IsSelect : false
        //     },
        //     {
        //         leaveType : 'PERMISSION',
        //         displayLeaveType : 'PERMISSION',
        //         YtdDays : "20",
        //         IsSelect : false
        //     },
        //     {
        //         leaveType : 'ONDUTY',
        //         displayLeaveType : 'ONDUTY',
        //         YtdDays : "0",
        //         IsSelect : false
        //     }
        // ]
            
        }.bind(this))
    }

    updateLayout = (index,value) => {
        
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        console.log("Is update click",[...this.state.leaveTypes],"Index",index)
        const array = [...this.state.leaveTypes];
        
        array.map((value, placeindex) =>
          placeindex === index
            ? (array[placeindex]['IsSelect'] = !array[placeindex]['IsSelect'])
            : (array[placeindex]['IsSelect'] = false)
        );
        this.setState(() => {
          return {
            leaveTypes: array,
          };
        });
        // this.natureofWorkdata(array[index]['TASK_ID'])
      };

      GetApprovalLeaveList(selectedDate){
        var PayloadData = {
            sessionKey : this.state.sessionData,
            startDate: selectedDate,
            endDate: selectedDate,
        }
        this.setState({
            leaveApprovalList: [],
            isMyLoading: true,
        })
        Api.LeaveapprovalList(PayloadData,function(response){
            let approval_list = [];
            var calinfo = [];
            if(response.success){
                if(response.data.length > 0){
                    
                    for(let i=0;i<response.data.length;i++){
                        for(let j=0;j<response.data[i].LeaveDetails.length;j++){
                            response.data[i].LeaveDetails[j]['IsSelect']= true;
                            response.data[i].LeaveDetails[j]['IsSuccess'] = '';
                            response.data[i].LeaveDetails[j]['Message'] = '';
                            response.data[i].LeaveDetails[j]['key'] = `${j}`;
                            response.data[i].LeaveDetails[j]['images'] = response.data[i].EmployeeImageURI;
                        }
                    }
                    for(let i=0;i<response.data.length;i++){
                        approval_list = response.data[i].LeaveDetails;
                        if(this.state.calData.length == 0){
                            calinfo[selectedDate] = response.data[i].LeaveDetails
                        }
                    }
                    console.log("Approval response LeaveDetails",approval_list,"Call info",calinfo[selectedDate]);
                    if(this.state.calData.length == 0){
                        this.setState({
                            leaveApprovalList : approval_list,
                            calData : calinfo,
                            isMyLoading: false,
                        })
                    }else{
                        this.setState({
                            leaveApprovalList : approval_list,
                            isMyLoading: false,
                        })
                    }
                }
                this.setState({
                    isMyLoading: false,
                })
            }
            else{
                console.log("error Response")
                this.setState({
                    isMyLoading: false,
                })
            }
        }.bind(this))
      }

      GetLeaveList(selectedDate) {

        console.log("change Data: ", this.ChangeDate(selectedDate));
        this.setState({
            scheduleItems: [],
            isMyLoading: true,
        })
        var TimesheetList = {
            sessionKey : this.state.sessionData,
            startDate: selectedDate,
            endDate:selectedDate,
            employeeId:this.state.userInfo.employeeId
        }
        console.log("Leave list Data: ", TimesheetList);
        Api.LeaveEntryList(TimesheetList, function (response) {
            console.log("Leave list Response", response.data);
            var items = [];
            if (response.success) {
                if (response.data.length > 0) {
                    items = response.data
                }
                else {
                    items = [];
                    console.log("Item datas empty", items);
                }
                this.setState({
                    scheduleItems: items,
                    selected: selectedDate,
                    isMyLoading: false,
                },()=>{
                    this.GetApprovalLeaveList(selectedDate);
                })
            }
            else {
                // this.props.navigation.navigate('Auth');
                items = [];
                this.setState({
                    scheduleItems: items,
                    selected : selectedDate,
                    isMyLoading: false,
                },()=>{
                    this.GetApprovalLeaveList(selectedDate);
                })
                console.log("Final Else condition", items);
            }
            console.log("Leave list",this.state.scheduleItems)
        }.bind(this))
    }
    
    GetLeavesummaryData( selectedDate) {
        console.log("change Data: ", this.ChangeDate(selectedDate));
        var TimesheetList = {
            sessionKey : this.state.sessionData,
            startDate: this.getDateOfPastYear(),
            endDate:this.getDateOfNextYear(),
            usersID:""
        }
       
        console.log("Leave summary Data: ", TimesheetList);
        Api.LeaveEntrySummary(TimesheetList, function (response) {
            console.log("Leave entry summary Response", response);
            var items = [];
            if (response.success) {
                if (response.data.length > 0) {
                    let data = response.data;
                    var markedDates = [];
                    var DatesList;
                    if(data.length > 0){
                        for (let i = 0; i < data.length; i++) {
                            var markedval = {
                                date:'',
                                dots:[]
                            }
                            if (data[i]["lineStatus"] == "MULTIPLE") {
                                markedval.date = this.MarkedDatePass(data[i]['requestedDate'].toString())
                                markedval.dots = [{
                                        color: '#ffff00',
                                selectedColor:'#ffff00'
                                }]
                            }
                            else if (data[i]["lineStatus"] == "Request Approval") {
                                markedval.date = this.MarkedDatePass(data[i]['requestedDate'].toString())
                                markedval.dots = [{
                                        color: '#ffa500',
                                selectedColor:'#ffa500'
                                }]
                            }
                            else if (data[i]["lineStatus"] == "Leave Approved") {
                                markedval.date = this.MarkedDatePass(data[i]['requestedDate'].toString())
                                markedval.dots = [{
                                    color: 'green',
                                    selectedColor:'green'
                                }]
                            }else if ((data[i]["lineStatus"] == "Request Cancelled")
                                ||  (data[i]["lineStatus"] == "Request Rejected")) {
                                markedval.date = this.MarkedDatePass(data[i]['requestedDate'].toString())
                                markedval.dots = [{
                                    color: 'red',
                                    selectedColor:'red'
                                }]
                            }
                            markedDates.push(markedval)
                        }
                    }
                    items = response.data

                    this.setState({
                        markedDateinfo: markedDates,
                    })
                }
                else {
                    items = [];
                    console.log("Item datas empty", items);

                }
                // this.setState({
                //     scheduleItems: items,
                //     selectDate: selectedDate
                // })
            }
            else {
                // this.props.navigation.navigate('Auth');
                items = [];
                // this.setState({
                //     scheduleItems: items,
                //     selected : selectedDate
                // })
                console.log("Final Else condition", items);
            }
        }.bind(this))
    }

    refreshScreen = ()=> {
        var {sessionData,selected} = this.state;
        var selectedDate = this.ChangeDate(selected);
        // this.setState({
        //   selected: this.ChangeDate(selectedDate),
        //   leaveTypes:[],
        //   scheduleItems: [],
        //   leaveApprovalList: [],
          
        // });
        // console.log()
        this.GetleaveType(sessionData,selectedDate);
        this.GetLeavesummaryData(selectedDate);
    }

    handleChange(index) { 
        var datestr = "";
        // var datestr = new Date(index.dateString);
        var datestr = new Date(index._d)
        console.log("Date values",datestr)
        var {sessionData} = this.state;
        var selectedDate = this.ChangeDate(datestr);
        console.log("New Date",this.ChangeDate(datestr));
        this.setState({
          selected: this.ChangeDate(datestr),
          myDate : index,
          leaveTypes:[],
          scheduleItems: [],
          leaveApprovalList: [],
        },()=>{
            this.GetleaveType(sessionData,selectedDate);
            this.GetLeavesummaryData( selectedDate);
        });
      };

    MarkedDatePass(StringDate) {
        var d = new Date(StringDate);
        var beforeChange = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + d.getDate()).slice(-2).toString();
        return beforeChange;
    }

    ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = ("0" + (d.getDate().toString())).slice(-2).toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    ChangeDate(selectedDate){
        var d = new Date(selectedDate);
        var timeToString = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + (d.getDate().toString())).slice(-2).toString();
        return timeToString;
    }

    getDateOfPastYear() {
        var d = new Date();
        var pastYear = d.getFullYear() - 1;
        d.setFullYear(pastYear);
        var timeToString = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + (d.getDate().toString())).slice(-2).toString();;
        return timeToString;
    }

    getDateOfNextYear() {
        var d = new Date();
        var pastYear = d.getFullYear();
        d.setFullYear(pastYear);
        var timeToString = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + (d.getDate().toString())).slice(-2).toString();;
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

        console.log("values of map: ",rowMap,"key: ",key,"item: ",item)
        // for(let i = 0;i<item.length ; i++){
            var payload = {
                sessionKey : this.state.sessionData,
                employeeId: item.employeeId,
                leaveType: item.leaveType,
                leaveTypeId: item.leaveTypeId,
                leaveRequestId: item.leaveRequestId,
                leaveFromDate: item.leaveFromDate,
                leaveToDate: item.leaveToDate,
            }
            this.setState({
                isMyLoading: true
            })
            Api.ApproveLeave(payload,function(response){
                if (response.success) {
                    // if (response.data.length > 0) {
                        this.deleteRow(rowMap,key,item)
                        // CommonData.toastSuccessAlert("Leave is successfully approved")
                        item.leaveType != "PERMISSION" ? this.toastAppr.show("Leave is successfully approved") : this.toastAppr.show("Permission is successfully approved")
                        this.refreshScreen();
                        this.setState({
                            isMyLoading : false,
                        })
                    // }
                }else{
                    // CommonData.toastFailureAlert(response.errorMessage);
                    this.toastRej.show(response.errorMessage);
                    this.setState({
                        isMyLoading : false,
                    })
                }
            }.bind(this))
        // }
    }


    rejectService =(item) => {
        
            var payload = {
                sessionKey : this.state.sessionData,
                employeeId: item.employeeId,
                leaveType: item.leaveType,
                leaveTypeId: item.leaveTypeId,
                leaveRequestId: item.leaveRequestId,
                leaveFromDate: item.leaveFromDate,
                leaveToDate: item.leaveToDate,
            }
            
            this.setState({
                isMyLoading: true
            })
            console.log("Reject Values",payload)
            Api.RejectLeave(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        this.deleteRow(this.state.rowMap,this.state.key,item)   
                            // this.setState({
                            //     scheduleItems: updatedQuotes,
                            //     showRejectionview: false,
                            // })
                            this.refreshScreen();
                            this.setState({
                                isMyLoading : false,
                                showRejectionview: false,
                            })
                        // CommonData.toastSuccessAlert(" Leave is Rejected!")
                        this.toastAppr.show("Leave is successfully Rejected")
                    }
                }else{
                    this.setState({
                        isMyLoading : false,
                        showRejectionview: false,
                    })
                }
                
            }.bind(this))
        // }
    }


    entryEdit(item,isVisible){
        console.log("cancel edit",item,isVisible);
        if(item !== ""){
            if(item.displayStatus ==="Request Approval"){
                this.setState({
                    isCancelEntry: isVisible,
                    cancelEntryInfo : item,
                })
            }
        }else{
            this.setState({
                isCancelEntry: isVisible,
                cancelEntryInfo : item,
            })
        }
        
    }

    onChangeData(Data){
        this.setState({
            cancelReason: Data
        })
    }

    showrejectionModal(rowMap,key,item,Isvisible){

        this.setState({
            showRejectionview: Isvisible,
            typeReject : item,
            rowMap : rowMap,
            key : key
        })
    }

    cancelInfoCall(){
        let {cancelEntryInfo} = this.state;
        console.log("cancel data ",cancelEntryInfo);
        var LeaveEntry = {
            employeeId: cancelEntryInfo.employeeId,
            leaveDuration: cancelEntryInfo.leaveDuration,
            leaveAppliedDate: cancelEntryInfo.leaveAppliedDate,
            displayLeaveType: cancelEntryInfo.displayLeaveType,
            displayStatus: cancelEntryInfo.displayStatus,
            fromTime: cancelEntryInfo.fromTime,
            toTime: cancelEntryInfo.toTime,
            reason: cancelEntryInfo.reason,
            fromDate: cancelEntryInfo.fromDate,
            toDate: cancelEntryInfo.toDate,
            inputLeaveType: cancelEntryInfo.inputLeaveType,
            leaveTypeId:cancelEntryInfo.leaveTypeId,
            session: cancelEntryInfo.session,
            nullifyRemark: this.state.cancelReason,
            periodStartDate: cancelEntryInfo.periodStartDate,
            periodEndDate: cancelEntryInfo.periodEndDate,
            phoneNo: cancelEntryInfo.phoneNo,
            status: cancelEntryInfo.status,
            DisplayCancelButtonFlag: cancelEntryInfo.DisplayCancelButtonFlag,
            lineWhoColumn: cancelEntryInfo.lineWhoColumn,
            inputLeavedetailId: cancelEntryInfo.inputLeavedetailId,
            sessionKey : this.state.sessionData,
            attachArray:  this.state.fileData
          }

          console.log("Cancel entry info",LeaveEntry);
        Api.LeavecancelSave(LeaveEntry,function (response) {
            console.log("Leave entry Cancel list Response", response);
                var items = [];
                if (response.success) {
                    // CommonData.toastWarningAlert(response.data);
                    this.toastRej.show(response.data);
                    console.log("Leave entry save",response)
                        this.setState({
                            isCancelEntry: false,
                            cancelEntryInfo : "",
                        })
                        // this.componentDidMount()
                }else{
                    // CommonData.toastWarningAlert(response.errorMessage)
                    this.toastRej.show(response.errorMessage);
                }
        }.bind(this))
    }

    fetchAttachmentInfo(fileInfo){

        var payload = {
            sessionKey: this.state.sessionData,
            fileName: fileInfo.Attachments[0].fileName
        }

        Api.FetchAttachment(payload,function(response){
            if (response.success) {
                var result = response.data;
                var path = RNFS.DocumentDirectoryPath +"/"+ result.fname;
                // write the file
                RNFS.writeFile(path, result.fileContent, 'base64')
                .then((success) => {
                    this.setState({
                        isIndicate : false
                    },()=>{
                        FileViewer.open(path)
                        .then(() => {
                            // success
                        })
                        .catch(error => {
                            // error
                            Validate.toastAlert(error.message)
                        });
                    })
                })
                .catch((err) => {
                    this.setState({
                        isIndicate : false
                    })
                    Validate.toastAlert(err.message)
                });   
            }
            else {
                this.setState({
                    isIndicate : false
                },()=>{
                    Validate.toastAlert(response.errorMessage);
                })
                
            }
        }.bind(this))
    }


    renderItem = (data,rowMap) => {
        console.log("data info",data)
        return <VisibleItem 
        data = {data}
        onAttachmentView ={()=>this.fetchAttachmentInfo(data.item)}
        onApprove ={()=>this.approveService(rowMap,data.item.key,data.item)}
        onReject ={()=>this.showrejectionModal(rowMap,data.item.key,data.item,true)}
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
        const newData = [...this.state.leaveApprovalList];
        const prevIndex = this.state.leaveApprovalList.findIndex(item => item.key === rowKey ) 
        newData.splice(prevIndex,1);
        this.setState({
            leaveApprovalList : newData
        })
    }

    renderHiddenItem = (data,rowMap) =>{
        console.log("data key",data.item.key,"rowMap",rowMap)
        return <HiddenItemWithAction
        data = {data}
        rowMap ={rowMap}
        onApprove ={()=>this.approveService(rowMap,data.item.key,data.item)}
        onReject ={()=>this.showrejectionModal(rowMap,data.item.key,data.item,true)}
        />
    }

    renderScene = ({ route, data}) => {
        switch (route.key) {
            case 'first':
            return (
                <View>
                    {
                    this.state.isMyLoading 
                    ?
                        <View style={styles.loading}>
                            <ActivityIndicator size='large' />
                        </View>
                    :
                        <FirstTab  
                        dateInfo = {this.state.selected}
                        leaveTypes = {this.state.leaveTypes}
                        selected = {this.state.selected}
                        scheduleItems = {this.state.scheduleItems}
                        userInfo = {this.state.userInfo}
                        stateInfo = {this.state}
                        updateValue = {this.updateLayout}
                        entryEdit = {this.entryEdit}
                        refreshScreen = {this.refreshScreen}
                        />
                    }
                </View>
            )
            case 'second':
            return (
                <View>
                    {
                    this.state.isMyLoading 
                    ?
                        <View style={styles.loading}>
                            <ActivityIndicator size='large' />
                        </View>
                    :
                        <TeamTab 
                        leaveApprovalList = {this.state.leaveApprovalList}
                        renderItem = {this.renderItem}
                        // renderHiddenItem = {this.renderHiddenItem}
                        />
                    }
                </View>
            )
        }
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

    onCalendarToggled() {
        this.setState({
            showMonthHead: false
        })
    }

    render(){


        let datesWhitelist = [{
            start: moment(),
            end: moment().add(6, 'days')  // total 4 days enabled
          }];
          let datesBlacklist = [ moment().add(1, 'days') ]; // 1 day disabled

          var {selected,scheduleItems,userInfo,index,route,calData,myDate,leaveTypes} = this.state;

        return(

            <Container >
                <Header  style={{ backgroundColor: 'white' }}>
                    <Left>
                        <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} />
                    </Left>
                    <Body>
                        <HeaderTitle title="Leave" />
                    </Body>
                    <Right>
                    {/* <CustomMenuIcon
                        menutext="Menu"
                        menustyle={{
                            marginRight: 10,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}
                        textStyle={{
                            color: 'white',
                        }}
                        option1Click={() => this.props.navigation.navigate('Settings')}
                        option2Click={() => this.props.navigation.navigate('Auth')}
                        employeeUrl = {this.state.userInfo.employeeImageUri}
                    /> */}
                        {
                                Validate.isNotNull(this.state.userInfo.employeeImageUri)
                                ?
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"Leave"})}>
                                    <Thumbnail square large source={{ uri: 'data:image/png;base64,' + this.state.userInfo.employeeImageUri}} style={{ borderRadius: 50, height: 40, width: 40 }} />
                                </TouchableOpacity>
                                    :
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"Leave"})}>
                                    <Thumbnail square large source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 40, width: 40 }} />
                                </TouchableOpacity>
                        }
                    </Right>
                </Header>

                {/* <Agenda
                    horizontal={true}
                    items={calData}
                    onDayPress={this.handleChange.bind(this)}
                    selected={myDate}
                    renderItem={this.renderAgenda.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    renderDay={this.renderDay.bind(this)}
                    // theme={{ backgroundColor: '#fff', agendaKnobColor: '#580073' }}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    hideKnob={false}
                    onCalendarToggled={this.onCalendarToggled.bind(this)}
                    theme={{backgroundColor: '#fff', agendaKnobColor: '#580073',
                        'stylesheet.calendar.header': { week: { marginTop: Platform.OS=='ios'?6:2, flexDirection: 'row', justifyContent: 'space-between' } }
                    }}

                /> */}
                    
                    <CalendarStrip
                        scrollable
                        calendarAnimation={{type: 'sequence', duration: 30}}
                        daySelectionAnimation={{type: 'border', duration: 200,borderWidth: 1, borderHighlightColor: '#ccc' }}
                        style={{height: 100, paddingTop: 20, paddingBottom: 10}}
                        calendarHeaderStyle={{color: 'black'}}
                        calendarColor={'transparent'}
                        dateNumberStyle={{color: 'black'}}
                        selectedDate = {this.state.myDate}
                        onDateSelected = {(date) =>this.handleChange(date)}
                        dateNameStyle={{color: 'black'}}
                        highlightDateNumberStyle={{color: '#580073'}}
                        highlightDateNameStyle={{color: '#580073'}}
                        disabledDateNameStyle={{color: 'grey'}}
                        disabledDateNumberStyle={{color: 'grey'}}
                        iconContainer={{flex: 0.1}}
                        markedDates = {this.state.markedDateinfo}
                    />
                
                    <View padder style={{ borderBottomWidth: .5, borderBottomColor: '#ccc', width: '100%', height: '100%', flexDirection: 'column' }}>
                        <TabView
                            navigationState={{index: this.state.index, routes: this.state.route}}
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
                        />
                    </View>
                     
                    {/* <ScrollView> */}
                        {/* {this.renderDateItem(scheduleItems)} */}
                        {/* <View style={{width:SCREEN_WIDTH,marginTop:50}}>
                            {
                                this.state.leaveTypes.length > 0 &&
                                this.state.leaveTypes.map((item,key)=>(
                                    <ExpandableComponent 
                                        taskList= {item} 
                                        updateValue = {this.updateLayout.bind(this,key)}
                                        dateInfo = {this.state.selected}
                                        // refreshScreen = {this.refreshScreen.bind(this)}
                                    />
                                ))
                            }
                        </View> */}
                        {/* <View  style={{flexDirection: 'row',flex:1, width: SCREEN_WIDTH,padding:20}}>
                            <TouchableOpacity>   
                                <Thumbnail  source={require('../../assets/casual.png')} style={{ marginRight:20, borderRadius: 30, height: 50, width: 40 }} />
                                <Text style={{textAlign:'center'}}>ME</Text>
                            </TouchableOpacity>
                            <View style={{margin:5, backgroundColor:'#ccc', width:2, height:35}}></View>
                            <TouchableOpacity >
                                <Thumbnail  source={require('../../assets/casual.png')} style={{ marginLeft:20, borderRadius: 30, height: 50, width: 40 }} />
                                <Text style={{textAlign:'center'}}>My Team</Text>
                            </TouchableOpacity>
                        </View> */}

                        {/* {    
                            scheduleItems.length > 0 &&
                            scheduleItems.map((item,key)=>(
                            <Card padder style={{width:SCREEN_WIDTH-30,marginLeft:15,borderRadius:5}}>
                                <CardItem style={{margin:5,marginRight:5}}>
                                <TouchableOpacity activeOpacity={0.8} onPress = {()=> this.entryEdit(item,true)}>
                                    <View  style={{flexDirection: 'row',flex:1,width:SCREEN_WIDTH-30}}>
                                        <View style={{ flexDirection:'row',width:'100%'}}/>
                                        <View style={{flex:.2,marginRight:5}}>
                                        {
                                                Validate.isNotNull(userInfo.employeeImageUri)
                                                ?
                                                <View  style={(item.displayStatus === "Manual Entry" || item.displayStatus === "Leave Approved") ? styles.approveCircle 
                                                    : (item.displayStatus === "Request Approval" ) ? styles.requestCircle : (item.displayStatus === "Request Cancelled") ? styles.cancelCircle 
                                                    : (item.displayStatus === "Request Rejected" ) ? styles.rejectCircle : styles.cancelCircle}>
                                                <Thumbnail  circular  source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} style={{width:52,height:52}} />
                                                </View>
                                                :
                                                <View style={(item.displayStatus === "Manual Entry" || item.displayStatus === "Leave Approved") ? styles.approveCircle 
                                                : (item.displayStatus === "Request Approval" ) ? styles.requestCircle : (item.displayStatus === "Request Cancelled") ? styles.cancelCircle 
                                                : (item.displayStatus === "Request Rejected" ) ? styles.rejectCircle : styles.cancelCircle}>
                                                <Thumbnail style={{justifyContent:'center',margin:2}} circular  source={require('../../assets/avatar.png')} style={{width:50,height:50}} />
                                                </View>
                                            }
                                        </View>
                                        <View style={{flex:.7,margintop:5}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14 ,padding: 2,fontWeight:'bold', color: '#434a54' }}>{item.displayLeaveType} </Text>
                                                //  <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14 ,padding: 2,fontWeight:'bold', color: '#434a54' }}> (Feb 14) </Text> 
                                            </View>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12 ,padding: 2,fontWeight:'500', color: '#ccc' }}> {item.reason}  </Text>
                                            <View style={{flexDirection: 'row',marginTop:5}}>
                                                <View style={[{minWidth:40,maxWidth:140, height:25,marginRight:10, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text style={{color:'#580073',textAlign:'center',fontSize:10}}> {item.leaveDuration} Day </Text>
                                                </View>
                                                <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text style={{color:'#580073',textAlign:'center',fontSize:10}}> {item.phoneNo} </Text>
                                                </View>
                                            </View>
                                        </View>
                                        //  </View> 
                                        <View style={{flex:.2,justifyContent:'flex-start'}}>
                                        {
                                        item.inputLeaveType == "CL" ?
                                        <Thumbnail square source={require('../../assets/casual.png')} style={{ borderRadius: 30, height: 50, width: 40 }} />
                                        :
                                        item.inputLeaveType == "ML" ?
                                        <Thumbnail square source={require('../../assets/sick.png')} style={{ borderRadius: 30, height: 50, width: 40 }} />
                                        :
                                        item.inputLeaveType == "EL" ?
                                        <Thumbnail square source={require('../../assets/El.png')} style={{ borderRadius: 30, height: 50, width: 40 }} />
                                        :
                                        item.inputLeaveType == "PERMISSION" ?
                                        <Thumbnail square source={require('../../assets/permission.png')} style={{ borderRadius: 30, height: 50, width: 40 }} />
                                        :
                                        <Thumbnail square source={require('../../assets/casual.png')} style={{ borderRadius: 30, height: 50, width: 40 }} />
                                        }
                                        </View>
                                    </View>
                                    </TouchableOpacity>
                                </CardItem>    
                            </Card>
                            ))
                        } */}
                    {/* </ScrollView> */}
                    <ModalInput
                        visible={this.state.isCancelEntry}
                        cancelEntryInfo = {this.state.cancelEntryInfo}
                        value={this.state.cancelReason}
                        onTextChange={this.onChangeData}
                        toggle ={this.entryEdit}
                        onSubmit ={this.cancelInfoCall}
                    />

                    <RejectinfoModel 
                        modalVisible={this.state.showRejectionview} 
                        showrejectionModal={this.showrejectionModal.bind(this)} 
                        rejectService={this.rejectService.bind(this)} 
                        typeReject= {this.state.typeReject}
                    />
                    <ToastRej
                        ref={(toastRej) => this.toastRej = toastRej}
                        style={{backgroundColor:'red'}}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={3000}
                        opacity={0.8}
                        textStyle={{color:'white'}}
                        />
                    <ToastAppr
                        ref={(toastAppr) => this.toastAppr = toastAppr}
                        style={{backgroundColor:'green'}}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{color:'white'}}
                        />
        
                    {/* <Fab
                        active = "true"
                        direction="up"
                        containerStyle={{ }}
                        style={{ backgroundColor: '#7666fe' }}
                        onPress={() => this.RBSheet.open()}
                        position="bottomRight"
                        >
                        <CSIcon name={"Artboard-401x-100"}/>
                    </Fab>   */}
                {/* </ImageBackground> */}
                 {/* </ScrollView> */}
             </Container>
           
        )
    }

    renderAgenda(value){

        return(
        <View padder style={{ borderBottomWidth: .5, borderBottomColor: '#ccc', width: '100%', height: '100%', flexDirection: 'column' }}>
            <TabView
                navigationState={{index: this.state.index, routes: this.state.route}}
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
            />
        </View>
        )

    }
}
export default Leave;

const styles = StyleSheet.create({
    tabcontainer: {
        marginTop: StatusBar.currentHeight,
    },
    background:{
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
    header: {
        // backgroundColor: 'rgba(0,255,0,0.5)',
        paddingHorizontal:10,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent:'center',
        width: '20%',
    },
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
        width: '90%', 
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
        paddingRight: 15,
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
        marginBottom:15,
        marginTop:15,
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
    cancelCircle: {
        borderWidth:5, 
        borderRadius: 60/2, 
        width: 62, 
        height: 62, 
        marginTop:4,
        backgroundColor:'#fff',
        alignItems:'center',
        borderColor: '#FF3D00',
      },
    rejectCircle: {
        borderWidth:5, 
        borderRadius: 60/2, 
        width: 62, 
        height: 62, 
        marginTop:4,
        backgroundColor:'#fff',
        alignItems:'center',
        borderColor: '#F44336',
      },  
    approveCircle: {
        borderWidth:5, 
        borderRadius: 60/2, 
        width: 62, 
        height: 62, 
        marginTop:4,
        backgroundColor:'#fff',
        alignItems:'center',
        borderColor: '#00C853',
      },
    requestCircle: {
        borderWidth:5, 
        borderRadius: 60/2, 
        width: 62, 
        height: 62, 
        marginTop:4,
        backgroundColor:'#fff',
        alignItems:'center',
        borderColor: 'orange',
      },
    hourcircle:{ 
        justifyContent:'center',
        borderRadius: 35/2, 
        width: 40, 
        height: 40, 
        backgroundColor:'#f4ebf9',
        alignItems:'center'
        },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 200,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
