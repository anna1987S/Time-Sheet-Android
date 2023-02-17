import React,{ Component } from 'react';
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
    Text,View,
    H3, Form ,Item,
    Card, CardItem,
    Subtitle,Fab,Input
    ,Thumbnail,Textarea,
    Switch
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal, ScrollView,
    ActivityIndicator,
 } from 'react-native';
import CSIcon from '../../icon-font';
import { Validate, Constants } from '../../utils';
import * as Api from '../../services/api/askHR';
import CalendarStrip from 'react-native-calendar-strip';
import { TabView, SceneMap, TabBar} from 'react-native-tab-view';
import moment from 'moment';
import NoRecordsFound from '../noRecordFound';
import { extend } from 'underscore';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { SwipeListView } from 'react-native-swipe-list-view';
import ToRBSheet from 'react-native-raw-bottom-sheet';
import TopickRBSheet from 'react-native-raw-bottom-sheet';
import ModuleRBSheet from 'react-native-raw-bottom-sheet';
import CatRBSheet from 'react-native-raw-bottom-sheet';
import SearchModuleRBSheet from 'react-native-raw-bottom-sheet';
import EmpQueryRBSheet from 'react-native-raw-bottom-sheet';
import SearchStatusRBSheet from 'react-native-raw-bottom-sheet';
import SearchPriRBSheet from 'react-native-raw-bottom-sheet';
import SearchSevRBSheet from 'react-native-raw-bottom-sheet';
import PriRBSheet from 'react-native-raw-bottom-sheet';
import SevRBSheet from 'react-native-raw-bottom-sheet';
import StatusRBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
import ToastRej from 'react-native-easy-toast';
import ToastAppr from 'react-native-easy-toast';
import Picker from '@gregfrench/react-native-wheel-picker';
import ToastReject from 'react-native-easy-toast';
import { CommonData } from '../../utils';

var PickerItem = Picker.Item;

 const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

 const DateModalView = (props) =>{
    // console.log("Bottomvalue",props)
    return(
        <View style={{alignItems:'flex-end'}}>

                <DatePicker style={{width: SCREEN_WIDTH, height: 200}}
                    mode="date"
                    date = {props.selectedItem}
                    onDateChange={(date) => props.onPickerSelect(date)}
                    // onValueChange={(value) => props.onPickerSelect(value)}
                />
        </View>

    )
}

const BottomModalView = (props) =>{
    console.log("props Item",props.itemList)
    return(
        <View style={{alignItems:'flex-end'}}>

                <Picker style={{width: SCREEN_WIDTH, height: 200}}
                    selectedValue={props.selectedItem}
                    itemStyle={{color:"#000", fontSize:18}}
                    onValueChange={(value) => props.onPickerSelect(value)}
                    >
                     {props.itemList.map((value, i) => (
                            <PickerItem label={String(value.hiddenCode)} value={value.hiddenId} key={i}/>
                        ))}
                </Picker>

        </View>

    )
}

const statusList = [
    {hiddenId:0,Id:"-- Select --",hiddenCode:"-- Select --"},
    {hiddenId:1,Id:"O",hiddenCode:"Open"},
    {hiddenId:2,Id:"APPROVED",hiddenCode:"Approved"},
    {hiddenId:3,Id:"TC",hiddenCode:"Task Created"},
    {hiddenId:4,Id:"TA",hiddenCode:"Task Approved"},
    {hiddenId:5,Id:"WIP",hiddenCode:"Work In Progress"},
    {hiddenId:6,Id:"C",hiddenCode:"Closed"},
    {hiddenId:7,Id:"TESTED",hiddenCode:"Testing Successful"},
    {hiddenId:8,Id:"TOBETESTED",hiddenCode:"To Be Tested"},
    {hiddenId:9,Id:"TESTFAILED",hiddenCode:"Testing Failed"},
    {hiddenId:10,Id:"AWAITINGFORINPUT",hiddenCode:"Awaiting For Input"},
    {hiddenId:11,Id:"AWAITINGFORCLIENTINPUT",hiddenCode:"Waiting For Customer"},
]

const priorityList = [
    {hiddenId:0,Id:"-- Select --",hiddenCode:"-- Select --"},
    {hiddenId:1,Id:"P1",hiddenCode:"P1"},
    {hiddenId:2,Id:"P2",hiddenCode:"P2"},
    {hiddenId:3,Id:"P3",hiddenCode:"P3"},
]

const severityList = [
    {hiddenId:0,Id:"-- Select --",hiddenCode:"-- Select --"},
    {hiddenId:1,Id:"S1",hiddenCode:"S1"},
    {hiddenId:2,Id:"S2",hiddenCode:"S2"},
    {hiddenId:3,Id:"S3",hiddenCode:"S3"},
    {hiddenId:4,Id:"S4",hiddenCode:"S4"},
]

 export default class AskHR extends Component {
    constructor(props){
        super(props)
        this.state = {
            myDate: new Date(),
            isLoading : false,
            isLazyLoading : false,
            userInfo: {},
            sessionData : '',
            modalVisible : false,
            selected: this.MarkedDatePass(new Date()),
            calData : [],
            tabInfo : [],
            queryList: [],
            queryteamList: [],
            index: 0,
            route : [
                { key: 'first', title: 'User' },
                { key: 'second', title: 'Queries' },
            ],
            swipeablePanelActive : false,
            listRecord : [],
            modalList: [],
            empQueryList: [],
            categoryList: [],
            expectedDate: '',
            selectedTo: new Date(),
            popupModuleVal : '',
            popupModuleId : 0,
            popupCategoryVal : '',
            popupCategoryId : 0,
            priorityVal : '',
            severityVal : '',
            statusId: "O",
            statusVal: "Open",
            description: '',
            searchpopupModuleId : 0,
            searchpopupModuleVal : '',
            searchstatusVal: '',
            searchstatusId: '',
            searchpriorityVal : '',
            searchseverityVal : '',
            searchEmpQurVal: '',
            searchEmpQurId: 0,
            requestorVal: '',
            isSearchView : false

        }
    }

    async componentDidMount(){
        var tabdata = [];
        var currentDate = this.MarkedDatePass(new Date());
        var MailID = await AsyncStorage.getItem('Email');
        var UserInfo = await AsyncStorage.getItem('userInfo');
        var seessionKey = await AsyncStorage.getItem('sessionKey');
        var datainfo =[];
        let login = JSON.parse(UserInfo)
        datainfo[currentDate] = [{name: 'item 1 - any js object'}];
        tabdata = [{ key: 'first', title: login.userName},{ key: 'second', title: 'Queries' }]
        this.setState({
            mailID: MailID,
            userInfo : JSON.parse(UserInfo),
            calData : datainfo,
            sessionData : seessionKey,
            tabInfo : tabdata,
            route: tabdata,

        }, () => {
            console.log("queryteamList",this.state.queryteamList,"queryList",this.state.queryList),
            this.calenderListFetch();
        })
    }

    refreshScreen = () => { 
        this.setState({
            isLoading : false,
            isListLoading : false,
            queryList: [],
            queryteamList: [],
            expectedDate: '',
            selectedTo: '',
            popupModuleVal : '',
            popupModuleId : 0,
            popupCategoryVal : '',
            popupCategoryId : 0,
            priorityVal : '',
            severityVal : '',
            statusId: "O",
            statusVal: "Open",
            description: '',
            searchpopupModuleId : 0,
            searchpopupModuleVal : '',
            searchstatusVal: '',
            searchstatusId: '',
            searchpriorityVal : '',
            searchseverityVal : '',
            searchEmpQurVal: '',
            searchEmpQurId: 0,
            requestorVal: '',
            isSearchView : false,
        });
        this.calenderListFetch();
    }

    handleChange(selectedDate) { 
        var tabdata = [];
        // var selectedvalDate = selectedDate.dateString
        var selectedvalDate = selectedDate._d
        console.log("Valuesselected",selectedvalDate)
        var {mailID,calData,userInfo} = this.state;
        var seletedVal = this.MarkedDatePass(selectedvalDate);
        var dataCheck = [];
        dataCheck[seletedVal] = [{name: 'item 1 - any js object'}];
        tabdata = [{ key: 'first', title: userInfo.userName},{ key: 'second', title: 'Team' }]
        this.setState({
            calData : dataCheck,
            selected : seletedVal,
            tabInfo : tabdata,

        },() => {
            this.calenderListFetch();
        })
        
    }

    calenderListFetch = () => {

        this.setState({
            isListLoading: true
        })

        var postData = {
            sessionKey: this.state.sessionData,
            fromDate: this.state.selected,
            toDate: this.state.selected
        }

        Api.CalendarlistFetchHR(postData,function(response){
            console.log("calendar Response",response);
            if (response.success) {
                if(response.data !== null && response.data.employeeQueryArray.length > 0){

                    if (response.dataList.teamDetailArray.length > 0 ){
                        for(let i = 0; i < response.dataList.teamDetailArray.length; i++){
                            response.dataList.teamDetailArray[i]['IsSelect'] = false;
                        }
                    }
                    if (response.dataList.selfDetailArray.length > 0){
                        for(let i = 0; i < response.dataList.selfDetailArray.length; i++){
                            response.dataList.selfDetailArray[i]['IsSelect'] = false;
                        }
                    }

                    let teamArray =  response.dataList.teamDetailArray.length > 0 ? response.dataList.teamDetailArray : [];
                    let selfArray = response.dataList.selfDetailArray.length > 0 ? response.dataList.selfDetailArray : [];
                    
                    this.setState({
                        isListLoading: false,
                        queryteamList : teamArray,
                        queryList : selfArray
                    })
                }else{
                    this.setState({
                        isListLoading : false,
                        queryList: [],
                        queryteamList: []
                    })
                }
            }else{
            this.toastRej.show(response.errorMessage)
            }
        }.bind(this));
    }

    toDatepress = () =>{
        this.setState({
            expectedDate: this.ChangeUrlDate(new Date()),
        },()=>{
            this.ToRBSheet.open();
        })
    }

    toDateClose = () =>{
        this.ToRBSheet.close()
    }

    onsearchModulepress =() => {
        var postData = {
            sessionKey: this.state.sessionData,
            popupName: "MODULE"
        }
        this.popupFetchsearchService(postData);
    }

    onEmpQuerypress = () =>{
        var postData = {
            sessionKey: this.state.sessionData,
            popupName: "EMPLOYEEQUERY"
        }
        this.popupFetchsearchService(postData);
    }

    onChangeRequestor = (value) => {
        this.setState({ requestorVal: value })
    }

    onEmpQueryChange = (value) => {

        var selectId = this.state.empQueryList.filter((item,index)=>{
            return(item.hiddenId == value)
       })

       this.setState({
           searchEmpQurId: value,
           searchEmpQurVal: selectId[0].hiddenCode
       })
    }

    onsearchModuleChange = (value) =>{

        var selectId = this.state.modalList.filter((item,index)=>{
            return(item.hiddenId == value)
       })

       this.setState({
           searchpopupModuleId: value,
           searchpopupModuleVal: selectId[0].hiddenCode
       })

    }


    onsearchStatuspress = () =>{
        this.SearchStatusRBSheet.open();
    }

    onsearchStatusChange = (value) =>{

        var selectId = statusList.filter((item,index)=>{
            return(item.hiddenId == value)
       })

       this.setState({
           searchstatusId: selectId[0].Id,
           searchstatusVal: selectId[0].hiddenCode
       })

    }

    onsearchPrioritypress = () =>{
        this.SearchPriRBSheet.open();
    }

    onsearchSeveritypress = () =>{
        this.SearchSevRBSheet.open();
    }

    onsearchPriorityChange = (value) =>{
        
        var selectId = priorityList.filter((item,index)=>{
            return(item.hiddenId === value)
        })
        this.setState({
            searchpriorityVal : selectId[0].hiddenCode
        })
    }

    onsearchSeverityChange = (value) =>{
        var selectId = severityList.filter((item,index)=>{
            return(item.hiddenId === value)
        })
        this.setState({
            searchseverityVal : selectId[0].hiddenCode
        })
    }

    onModulepress = () =>{

        var postData = {
            sessionKey: this.state.sessionData,
            popupName: "MODULE"
        }
        this.popupFetchService(postData);
    }

    onModuleChange = (value) =>{

        var selectId = this.state.modalList.filter((item,index)=>{
            return(item.hiddenId === value)
       })

       this.setState({
           popupModuleId: value,
           popupModuleVal: selectId[0].hiddenCode
       })

    }

    onCategorypress = () =>{

        var postData = {
            sessionKey: this.state.sessionData,
            popupName: "CATEGORY"
        }
        this.popupFetchService(postData);
    }

    onCategoryChange = (value) =>{

        var selectId = this.state.categoryList.filter((item,index)=>{
            return(item.hiddenId === value)
       })

       this.setState({
           popupCategoryId: value,
           popupCategoryVal: selectId[0].hiddenCode
       })

    }

    onPrioritypress = () =>{
        this.PriRBSheet.open()
    }

    onPriorityChange = (value) =>{
        var selectId = priorityList.filter((item,index)=>{
            return(item.hiddenId === value)
        })
       this.setState({
            priorityVal: selectId[0].hiddenCode,
       })

    }

    onSeveritypress = () =>{
        this.SevRBSheet.open()
    }


    onSeverityChange = (value) =>{

        var selectId = severityList.filter((item,index)=>{
            return(item.hiddenId === value)
        })
       this.setState({
            severityVal: selectId[0].hiddenCode,
       })

    }

    onStatuspress = () =>{
        this.StatusRBSheet.open()
    }

    onStatusChange = (value) =>{

        var selectId = statusList.filter((item,index)=>{
            return(item.hiddenId === value)
       })
       this.setState({
           statusId: "O",
           statusVal: "Open"
       })

    }

    onChangeTextArea = (value) => {
        this.setState({ description: value });
    }

    popupFetchService = (postData) => { 
        Api.popupFetchHR(postData,function(response){
            console.log("popup Response",response);
            if (response.success) {
                if(response.data.length > 0){
                    response.data.unshift({ hiddenId: 0, hiddenCode: "-- Select --" })
                    if(response.PopupName == "MODULE"){
                        this.setState({
                            modalList : response.data
                        },()=>{
                            this.ModuleRBSheet.open()
                        })
                    }else if(response.PopupName == "CATEGORY"){
                        this.setState({
                            categoryList: response.data
                        },()=>{
                            this.CatRBSheet.open()
                        })
                    }else if(response.PopupName == "EMPLOYEEQUERY"){
                        this.setState({
                            empQueryList: response.data
                        },()=>{

                        })
                    }
                }else{
                    this.setState({
                        modalList : [],
                        categoryList : [],
                        empQueryList: [],
                    })
                }
            }else{
                this.toastRej.show(response.errorMessage)
            }
        }.bind(this));
    }

    
    popupFetchsearchService = (postData) => { 
        Api.popupFetchHR(postData,function(response){
            console.log("popup Response",response);
            if (response.success) {
                if(response.data.length > 0){
                    response.data.unshift({ hiddenId: 0, hiddenCode: "-- Select --" })
                    if(response.PopupName == "MODULE"){
                        this.setState({
                            modalList : response.data
                        },()=>{
                            this.SearchModuleRBSheet.open();
                        })
                    }else if(response.PopupName == "CATEGORY"){
                        this.setState({
                            categoryList: response.data
                        })
                    }else if(response.PopupName == "EMPLOYEEQUERY"){
                        this.setState({
                            empQueryList: response.data
                        },()=>{
                            this.EmpQueryRBSheet.open()
                        })
                    }
                }else{
                    this.setState({
                        modalList : [],
                        categoryList : [],
                        empQueryList: [],
                    })
                }
            }else{
                this.toastRej.show(response.errorMessage)
            }
        }.bind(this));
    }


    ontoDateChange= (value) => {
        this.setState({
            selectedTo : value,
            expectedDate : this.ChangeUrlDate(value),
        })
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

    ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = ("0" + (d.getDate().toString())).slice(-2).toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    getMonth(date, year) {
        const month = date - 1;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        this.setState({ month: "" + monthNames[month] + " " + year, showMonthHead: true });
    }


    // Create/Save Query method

    _saveQueryInfo = () => {

        var {popupModuleId,popupCategoryId,priorityVal,severityVal,statusId,expectedDate,description,sessionData} = this.state;
        var checkValidation = this.saveValidate();
        if (checkValidation.isValid) {
            this.setState({
                isLoading : true
            })
            var postData = {
                sessionKey : sessionData,
                internalRequestId:0,
                internalRequestNo:"",
                componentId:popupModuleId,
                moduleCategoryId:popupCategoryId,
                priority:priorityVal,
                severity:severityVal,
                expectedDate:this.MarkedDatePass(expectedDate),
                status:statusId,
                description:description,
                deliveryDate:"",
            }
            console.log("Request postData",postData)
            Api.HRsave(postData, function(response){
                if (response.success) {
                    if(response.data !== null){
                        console.log("Save HR Response",response.data)
                        this.closePanel();
                        this.refreshScreen();
                        this.toast.show("New Query Generated Successfully!!!");
                    }else{
                        this.setState({
                            isLoading : false,
                        })
                    }
                }else{
                this.toastRej.show(response.errorMessage)
                }
            }.bind(this))
        } else {
            this.toastRej.show(checkValidation.message);
            this.setState({
                isLoading : false,
            })
        }
    }

    _searchQueryInfo = () => {
        console.log("Request Search postData");
        var {searchEmpQurId,searchEmpQurVal,searchpopupModuleId,searchstatusId,searchseverityVal,searchpriorityVal,sessionData} = this.state;
        this.setState({
            isLoading : true,
            queryList: []
        })
        var postData = {
                sessionKey : sessionData,
                componentId: searchpopupModuleId,
                priority: searchpriorityVal,
                severity: searchseverityVal,
                requesterId: searchEmpQurId,
                requestedDate: "",
                requestEndDate: "",
                expectedDate: "",
                expectedEndDate: "",
                status: searchstatusId,
                searchRequestId: 0
        }
        console.log("Request Search postData",postData);
        Api.listSearchHR(postData,function(response){
            console.log("Response Search postData",response);
            if (response.success) {
                if(response.data !== null){
                    var searchData = response.listSearch.length > 0 ? response.listSearch : [];
                    this.setState({
                        queryList : searchData,
                        isLoading: false,
                        swipeablePanelActive: false,
                        searchpopupModuleId : 0,
                        searchpopupModuleVal : '',
                        searchstatusVal: '',
                        searchstatusId: '',
                        searchpriorityVal : '',
                        searchseverityVal : '',
                        searchEmpQurVal: '',
                        searchEmpQurId: 0,
                        requestorVal: '',
                        isSearchView: false,
                    })
                }else{
                    this.setState({
                        isLoading : false,
                    })
                }
            }else{
            this.toastRej.show(response.errorMessage)
            this.setState({
                isLoading : false,
            })
            }
        }.bind(this));
    }

    // Validations handling

    saveValidate = () => {

        if (this.state.popupModuleId == 0 ) {
            return {
                isValid: false,
                message:  "Select Module"
            };
        }else if (this.state.popupCategoryId == 0){
            return {
                isValid: false,
                message:  "Select Category"
            };
        }else if (this.state.priorityVal == '' || this.state.priorityVal == "-- Select --"){
            return {
                isValid: false,
                message:  "Select Priority"
            };
        }else if (this.state.severityVal == '' || this.state.severityVal == "-- Select --"){
            return {
                isValid: false,
                message:  "Select Severity"
            };
        }else if (this.state.statusId == '' || this.state.statusId == "-- Select --"){
            return {
                isValid: false,
                message:  "Select Status"
            };
        }else if (this.state.expectedDate.trim() == '' || this.state.expectedDate == null) {
            return {
                isValid: false,
                message:  "Select Expected Date"
            };
        }else if (this.state.description.trim() == '' || this.state.description == null){
            return {
                isValid: false,
                message:  "Enter the Description"
            };
        }else{
            return {
                isValid: true
            };
        }
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

    rowHasChanged(r1, r2) {
        return r1 == r2;
    }
    updateLayout = (index,value) => {
        console.log("Values in update",value)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        console.log("Is update click",[...this.state.queryList],"Index",index)
        const array = [...this.state.queryList];
        
        array.map((value, placeindex) =>
          placeindex === index
            ? (array[placeindex]['IsSelect'] = !array[placeindex]['IsSelect'])
            : (array[placeindex]['IsSelect'] = false)
        );
        this.setState(() => {
          return {
            leaveTypes: array,
          };
        },()=>{
            if(array[index]['IsSelect'] == false){
                this.refreshScreen();
            }
        });
        // this.natureofWorkdata(array[index]['TASK_ID'])
    };

    updateAppliedLayout = (index,value) => {
        console.log("Values in updating",value)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        console.log("Is update Applied click",[...this.state.queryteamList],"Index",index)
        const array = [...this.state.queryteamList];
        
        array.map((value, placeindex) =>
          placeindex === index
            ? (array[placeindex]['IsSelect'] = !array[placeindex]['IsSelect'])
            : (array[placeindex]['IsSelect'] = false)
        );
        this.setState(() => {
          return {
            oDItems: array,
          };
        },()=>{
            if(array[index]['IsSelect'] == false){
                this.refreshScreen();
            }
        });
        // this.natureofWorkdata(array[index]['TASK_ID'])
    };

    openPanel = () => {
        this.setState({ swipeablePanelActive: true });
    };

    closePanel = () => {
        this.setState({ 
            swipeablePanelActive: false,
            isSearchView: false,
         });
    };

    searchView = () => {
        this.setState({
            isSearchView : true,
            swipeablePanelActive: true,
        })
    }

    renderItem = (data,rowMap) => {
        return <VisibleItem 
        data = {data}
        />
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
                        this.state.isListLoading 
                        ? 
                        <View style={styles.loading}>
                            <ActivityIndicator size='large'/> 
                        </View>
                        :
                        <FirstTab  
                            dateInfo = {this.state.selected}
                            stateInfo = {this.state}
                            updateValue = {this.updateLayout}
                            refreshScreen = {this.refreshScreen}
                            />
                        }
                    </View>
                )
            case 'second':
                return (
                    <View>
                        {
                        this.state.isListLoading 
                        ? 
                        <View style={styles.loading}>
                            <ActivityIndicator size='large'/> 
                        </View>
                        :
                        <TeamTab 
                        stateInfo = {this.state}
                        dateInfo = {this.state.selected}
                        updateAppliedLayout = {this.updateAppliedLayout}
                        refreshScreen = {this.refreshScreen}
                        />
                        }
                    </View>
                )
        }
    }

    statusVal = (status) =>{
        var selectId = statusList.filter((item,index)=>{
            return(item.Id === status)
        })
        // this.setState({
        //     statusId: selectId[0].Id,
        //     statusVal: selectId[0].hiddenCode
        // })
        return selectId[0].hiddenCode
    }

    renderAgenda(value){
        let {birthdayInfo,serviceInfo,weddingInfo,userInfo} = this.state;
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

    render(){

        var {calData,markedDates,myDate,isSearchView} = this.state;
      return(
          // <ImageBackground source={require('../../assets/background.png')} style={styles.background}> 
            <Container >
                <Header  style={{ backgroundColor: 'white' }}>
                    <Left>
                        <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} />
                    </Left>
                    <Body>
                        <HeaderTitle title= "Ask HR" />
                    </Body>
                    <Right>
                        {
                                Validate.isNotNull(this.state.userInfo.employeeImageUri)
                                ?
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"AskHR"})}>
                                    <Thumbnail square large source={{ uri: 'data:image/png;base64,' + this.state.userInfo.employeeImageUri}} style={{ borderRadius: 50, height: 40, width: 40 }} />
                                </TouchableOpacity>
                                    :
                                <TouchableOpacity onPress ={() => this.props.navigation.navigate('Settings',{navigateVal:"AskHR"})}>
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
                  renderDay={this.renderDay.bind(this)}
                  // theme={{ backgroundColor: 'transparent', agendaKnobColor: '#580073' }}
                  pastScrollRange={50}
                  futureScrollRange={50}
                  hideKnob={false}
                  onCalendarToggled={this.onCalendarToggled.bind(this)}
                  theme={{
                      backgroundColor: 'transparent', agendaKnobColor: '#580073',
                      'stylesheet.calendar.header': { week: { marginTop: Platform.OS=='ios'?6:2, flexDirection: 'row', } }
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

                {/* <TabView
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
                /> */}
                <ScrollView>
                 {  
                    this.state.isListLoading 
                    ?
                    <ActivityIndicator size='large' style={{marginTop:10}}/>
                    :
                    <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10,marginBottom:50}}>
                    {
                        this.state.queryList.length > 0 &&
                        this.state.queryList.map((item,key)=>(
                        <Card  style={{width:'100%',borderRadius:10,padding:5,marginTop:5,marginBottom:5}}>    
                            <CardItem cardBody>
                                <TouchableOpacity activeOpacity={0.8} onPress = {()=>  this.props.navigation.navigate('Chat', { EmpDetail : item, Type:"View", user:"MyTask" })}>
                                    <View  style={{flexDirection: 'row', justifyContent:'center', width: '100%',marginTop:10,marginBottom:10}}>
                                        <View style={ {width:'50%',alignItems:'flex-start'} }>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {item.requesterName} </Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2, color: '#434a54' }}> {item.module} </Text>
                                        </View>
                                        <View style={{width:'50%',alignItems:'flex-end'} }>
                                            <View>
                                                <View style={[{minWidth:60,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.statusVal(item.status)}</Text>    
                                                </View>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ textAlign:'center',fontSize: 12, margin: 2,padding: 5, color: '#434a54' }}> {item.priority} </Text>
                                            </View>
                                            
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardItem>
                        </Card>
                        ))
                    }
                    <View style={{marginTop:15}}></View>
                    {
                        this.state.queryteamList.length > 0 &&
                        this.state.queryteamList.map((item,key)=>(
                        <Card  style={{width:'100%',borderRadius:10,padding:5,marginTop:5,marginBottom:5}}>    
                            <CardItem cardBody>
                                <TouchableOpacity activeOpacity={0.8} onPress = {()=>  this.props.navigation.navigate('Chat', { EmpDetail : item, Type:"View", user:"TeamTask" })}>
                                    <View  style={{flexDirection: 'row', justifyContent:'center', width: '100%',marginTop:10,marginBottom:10}}>
                                        <View style={ {width:'50%',alignItems:'flex-start'} }>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {item.requesterName} </Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2, color: '#434a54' }}> {item.module} </Text>
                                        </View>
                                        <View style={{width:'50%',alignItems:'flex-end'} }>
                                            <View>
                                                <View style={[{minWidth:60,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.statusVal(item.status)}</Text>    
                                                </View>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ textAlign:'center',fontSize: 12, margin: 2,padding: 5, color: '#434a54' }}> {item.priority} </Text>
                                            </View>
                                            
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardItem>
                        </Card>
                        ))
                    }
                    {
                    ((this.state.queryList.length == 0) && (this.state.queryteamList.length == 0)) &&
                    <NoRecordsFound/>
                    }
                    </View>
                }
                </ScrollView>
                <Fab
                    active = "true"
                    direction="right"
                    containerStyle={{}}
                    style={{ backgroundColor: '#fff' }}
                    onPress={() => 
                        this.props.navigation.navigate('Chat', { EmpDetail : {}, Type:"Create", user:"MyTask"})
                        // this.openPanel()
                    }
                    position="bottomRight"
                    >
                    <CSIcon name={"Artboard-401x-100"} size={28} style={{color:'#580073'}}/>
                </Fab>

                <SwipeablePanel isActive={this.state.swipeablePanelActive} 
                    fullWidth={true} 
                    openLarge={true}
                    showCloseButton = {true}
                    onClose = {()=>this.closePanel()}>
                     {   
                    !isSearchView ?
                    <View style={{margin:10}}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16,fontWeight:'bold', color: '#580073',textAlign:'center' }} > New Query </Text>
                        <View style={{ padding:5,flexDirection: 'row',marginTop:15 }}>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Module </Text>
                            </View>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Category </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',}}>
                                <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onModulepress()}>
                                    <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}]}>
                                        <Text> {this.state.popupModuleVal} </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onCategorypress()}>
                                    <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', justifyContent:'center',borderWidth:2, borderColor:'transparent'}]}>
                                        <Text> {this.state.popupCategoryVal} </Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <View style={{ padding:5,flexDirection: 'row',marginTop:15 }}>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Priority </Text>
                            </View>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc' ,fontWeight:'bold'}} > Severity </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',}}>
                                <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onPrioritypress()}>
                                    <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}]}>
                                        <Text> {this.state.priorityVal} </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onSeveritypress()}>
                                    <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', justifyContent:'center',borderWidth:2, borderColor:'transparent'}]}>
                                        <Text> {this.state.severityVal} </Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <View style={{ padding:5,flexDirection: 'row',marginTop:15 }}>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Status </Text>
                            </View>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Expected Date </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',}}>
                                <TouchableOpacity style={{width:'50%',padding:5}} > 
                                {/* onPress={()=> this.onStatuspress()} */}
                                    <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}]}>
                                        <Text> {this.state.statusVal} </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.toDatepress()}>
                                    <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2, borderColor:'transparent'}]}>
                                        <Text> {this.state.expectedDate} </Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15,marginTop:10, padding: 5, color: '#ccc',fontWeight:'bold' }}> Description </Text>
                        <View style={[{height:80, borderRadius:5,backgroundColor:'#edebeb',margin:5,marginTop:10,borderColor:'transparent'}]}>
                            <Textarea rowSpan={3} placeholderTextColor='#ccc'  placeholder="Comments" 
                                onChangeText={this.onChangeTextArea} 
                                value={this.state.description} 
                                />
                        </View>
                        <View style={{flexDirection: 'row',justifyContent:'center',marginTop:10}}>
                            <View style = {{justifyContent:'center',padding:5,width:'50%'}}>
                                <Button padder rounded style={{justifyContent:'center',backgroundColor:'#edebeb',width:'100%'}}
                                    onPress={() => this.closePanel()}>
                                    <Text style={{alignSelf:'center',color:'#000',fontWeight:'bold',fontSize:14}}>Cancel</Text>
                                </Button>
                            </View>
                            <View style = {{justifyContent:'center',padding:5,width:'50%'}}>
                                <Button padder rounded style={{justifyContent:'center',backgroundColor:'#580073',width:'100%'}}
                                    onPress={() => this._saveQueryInfo()}>
                                    {this.state.isLoading ? <ActivityIndicator /> :<Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}>Add a Query</Text>}
                                </Button>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{margin:10}}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16,fontWeight:'bold', color: '#580073',textAlign:'center' }} > Search Query </Text>
                        <View style={{ padding:5,flexDirection: 'row',marginTop:15 }}>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Module </Text>
                            </View>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Status </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',}}>
                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onsearchModulepress()}>
                                <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}]}>
                                    <Text> {this.state.searchpopupModuleVal} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onsearchStatuspress()}>
                                <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}]}>
                                    <Text> {this.state.searchstatusVal} </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding:5,flexDirection: 'row',marginTop:15 }}>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Priority </Text>
                            </View>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc' ,fontWeight:'bold'}} > Severity </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',}}>
                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onsearchPrioritypress()}>
                                <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}]}>
                                    <Text> {this.state.searchpriorityVal} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onsearchSeveritypress()}>
                                <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb', justifyContent:'center',borderWidth:2, borderColor:'transparent'}]}>
                                    <Text> {this.state.searchseverityVal} </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding:5,flexDirection: 'row',marginTop:15 }}>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Employee Query No </Text>
                            </View>
                            <View style={{width:'50%',padding:5}}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc',fontWeight:'bold' }} > Requestor </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row',}}>
                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.onEmpQuerypress()}>
                                <View style={[{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}]}>
                                    <Text> {this.state.searchEmpQurVal} </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width:'50%',padding:5}}>
                                <View style={{ height:35, borderRadius:5,backgroundColor:'#edebeb',justifyContent:'center', borderWidth:2,borderColor:'transparent'}}>
                                    <Input  placeholder='Type a Requestor' onChangeText={this.onChangeRequestor} style={{ height: 35, fontSize: 14, width:"90%" }} />
                                </View>
                            </View>
                        </View>
                        
                        <View style={{flexDirection: 'row',justifyContent:'center',marginTop:10}}>
                            <View style = {{justifyContent:'center',padding:10,width:'50%'}}>
                                <Button padder rounded style={{justifyContent:'center',backgroundColor:'#edebeb'}}
                                    onPress={() => this.closePanel()}>
                                    <Text style={{alignSelf:'center',color:'#000',fontWeight:'bold',fontSize:14}}>Cancel</Text>
                                </Button>
                            </View>
                            <View style = {{justifyContent:'center',padding:10,width:'50%'}}>
                                <Button padder rounded style={{justifyContent:'center',backgroundColor:'#580073'}}
                                    onPress={() => this._searchQueryInfo()}>
                                    {this.state.isLoading ? <ActivityIndicator /> :<Text style={{alignSelf:'center',color:'#ffffff',fontWeight:'bold',fontSize:14}}> Search </Text>}
                                </Button>
                            </View>
                        </View> 
                    </View>
                    }
                    <ModuleRBSheet
                        ref={ref => {
                            this.ModuleRBSheet = ref;
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
                           selectedItem = {this.state.popupModuleId}
                           itemList = {this.state.modalList}
                           onPickerSelect = {this.onModuleChange.bind(this)}
                        />
                    </ModuleRBSheet>
                    <SearchModuleRBSheet
                        ref={ref => {
                            this.SearchModuleRBSheet = ref;
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
                           selectedItem = {this.state.searchpopupModuleId}
                           itemList = {this.state.modalList}
                           onPickerSelect = {this.onsearchModuleChange.bind(this)}
                        />
                    </SearchModuleRBSheet>

                    <EmpQueryRBSheet
                        ref={ref => {
                            this.EmpQueryRBSheet = ref;
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
                           selectedItem = {this.state.searchEmpQurId}
                           itemList = {this.state.empQueryList}
                           onPickerSelect = {this.onEmpQueryChange.bind(this)}
                        />
                    </EmpQueryRBSheet>
                    <CatRBSheet
                        ref={ref => {
                            this.CatRBSheet = ref;
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
                           selectedItem = {this.state.popupCategoryId}
                           itemList = {this.state.categoryList}
                           onPickerSelect = {this.onCategoryChange.bind(this)}
                        />
                    </CatRBSheet>
                    <PriRBSheet
                        ref={ref => {
                            this.PriRBSheet = ref;
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
                           selectedItem = {this.state.priorityVal}
                           itemList = {priorityList}
                           onPickerSelect = {this.onPriorityChange.bind(this)}
                        />
                    </PriRBSheet>
                    <SevRBSheet
                        ref={ref => {
                            this.SevRBSheet = ref;
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
                           selectedItem = {this.state.severityVal}
                           itemList = {severityList}
                           onPickerSelect = {this.onSeverityChange.bind(this)}
                        />
                    </SevRBSheet>
                    <SearchPriRBSheet
                        ref={ref => {
                            this.SearchPriRBSheet = ref;
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
                           selectedItem = {this.state.searchpriorityVal}
                           itemList = {priorityList}
                           onPickerSelect = {this.onsearchPriorityChange.bind(this)}
                        />
                    </SearchPriRBSheet>
                    <SearchSevRBSheet
                        ref={ref => {
                            this.SearchSevRBSheet = ref;
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
                           selectedItem = {this.state.searchseverityVal}
                           itemList = {severityList}
                           onPickerSelect = {this.onsearchSeverityChange.bind(this)}
                        />
                    </SearchSevRBSheet>
                    <StatusRBSheet
                        ref={ref => {
                            this.StatusRBSheet = ref;
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
                           selectedItem = {this.state.statusId}
                           itemList = {statusList}
                           onPickerSelect = {this.onStatusChange.bind(this)}
                        />
                    </StatusRBSheet>
                    <SearchStatusRBSheet
                        ref={ref => {
                            this.SearchStatusRBSheet = ref;
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
                           selectedItem = {this.state.searchstatusId}
                           itemList = {statusList}
                           onPickerSelect = {this.onsearchStatusChange.bind(this)}
                        />
                    </SearchStatusRBSheet>
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
                </SwipeablePanel>
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
            </Container>
        )
    }
}

const FirstTab = props =>{
    var {stateInfo,panelActive} = props
    return(
        <ScrollView keyboardShouldPersistTaps={'handled'}>{
            stateInfo.queryList.length > 0 
            ?
                <View style={{width:SCREEN_WIDTH,marginTop:5,marginBottom:15}}>
                    {
                        stateInfo.queryList.length > 0 &&
                        stateInfo.queryList.map((item,key)=>(
                            <ExpandableComponent 
                                taskType= {"MyTask"} 
                                taskList= {item}
                                taskId = {key} 
                                dateInfo = {stateInfo.selected}
                                updateValue = {props.updateValue}
                                refreshScreen = {props.refreshScreen}
                            />
                        ))
                    }
                </View>
            :
            <NoRecordsFound/>
            }
        </ScrollView>
    )
}


const TeamTab = props => {
    var {stateInfo} = props;
    return(
        <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={{width:SCREEN_WIDTH,marginTop:20,marginBottom:120}}>
                {
                    stateInfo.queryteamList.length > 0 
                    ?
                    stateInfo.queryteamList.length > 0 &&
                    stateInfo.queryteamList.map((item,key)=>(
                        <ExpandableComponent 
                            taskType= {"TeamTask"} 
                            taskList= {item}
                            taskId = {key} 
                            dateInfo = {stateInfo.selected}
                            updateAppliedLayout = {props.updateAppliedLayout}
                            refreshScreen = {props.refreshScreen}
                        />
                    ))
                    :
                    <NoRecordsFound/>
                }
            </View>
        </ScrollView>
    )
}

const VisibleItem = props =>{
    var {data} = props;
   var screen = Dimensions.get('window');
    return(
        <View style={{padding:10}}>
            { data.item.type == "ONDUTY" ?
            <Card padder style={{width:'100%',borderRadius:15}}>
            <CardItem cardBody>
                <View style={styles.standaloneRowFront}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: screen.width }}>
                        <View style={  styles.header}>
                            <Text style={styles.hours}> 
                            {data.item.employeeName}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'column',width:'80%',}}>
                            <View  style={ styles.content }>
                            <View style={{ width: '100%',  flexDirection: 'column' }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,textAlign: 'left',color: '#7666fe' }}> {data.item.type} </Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {data.item.startDate} to {data.item.endDate}</Text>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{data.item.reason} </Text>
                                <View style={[{minWidth:40,maxWidth:140, height:35, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                    <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> {data.item.stringDuration} </Text>
                                </View>
                            </View>
                            </View>
                        </View>
                    </View>
                </View>
            </CardItem>
            </Card>
            :
           <Card padder style={{width:'100%',borderRadius:15}}>
                   <CardItem cardBody>
               <View style={styles.standaloneRowFront}>
                   <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: screen.width }}>
                       <View style={  styles.header}>
                           <Text style={styles.hours}> 
                           {data.item.employeeName}
                           </Text>
                       </View>
                       <View style={{flexDirection: 'column',width:'80%',}}>
                           <View  style={ styles.content }>
                           <View style={{ width: '80%',  flexDirection: 'column' }}>
                               <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,textAlign: 'left',color: '#7666fe' }}> {data.item.displayLeaveType} </Text>
                               <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {data.item.leaveFromDate} to {data.item.leaveToDate}</Text>
                               <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{data.item.leaveRemarks} </Text>
                               <View style={[{minWidth:40,maxWidth:140, height:30,marginTop:5, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                   <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> {data.item.PhoneNumber} </Text>
                               </View>
                           </View>
                           <View style={{width:'20%',justifyContent:'center'}}>
                               <Text style={{fontWeight:'bold',color:'#434a54',textAlign:'center',fontSize:14}}> {data.item.noOfDays}</Text>    
                           </View>
                           </View>
                       </View>
                   </View>
               </View>
           </CardItem>
           </Card>
            }
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

class ExpandableComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            layoutHeight: 0,
            userInfo : {},
            sessionData : '',
            istaskLoading: false,
            chatList : [],
            chatInfo: {},
            comments : '',
            statusVal: '',
            statusId: '',
            closedDate: '',
            toClosedDate: new Date(),
            updateInfo: {},
            isInfoPressed : false,
        }
        this.callmsgValself = React.createRef();
        this.callmsgValTeam = React.createRef();
    }

    async componentDidMount(){
        let UserInfo = await AsyncStorage.getItem('userInfo');
        let sessionKey = await AsyncStorage.getItem('sessionKey');
        this.setState({
            userInfo : JSON.parse(UserInfo),
            sessionData : sessionKey
        })
        this.props.fetchData();
        this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
            this.props.fetchData();
        }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription();
      }

    async componentWillReceiveProps(nextProps) {
        
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

    onChangeMessage = (value) => {
        this.setState({ comments: value })
    }

    chatInfoView = (val) => {
        this.setState({
            isInfoPressed : val
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.layoutHeight !== nextState.layoutHeight) || (this.state.chatList !== nextState.chatList)
        || (this.state.statusId !== nextState.statusId) || (this.state.statusVal !== nextState.statusVal) || 
        (this.state.closedDate !== nextState.closedDate) || (this.state.toClosedDate !== nextState.toClosedDate) || (this.state.isInfoPressed !== nextState.isInfoPressed)
        ||(this.state.comments !== nextState.comments)) {
            return true;
        }
        return false;
    }

    statusVal = (status) =>{
        var selectId = statusList.filter((item,index)=>{
            return(item.Id === status)
        })
        this.setState({
            statusId: selectId[0].Id,
            statusVal: selectId[0].hiddenCode
        })
        return selectId[0].hiddenCode
    }

    onStatuspress = () =>{
        this.StatusRBSheet.open()
    }

    onStatusChange = (value) =>{

        var selectId = statusList.filter((item,index)=>{
            return(item.hiddenId === value)
       })
       this.setState({
           statusId: selectId[0].Id,
           statusVal: selectId[0].hiddenCode
       })

    }

    closeDatepress = () =>{
        var myDate = new Date();
        this.setState({
            toClosedDate: myDate,
            closedDate : this.ChangeUrlDate(myDate),
        })
        this.TopickRBSheet.open()
    }

    ontoDateChange= (value) => {
        this.setState({
            toClosedDate: value,
            closedDate : this.ChangeUrlDate(value),
        })
    }


    myTaskPress = (id,value,taskType,val) => {

        this.setState({
            istaskLoading : true,
        })
        var postData = {
            sessionKey: this.state.sessionData,
            internalRequestId: value.internalRequestId
        }
        console.log("chat Req",this.state.sessionData);
        console.log("User Details",this.state.userInfo);
        Api.chatListHR(postData,function(response){
            if (response.success) {
                console.log("chat response",response)
                if(response.data !== null){
                    let chatData = response.chatList.length > 0 ? response.chatList : []
                    this.setState({
                        chatList: chatData,
                        chatInfo: response.data,
                        updateInfo: value,
                        istaskLoading : false,
                    })
                }else{
                    this.setState({
                        istaskLoading : false,
                    })
                }
                if(val == ""){
                    taskType == "MyTask" ? this.props.updateValue(id,value) : this.props.updateAppliedLayout(id,value);
                }
            }else{
            this.toastRej.show(response.errorMessage)
            this.setState({
                istaskLoading : false,
            })
            }
                
        }.bind(this))
    }

    querySubmit = (Val) =>{
        Val == "TEAM" ? this.callmsgValTeam.current._root.clear() : this.callmsgValself.current._root.clear()
        var checkValidation = this.queryValidate();
            if(checkValidation.isValid){
            var dummyList = {
                commentEntryDate: "",
                commentEntryTime: "",
                internalCommentId: 0,
                internalComments: this.state.comments,
                ownerEmployeeId: 0,
                ownerEmployeeName: "",
                ownerFlag: "Y",
                ownerId: 0,
                ownerName: "",
            }
            var postData = {
                sessionKey : this.state.sessionData,
                internalRequestId:this.state.chatInfo.internalRequestId,
                internalRequestNo:this.state.chatInfo.internalRequestNo,
                componentId:this.state.chatInfo.moduleId,
                moduleCategoryId:this.state.chatInfo.categoryId,
                priority:this.state.chatInfo.priority,
                severity:this.state.chatInfo.severity,
                expectedDate:this.state.chatInfo.expectedDate,
                status:this.state.statusId,
                description:this.state.comments,
                deliveryDate:this.state.closedDate == "" ? "" : this.MarkedDatePass(this.state.closedDate),
            }
            console.log("Request postData",postData)
            Api.HRsave(postData, function(response){
                if (response.success) {
                    if(response.data !== null){
                        console.log("Save HR Response",response.data)
                        this.setState({
                            comments : ''
                        },()=>{
                            this.myTaskPress(this.props.taskId,this.props.taskList,this.props.taskType,"Update");
                        })
                    }else{
                        this.setState({
                            isLoading : false,
                        })
                    }
                }else{
                CommonData.toastFailureAlert(response.errorMessage)
                }
            }.bind(this))
        } else {
            CommonData.toastFailureAlert(checkValidation.message)

        }
    }

    queryValidate = () => {

        if (this.state.comments.trim() == '' || this.state.comments == null ) {
            return {
                isValid: false,
                message:  "Enter the Comments"
            };
        }else if(this.state.statusVal == "Closed" && this.state.closedDate == ''){
            return {
                isValid: false,
                message:  "Enter the Closed Date"
            };
        } else {
            return {
                isValid: true
            };
        }
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

    ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = ("0" + (d.getDate().toString())).slice(-2).toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    render() {
        var value = this.props.taskList;
        var id = this.props.taskId;
        console.log("UserInfo ",this.state.userInfo)
        return(
            <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:5}}>
                {
                this.props.taskType === "MyTask" ?
                <Card style={{width:'100%',borderRadius:10,padding:5,marginTop:5,marginBottom:5}}>    
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8} onPress = {()=> 
                        // this.props.navigation.navigate('Chat', { EmpDetail : value, Type:"View", user:taskType })
                            this.myTaskPress(id,value,this.props.taskType,"")
                            }>
                            <View  style={{flexDirection: 'row', width: '100%',marginTop:10,marginBottom:10}}>
                                
                                {
                                    value.IsSelect &&
                                     !this.state.isInfoPressed &&
                                    <Button transparent style={{width:'10%',justifyContent:'center'}} onPress={() => { this.chatInfoView(true) }}>
                                        <CSIcon name="Artboard-311x-100" size={25} color="#ccc" />
                                    </Button>
                                }
                                <View style={(value.IsSelect && !this.state.isInfoPressed ) ? {width:'50%',justifyContent:'center'} : {width:'80%',justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {value.requesterName} </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2, color: '#434a54' }}> {value.module} </Text>
                                </View>
                                <View style={(value.IsSelect && !this.state.isInfoPressed ) ? {width:'40%',justifyContent:'flex-end'} : {width:'20%',justifyContent:'flex-end'}}>
                                    { value.IsSelect ? 
                                    <View>
                                        {
                                        !this.state.isInfoPressed ?
                                        <View>
                                            <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.statusVal(value.status)}</Text>    
                                            </View>
                                            {
                                                this.state.statusId == "C" &&
                                            <TouchableOpacity style={{width:'50%',padding:5}} onPress={()=> this.closeDatepress()}>
                                                <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text> {this.state.closedDate == '' ? " Closed date " :this.state.closedDate } </Text>
                                                </View>
                                            </TouchableOpacity>
                                            }
                                        </View>  
                                        :
                                        <View>
                                            <Button transparent style={{justifyContent:'flex-end',marginTop:7,marginLeft:15}} onPress={() => { this.chatInfoView(false) }}>
                                                <CSIcon name="Artboard-20" size={25} color="#ccc" />
                                            </Button>
                                        </View> 
                                        }
                                    </View>
                                    :
                                    <View>
                                        <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                            <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.statusVal(value.status)}</Text>    
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ textAlign:'center',fontSize: 12, margin: 2,padding: 5, color: '#434a54' }}> {value.priority} </Text>
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
                                
                                {
                                this.state.isInfoPressed 
                                ?
                                    <View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc'}} > Module </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc'}} > Category </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.module} </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.category} </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row'}}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc' }} > Priority </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc' }} > Severity </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.priority} </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.severity} </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc' }} > Status </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc'}} > expectedDate </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row'}}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.statusVal} </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.expectedDate} </Text>
                                            </View>
                                        </View>
                                    </View>
                                :   
                                this.state.istaskLoading 
                                ? 
                                <ActivityIndicator/>
                                :
                                this.state.chatList.length > 0 &&
                                this.state.chatList.map((item,key)=>(
                                    <View key={key}>
                                        {
                                            item.ownerEmployeeId == this.state.userInfo.employeeId
                                            ?
                                            <View style={{
                                                backgroundColor: "#0078fe",
                                                padding:10,
                                                marginLeft: '45%',
                                                borderRadius: 5,
                                                marginTop: 5,
                                                maxWidth: '80%',
                                                alignSelf: 'flex-end',
                                                borderRadius: 20,
                                              }} key={key}>
                                                  <Text style={{ fontSize: 16, color: "#fff",marginRight: "6%" }} key={key}> {item.internalComments}</Text>
                                                <View style={styles.rightArrow}/>
                                                {/* <View style={styles.rightArrowOverlap}/> */}
                                            </View>
                                            :
                                            <View style={{
                                                backgroundColor: "#dedede",
                                                padding:10,
                                                borderRadius: 5,
                                                marginTop: 5,
                                                maxWidth: '80%',
                                                alignSelf: 'flex-start',
                                                borderRadius: 20,
                                              }} key={key}>
                                                  <Text style={{ fontSize: 16, color: "#000",marginLeft: "6%" }} key={key}> {item.internalComments}</Text>
                                                <View style={styles.leftArrow}></View>
                                                {/* <View style={styles.leftArrowOverlap}></View>  */}
                                            </View>
                                        }
                                    </View>
                                )) 
                                }
                                {
                                !this.state.isInfoPressed &&
                                <View style={{ width: "100%",backgroundColor: '#dedede',marginTop:10,borderRadius:10 }}>
                                    <View style={{ width: "100%",flexDirection:'row', height: 57, alignItems: 'center', justifyContent: 'center' }}>
                                        <Input ref={this.callmsgValself}  placeholder='Type a message' onChangeText={ this.onChangeMessage} style={{ height: 36, fontSize: 14,width:"90%" }} />
                                        <Button transparent style={{width:'10%'}} onPress={() =>  this.querySubmit("SELF") }>
                                            <CSIcon name="Artboard-67" size={34} color="#fff" />
                                        </Button>
                                    </View>
                                </View>
                                }
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                :
                <Card style={{width:'100%',borderRadius:10,padding:5,marginTop:5,marginBottom:5}}>    
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8} onPress = {()=> this.myTaskPress(id,value,this.props.taskType,"")}>
                            <View  style={{flexDirection: 'row', width: '100%',marginTop:10,marginBottom:10}}>
                                {
                                    value.IsSelect &&
                                    !this.state.isInfoPressed &&
                                    <Button transparent style={{width:'10%',justifyContent:'center'}} onPress={() => { this.chatInfoView(true) }}>
                                        <CSIcon name="Artboard-311x-100" size={25} color="#ccc" />
                                    </Button>
                                }
                                <View style={(value.IsSelect && !this.state.isInfoPressed ) ? {width:'50%',justifyContent:'center'} :{width:'80%',justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> {value.requesterName} </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2, color: '#434a54' }}> {value.module} </Text>
                                </View>
                                <View style={(value.IsSelect && !this.state.isInfoPressed ) ? {width:'40%',justifyContent:'flex-end'} : {width:'20%',justifyContent:'flex-end'}}>
                                    {value.IsSelect ? 
                                    <View>
                                        { 
                                        !this.state.isInfoPressed 
                                        ?
                                        <View>
                                            <TouchableOpacity onPress={()=> this.onStatuspress()}>
                                                <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.state.statusVal} </Text>
                                                </View>
                                            </TouchableOpacity>
                                            {
                                                this.state.statusId == "C" &&
                                            <TouchableOpacity  onPress={()=> this.closeDatepress()}>
                                                <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                    <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.state.closedDate} </Text>
                                                </View>
                                            </TouchableOpacity>
                                            }
                                        </View>
                                        :
                                        <View>
                                            <Button transparent style={{justifyContent:'flex-end',marginTop:2}} onPress={() => { this.chatInfoView(false) }}>
                                                <CSIcon name="Artboard-20" size={25} color="#ccc" />
                                            </Button>
                                        </View> 
                                        }
                                    </View>
                                    :
                                    <View>
                                        <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                            <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.statusVal(value.status)}</Text>    
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ textAlign:'center',fontSize: 12, margin: 2,padding: 5, color: '#434a54' }}> {value.priority} </Text>
                                    </View>
                                    }
                                </View>
                            </View>
                            <View style={
                                    value.IsSelect ? 
                                {
                                    height: this.state.layoutHeight,
                                    overflow: 'visible',marginBottom:10} : 
                                    {height: this.state.layoutHeight,
                                    overflow: 'hidden'}}>
                                {
                                this.state.isInfoPressed 
                                ?
                                    <View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc'}} > Module </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc'}} > Category </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.module} </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.category} </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row'}}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc' }} > Priority </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc' }} > Severity </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.priority} </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.severity} </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row' }}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc' }} > Status </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: '#ccc'}} > expectedDate </Text>
                                            </View>
                                        </View>
                                        <View style={{ padding:5,flexDirection: 'row'}}>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.statusVal} </Text>
                                            </View>
                                            <View style={{width:'50%',padding:5}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.chatInfo.expectedDate} </Text>
                                            </View>
                                        </View>
                                    </View>
                                : 
                                this.state.istaskLoading 
                                ? 
                                <ActivityIndicator/>
                                :
                                this.state.chatList.length > 0 &&
                                this.state.chatList.map((item,key)=>(
                                    <View key={key}>
                                        {
                                            item.ownerEmployeeId == this.state.userInfo.employeeId
                                            ?
                                            <View style={{
                                                backgroundColor: "#0078fe",
                                                padding:10,
                                                marginLeft: '45%',
                                                borderRadius: 5,
                                                marginTop: 5,
                                                maxWidth: '80%',
                                                alignSelf: 'flex-end',
                                                borderRadius: 20,
                                              }} key={key}>
                                                  <Text style={{ fontSize: 16, color: "#fff", marginRight: "6%"}} key={key}> {item.internalComments}</Text>
                                                <View style={styles.rightArrow}/>
                                                {/* <View style={styles.rightArrowOverlap}/> */}
                                            </View>
                                            :
                                            <View style={{
                                                backgroundColor: "#dedede",
                                                padding:10,
                                                borderRadius: 5,
                                                marginTop: 5,
                                                maxWidth: '80%',
                                                alignSelf: 'flex-start',
                                                borderRadius: 20,
                                              }} key={key}>
                                                  <Text style={{ fontSize: 16, color: "#000",marginLeft: "6%" }} key={key}> {item.internalComments}</Text>
                                                <View style={styles.leftArrow}></View>
                                                {/* <View style={styles.leftArrowOverlap}></View>  */}
                                            </View>
                                        }
                                    </View>
                                ))
                                }
                                {
                                !this.state.isInfoPressed &&
                                <View style={{ width: "100%",backgroundColor: '#dedede',marginTop:10,borderRadius:10 }}>
                                    <View style={{ width: "100%",flexDirection:'row', height: 57, alignItems: 'center', justifyContent: 'center' }}>
                                        <Input ref={this.callmsgValTeam} placeholder='Type a message' onChangeText={this.onChangeMessage} style={{ height: 36, fontSize: 14,width:"90%" }} />
                                        <Button transparent style={{width:'10%'}} onPress={() => {this.querySubmit("TEAM")}}>
                                            <CSIcon name="Artboard-67" size={34} color="#fff" />
                                        </Button>
                                    </View>
                                </View>
                                }
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                }
                <StatusRBSheet
                    ref={ref => {
                        this.StatusRBSheet = ref;
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
                        selectedItem = {this.state.statusId}
                        itemList = {statusList}
                        onPickerSelect = {this.onStatusChange.bind(this)}
                    />
                </StatusRBSheet>

                <TopickRBSheet
                    ref={ref => {
                        this.TopickRBSheet = ref;
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
                        selectedItem = {this.state.toClosedDate}
                        onPickerSelect = {this.ontoDateChange.bind(this)}
                    />
                </TopickRBSheet>

                <ToastReject
                        ref={(toastReject) => this.toastReject = toastReject}
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
            </View>
        )
    }    
}


const styles = StyleSheet.create({
    assignedcircle:{ 
        justifyContent:'center',
        width:'15%',
        borderRadius: 50/2,  
        height: 52, 
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

    rightArrow: {
        position: "absolute",
        backgroundColor: "#0078fe",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: 0
    },
      
    rightArrowOverlap: {
        position: "absolute",
        backgroundColor: "#eeeeee",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -10
      
    },
      
      /*Arrow head for recevied messages*/
    leftArrow: {
        position: "absolute",
        backgroundColor: "#dedede",
        // backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomRightRadius: 25,
        left:0
    },
      
    leftArrowOverlap: {
        position: "absolute",
        backgroundColor: "#dedede",
        // backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomRightRadius: 18,
        left: -8,  
        top:0
    },
    
});
