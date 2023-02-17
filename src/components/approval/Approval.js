import React from 'react';
// import { Agenda } from 'react-native-calendars';
import moment from 'moment';
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
    ListItem,
    Content,
    Text,
    View,
    Form,
    Textarea,
    H3,Subtitle,Footer
} from "native-base";
import { StyleSheet, Dimensions, StatusBar, AsyncStorage, TouchableOpacity,Modal, Platform } from 'react-native';
import * as Api from '../../services/api/approval';
import NoRecordsFound from '../noRecordFound';
import { SwipeRow } from 'react-native-swipe-list-view';
import { CommonData } from '../../utils';
import HeaderTitle from '../HeaderTitle';

const RejectinfoModel = (props) => {
    var screen = Dimensions.get('window');
    return(
        <Modal 
        animationType="fade"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
            props.showrejectionModal(false)
    }}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View padder style={{width: 300, height: 250, backgroundColor: '#fff', borderRadius: 5, justifyContent: 'center'}}>
                <Text>Enter reason for Rejection :</Text>
                <Form>
                    <Textarea rowSpan={5} bordered placeholder="Rejection reason" onChangeText={(value) => props.onChangeData(value)} />
                </Form>
                <View style={{flex:1,flexDirection: 'row', justifyContent: 'center',marginTop:5,marginBottom:5 }}>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Button style={{width:'70%'}}onPress={() => props.typeReject.lenth == 0 ? props.rejectService() : props.singleReject(props.typeReject)} >
                            <Text style={{ color: 'white',marginLeft:20 }}>Ok</Text>
                        </Button>
                    </View>
                    <View style={{ width:  '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Button style={{width:'70%'}} onPress={() => props.showrejectionModal(false)}>
                            <Text style={{ color: 'white',marginLeft:5 }}>cancel</Text>
                        </Button>
                    </View>
                </View>
            </View>
            </View>
            
        </Modal>
    )
} 

class Approval extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myDate: this.timeToString(new Date()),
            scheduleItems: [],
            filter_select : [],
            markedDates: {},
            navigateData: {},   
            month: '',
            showMonthHead: true,
            mailID: undefined,
            isSelectAll: false,
            selectAllDate:[],
            selectDate: undefined,
            selectedList: [],
            showRejectionview : false,
            onChangeTextArea: '',
            typeReject: {},
        }
        // this.CheckActivity = this.CheckActivity.bind(this);
        this.approveService = this.approveService.bind(this);
        this.rejectService = this.rejectService.bind(this);
        this.showrejectionModal = this.showrejectionModal.bind(this);
        this.onChangeData = this.onChangeData.bind(this);
        this.singleApproval = this.singleApproval.bind(this);
        this.singleReject = this.singleReject.bind(this);
        this.GetTimesheetListData = this.GetTimesheetListData.bind(this);
    }

    async componentDidMount() {

        var MailID = await AsyncStorage.getItem('Email');
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        var marked = {};
        this.setState({
            mailID: MailID
        }, () => {
            var myDate = this.timeToString(new Date());
            this.getMarkedDates(MailID, myDate);
            this.getMonth(month, year);
        })
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

    GetTimesheetListData(mailID, selectedDate) {
        console.log("change Data: ", this.ChangeUrlDate(selectedDate));
        var TimesheetList = {
            MailID: mailID,
            startDate: this.ChangeUrlDate(selectedDate),
            endDate:this.ChangeUrlDate(selectedDate),
            usersID:""
        }
        this.setState({
            navigateData: TimesheetList,
            selectedList: []
        })
        console.log("TimeSheet list Data: ", TimesheetList);
        Api.approvalRequestList(TimesheetList, function (response) {
            console.log("Result Response", response);
            var items = {};
            if (response.success) {
                if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i]['IsSelect']= false;
                        response.data[i]['IsSuccess'] = '';
                        response.data[i]['Message'] = '';
                    }
                    items[selectedDate] = response.data;
                    console.log("Item datas", items);
                }
                else {
                    items[selectedDate] = [];
                    console.log("Item datas empty", items);

                }
                this.setState({
                    scheduleItems: items,
                    selectDate: selectedDate
                })
            }
            else {
                // this.props.navigation.navigate('Auth');
                items[selectedDate] = [];
                this.setState({
                    scheduleItems: items,
                    selectDate : selectedDate
                })
                console.log("Final Else condition", items);

            }
        }.bind(this))
    }

    getMarkedDates(mailID,currentDate) {
        console.log("current get marked date", currentDate)
        var startDate = this.getDateOfPastYear();
        var endDate = this.getDateOfNextYear();
        var RequestedData = {
            MailID: mailID,
            startDate: startDate,
            endDate: endDate,
            usersID:""
        }
        Api.approvemothlist(RequestedData, function (response) {
            if (response.success) {
                var data = response.data;
                var markedDates = {};
                var DatesList;
                console.log("Dates Marked: ",data);
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        console.log("before dateList Marked",data[i]['TIMESHEET_DATE'].toString());
                        DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString());
                        markedDates[DatesList] = {
                            marked: true,
                            dotColor: 'red'
                        }
                    }
                }
                this.setState({
                    markedDates: markedDates,
                }, () => {
                    this.GetTimesheetListData(mailID, currentDate);
                })
            }
            else {
                CommonData.toastWarningAlert(response.errorMessage);
            }
        }.bind(this));
    }

    ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    MarkedDatePass(StringDate) {
        var d = new Date(StringDate);
        var DateChange = d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate().toString();
        return DateChange;
    }


    getDateOfPastYear() {
        var d = new Date();
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var pastYear = d.getFullYear() - 1;
        d.setFullYear(pastYear);
        // var timeToString = this.timeToString(d);
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    getDateOfNextYear() {
        var d = new Date();
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var pastYear = d.getFullYear() + 1;
        d.setFullYear(pastYear);
        // var timeToString = this.timeToString(d);
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    static async _signOutAsync(navigation) {
        await AsyncStorage.clear();
        navigation.navigate('Auth');
    };

    tConvert(time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) {
            time = time.slice(1);
            time[5] = +time[0] < 12 ? 'AM' : 'PM';
            time[0] = +time[0] % 12 || 12;
        }
        delete time[3];
        return time.join('');
    }

    loadItems(selectedDate) {
        var { mailID } = this.state;
        this.GetTimesheetListData(mailID, selectedDate.dateString);
        this.getMonth(selectedDate.month, selectedDate.year);
    }

    renderDay(day, item) {
        return (
            <List></List>
        )
    }

    CheckActivity(item) {
        var {scheduleItems,selectDate,selectedList} = this.state;
        for(let i = 0;i < scheduleItems[selectDate].length; i++){
            if(item["TIMESHEET_LINE_ID"] === scheduleItems[selectDate][i]["TIMESHEET_LINE_ID"] ){
                scheduleItems[selectDate][i]['IsSelect'] = !scheduleItems[selectDate][i]['IsSelect'];
            }
        }
        if(item["IsSelect"]){
            selectedList.push(item)
        }else if(!item["IsSelect"]){
            selectedList = selectedList.filter(function(items) {
                return items["TIMESHEET_LINE_ID"] !== item["TIMESHEET_LINE_ID"];  
            })
        }
        this.setState({
            scheduleItems,
            selectedList
        },()=>{
            console.log("List",selectedList)
        })
    }

    IsSuccesActivity(item) {
        console.log("ApprovalFlag", item.LINE_APPROVAL_FLAG);
        if (item.LINE_APPROVAL_FLAG == 'Y') {
            return (
                <Icon type="AntDesign" name="like2" style={{ fontSize: 26, color: '#000' }} />
            )
        }
        else if (item.LINE_REJECTION_FLAG == 'Y') {
            return (
                <Icon type="AntDesign" name="dislike2" style={{ fontSize: 26, color: '#000' }} />
            )
        }
    }

    renderEmptyDate() {
        return (
            <NoRecordsFound />
        );
    }

    rowHasChanged(r1, r2) {
        return r1 == r2;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    selectallOption() {
        var {scheduleItems,selectDate,selectedList,filter_select} = this.state;

        if(scheduleItems[selectDate].length > 0){

            var filtered = scheduleItems[selectDate].filter(function(items) {
                console.log("Items",items)
                return items["IsSuccess"] === '' ;  
            })
            console.log("Filtered",filtered)
            for(let i = 0; i< filtered.length;i++){
                if(!filtered[i]['IsSelect']){
                    filtered[i]['IsSelect'] = true;
                    selectedList.push(filtered[i])
                }
            }
            this.setState({
                scheduleItems,
                selectedList,
                filter_select : filtered
            })
        }   
    }

    deselectOption() {
        var {scheduleItems,selectDate,selectedList,filter_select} = this.state;
        if(scheduleItems[selectDate].length > 0){

            var filtered = scheduleItems[selectDate].filter(function(items) {
                return items["IsSuccess"] === '' ;  
            })

            for(let i = 0; i< filtered.length;i++){
                if(filtered[i]['IsSelect']){
                    filtered[i]['IsSelect'] = false;
                }
            }
            this.setState({
                scheduleItems,
                selectedList : [],
                filter_select : filtered
            })
        }   
    }

    approveService(){
        var {selectedList,mailID,selectDate,scheduleItems} = this.state

        for(let i = 0;i<selectedList.length ; i++){
            var payload = {
                sheetNumber: selectedList[i].TIMESHEET_NUMBER,
                lineId: selectedList[i].TIMESHEET_LINE_ID,
                MailID: mailID
            }
            Api.apporveSheet(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully approved")
                        for(let j=0;j<scheduleItems[selectDate].length;j++){
                            if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                                scheduleItems[selectDate][j]['IsSuccess'] = 'Y';
                                scheduleItems[selectDate][j]['Message'] = ' Approved ';
                                scheduleItems[selectDate][j]['IsSelect'] = false;
                            }
                        }
                    }
                }else{
                    // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                    for(let j=0;j<scheduleItems[selectDate].length;j++){
                        if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                            scheduleItems[selectDate][j]['IsSuccess'] = 'N';
                            scheduleItems[selectDate][j]['Message'] = response.errorMessage;
                            scheduleItems[selectDate][j]['IsSelect'] = false;
                        }
                    }
                }
                this.setState({
                    scheduleItems,
                    selectedList:[],
                })
            }.bind(this))
        }
    }

    rejectService(){
        
        var {selectedList,mailID,onChangeTextArea,selectDate,showRejectionview,scheduleItems} = this.state

        for(let i = 0;i<selectedList.length ; i++){
            var payload = {
                sheetNumber: selectedList[i].TIMESHEET_NUMBER,
                lineId: selectedList[i].TIMESHEET_LINE_ID,
                MailID: mailID,
                reason:onChangeTextArea
            }
            Api.rejectionSheet(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully Rejected")
                        for(let j=0;j<scheduleItems[selectDate].length;j++){
                            if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                                scheduleItems[selectDate][j]['IsSuccess'] = 'Y';
                                scheduleItems[selectDate][j]['Message'] = ' Rejected ';
                                scheduleItems[selectDate][j]['IsSelect'] = false;
                            }
                        }
                    }
                }else{
                    // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                    for(let j=0;j<scheduleItems[selectDate].length;j++){
                        if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                            scheduleItems[selectDate][j]['IsSuccess'] = 'N';
                            scheduleItems[selectDate][j]['Message'] = response.errorMessage;
                            scheduleItems[selectDate][j]['IsSelect'] = false;
                        }
                    }
                }
                this.setState({
                    showRejectionview: false,
                    selectedList:[],
                    scheduleItems
                })
            }.bind(this))
        }
    }
    
    showrejectionModal(visible,type) {
        this.setState({
            showRejectionview: visible,
            typeReject : type
        })
    }

    onChangeData(Data){
        this.setState({
            onChangeTextArea: Data
        })
    }

    singleApproval(item){
        console.log("single select",item);
        var {mailID,selectDate,scheduleItems} = this.state
        var payload = {
            sheetNumber: item.TIMESHEET_NUMBER,
            lineId: item.TIMESHEET_LINE_ID,
            MailID: mailID
        }
        Api.apporveSheet(payload,function(response){
            if (response.success) {
                if (response.data.length > 0) {
                    // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully approved")
                    for(let j=0;j<scheduleItems[selectDate].length;j++){
                        if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === payload.lineId){
                            scheduleItems[selectDate][j]['IsSuccess'] = 'Y';
                            scheduleItems[selectDate][j]['Message'] = ' Approved ';
                        }
                    }
                }
            }else{
                // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                for(let j=0;j<scheduleItems[selectDate].length;j++){
                    if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === payload.lineId){
                        scheduleItems[selectDate][j]['IsSuccess'] = 'N';
                        scheduleItems[selectDate][j]['Message'] = response.errorMessage;
                    }
                }
            }
            this.setState({
                selectedList: [],
                scheduleItems
            })    
        }.bind(this))
    }

    singleReject(item){
        var {mailID,onChangeTextArea,selectDate,scheduleItems} = this.state;
        console.log("Results item",item)
        var payload = {
            sheetNumber: item.TIMESHEET_NUMBER,
            lineId: item.TIMESHEET_LINE_ID,
            MailID: mailID,
            reason:onChangeTextArea
        }
        Api.rejectionSheet(payload,function(response){
            if (response.success) {
                if (response.data.length > 0) {
                    // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully Rejected")
                    for(let j=0;j<scheduleItems[selectDate].length;j++){
                        if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === payload.lineId){
                            scheduleItems[selectDate][j]['IsSuccess'] = 'Y';
                            scheduleItems[selectDate][j]['Message'] = ' Rejected ';
                        }
                    }
                }
            }else{
                // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                for(let j=0;j<scheduleItems[selectDate].length;j++){
                    if(scheduleItems[selectDate][j]['TIMESHEET_LINE_ID'] === payload.lineId){
                        scheduleItems[selectDate][j]['IsSuccess'] = 'N';
                        scheduleItems[selectDate][j]['Message'] = response.errorMessage;
                    }
                }
            }
            this.setState({
                showRejectionview: false,
                selectedList:[],
                typeReject: [],
                scheduleItems
            })
        }.bind(this));
    }

    renderItem(item) {
        var screen = Dimensions.get('window');
        return (
            <Content>
                <SwipeRow rightOpenValue={-120} disableRightSwipe={true} >
                    <View style={styles.standaloneRowBack} icon>
                        
                    <TouchableOpacity transparent disabled={item.IsSuccess !== '' ? true : false } style={styles.approveButton} onPress={()=> this.singleApproval(item)}>
                        <View>
                            <Icon iconLeft style={{ color: '#fff' }} type="Feather" name="check" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity transparent disabled={item.IsSuccess !== '' ? true : false } style={styles.rejectButton} onPress={() => this.showrejectionModal(true,item)}>
                        <View>
                            <Icon iconLeft style={{ color: '#fff' }} type="AntDesign" name="close" />
                        </View>
                    </TouchableOpacity>
                                                            
                    </View>
                    <View style={styles.standaloneRowFront} icon>
                        <View padder style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width, height: 180 }}>
                            <View style={ (item.IsSuccess == 'Y') ? styles.headerSucess : (item.IsSuccess == 'N') ? styles.headerFail : styles.header}>
                                <Text style={styles.duration}> {item.DURATION}{"\n"}
                                    <Text style={styles.hours}>hrs</Text></Text>
                                    <TouchableOpacity transparent disabled={item.IsSuccess !== '' ? true : false } onPress={() => this.CheckActivity(item)}>
                                    {
                                    !item.IsSelect ?
                                        <Icon type="MaterialCommunityIcons" name="checkbox-blank-outline"  style={{ fontSize: 26, color: '#fff' }} />
                                        :
                                        <Icon type="MaterialCommunityIcons" name="check-box-outline"  style={{ fontSize: 26, color: '#000' }} />
                                    }
                                    </TouchableOpacity>
                            </View>
                            <View padder style={(item.IsSuccess == 'Y') ? styles.suceessContent : (item.IsSuccess == 'N') ? styles.failContent : styles.content }>
                                <View style={{ width: '100%', height: '12%', flexDirection: 'row' }}>
                                    <View style={{ width: '50%', height: '100%', alignContent: 'flex-start' }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, textAlign: 'left', color: '#009688' }} > {item.TASK_NUMBER} </Text>
                                    </View>
                                    <View style={{ width: '50%', height: '100%', alignContent: 'flex-end' }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, textAlign: 'right', color: '#009688' }} > {item.TASK_SUBTYPE} </Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', height: '25%', justifyContent: 'flex-start' }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2, color: '#434a54' }}>{item.PROJECT_TITLE}</Text>
                                </View>
                                <View style={{ width: '100%', height: '30%', justifyContent: 'flex-start' }}>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, padding: 2, color: '#999999' }}>{item.COMMENTS}</Text>
                                </View>
                                <View style={{ width: '100%', height: '35%', flexDirection: 'row', }}>
                                    <View style={{ width: '15%', height: '100%', alignContent: 'flex-start' }}>
                                        <Icon type="Ionicons" name="ios-contact" style={{ fontSize: 35, color: '#009688' }} />
                                    </View>
                                    <View style={{ width: '85%', height: '100%', alignContent: 'flex-start' }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, textAlign: 'left', marginTop: 7, color: '#434a54' }} > {item.EMPLOYEE_NAME} </Text>
                                    </View>
                                </View>
                                {  
                                    item.Message != '' ?
                                        <Text style={{color:"#fff",flex:1,marginTop:60,textAlign:'center',fontSize:20 ,top:0 , bottom:0,right:0,left:0,position:'absolute'}}>{item.Message} </Text>
                                        :
                                        null
                                }
                            </View>
                        </View>
                    </View>
                </SwipeRow>
            </Content>
        );
    }

    render() {
        var currentDate = new Date();
        var { scheduleItems, markedDates,myDate, showMonthHead, month,selectedList,selectDate,filter_select } = this.state;
        console.log(this.state)
        const screen = Dimensions.get('window');
        return (
            <Container>
                <Header style={Platform.OS ==='android'? { backgroundColor: '#009688' }: null}>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.toggleDrawer()} >
                                {
                                    Platform.OS === 'android' 
                                    ?
                                    <Icon name="menu"  style={{ fontSize: 22}} />
                                    :
                                    <Icon name="menu"  style={{ fontSize: 22,color: "#009688"  }} />
                                }
                        </Button>
                    </Left>
                    <Body>
                        <HeaderTitle title="Approval" />
                        {   this.state.showMonthHead === true &&
                             <Subtitle>{month}</Subtitle>
                        }
                    </Body>
                    <Right>
                        {selectedList.length > 0 && filter_select.length > 0 
                            && selectedList.length === filter_select.length
                            ?
                            <Button style={{marginBottom:10}} hasText transparent onPress={() => this.deselectOption()} >
                                <Text style={ Platform.OS === 'ios' ? {color:'#009688'} : null}>DeSelect All</Text>
                            </Button>
                            :
                            <Button style={{marginBottom:10}} hasText transparent onPress={() =>this.selectallOption() } >
                                <Text  style={ Platform.OS === 'ios' ? {color:'#009688'} : null}>Select All</Text>
                            </Button>
                            }
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('ApprovalFilter')}>
                                {
                                    Platform.OS === 'android' 
                                    ?
                                    <Icon type="Feather" name="filter"  style={{ fontSize: 22}} />
                                    :
                                    <Icon type="Feather" name="filter"  style={{ fontSize: 22,color: "#009688"  }} />
                                }
 
                        </Button>
                    </Right>
                </Header>
                <StatusBar backgroundColor='#009688' />
                {/* <Agenda
                    horizontal
                    items={scheduleItems}
                    onDayPress={this.loadItems.bind(this)}
                    selected={myDate}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    markedDates={markedDates}
                    renderDay={this.renderDay.bind(this)}
                    theme={{ backgroundColor: '#fff', agendaKnobColor: '#009688' }}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    onCalendarToggled={this.onCalendarToggled.bind(this)}
                /> */}
                <RejectinfoModel 
                modalVisible={this.state.showRejectionview} 
                showrejectionModal={this.showrejectionModal} 
                onChangeTextArea={this.state.onChangeTextArea}
                rejectService={this.rejectService} 
                onChangeData = {this.onChangeData}
                typeReject= {this.state.typeReject}
                singleReject = {this.singleReject.bind(this)}
                />
                { selectedList.length > 0 &&
                <Footer style={{backgroundColor:"white",alignContent:'center'}}>   
                    <View style={{flex:1,flexDirection: 'row', justifyContent: 'center',marginTop:5,marginBottom:5 }}>
                    
                        <View style={{ width: screen.width * 2 / 4, alignItems: 'center', justifyContent: 'center' }}>
                        <Button iconRight rounded light success onPress={() => this.approveService()}>
                            <Text style={{ color: 'white' }}>Approve</Text>
                            <Icon style={{ color: 'white' }} type='MaterialCommunityIcons' name='check'  />
                        </Button>
                        </View>
                        
                        {/* <View style={{ width: screen.width * 2 / 4, alignItems: 'center', justifyContent: 'center' }}>
                        <Button  iconRight rounded light danger onPress={() => this.showrejectionModal(true)} >
                            <Text style={{ color: 'white' }}>Reject</Text>
                            <Icon name='close'style={{ color: 'white' }} />
                        </Button>
                        </View> */}
                    </View>
                </Footer>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
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
        backgroundColor: '#cfe8fc',
        // backgroundColor: 'rgba(0,255,0,0.5)',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
        height: '100%'
    },
    headerSucess: {
        // backgroundColor: '#cfe8fc',
        backgroundColor: 'rgba(0,255,0,0.7)',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
        height: '100%'
    },
    headerFail: {
        backgroundColor: '#cfe8fc',
        backgroundColor: 'rgba(255,0,0,0.7)',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
        height: '100%'
    },
    suceessContent:{ 
        width: '80%', 
        height: '100%', 
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
        height: '100%', 
        flexDirection: 'column',
    },
    header1: {
        backgroundColor: 'lightgreen',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
        height: '100%'
    },
    header2: {
        backgroundColor: 'red',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
        height: '100%'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
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
        color: '#2962ff',
        textAlign: 'center',
        alignContent: 'space-between',
    },
    standaloneRowFront: {
        backgroundColor: '#fff',
        paddingRight: 0,
        paddingLeft: 0,
        flex: 1,
        flexDirection: 'row'
    },
    standaloneRowBack: {
        backgroundColor: 'white',
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

});

export default Approval;