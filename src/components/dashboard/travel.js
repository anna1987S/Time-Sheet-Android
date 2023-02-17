import React from 'react';
// import { Agenda } from 'react-native-calendars';
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
    Card, CardItem,
    Subtitle,Fab
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,View,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,
 } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import CSIcon from '../../icon-font';
import RBSheet from "react-native-raw-bottom-sheet";
import RBSheetNew from "react-native-raw-bottom-sheet";
// import BottomView from './actionSheetView';
import Status from '../status'
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import ListItem, { Separator } from '../request/swipeList/ListItem';
import { ScrollView } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import * as Api from '../../services/api/approval';
import _ from 'underscore';
import CustomMenuIcon from '../../navigation/customMenu/customMenuIcon';
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

class Travel extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            pickerValue : undefined,
            selected: this.ChangeUrlDate(moment()),
            scheduleItems: [],
            mailID:'',
            // data: DATA
        }
    }

    async componentDidMount() {

        var {selected} = this.state;

        var MailID = await AsyncStorage.getItem('Email');
        this.setState({
            mailID: MailID,
            selected
        }, () => {
            this.GetTimesheetListData(MailID, selected);
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
                        response.data[i]['IsSelect']= true;
                        response.data[i]['IsSuccess'] = '';
                        response.data[i]['Message'] = '';
                    }
                    var groupedVal = _.groupBy(response.data,'EMPLOYEE_NAME');
                    items = groupedVal;
                    console.log("Item datas", items);
                }
                else {
                    items = [];
                    console.log("Item datas empty", items);

                }
                this.setState({
                    scheduleItems: items,
                    selectDate: selectedDate
                })
            }
            else {
                // this.props.navigation.navigate('Auth');
                items = [];
                this.setState({
                    scheduleItems: items,
                    selected : selectedDate
                })
                console.log("Final Else condition", items);

            }
        }.bind(this))
    }

    handleChange(index) { 
        var datestr = "";
        var datestr = new Date(index._d);
        console.log("Date values",datestr)
        var {mailID,} = this.state;
        var selectedDate = this.ChangeUrlDate(datestr);
        console.log("New Date",this.ChangeUrlDate(datestr));
        this.setState({
          selected: this.ChangeUrlDate(datestr)
        });
        this.GetTimesheetListData(mailID, selectedDate);
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

    approveService =(item,index) => {
         var {selectedList,mailID,selectDate,scheduleItems} = this.state
        
        for(let i = 0;i<item.length ; i++){
            var payload = {
                sheetNumber: item[i].TIMESHEET_NUMBER,
                lineId: item[i].TIMESHEET_LINE_ID,
                MailID: mailID
            }
            var empName = Object.entries(scheduleItems)[0][0];
            var empdata = Object.entries(scheduleItems)[0][1];
            console.log("Approve Item",payload);
            console.log("schedule Item in approve",empName)
            console.log("schedule Item in data",scheduleItems[empName])
            
            Api.apporveSheet(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully approved")
                        var updatedQuotes =  scheduleItems[empName].filter((row, index) => {
                            console.log("Index", index)
                            console.log("Indexselect", item[i].TIMESHEET_LINE_ID)
                            return row['TIMESHEET_LINE_ID'] != item[i].TIMESHEET_LINE_ID;
                          });
                        this.setState({
                            scheduleItems: updatedQuotes,
                        })
                    }
                }else{
                    // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                    for(let j=0;j<scheduleItems[empName].length;j++){
                        if(scheduleItems[empName][j]['TIMESHEET_LINE_ID'] === item[i].TIMESHEET_LINE_ID){
                            scheduleItems[empName][j]['IsSuccess'] = 'N';
                            scheduleItems[empName][j]['Message'] = response.errorMessage;
                            scheduleItems[empName][j]['IsSelect'] = false;
                        }
                    }
                    this.setState({
                        scheduleItems,
                    })
                }
            }.bind(this))
        }
    }


      renderDateItem(Items) {
        console.log("Log val",Items)
        return (
            Object.entries(Items)
                .map(([key, item], i) => (
                    <React.Fragment  key={i}>
                        <ListItem
                            itemVal = {item}
                            onSwipeFromLeft={(item,i) => this.approveService(item,i)}
                            onRightPress={(item) => this.rowDelete(item)}
                        />
                   </React.Fragment>
             ))
        );
    }

    

    render(){

        let datesWhitelist = [{
            start: moment(),
            end: moment().add(6, 'days')  // total 4 days enabled
          }];
          let datesBlacklist = [ moment().add(1, 'days') ]; // 1 day disabled

          var {selected,scheduleItems} = this.state;
        console.log("Today date",scheduleItems)
        return(

            <Container >
                <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <Header  style={{ backgroundColor: '#580073' }}>
                    <Left>
                        <TouchableOpacity onPress ={() => {this.props.navigation.toggleDrawer()}}>
                            <CSIcon name='Artboard-63' size={22} color="#fff" />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <HeaderTitle title="Travel" />
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
                        option1Click={() => {this.props.navigation.navigate('Settings')}}
                        option2Click={() => {this.props.navigation.navigate('Auth')}}
                        employeeName = {"Usha.t"}
                        employeeId ={"1235"}
                    /> */}
                        {/* <TouchableOpacity onPress ={() => this.props.navigation.navigate('Auth')}>
                            <Thumbnail square source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 30, width: 30 }} />
                            </TouchableOpacity> */}
                    </Right>
                </Header>

                <CalendarStrip
                    scrollable
                    calendarAnimation={{type: 'sequence', duration: 30}}
                    daySelectionAnimation={{type: 'border', duration: 200,borderWidth: 1, borderHighlightColor: 'white' }}
                    style={{height: 80, paddingTop: 20, paddingBottom: 10}}
                    calendarHeaderStyle={{color: 'white'}}
                    calendarColor={'transparent'}
                    dateNumberStyle={{color: 'white'}}
                    selectedDate = {moment()}
                    onDateSelected = {(date) =>this.handleChange(date)}
                    dateNameStyle={{color: 'white'}}
                    highlightDateNumberStyle={{color: 'yellow'}}
                    highlightDateNameStyle={{color: 'yellow'}}
                    disabledDateNameStyle={{color: 'grey'}}
                    disabledDateNumberStyle={{color: 'grey'}}
                    iconContainer={{flex: 0.1}}
                />
                { Object.keys(scheduleItems).length > 0 &&
                <ScrollView>
                     {this.renderDateItem(scheduleItems)}
                </ScrollView>
                }
                
                
                
                <Fab
                    active = "true"
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#7666fe' }}
                    onPress={() => this.RBSheet.open()}
                    position="bottomRight"
                    >
                    <CSIcon name={"Artboard-401x-100"}/>
                </Fab>  
                </ImageBackground>
            </Container>
            // </View>
        )
    }
}
export default Travel;

const styles = StyleSheet.create({
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

});