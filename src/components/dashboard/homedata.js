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
    H3, Form ,Item,
    Card, CardItem,
    Subtitle,Fab,Input
    ,Thumbnail,Textarea
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,View,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal,ActivityIndicator
 } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
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
import { SwipeRow } from 'react-native-swipe-list-view';
import * as Api from '../../services/api/home';
import * as ApiNotification from '../../services/api/pushnotification';
import * as Apirequest from '../../services/api/request';
import Picker from '@gregfrench/react-native-wheel-picker';
import _ from 'underscore';
import { CommonData } from '../../utils';
import CustomMenuIcon from '../../navigation/customMenu/customMenuIcon';
import SideBar from '../../navigation/sidebar'
import { Validate, Constants } from '../../utils';
import { FlatList } from 'react-native';
var PickerItem = Picker.Item;

const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            myDate: new Date(),
            selected: this.MarkedDatePass(new Date()),
            isLoading: false,
            mailID : "",
            userInfo: {},
            sessionData : '',
            calData : [],
            birthdayInfo: [],
            weddingInfo : [],
            serviceInfo : [],
            holidayData : [],
            holidayInfo : "",
            employeeRecordsFrom: "0",
            employeeRecordsTo: "0",
            next: "Y",
            previous: "N",
            mobileSyncDate: "",
            profilePictureRequired: "Y",
            category:"",
           
        }
        // if (Platform.OS === 'android') {
        //     UIManager.setLayoutAnimationEnabledExperimental(true);
        //   }
    }

    async componentDidMount() {

        var {selected,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,category} = this.state;
        var currentDate = this.MarkedDatePass(new Date());
        var MailID = await AsyncStorage.getItem('Email');
        var UserInfo = await AsyncStorage.getItem('userInfo');
        var seessionKey = await AsyncStorage.getItem('sessionKey');
        var datainfo =[];
        datainfo[currentDate] = [{name: 'item 1 - any js object'}];
        var navigationData = this.props.navigation.getParam("filterType");
        console.log("Values",navigationData)
        if(navigationData == "notification"){
            var UserData = await AsyncStorage.getItem('userInfo');
            var notificationVal = this.props.navigation.getParam('data');
            console.log("Notification userInfo", JSON.parse(UserData),"DAta", notificationVal)
            // this.setState({
            //     mailID: MailID,
            //     userInfo : JSON.parse(UserInfo),
            //     selected,
            //     calData : datainfo,
            //     sessionData : seessionKey
            // }, () => {
            //     this.getBirthdayInfo();
            //     this.getHolidayList();
            // })
        }else{
            this.setState({
                mailID: MailID,
                userInfo : JSON.parse(UserInfo),
                selected,
                calData : datainfo,
                sessionData : seessionKey
            }, () => {
                this.getBirthdayInfo();
                this.getHolidayList();
            })
        }
    }
    
    getBirthdayInfo = () => {
        var {selected,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
        // var date = this.ChangeDate(selected);
        var calinfo = [];
        let items = [];
        var birthdayValues = {
            fromDate: this.ChangeDate(selected),
            toDate :this.ChangeDate(selected),
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "BA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLoading: true
        })

        console.log("Request Birthday",birthdayValues)
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    if(calData.length == 0){
                        calinfo[selected] = response.data
                    }
                }else{
                    if(calData.length == 0){
                        calinfo[selected] = []
                    }
                }
                this.setState({
                    // calData : calinfo,
                    birthdayInfo : items
                },()=>{
                    this.getWorkAnniversaryInfo();
                })
            }else{
                this.setState({
                    isLoading: false,
                    birthdayInfo : items
                })
            }
        }.bind(this))
    }

    getWorkAnniversaryInfo = () => {
        var {selected,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
            // var date = this.ChangeDate(selected);
            var calinfo = [];
            let items = [];
        var WorkValues = {
            fromDate: this.ChangeDate(selected),
            toDate :this.ChangeDate(selected),
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "SA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        Api.getBirthdayInfo(WorkValues,function(response){
            console.log("response Service",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    if(calData.length == 0){
                        calinfo[selected] = response.data
                    }
                }
                else{
                    if(calData.length == 0){
                    calinfo[selected] = []
                    }
                }
                
                    this.setState({
                        serviceInfo : items,
                    },()=>{
                        this.getWeddingAnniversaryInfo();
                    })
                
            }else{
                this.setState({
                    isLoading: false,
                    serviceInfo : items,
                })
            }
        }.bind(this))
    }

    getWeddingAnniversaryInfo = () => {
        var {selected,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
        // var date = this.ChangeDate(selected);
        var calinfo = [];
        let items = [];
        var weddingValues = {
            fromDate: this.ChangeDate(selected),
            toDate :this.ChangeDate(selected),
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "WA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        Api.getBirthdayInfo(weddingValues,function(response){
            console.log("response Wedding",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    if(calData.length == 0){
                        calinfo[selected] = response.data
                    }
                }else{
                    if(calData.length == 0){
                    calinfo[selected] = []
                    }
                }
                
                    this.setState({
                        isLoading: false,
                        weddingInfo : items,
                    })
                
            }else{
                this.setState({
                    isLoading: false,
                    weddingInfo : items,
                })
            }
        }.bind(this))
    }

    notificationWishes(Type,values){
        var {sessionData,selected,userInfo} = this.state;
        var todayDate = this.ChangeDate(new Date());
        var selectedDate = this.ChangeDate(selected);
        console.log("Values info",Type,values)
        if(userInfo.employeeId.toString() != values.EmployeeId){
            console.log("Date info Today",todayDate,"SelectedDate",selectedDate);
            if(todayDate == selectedDate){
                var postData = {
                    sessionData : sessionData,
                    userId : values.UserId,
                    serviceType: Type,
                    currentDate: selectedDate
                }
                ApiNotification.WishesNotification(postData,function(response){
                    console.log("Notification Response",response);
                    if(response.success){
                        console.log("Notification Response",response);
                    }
                }.bind(this));
            }else{
                CommonData.toastWarningAlert("You can able to sent notification to current date only!!!");
            }
        } else{
            CommonData.toastWarningAlert("Self wish is not enabled!!!");
        }
    }
    
    getHolidayList(){
        var {sessionData} = this.state
        this.setState({
            isLoading: true
        })
        Api.getHolidayInfo(sessionData,function(response){
            
            var items =[];
            if(response.success){
                if(response.data.length > 0){
                    for (let i = 0; i < response.data.length ;i++ ){
                        console.log("Log val",this.monthGet(response.data[i]['HolidayDate']))
                        var month = this.monthGet(response.data[i]['HolidayDate']);
                        var datainfo = this.dateGet(response.data[i]['HolidayDate'])
                        var splicDate = (response.data[i]['Day']).slice(0,3)
                        response.data[i]['Dayinfo'] = splicDate
                        response.data[i]['Month'] = month
                        response.data[i]['Date'] = datainfo
                    }
                    items = response.data;
                    console.log("response HolidayList :",items)
                }
                this.setState({
                    isLoading: false,
                    holidayData: items
                },()=>{
                    this.checkHolidayInfo()
                })
            }else{
                this.setState({
                    isLoading: false,
                    holidayData: items
                })
            }

        }.bind(this));
    }

    checkHolidayInfo(){
        var {selected,holidayData} = this.state
        var holidayFilter = holidayData.filter(item =>{
            return item.HolidayDate == selected
        })
        if(holidayFilter.length > 0){
            this.setState({
                holidayInfo : holidayFilter[0]
            },()=>{
                console.log("holidayInof",this.state.holidayInfo.length)
            })
        }
        console.log("Values holiday",holidayFilter.length)
    }

    monthGet(val){
        var date = new Date(val);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = months[date.getMonth()]
        return month
    }

    dateGet(val){
        var date = new Date(val);
        var day = ("0" + (date.getDate().toString())).slice(-2).toString()
        return day
    }

    MarkedDatePass(StringDate) {
        var d = new Date(StringDate);
        var beforeChange = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + d.getDate()).slice(-2).toString();
        return beforeChange;
    }

    ChangeDate(selectedDate){
        var d = new Date(selectedDate);
        var timeToString = ("0" + (d.getDate().toString())).slice(-2).toString() +  "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + d.getFullYear().toString();
        return timeToString;
    }

    refreshScreen=() => { 
        this.getBirthdayInfo()
    }

    handleChange(selectedDate) { 
        // var selectedvalDate = selectedDate.dateString
        var selectedvalDate = selectedDate._d
        console.log("Valuesselected",selectedvalDate)
        var {mailID,calData} = this.state;
        var seletedVal = this.MarkedDatePass(selectedvalDate);
        var dataCheck = [];
        dataCheck[seletedVal] = [{name: 'item 1 - any js object'}];
        this.setState({
            calData : dataCheck,
            selected : seletedVal,
            holidayInfo : "",
        },() => {
            this.getBirthdayInfo();
            this.checkHolidayInfo();
        })
        
      };

      ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    // componentWillUpdate() {
    //     UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    //     LayoutAnimation.spring();
    // }

    
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

    changeListType(value){
        this.setState({
            listType : value
        })
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

    renderAgenda(value){
        let {birthdayInfo,serviceInfo,weddingInfo,userInfo,holidayInfo} = this.state;
        console.log("birthdayInfo",)
        return(
            <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
                {
                ( holidayInfo !== "" ) &&
                    <Card padder  style={{width:'100%',borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} >
                                <View padder style={{flexDirection: 'row',width:'100%'}}>
                    
                                    <View style={{width:'82%',marginLeft:2,justifyContent:'center'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000',marginLeft:10 }}> {holidayInfo.leaveDescription} </Text>
                                    </View>
                                    
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                }
                {
                    birthdayInfo.length > 0 &&
                    birthdayInfo.map((value,key)=>(
                    <Card padder style={{width:'100%',borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress ={() => {this.props.navigation.navigate('EmpInfo',{ EmpDetail : value,selectedDate:this.state.selected, navigateVal: "Home"})}}>
                                <View padder style={{flexDirection: 'row',width:'100%'}}>
                                    {
                                        Validate.isNotNull(value.EmployeeImageUri)
                                        ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',marginTop:20,marginLeft:2}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',marginTop:20,padding:2,marginLeft:2}} />
                                        </View>
                                    }
                                    <View style={{width:'70%',marginLeft:2}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000',textTransform:'capitalize' }}>  {value.DepartmentName} </Text>
                                    </View>
                                    <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                    <CSIcon name={"a1"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                    ))
                }
                <View style={{marginTop:15}}></View>
                {
                    serviceInfo.length > 0 &&
                    serviceInfo.map((value,key)=>(
                    <Card padder style={{width:'100%',marginTop:5,borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress ={() => {this.props.navigation.navigate('EmpInfo',{ EmpDetail : value,selectedDate:this.state.selected, navigateVal: "Home"})}}>
                                <View padder style={{flexDirection: 'row',width:'100%'}}>
                                    {
                                        Validate.isNotNull(value.EmployeeImageUri)
                                        ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',marginTop:20,marginLeft:2}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',marginTop:20,padding:2,marginLeft:2}} />
                                        </View>
                                    }
                                    <View style={{width:'70%',marginLeft:2}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000',textTransform:'capitalize' }}>  {value.DepartmentName} </Text>
                                    </View>
                                    <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                    <CSIcon name={"a5"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                    ))
                }
                    <View style={{marginTop:15}}></View>
                {
                    weddingInfo.length > 0 &&
                    weddingInfo.map((value,key)=>(
                    <Card padder style={{width:'100%',marginTop:5,borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress ={() => {this.props.navigation.navigate('EmpInfo',{ EmpDetail : value, selectedDate:this.state.selected, navigateVal: "Home"})}}>
                                <View padder style={{flexDirection: 'row',width:'100%'}}>
                                    {
                                        Validate.isNotNull(value.EmployeeImageUri)
                                        ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',padding:5}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',padding:5}} />
                                        </View>
                                    }
                                    <View style={{width:'70%',marginLeft:2,justifyContent:'center'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000',textTransform:'capitalize' }}>  {value.DepartmentName} </Text>
                                    </View>
                                    <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                    <CSIcon name={"Artboard-83"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                    ))
                }
                {
                    ((weddingInfo.length == 0) && (serviceInfo.length == 0) && (birthdayInfo.length == 0)) &&
                    <NoRecordsFound/>
                }
            </View>
        )
    }

    render(){
          let {birthdayInfo,serviceInfo,weddingInfo,userInfo,calData,isLoading,holidayInfo} = this.state;
        return(
            // <ImageBackground source={require('../../assets/background.png')} style={styles.background}> 
            <Container >
            
            <Header  style={{ backgroundColor: 'white' }}>
                        <Left>
                            <TouchableOpacity 
                             onPress ={() => {this.props.navigation.navigate('Contacts')}} 
                            >
                                <CSIcon name={"next"} size={24} color={"#580073"}/>
                                {/* <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} /> */}
                            </TouchableOpacity>
                        </Left>
                        <Body>
                            {/* <HeaderTitle title="Home" /> */}
                             <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} />
                        </Body>
                        <Right>
                                {
                                Validate.isNotNull(this.state.userInfo.employeeImageUri)
                                ?
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"Home"})}>
                                    <Thumbnail square large source={{ uri: 'data:image/png;base64,' + this.state.userInfo.employeeImageUri }} style={{ borderRadius: 50, height: 40, width: 40 }} />
                                </TouchableOpacity>
                                    :
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"Home"})}>
                                    <Thumbnail square large source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 40, width: 40 }} />
                                </TouchableOpacity>
                                }
                            {/* </TouchableOpacity> */}
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
                    renderDay={this.renderDay.bind(this)}
                    // theme={{ backgroundColor: 'transparent', agendaKnobColor: '#580073' }}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    hideKnob={false}
                    onCalendarToggled={this.onCalendarToggled.bind(this)}
                    theme={{
                        backgroundColor: 'transparent', agendaKnobColor: '#580073',
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
                    selectedDate = {moment()}
                    onDateSelected = {(date) =>this.handleChange(date)}
                    dateNameStyle={{color: 'black'}}
                    highlightDateNumberStyle={{color: '#580073'}}
                    highlightDateNameStyle={{color: '#580073'}}
                    disabledDateNameStyle={{color: 'grey'}}
                    disabledDateNumberStyle={{color: 'grey'}}
                    iconContainer={{flex: 0.1}}
                    // markedDates = {this.state.markedDateinfo}
                    // maxDate = {moment()}
                />
                <ScrollView>
                 {  
                 isLoading 
                ?
                // <View style={styles.loading}>
                    <ActivityIndicator size='large' style={{marginTop:10}}/>
                // </View>
                :
                <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10,marginBottom:50}}>
                {
                ( holidayInfo !== "" ) &&
                    <Card padder  style={{width:'100%',borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} >
                                <View padder style={{flexDirection: 'row',width:'100%',padding:5}}>
                    
                                    <View style={{width:'85%',marginLeft:2,justifyContent:'center'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000',marginLeft:10 }}> {holidayInfo.leaveDescription} </Text>
                                    </View>

                                    <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                        <CSIcon name={"a8"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    </View>
                                    
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                }
                {
                    birthdayInfo.length > 0 &&
                    birthdayInfo.map((value,key)=>(
                    <Card padder style={{width:'100%',borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress ={() => {this.props.navigation.navigate('EmpInfo',{ EmpDetail : value, selectedDate:this.state.selected, navigateVal: "Home"})}}>
                                <View padder style={{flexDirection: 'row',width:'100%',marginBottom:5}}>
                                    {
                                        Validate.isNotNull(value.EmployeeImageUri)
                                        ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',marginTop:20,marginLeft:2}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',marginTop:20,padding:2,marginLeft:2}} />
                                        </View>
                                    }
                                    <View style={{width:'70%',marginLeft:2}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000', textTransform:'capitalize' }}>  {value.EmployeeName}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595', textTransform:'capitalize' }}>  {value.EmpCode} - {value.DepartmentName} </Text>
                                        {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text> */}
                                    </View>
                                    
                                    <TouchableOpacity onPress={()=> this.notificationWishes("BIRTHDAY",value)} style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                        <CSIcon name={"a1"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    </TouchableOpacity>
                                    
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                    ))
                }
                <View style={{marginTop:15}}></View>
                {
                    serviceInfo.length > 0 &&
                    serviceInfo.map((value,key)=>(
                    <Card padder style={{width:'100%',marginTop:5,borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress ={() => {this.props.navigation.navigate('EmpInfo',{ EmpDetail : value, selectedDate:this.state.selected, navigateVal: "Home"})}}>
                                <View padder style={{flexDirection: 'row',width:'100%',marginBottom:5}}>
                                    {
                                        Validate.isNotNull(value.EmployeeImageUri)
                                        ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',marginTop:20,marginLeft:2}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',marginTop:20,padding:2,marginLeft:2}} />
                                        </View>
                                    }
                                    <View style={{width:'70%',marginLeft:2}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000', textTransform:'capitalize' }}>  {value.EmployeeName}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595', textTransform:'capitalize' }}>  {value.EmpCode} - {value.DepartmentName} </Text>
                                        {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text> */}
                                    </View>
                                    <TouchableOpacity onPress={()=> this.notificationWishes("SERVICEANNIVERSARY",value)} style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                    <CSIcon name={"a5"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                    ))
                }
                    <View style={{marginTop:15}}></View>
                {
                    weddingInfo.length > 0 &&
                    weddingInfo.map((value,key)=>(
                    <Card padder style={{width:'100%',marginTop:5,borderRadius:10,padding:5}}>    
                        <CardItem cardBody>
                            <TouchableOpacity activeOpacity={0.8} onPress ={() => {this.props.navigation.navigate('EmpInfo',{ EmpDetail : value, selectedDate:this.state.selected, navigateVal: "Home"})}}>
                                <View padder style={{flexDirection: 'row',width:'100%',marginBottom:5}}>
                                    {
                                        Validate.isNotNull(value.EmployeeImageUri)
                                        ?
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',padding:5}}/>
                                        </View>
                                        :
                                        <View style={styles.assignedcircle}>
                                            <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',padding:5}} />
                                        </View>
                                    }
                                    <View style={{width:'70%',marginLeft:2,justifyContent:'center'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000', textTransform:'capitalize' }}>  {value.EmployeeName}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595', textTransform:'capitalize' }}>  {value.EmpCode} - {value.DepartmentName} </Text>
                                        {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text> */}
                                    </View>
                                    <TouchableOpacity onPress={()=> this.notificationWishes("WEDDINGANNIVERSARY",value)} style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                    <CSIcon name={"Artboard-83"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                    ))
                }
                {
                    ((weddingInfo.length == 0) && (serviceInfo.length == 0) && (birthdayInfo.length == 0)) &&
                    <NoRecordsFound/>
                }
            </View>
            }
            </ScrollView>
            <Fab
                    active = "true"
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#fff' }}
                    onPress={() => this.props.navigation.navigate('Blood')}
                    position="bottomRight"
                    >
                    <CSIcon name={"tick"}  style={{color:'#580073',fontSize:30}}/>
            </Fab>
            </Container>

        )
    }
}
export default Home;

const styles = StyleSheet.create({
    assignedHoliday:{ 
        justifyContent:'center',
        width:'18%',
        borderRadius: 50/2,  
        height: 52, 
        marginTop:12,
        marginBottom:2,
        backgroundColor:'#fff',
        },

    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.8,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    assignedcircle:{ 
        justifyContent:'center',
        width:'15%',
        borderRadius: 40/2,  
        height: 42, 
        marginTop:3,
        backgroundColor:'#fff',
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
    header: {
        // backgroundColor: 'rgba(0,255,0,0.5)',
        paddingHorizontal:10,
        alignItems: 'center',
        alignContent: 'center',
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
    hours: {
        fontSize: 15,
        color: 'black',
        marginTop:20,
        textAlign: 'center',
        fontWeight:'bold',
        alignContent: 'space-between',
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
        backgroundColor:'red'
    },
    approveButton:{
        justifyContent: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor:'blue'
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

    approvedcircle:{ borderColor: '#00c853',
    borderWidth:3, 
    borderRadius: 60/2, 
    width: 60, 
    height: 60, 
    marginTop:3,
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
    
    pendingcircle:{ borderColor: '#fbfb08',
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
