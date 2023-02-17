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
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, ToastAndroid,Keyboard,
    Platform,View,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal,TouchableWithoutFeedback,KeyboardAvoidingView
 } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const initialLayout = {width: Dimensions.get('window').width}
const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0;
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
import ToastRej from 'react-native-easy-toast';
import ToastAppr from 'react-native-easy-toast';
import Toastinfo from 'react-native-easy-toast';
var PickerItem = Picker.Item;

const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const BottomModalView = (props) =>{
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
                    <Text style={{marginTop:10, marginLeft:10}}>Enter Reason for Rejection :</Text>
                    <View style={[{width: SCREEN_WIDTH-100,marginLeft:10, height:60, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                        <Textarea rowSpan={2} placeholderTextColor='#ccc'  placeholder="Comments"
                                 onChangeText={(value) => props.onChangeData(value)} />
                    </View>
                    <View style={{flex:1,flexDirection: 'row', justifyContent: 'center',marginTop:5}}>
                        <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                            <Button style={{justifyContent:'center',width:'60%',alignSelf:'center'}}onPress={() =>  props.rejectService(props.typeReject)} >
                                <Text style={{ color: 'white',textAlign:'center' }}>Ok</Text>
                            </Button>
                        </View>
                        <View style={{ width:'50%', alignItems: 'center', justifyContent: 'center' }}>
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
          selectedNatureVal : '-- select --',
          IspickerValue : false,
          selectedDuration : '',
          selectedComments: null,
          userInfo : {},
          naturePicker : [],
          isLoading : false,

        };
    }

    async componentDidMount(){
        if(this.props.taskType === "AppliedTask")
        {
            this.setState({
                selectedNature : this.props.taskList.TASK_SUB_TYPE_ID,
                selectedNatureVal : this.props.taskList.TASK_SUB_TYPE,
                selectedDuration : this.props.taskList.DURATION,
                selectedComments: this.props.taskList.COMMENTS,
            })
        }
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
            this.setState(() => {
                return {
                    layoutHeight: null,
                };
            });
        }
        else {
          this.setState(() => {
            return {
              layoutHeight: 0,
            };
          });
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
        var selectVal = this.state.naturePicker.filter((item,index)=>{
             return(item.TASK_SUBTYPE_ID === value)
        })
        this.setState({
            selectedNature: value,
            selectedNatureVal : selectVal[0].TASK_SUBTYPE,

        });
    }

    pickerValueChange =(value) =>{
        this.setState({
            IspickerValue : value
        })
    }

    onChangeDuration = (value) => {
        var t = value;
        var char = value.toString().split(".")
        if (char.length <= 2) {
            if (value.toString()[2] === ".") {
                this.setState({ selectedDuration: value });
            } else if (value.toString().length <= 2) {
                this.setState({ selectedDuration: value });
            } else if (value.toString().includes(".")) {
                if (value.toString()[3] !== "." && value.toString()[3] !== "-" && value.toString()[3] !== ","
                    && value.toString()[3] !== "") {
                    value = (t.indexOf(".") >= 0) ? ((t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3))) : t;
                    this.setState({ selectedDuration: value });
                }
            }
        }
    }

    onChangeTextArea = (value) => {
        this.setState({ selectedComments: value });
    }

    
    _saveTaskInfo = (stateData) => {
        var checkValidation = this.checkFormValidation(stateData);
        if (checkValidation.isValid) {
            this.setState({
                isLoading: true,
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
                Apirequest.SaveTaskInfo(saveCredentials, async function (response) {
                    var Data = response.data;
                    if (response.success) {
                        this.setState({
                            isLoading: false,
                        })
                        this.props.refreshScreen("Approved");
                        // CommonData.toastSuccessAlert("Your time is Booked!!!")
                    }
                    else {
                        this.setState({
                            isLoading: false,
                            errorMessage: response.errorMessage
                        })
                        // this.toastRej.show(response.errorMessage)
                        CommonData.toastFailureAlert(response.errorMessage)
                        

                    }
                }.bind(this));
            })
        }
        else {
            // this.toastRej.show(checkValidation.message)
            CommonData.toastWarningAlert(checkValidation.message)
        }
    };


    _updateTaskInfo = (stateData) => {
        var checkValidation = this.checkFormValidation(stateData);
        if (checkValidation.isValid) {
            this.setState({
                isLoading: true,
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
                Apirequest.UpdateTaskInfo(saveCredentials, function (response) {
                    if (response.success) {
                        // var Data = response.data;
                        // this.toast.show("Your time is Updated!");
                        this.setState({
                            isLoading: false,
                        })
                        this.props.refreshScreen("Updated");
                        // CommonData.toastSuccessAlert("Your time is Updated!")

                        // this.props.navigation.navigate('Request',{ScheduledTask: response.data,Date:stateData.date});
                    }
                    else {
                        this.setState({
                            isLoading: false,
                            errorMessage: response.errorMessage
                        })
                        // this.toastRej.show(response.errorMessage);
                        CommonData.toastFailureAlert(response.errorMessage)
                    }
                }.bind(this));
            })
        }
        else {
            // this.toastRej.show(checkValidation.message);
            CommonData.toastWarningAlert(checkValidation.message)
        }
    };
    
    checkFormValidation(stateData) {
        var duration = 0;
        var existDuration = parseFloat(stateData.REMAINING_HOURS)
        if (this.state.selectedDuration != null) {
            duration = parseFloat(this.state.selectedDuration)

        }
        if (this.state.selectedComments == null || this.state.selectedComments.trim() === '' || this.state.selectedDuration == '' || this.state.selectedDuration == null) {
            return {
                isValid: false,
                message: this.state.selectedDuration == '' ? "Enter the Duration of work" : "Enter the comments"
            };
        }
        else if(this.state.selectedNature == 0 || isNaN(this.state.selectedNature)){
            return{
                isValid : false,
                message : "Select Nature of Work"
            }
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
        return (
            // <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'position' :'null'}
            //     keyboardVerticalOffset = {keyboardVerticalOffset}>
            <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
                {
                    this.props.taskType === "MyTask" ?
                    <Card padder style={{width:'100%',borderRadius:20,padding:10,marginTop:-35,marginBottom:10}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} 
                            // onLongPress={()=>{
                            // Alert.alert(
                            //     //title
                            //     value.TASK_TITLE,
                            //     //body
                            //     value.TASK_DEVELOPMENT_TYPE,
                            //     [
                            //         { text: 'Cancel', onPress: () => { cancelable: true }, style: 'cancel' },
                            //     ],
                            //     { cancelable: true }
                            // );}} 
                            onPress = {() => this.props.updateValue(id,value)}>
                                <View padder style={{flexDirection: 'row',width:'100%'}}>
                                    {/* <View style={{ flexDirection:'row',width:'100%'}}> */}
                                    {
                                    Validate.isNotNull(userInfo.employeeImageUri)
                                            ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} style={{width:45,height:45}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{width:45,height:45}} />
                                        </View>
                                    }
                                    <View style={{width:'70%'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2,fontWeight:'bold', color: '#434a54' }}>{value.PROJECT_TITLE}</Text>
                                        <Text 
                                        // numberOfLines={1} ellipsizeMode="tail" 
                                        style={{ fontSize: 14, padding: 2, color: '#959595' }}>{value.TASK_TITLE} </Text>
                                        <Text 
                                        // numberOfLines={1} ellipsizeMode="tail" 
                                        style={{ fontSize: 14, padding: 2, color: '#959595' }}>{value.TASK_DEVELOPMENT_TYPE} </Text>
                                        
                                    </View>
                                    {/* </View> */}
                                    <View style={{width:'10%',justifyContent:'center',alignContent:'center'}}>
                                        { !value.IsSelect 
                                            ?
                                            // <View style={{ height:65, borderRadius:10,backgroundColor:'#59b7d3',padding:5, borderWidth:2, marginTop:5,borderColor:'transparent'}}>
                                            <View style={styles.hourcircle}>
                                                <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:14,marginTop:2}}>{value.REMAINING_HOURS} </Text>
                                            </View>
                                                // <Icon type="AntDesign" name="checkcircle" style={{ fontSize: 16, color: '#c0c0c0' }} />
                                            : 
                                            // <View style={{ height:65, borderRadius:10,backgroundColor:'#006fb1',padding:5, borderWidth:2, marginTop:5,borderColor:'transparent'}}>
                                            <View style={styles.hourcircle}>
                                                <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:14,marginTop:2}}>{value.REMAINING_HOURS} </Text>
                                            </View>
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
                                            <View style={{width:'50%'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Nature of Work </Text>
                                            </View>
                                            <View style={{width:'50%'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Hours </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row',marginTop:5 }}>
                                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=>this.RBSheet.open()}>
                                                <View style={[{ height:45, padding:2, justifyContent:'center', borderRadius:5,backgroundColor:'#edebeb', borderWidth:2,marginTop:10,borderColor:'transparent'}]}>
                                                    <Text numberOfLines={1}  style={{marginTop:2}}>{this.state.selectedNatureVal}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{width:'50%',padding:5}}>
                                                <View style={[{ height:45, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2,marginTop:10, borderColor:'transparent'}]}>
                                                <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} maxLength={5} placeholder='0.0 hrs' keyboardType='numeric'
                                                    onChangeText={this.onChangeDuration} value={`${this.state.selectedDuration}`}
                                                />
                                                </View>
                                            </View>
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,marginTop:10, padding: 5, color: '#000' }}>Description </Text>
                                        <View style={[{width: '98%', height:60, borderRadius:5,backgroundColor:'#edebeb',padding:7,marginTop:10,borderColor:'transparent'}]}>
                                        <Textarea rowSpan={2} placeholderTextColor='#ccc'  placeholder="Comments" 
                                            onChangeText={this.onChangeTextArea} 
                                            value={this.state.selectedComments} 
                                            />
                                        </View>
                                    </View>
                                    
                                    <Button rounded style={{marginTop:20,padding:5,width:250,alignSelf:'center',justifyContent:'center',backgroundColor:'#580073'}}
                                    onPress={() => this._saveTaskInfo(value)}>
                                        {this.state.isLoading ? <ActivityIndicator /> :<Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}>Book Your Time</Text>}
                                    </Button>
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>  
                :
                <Card padder style={{width:'100%',borderRadius:20,padding:10,marginTop:-35,marginBottom:10}}>
                    <CardItem header bordered style={{backgroundColor:'#f1efff',height:35}}>
                        <Text style={{color:'#7666fe',textAlign:'center',fontSize:12}}> { value.TASK_SUB_TYPE }</Text>
                    </CardItem>
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8}  onPress = {()=> this.props.updateValue(id,value)}>
                            <View padder style={{flexDirection: 'row', width: '100%',marginTop:5}}>
                                {
                                    Validate.isNotNull(userInfo.employeeImageUri)
                                    ?
                                    
                                    <View style={(value.LINE_APPROVAL_FLAG == 'Y') ? styles.approvedcircle : (value.LINE_REJECTION_FLAG == 'Y') ? styles.rejectedcircle : styles.pendingcircle}>
                                    <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} style={{width:45,height:45}}/>
                                    </View>
                                    :
                                    <View style={(value.LINE_APPROVAL_FLAG == 'Y') ? styles.approvedcircle : (value.LINE_REJECTION_FLAG == 'Y') ? styles.rejectedcircle : styles.pendingcircle}>
                                    <Thumbnail circular  source={require('../../assets/avatar.png')} style={{width:45,height:45}} />
                                    </View>
                                }
                                <View style={{width:'70%'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> { value.PROJECT_TITLE } </Text>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}> { value.COMMENTS} </Text>
                                    {/* <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                        <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> { value.TASK_SUB_TYPE } 
                                        </Text>
                                    </View> */}
                                </View>

                                <View style={{width:'10%',justifyContent:'center'}}>
                                    { !value.IsSelect 
                                        ?
                                        <View style={styles.hourcircle}>
                                            <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:14,marginTop:2}}>{value.DURATION}</Text>
                                         </View>
                                        : 
                                        <View style={styles.hourcircle}>
                                            <Text style={{color:'#000',fontWeight:'bold',textAlign:'center',fontSize:14,marginTop:2}}>{value.DURATION}</Text>
                                        </View>
                                    }    
                                </View>
                            </View>
                            <View style={value.IsSelect ? {
                                height: this.state.layoutHeight,
                                overflow: 'visible',marginBottom:40}: {height: this.state.layoutHeight,
                                overflow: 'hidden'}}>
                                <View>
                                    <View style={{ flexDirection: 'row',marginTop:30 }}>
                                        <View style={{width:'50%'}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Nature of Work </Text>
                                        </View>
                                        <View style={{width:'50%'}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Hours </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row',marginTop:5 }}>
                                        <TouchableOpacity disabled style={{width:'50%',padding:5}} onPress={()=>this.RBSheet.open()}>
                                            <View style={[{ height:45,padding:2, justifyContent:'center', borderRadius:5,backgroundColor:'#edebeb', borderWidth:2,marginTop:10,borderColor:'transparent'}]}>
                                                <Text numberOfLines={1} style={{marginTop:2}} >{this.state.selectedNatureVal}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{width:'50%',padding:5}}>
                                            <View style={[{ height:45, borderRadius:5,backgroundColor:'#edebeb', borderWidth:2,marginTop:10, borderColor:'transparent'}]}>
                                            <Input placeholderTextColor='#ccc' style={{ color: '#000' }} maxLength={5} placeholder='0.0 hrs' keyboardType='numeric'
                                                 onChangeText={((value.LINE_APPROVAL_FLAG != 'Y') && (value.LINE_REJECTION_FLAG != 'Y')) && this.onChangeDuration} value={`${this.state.selectedDuration}`}
                                            />
                                            </View>
                                        </View>
                                    </View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,marginTop:10, padding: 5, color: '#000' }}>Description </Text>
                                    <View style={[{width: '98%', height:60, marginLeft:2,borderRadius:5,backgroundColor:'#edebeb',padding:7,marginTop:10,borderColor:'transparent'}]}>
                                    <Textarea rowSpan={2} placeholderTextColor='#ccc'  placeholder="Comments" 
                                        onChangeText= { ((value.LINE_APPROVAL_FLAG != 'Y') && (value.LINE_REJECTION_FLAG != 'Y')) && this.onChangeTextArea} 
                                        value={this.state.selectedComments} 
                                        />
                                    </View>
                                </View>
                                {(value.LINE_APPROVAL_FLAG != 'Y') && (value.LINE_REJECTION_FLAG != 'Y') &&
                                <Button rounded style={{marginTop:20,padding:5,width:250,alignSelf:'center',justifyContent:'center',backgroundColor:'#580073'}}
                                onPress={() => this._updateTaskInfo(value)}>
                                    {this.state.isLoading ? <ActivityIndicator /> : <Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}>Update Your Time</Text>}
                                </Button>
                                }
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                }
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
                <Toastinfo
                ref={(Toastinfo) => this.Toastinfo = Toastinfo}
                style={{backgroundColor:'green'}}
                position='bottom'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
                textStyle={{color:'white'}}
                />            
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
            //  </KeyboardAvoidingView>
        );
    }
 }   

 
 const VisibleItem = props =>{
     var {data,loading,onReject,onApprove} = props;
    var screen = Dimensions.get('window');
     return(
        loading 
        ?
        <View style={styles.loading}>
            <ActivityIndicator size='large' />
        </View>
        : 
         <View style={{margin: 10}}>
            <Card padder style={{width:'100%',borderRadius:20,padding:10}}>
                <CardItem header bordered style={{backgroundColor:'#f1efff',height:35}}>
                    <Text style={{color:'#7666fe',textAlign:'center',fontSize:12}}> {data.item.TASK_SUBTYPE}</Text>
                </CardItem>
                <CardItem cardBody>
                    <View style={{flexDirection: 'row', width: '100%',marginTop:5}}>
                        <View style={styles.header} >
                            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hours}> 
                            {data.item.EMPLOYEE_NAME}
                            </Text> */}
                            {
                                Validate.isNotNull(data.item.EMPLOYEE_PHOTO)
                                ?
                                <View >
                                    <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + data.item.EMPLOYEE_PHOTO }} style={{width:50,height:50}}/>
                                    <View  style={{minWidth:20,minHeight:20,backgroundColor:"#f4ebf9",borderRadius:10,position:"absolute",alignItems:'center',right:2,top:2}}><Text style={{fontSize:12,color:"#000",fontWeight:'bold',textAlign:'center',marginTop:2 }}>{data.item.DURATION}</Text></View>
                                </View>
                                :
                                <View >
                                    <Thumbnail circular  source={require('../../assets/avatar.png')} style={{width:50,height:50}} />
                                    <View  style={{minWidth:20,minHeight:20,backgroundColor:"#f4ebf9",borderRadius:10,position:"absolute",alignItems:'center',right:2,top:2}}><Text style={{fontSize:12,color:"#000",fontWeight:'bold',textAlign:'center',marginTop:2 }}>{data.item.DURATION}</Text></View>
                                </View>
                            }
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hours}> 
                            {data.item.EMPLOYEE_NAME}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'column',width:'65%',}}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {data.item.PROJECT_TITLE} </Text>
                            <Text numberOfLines={4} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}> {data.item.COMMENTS} </Text>
                        </View>
                        <View style={{flexDirection: 'row',width:'20%',}}>
                            <TouchableOpacity disabled={data.item.IsSuccess !== '' ? true : false } style={{width:'60%',justifyContent:'center'}} transparent  onPress={onReject} >
                                <View >
                                    <CSIcon name={"Artboard-2-copy-3"} size={20} color={'red'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity transparent disabled={data.item.IsSuccess !== '' ? true : false } style={{width:'40%',justifyContent:'center'}} onPress={onApprove} >
                                <View>
                                    <CSIcon name={"Artboard-2-copy-2"} size={20} color={'#00c853'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
            </CardItem>
            </Card>
        </View>
    )
}

 const FirstTab = props => {
     var {stateInfo,taskList,TimesheetItems,natureofWorkData,naturePicker,mailID,selected} = props
     console.log("Timesheet FirstTab List TimesheetItems :",TimesheetItems, "taskList :",taskList
     ,"others :",natureofWorkData,naturePicker,mailID,selected)
     return (
            <ScrollView keyboardShouldPersistTaps={'handled'}>
                {
                taskList.length == 0 && Object.keys(TimesheetItems).length == 0
                ?
                <NoRecordsFound/>
                :
                <View style={{marginBottom:140}}>
                    <View style={{width:SCREEN_WIDTH,marginTop:40}}>
                        {
                            taskList.length > 0 &&
                            taskList.map((item,key)=>(
                            <ExpandableComponent 
                                taskType= {"MyTask"}
                                taskList= {item} 
                                taskId = {key}
                                updateValue = {props.updateLayout}
                                NatureofWork = {natureofWorkData}
                                natureList = {naturePicker}
                                mailID = {mailID}
                                dateInfo = {selected}
                                refreshScreen = {props.refreshScreen}
                            />
                        ))}
                    </View>
                    <View style={{width:SCREEN_WIDTH,marginTop:40}}>
                    {
                        Object.keys(TimesheetItems).length > 0 &&
                        Object.entries(TimesheetItems)
                        .map(([key, item], i) => (
                            <React.Fragment  key={i}>
                                <ExpandableComponent
                                    taskType= {"AppliedTask"} 
                                    taskList= {item} 
                                    taskId = {key}
                                    updateValue = {props.updateAppliedLayout}
                                    NatureofWork = {natureofWorkData}
                                    natureList = {naturePicker}
                                    mailID = {mailID}
                                    dateInfo = {selected}
                                    refreshScreen = {props.refreshScreen}
                                />
                                
                        </React.Fragment>
                        ))
                    }
                    </View>
                </View>
            }
            </ScrollView>
     )
 }

 const TeamTab = props => {
     var {scheduleItems} = props;
     console.log("Timesheet TeamTab stateInfo :","scheduleItems :",scheduleItems)
     return(
        <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={{width:SCREEN_WIDTH,marginTop:25,marginBottom:10}}>
        {
            scheduleItems.length > 0 
            ?
                <SwipeListView 
                data ={scheduleItems}
                rightOpenValue={-120} 
                disableRightSwipe={true} 
                disableLeftSwipe={true}
                renderItem = {props.renderItem}
                // renderHiddenItem = {props.renderHiddenItem}
                />      
            :
            <NoRecordsFound/>
        }
    </View>
    </ScrollView>
     )
 }

 const HiddenItemWithAction =  props => {

    var {onApprove,onReject,data,loading} = props
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
            calData :[],
            isLoading: false,
            isMyLoading: false,
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
                { key: 'first', title: 'User' },
                { key: 'second', title: 'Team' },
            ],
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
          }
        this.dateLockcall = this.dateLockcall.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
        this.updateAppliedLayout = this.updateAppliedLayout.bind(this);
    }

    async componentDidMount() {
        var tabdata = [];
        var {selected} = this.state;
        var currentDate = this.ChangeUrlDate(new Date());
        var MailID = await AsyncStorage.getItem('loginEmail');
        var UserInfo = await AsyncStorage.getItem('userInfo');
        var infoDate = this.MarkedDatePass(new Date());
        var dataValues = {
            mailID: MailID,
            date: selected
        }
        let login = JSON.parse(UserInfo)
        tabdata = [{ key: 'first', title: login.userName},{ key: 'second', title: 'Team' }]
        this.setState({
            mailID: MailID,
            userInfo : JSON.parse(UserInfo),
            route : tabdata,
            selected
        }, () => {
            this.getTaskSheetDetails(dataValues);
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
                //             markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                //                 marked: true,
                //                 dotColor: '#ffa500'
                //             }
                //         }
                //         else if (data[i]["STATUS"] == "APPROVED") {
                //             DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                //             markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                //                 marked: true,
                //                 dotColor: 'blue'
                //             }
                //         }
                //         else if (data[i]["STATUS"] == "REJECTED") {
                //             DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                //             markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                //                 marked: true,
                //                 dotColor: 'red'
                //             }
                //         }
                //     }
                // }
                this.setState({
                    markedDateinfo: markedDates,
                })
            }
            else {
                this.toastRej.show(response.errorMessage);
                // CommonData.toastWarningAlert(response.errorMessage);
            }
        }.bind(this));
    }
    

    refreshScreen=(val) => { 
        var dataValues = {
            mailID: this.state.mailID,
            date: this.state.selected
        }
        this.getTaskSheetDetails(dataValues);
        this.dateLockcall(this.state.mailID);
        if(val == "Approved"){
            this.toast.show('Your time is Booked!!!');
            // CommonData.toastSuccessAlert("Your time is Booked!!!")
        }else if(val == "Updated"){
            this.toast.show('Your time is Updated!');
            // CommonData.toastSuccessAlert("Your time is Updated!")
        }
    }

    
    GetApproveReqListData(mailID, selectedDate) {
        var infoDate = this.MarkedDatePass(selectedDate);
        // var datainfo =[];
        var calinfo = [];
        // datainfo[infoDate] = [{name: 'item 1 - any js object'}];
        var TimesheetList = {
            MailID: mailID,
            startDate: this.ChangeUrlDate(selectedDate),
            endDate:this.ChangeUrlDate(selectedDate),
            usersID:""
        }
        this.setState({
            navigateData: TimesheetList,
            isMyLoading : true,
            scheduleItems : []
            // selectedList: []
        })
        Api.approvalRequestList(TimesheetList, function (response) {
            var items = {};
            if (response.success) {
                if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i]['IsSelect']= true;
                        response.data[i]['IsSuccess'] = '';
                        response.data[i]['Message'] = '';
                        response.data[i]['key'] = `${i}`;
                        // if(Object.keys(this.state.calData).length == 0){
                        //     calinfo[infoDate] = response.data[i]
                        // }
                    }
                    // var groupedVal = _.groupBy(response.data,'EMPLOYEE_NAME');
                    items = response.data;
                    // if(Object.keys(this.state.calData).length == 0){
                    //     calinfo[infoDate] = response.data
                    // }
                }
                else {
                    items = [];
                    // calinfo[infoDate] = []

                }
                // if(Object.keys(this.state.calData).length == 0){
                //     this.setState({
                //         scheduleItems: items,
                //         selectDate: selectedDate,
                //         calData: calinfo,
                //     })
                // }else{
                    this.setState({
                        scheduleItems: items,
                        selectDate: selectedDate,
                        isMyLoading : false,
                    })
                // }

            }
            else {
                // this.props.navigation.navigate('Auth');
                items = []
                // if(Object.keys(this.state.calData).length == 0){
                //     calinfo[infoDate] = []
                //     this.setState({
                //         scheduleItems: items,
                //         selected : selectedDate,
                //         calData : calinfo,
                //     })
                // }else{
                    this.setState({
                        scheduleItems: items,
                        selected : selectedDate,
                        isMyLoading : false,
                    })
                // }
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
            isMyLoading: true,
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
                }
                else {
                    items[selectedDate] = [];
                    List = false;
                }
                this.setState({
                    TimesheetItems: items,
                    scheduleList: List,
                    navigateData: TimesheetList,
                },()=>{
                    this.GetApproveReqListData(mailID, selectedDate);
                })
            }
            else {
                items = []
                this.setState({
                    TimesheetItems: items,
                    scheduleList: List,
                    navigateData: TimesheetList,
                },()=>{
                    this.GetApproveReqListData(mailID, selectedDate);
                })

            }
        }.bind(this))
    }


    getTaskSheetDetails(dataValues) {
        var infoDate = this.MarkedDatePass(dataValues.date);
        // var datainfo =[];
        // datainfo[infoDate] = [{name: 'item 1 - any js object'}];
        this.setState({
            taskList: [],
            isMyLoading: true,
        })
        Apirequest.TaskSheetList(dataValues, function (response) {
            var items = [];
            // var calinfo = []

            if (response.success) {
                if (response.data.length > 0) {
                    for(let i = 0; i< response.data.length;i++){
                        response.data[i]['ID'] = i+1;
                        response.data[i]['IsSelect'] = false;
                    }
                    // calinfo[infoDate] = response.data;
                    items = response.data;
                }
                else {
                    items = [];
                }
                this.setState({
                    taskList: items,
                },()=>{
                    this.GetTimesheetListData(dataValues.mailID,dataValues.date);
                })
            }
            else {
                items = []
                calinfo[date] = []
                this.setState({
                    taskList: items,
                },()=>{
                    this.GetTimesheetListData(dataValues.mailID,dataValues.date);
                })
                // CommonData.toastFailureAlert(response.errorMessage);
            }
        }.bind(this))
    }

    updateLayout = (index,value) => {
        var { dateList, navigateData, scheduleList, dateCount,selected } = this.state;
        var dateCheck = [];
        dateCheck = dateList;
            console.log("Update info dateCheck :",dateCheck,"navigateData.data :",navigateData,selected,"dateCount :",dateCount,
            "scheduleList :",scheduleList);
            if (dateCheck.includes(selected) || dateCount === undefined || scheduleList === true) {
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
                console.log("DateCheck: ",dateCheck,"NavigationDate: ",navigateData,"dateCount :",dateCount,"scheduleList",scheduleList)
                if (dateCheck.includes(navigateData.date) || dateCount === undefined || scheduleList === true) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                const array = [...this.state.TimesheetItems];
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
                    response.data.unshift({ TASK_SUBTYPE_ID: 0, TASK_SUBTYPE: '-- select --' })
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
        var selectedvalDate = new Date(selectedDate._d)
        var tabdata = [];
        // var selectedvalDate = selectedDate.dateString
        var {mailID,userInfo} = this.state;
        var selectedVal = this.ChangeUrlDate(selectedvalDate);
        let selectVal = new Date(selectedVal);
        let CurrentDate = new Date();
        var infoDate = this.MarkedDatePass(selectedvalDate);
        // var datainfo =[];
        // datainfo[infoDate] = [{name: 'item 1 - any js object'}];
        if(selectVal <= CurrentDate){
        var dataValues = {
            mailID: mailID,
            date: selectedVal
            
        }            
        
        this.setState({
          selected: this.ChangeUrlDate(selectedvalDate),
          myDate : selectedDate
        //   calData : datainfo,
        },()=>{
            this.getTaskSheetDetails(dataValues);
            this.dateLockcall(mailID);
        });
        
        } else {
            alert(" Not allow to enter Timesheet for Future Date...");
            var dataValues = {
                mailID: mailID,
                date: selectedVal
            }
            this.setState({
              selected: selectedVal
            },()=>{
                this.getTaskSheetDetails(dataValues);
                this.dateLockcall(mailID);
            });
            
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
        console.log("Timesheet approve list Map :",rowMap,"Key :",key,"Item :",item)
        var {selectedList,mailID,selectDate,scheduleItems} = this.state
        // for(let i = 0;i<item.length ; i++){
            var payload = {
                sheetNumber: item.TIMESHEET_NUMBER,
                lineId: item.TIMESHEET_LINE_ID,
                MailID: mailID
            }

            this.setState({
                isMyLoading : true,
            })
            console.log("Timesheet approve service Req :",payload);
            Api.apporveSheet(payload,function(response){
                console.log("Timesheet approve service res :",response)
                if (response.success) {
                    if (response.data.length > 0) {
                        console.log("Timesheet approve service suceess del")
                        this.deleteRow(rowMap,key,item,"Approve")   
                        this.setState({
                            isMyLoading : false,
                        })
                        this.refreshScreen("")       
                    }else{
                            this.setState({
                                isMyLoading : false,
                            })   
                        }                              
                }else{
                    this.toastRej.show(response.errorMessage);
                    this.setState({
                        scheduleItems,
                        isMyLoading : false,
                    })
                }
            }.bind(this))
        // }
    }

    showrejectionModal(rowMap,key,item,Isvisible){
        this.setState({
            showRejectionview: Isvisible,
            typeReject : item,
            rowMap : rowMap,
            key : key
        })
    }

    onChangeData(Data){
        this.setState({
            onChangeTextArea: Data
        })
    }

    rejectService =(item) => {

        var {mailID,onChangeTextArea,selectDate,showRejectionview,scheduleItems} = this.state
        Keyboard.dismiss();
            if(onChangeTextArea.trim()!= "" && onChangeTextArea != null){
            var payload = {
                sheetNumber: item.TIMESHEET_NUMBER,
                lineId: item.TIMESHEET_LINE_ID,
                MailID: mailID,
                reason:onChangeTextArea
            }
            this.setState({
                showRejectionview: false,
                isMyLoading: true
            })
            // var empName = Object.entries(scheduleItems)[0][0];
            Api.rejectionSheet(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        this.deleteRow(this.state.rowMap,this.state.key,item,"Reject")   
                            this.setState({
                                showRejectionview: false,
                                onChangeTextArea: "",
                                isMyLoading : false,
                            })
                            this.refreshScreen("")
                    }else{
                        this.setState({
                            isMyLoading : false,
                        })
                    }
                }else{
                    this.toastRej.show(response.errorMessage)
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
                        scheduleItems,
                        isLoading : false,
                    })
                    this.refreshScreen("");
                }
                
            }.bind(this))
        }else{
            this.toastRej.show("Enter the Rejection Reason")
        }
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
            showMonthHead: false
        })
    }

    // loadItems(selectedDate) {
    //     var { mailID } = this.state;
    //     this.GetTimesheetListData(mailID, selectedDate.dateString);
    //     this.getMonth(selectedDate.month, selectedDate.year);
    //     this.refreshScreen();
    // }

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
        this.setState({
            isLoading : true
        })
        Apirequest.DateLockInfo(mailID,  function (response) {
            if (response.success) {
                var count = parseInt(response.data);
                var currentInfo = response.sysDate.toString().split(" ")[0];
                var CurrentDate = new Date(currentInfo)
                const month = CurrentDate.getMonth() + 1;
                const year = CurrentDate.getFullYear();
                var dt = new Date(CurrentDate);
                var datelist = [];
                var changedList = [];
                for (let i = 0; i < count; i++) {
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    datelist.push(dt.getDate().toString() + "-" + months[dt.getMonth()] + "-" + dt.getFullYear().toString());
                    dt.setDate(dt.getDate() - 1);
                }
                this.setState({
                    sysDate: this.timeToString(CurrentDate),
                    dateList: datelist,
                    dateCount: response.data,
                    isLoading : false
                }, () => {
                    this.getMarkedDates(this.state.mailID);
                    this.getMonth(month, year)
                })
            } else {
                this.setState({
                    isLoading : false
                })
                this.toastRej.show(response.errorMessage);
                // CommonData.toastWarningAlert(response.errorMessage);
            }
        }.bind(this))

    }

    dateLockValidation() {
        var { dateList, navigateData, scheduleList, dateCount } = this.state;
        var dateCheck = [];
        dateCheck = dateList;
        if (dateCheck.includes(navigateData.date) || dateCount === undefined || scheduleList === true) {
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
        return <VisibleItem 
        data = {data}
        loading = {this.state.isLoading}
        onApprove ={()=>this.approveService(rowMap,data.item.key,data.item)}
        onReject ={()=>this.showrejectionModal(rowMap,data.item.key,data.item,true)}
        />
    }

    closeRow=(rowMap,rowKey,data) => {
        if(rowMap[rowKey]){
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow = (rowMap,rowKey,data,val) =>{
        console.log("Timesheet delete rowMap :",rowMap,"rowKey :",rowKey,"data :",data,"Val :",
        val,"scheduleItems",this.state.scheduleItems);
        this.closeRow(rowMap,rowKey,data)
        const newData = [...this.state.scheduleItems];
        const prevIndex = this.state.scheduleItems.findIndex(item => item.key === rowKey ) 
        newData.splice(prevIndex,1);
        this.setState({
            scheduleItems : newData,
        },()=>{
            console.log("Timesheet delete new scheduleItems :",this.state.scheduleItems);
        })
        if(val =="Approve"){
            this.toast.show('Approved Successfully!!!.');
        }else if(val == "Reject"){
            this.toast.show('Rejected successfully!!!.');
        }
    }

    renderHiddenItem = (data,rowMap) =>{
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
                        this.state.isMyLoading ?
                        <View style={styles.loading}>
                            <ActivityIndicator size='large' />
                        </View>
                        :
                        <FirstTab 
                            taskType= {"MyTask"}
                            taskList= {this.state.taskList}
                            TimesheetItems = {this.state.TimesheetItems} 
                            natureofWorkData = {this.state.natureofWorkData}
                            naturePicker = {this.state.naturePicker}
                            mailID = {this.state.mailID}
                            selected = {this.state.selected}
                            updateLayout = {this.updateLayout}
                            stateInfo = {this.state}
                            //mailID = {this.state.mailID}
                            dateInfo = {this.state.selected}
                            refreshScreen = {this.refreshScreen}
                            updateAppliedLayout = {this.updateAppliedLayout}
                        />
                    }
                </View>
            )
            case 'second':
            return (
                <View>
                    {
                        this.state.isMyLoading ?
                        <View style={styles.loading}>
                            <ActivityIndicator size='large' />
                        </View>
                        :
                        <TeamTab 
                        stateInfo = {this.state}
                        scheduleItems = {this.state.scheduleItems}
                        renderItem = {this.renderItem}
                        // renderHiddenItem = {this.renderHiddenItem}
                        />
                    }
                </View>
            )
        }
    }

    
    render(){

          var {calData,selected,scheduleItems,markedDates,TimesheetItems,taskList,natureofWorkData,myDate} = this.state;
          var screen = Dimensions.get('window');
          var { route, index } = this.state 
        return(
            // <ImageBackground source={require('../../assets/background.png')} style={styles.background}> 
            <Container >
                 {/* <ImageBackground source={require('../../assets/background.png')} style={styles.background}>  */}
                    <Header  style={{ backgroundColor: 'white' }}>
                        <Left>
                            {/* <TouchableOpacity 
                             onPress ={() => {this.props.navigation.navigate('Settings')}} 
                            > */}
                                <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} />
                            {/* </TouchableOpacity> */}
                        </Left>
                        <Body>
                            <HeaderTitle title="Timesheet" />
                            {/* {   this.state.showMonthHead === true &&
                                <Subtitle>{month}</Subtitle>
                            } */}
                        </Body>
                        <Right>
                        {/* <CustomMenuIcon
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
                        /> */}
                                {
                                Validate.isNotNull(this.state.userInfo.employeeImageUri)
                                ?
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"Timesheet"})}>
                                    <Thumbnail square large source={{ uri: 'data:image/png;base64,' + this.state.userInfo.employeeImageUri}} style={{ borderRadius: 50, height: 40, width: 40 }} />
                                </TouchableOpacity>
                                    :
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"Timesheet"})}>
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
                    markedDates={markedDates}
                    maxDate ={new Date()}
                    renderDay={this.renderDay.bind(this)}
                    // theme={{ backgroundColor: '#fff', agendaKnobColor: '#580073' }}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    hideKnob={false}
                    onCalendarToggled={this.onCalendarToggled.bind(this)}
                    theme={{
                        backgroundColor: '#fff', 
                        agendaKnobColor: '#580073' ,
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
                {/* <ScrollView> */}

                    {/* {
                    this.state.taskList.length > 0 &&
                    <View>
                        <Text style={{textAlign:'center',color:'#59b7d3',fontWeight:'bold'}}> Task List</Text>
                    </View>
                    } */}
                        {   
                        // this.state.showMonthHead === true &&
                             
                        <TabView
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
                        />
                        }

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
                ref={(toast) => this.toast = toast}
                style={{backgroundColor:'green'}}
                position='bottom'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
                textStyle={{color:'white'}}
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
        width: '15%',
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
        marginRight:5,
        marginTop:10,
        elevation: 3,
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

    assignedcircle:{ borderColor: '#580073',
    justifyContent:'center',
    width:'20%',
    marginRight:4,
    borderWidth:3, 
    borderRadius: 50/2, 
    width: 52, 
    height: 52, 
    marginTop:12,
    backgroundColor:'#fff',
    alignItems:'flex-start'
    },

    hourappcircle:{ 
    justifyContent:'center',
    marginRight:4,
    borderRadius: 33/2, 
    width: 35, 
    height: 35, 
    marginLeft:10,
    backgroundColor:'#f4ebf9',
    alignItems:'center',
    width:'20%'
    },

    hourcircle:{ 
    justifyContent:'center',
    borderRadius: 35/2, 
    width: 40, 
    height: 40, 
    backgroundColor:'#f4ebf9',
    alignItems:'center'
    },

    approvedcircle:{ borderColor: '#00c853',
    justifyContent:'center',
    width:'20%',
    marginRight:4,
    borderWidth:5, 
    borderRadius: 60/2, 
    width: 54, 
    height: 54, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'flex-start'
    },

    rejectedcircle:{ borderColor: '#f44336',
    justifyContent:'center',
    width:'20%',
    marginRight:4,
    borderWidth:5, 
    borderRadius: 60/2, 
    width: 54, 
    height: 54, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'flex-start'
    },
    // 90caf9
    
    pendingcircle:{ borderColor: 'orange',
    justifyContent:'center',
    width:'20%',
    marginRight:4,
    borderWidth:5, 
    borderRadius: 60/2, 
    width: 54, 
    height: 54, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'flex-start'
    },

    cancelcircle:{ borderColor: '#ff3d00',
    justifyContent:'center',
    width:'20%',
    marginRight:4,
    borderWidth:5, 
    borderRadius: 60/2, 
    width: 54, 
    height: 54, 
    marginTop:3,
    backgroundColor:'#fff',
    alignItems:'flex-start'
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
