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
    View,
    Text,
    H3, Subtitle
} from "native-base";
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Api from '../../services/api/request';
import CommonList from '../commonUIList/commonUI';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { CommonData } from '../../utils';
import NoRecordsFound from '../noRecordFound';
import CSIcon from '../../icon-font';
import HeaderTitle from '../HeaderTitle';


class Request extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myDate: undefined,
            scheduleItems: [],
            scheduleList: false,
            markedDates: {},
            navigateData: {},
            sysDate: undefined,
            dateCount: null,
            dateList: [],
            month: '',
            showMonthHead: true,
            mailID: undefined
        }
        // this.refreshScreen = this.refreshScreen.bind(this);
        this.dateLockcall = this.dateLockcall.bind(this);
        this.getMarkedDates = this.getMarkedDates.bind(this);
        this.GetTimesheetListData = this.GetTimesheetListData.bind(this);
        this.dateLockValidation = this.dateLockValidation.bind(this);
    }

    async componentDidMount() {
        var MailID = await AsyncStorage.getItem('Email');
        // const currentDate = new Date();

        var marked = {};
        var scheduledata = [];
        var List = false;

        this.setState({
            mailID: MailID,
            scheduleItems: scheduledata,
            scheduleList: List
        }, () => {
            this.dateLockcall(MailID);
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                //title
                'Warning!',
                //body
                'Do you want to Sign Out?',
                [
                    { text: 'Yes', onPress: () => this.props.navigation.navigate('Auth') },
                    { text: 'No', onPress: () => { cancelable: true }, style: 'cancel' },
                ],
                { cancelable: true }
            );
            return true;
        });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            console.log("Focus calling...")
            var scheduledata = this.props.navigation.getParam('ScheduledTask');
            var marked = {};
            var List = true;
            this.setState({
                scheduleItems: scheduledata,
                scheduleList: List
            }, () => {
                this.getMarkedDates(this.state.mailID);
            })
        });
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

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();
        this.backHandler.remove();
    }

    GetTimesheetListData(mailID, selectedDate) {
        var TimesheetList = {
            MailID: mailID,
            date: this.ChangeUrlDate(selectedDate)
        };
        Api.TimeSheetSummaryList(TimesheetList, function (response) {
            var items = {};
            var List = false;
            if (response.success) {
                if (response.data.length > 0) {
                    items[selectedDate] = response.data;
                    List = true;
                    // console.log("Item datas", items);
                }
                else {
                    items[selectedDate] = [];
                    List = false;
                }
                this.setState({
                    scheduleItems: items,
                    scheduleList: List,
                    navigateData: TimesheetList,

                })
            }
            else {
                items[selectedDate] = [];
                this.setState({
                    scheduleItems: items,
                    scheduleList: List,
                    navigateData: TimesheetList
                })

            }
        }.bind(this))
    }

    dateLockcall(mailID) {
        console.log("Date Lock Check")
        Api.DateLockInfo(mailID,  function (response) {
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

    ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    MarkedDatePass(StringDate) {
        var d = new Date(StringDate);
        var beforeChange = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + d.getDate()).slice(-2).toString();
        return beforeChange;
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
        var pastYear = d.getFullYear() + 1;
        d.setFullYear(pastYear);
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    getMarkedDates(mailID) {
        var startDate = this.getDateOfPastYear();
        var endDate = this.getDateOfNextYear();
        var RequestedData = {
            email: mailID,
            startDate: startDate,
            endDate: endDate
        }
        Api.TimeSheetRequests(RequestedData, function (response) {
            if (response.success) {
                var data = response.data;
                var markedDates = {};
                var DatesList;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]["STATUS"] == "BOTH") {
                            DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                            // console.log("DateInfo: ", DatesList)
                            markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                                marked: true,
                                dotColor: '#ffa500'
                            }
                        }
                        else if (data[i]["STATUS"] == "APPROVED") {
                            DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                            // console.log("DateInfo: ", DatesList)
                            markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                                marked: true,
                                dotColor: 'blue'
                            }
                        }
                        else if (data[i]["STATUS"] == "REJECTED") {
                            DatesList = this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())
                            // console.log("DateInfo: ", DatesList)
                            markedDates[this.MarkedDatePass(data[i]['TIMESHEET_DATE'].toString())] = {
                                marked: true,
                                dotColor: 'red'
                            }
                        }
                    }
                }
                this.setState({
                    markedDates: markedDates,
                }, () => {
                    this.GetTimesheetListData(mailID, this.state.myDate);
                })
            }
            else {
                CommonData.toastWarningAlert(response.errorMessage);
            }
        }.bind(this));
    }

    static async _signOutAsync(navigation) {
        await AsyncStorage.clear();
        navigation.navigate('Auth');
    };


    loadItems(selectedDate) {
        console.log("Load Item")
        var { mailID } = this.state;
        this.setState({
            myDate: this.timeToString(selectedDate.dateString)
        }, () => {
            this.GetTimesheetListData(mailID, selectedDate.dateString);
            this.getMonth(selectedDate.month, selectedDate.year);
        }
        )
    }

    renderDay(day, item) {
        return (
            <List></List>
        )
    }

    updateTask = (item) => {
        if (item.LINE_APPROVAL_FLAG != 'Y') {
            if ((item.LINE_REJECTION_FLAG != 'Y')) {
                this.props.navigation.navigate('UpdateTask', {
                    itemDate: item,
                    mailID: this.state.mailID,
                    // refreshScreen: this.refreshScreen
                });
            }
        }
    }

    renderItem(item) {
        var screen = Dimensions.get('window');
        return (
            <View>
                <TouchableOpacity onPress={() => this.updateTask(item)}>
                    <View padder style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width, height: 200 }}>
                        <View style={(item.LINE_APPROVAL_FLAG == 'Y') ? styles.header1 : (item.LINE_REJECTION_FLAG == 'Y') ? styles.header2 : styles.header}>
                            <Text style={(item.LINE_APPROVAL_FLAG == 'Y') ? styles.duration : (item.LINE_REJECTION_FLAG == 'Y') ? styles.duration1 : styles.duration}> {item.DURATION}{"\n"}
                                <Text style={(item.LINE_APPROVAL_FLAG == 'Y') ? styles.hours : (item.LINE_REJECTION_FLAG == 'Y') ? styles.hours1 : styles.hours}>hrs</Text></Text>
                            {this.IsSuccesActivity(item)}
                        </View>
                        <View padder style={{ borderBottomWidth: .5, borderBottomColor: '#ccc', width: '80%', height: '100%', flexDirection: 'column' }}>
                            <View style={{ width: '100%', height: '12%', flexDirection: 'row' }}>
                                <View style={{ width: '50%', height: '100%', alignContent: 'flex-start' }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, textAlign: 'left', color: '#009688' }} > {item.TIMESHEET_NUMBER} </Text>
                                </View>
                                <View style={{ width: '50%', height: '100%', alignContent: 'flex-end' }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, textAlign: 'right', color: '#009688' }} > {item.TASK_SUB_TYPE} </Text>
                                </View>
                            </View>
                            <View style={{ width: '100%', height: '30%', justifyContent: 'flex-start' }}>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2, color: '#434a54' }}>{item.PROJECT_TITLE}</Text>
                            </View>
                            <View style={{ width: '100%', height: '28%', justifyContent: 'flex-start' }}>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#959595' }}>{item.TASK_TITLE}</Text>
                            </View>
                            <View style={{ width: '100%', height: '30%', justifyContent: 'flex-start' }}>
                                <Text numberOfLines={3} ellipsizeMode="tail" style={{ fontSize: 12, padding: 2, color: '#999999' }}>{item.COMMENTS}</Text>
                            </View>

                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // touchfeadback(item) {
    //     if (item.LINE_APPROVAL_FLAG != 'Y' || item.LINE_REJECTION_FLAG != 'Y') {
    //         console.log("data pressed")
    //         return (

    //         )
    //     }
    // }


    IsSuccesActivity(item) {
        // console.log("ApprovalFlag", item.LINE_APPROVAL_FLAG);
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
        return r1 !== r2;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
}

    render() {
        // this.dateLockcall(this.state.mailID);
        var { scheduleItems, markedDates, myDate, showMonthHead, month, sysDate } = this.state;
        var currentDate = sysDate;
        console.log("Current date -- selected My Date calendar :", myDate)
        console.log("Current date -- selected calendar :", sysDate)
        return (
            <Container>
                <Header  style={Platform.OS ==='android'? { backgroundColor: '#009688' }: null}>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.toggleDrawer()} >
                                {
                                    Platform.OS === 'android' ?
                                    <Icon name="menu"  style={{ fontSize: 22}} />
                                    :
                                    <Icon name="menu"  style={{ fontSize: 22,color: "#009688"  }} />
                                }
                        </Button>
                    </Left>
                    <Body>
                        <HeaderTitle title="Request" />
                        {   this.state.showMonthHead === true &&
                             <Subtitle>{month}</Subtitle>
                        }
                    </Body>
                    {/* <Body>
                        <Title>eChain CRM</Title>
                        {this.state.showMonthHead === true &&
                            <Subtitle>{month}</Subtitle>
                        }

                    </Body>  */}
                    <Right>
                        <Button transparent
                            onPress={() => this.dateLockValidation(this.state, this.props)}>
                                {
                                    Platform.OS === 'android' ?
                                    <Icon name="md-add" style={{ fontSize: 22}}/>
                                    :
                                    <Icon name="md-add" style={{ fontSize: 22,color: "#009688" }}/>
                                }
                            
                        </Button>
                    </Right>
                </Header>
                <StatusBar backgroundColor='#009688' />
                {/* <View style={(showMonthHead === false) ? styles.hidden : styles.show}> */}
                {/* <Text style={(showMonthHead === false) ? styles.hidden : styles.show}>{month} </Text> */}
                {/* </View> */}
                <Agenda
                    horizontal
                    items={scheduleItems}
                    onDayPress={this.loadItems.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    markedDates={markedDates}
                    maxDate={sysDate}
                    selected={sysDate}
                    renderDay={this.renderDay.bind(this)}
                    theme={{ backgroundColor: '#fff', agendaKnobColor: '#009688' }}
                    pastScrollRange={12}
                    futureScrollRange={12}
                    onCalendarToggled={this.onCalendarToggled.bind(this)}
                />
            </Container>
        );
    }
}


// const yourDate = new Date()
// const NewDate = moment(Date(yourDate), 'DD-MM-YYYY')

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
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
        height: '100%'
    },
    header1: {
        backgroundColor: '#9de9bc',
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
        marginTop: 50
    },
    duration1: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        alignContent: 'space-between',
        marginTop: 50
    },
    hours: {
        fontSize: 15,
        color: '#2962ff',
        textAlign: 'center',
        alignContent: 'space-between',
    },
    hours1: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        alignContent: 'space-between',
    },
    hidden: {
        width: 0,
        height: 0,
    },
    show: {
        fontSize: 15,
        color: '#434a54',
        textAlign: 'center'
    }

});


export default Request;
