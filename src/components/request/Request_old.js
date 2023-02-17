import React from 'react';
import { View, Text, AsyncStorage, Dimensions, TouchableOpacity, StyleSheet  } from 'react-native';
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
    ListItem,
    Content,
    H3
} from "native-base";
import * as Api from '../../services/api/request';

class Request extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            scheduleItems: {},
            mailID: null
        }
        this.refreshScreen = this.refreshScreen.bind(this);
    }

    async componentDidMount() {
        console.log("ReCall")        
        var mailID = await AsyncStorage.getItem('Email');
        this.setState({
            mailID: mailID
        }, () => {
            this.getTimesheetList(mailID, this.state.selectedDate);
        })        
    }

    changeUrlDate(date) {
        var d = new Date(date);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    getTimesheetList(mailID, date) {
        var dateStr = this.timeToString(date);
        var postData = {
            "MailID": mailID,
            "date": this.changeUrlDate(date)
        }
        Api.TimeSheetSummaryList(postData, function (response) {
            console.log("response", response)
            var items = {};
            items[dateStr] = [];
            if (response.success) {
                if (response.data.length > 0) {
                    items[dateStr] = response.data;                    
                }
                this.setState({
                    scheduleItems: items
                })
            }
            else {
                alert(JSON.stringify(response))
            }
        }.bind(this))
    }

    loadItems(date) {
        this.setState({
            selectedDate: date.dateString
        },() => {
            this.getTimesheetList(this.state.mailID, this.state.selectedDate);
        })     
    }

    updateTask = (item) => {
        if (item.LINE_APPROVAL_FLAG != 'Y') {
            if ((item.LINE_REJECTION_FLAG != 'Y')) {
                this.props.navigation.navigate('UpdateTask', {
                    itemDate: item,
                    mailID: this.state.mailID,
                    refreshScreen: this.refreshScreen
                });
            }
        }
    }

    refreshScreen(dataDetails) {

        console.log("Refresh function calling...",dataDetails);
        console.log("state values ",this.state)
        var { selectedDate, scheduleItems } = this.state;
        // console.log("before setState", this.state.scheduleItems)
        scheduleItems[selectedDate] = dataDetails;
        this.setState({
            scheduleItems,
            selectedDate
        }, () => {
            console.log("after setState", this.state.scheduleItems)
        })
        // var updateTask_Data = this.props.navigation.getparm('ScheduledTask');
        // var date = this.props.navigation.getparam('Date');

        // this.componentDidMount();
    }

    renderItem(item) {
        var screen = Dimensions.get('window');
        return (
            <View>
                <TouchableOpacity onPress={() => this.updateTask(item)}>
                    <View padder style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width, height: 200 }}>
                        <View style={(item.LINE_APPROVAL_FLAG == 'Y') ? styles.header1 : (item.LINE_REJECTION_FLAG == 'Y') ? styles.header2 : styles.header}>
                            <Text style={styles.duration}> {item.DURATION}{"\n"}
                                <Text style={styles.hours}>hrs</Text></Text>
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

    render() {
        var { selectedDate, scheduleItems } = this.state;
        return (
            <Container>
                <Header />
                <Agenda
                    items={scheduleItems}                   
                    // callback that fires when the calendar is opened or closed
                    onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
                    // callback that gets called on day press
                    onDayPress={this.loadItems.bind(this)}
                    // callback that gets called when day changes while scrolling agenda list
                    onDayChange={(day)=>{console.log('day changed')}}
                    // initially selected day
                    selected={this.timeToString(selectedDate)}                   
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={12}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={12}
                    // specify how each item should be rendered in agenda
                    renderItem={this.renderItem.bind(this)}
                    // specify how each date should be rendered. day can be undefined if the item is not first in that day.
                    renderDay={(day, item) => {return (<List></List>);}}
                    // specify how empty date content with no items should be rendered
                    renderEmptyDate={() => {return (<View />);}}
                    // specify what should be rendered instead of ActivityIndicator
                    renderEmptyData = {() => {return (<View />);}}
                    // specify your item comparison function for increased performance
                    rowHasChanged={(r1, r2) => {return r1 !== r2}}
                    // Hide knob button. Default = false
                    hideKnob={false}
                    // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                    markedDates={{
                        '2012-05-16': {selected: true, marked: true},
                        '2012-05-17': {marked: true},
                        '2012-05-18': {disabled: true}
                    }}
                    theme={{
                        agendaKnobColor: 'blue',
                        marginTop: 0, flexDirection: 'row', justifyContent: 'space-between'
                    }}
                />
            </Container>
        )
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
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
    hours: {
        fontSize: 15,
        color: '#2962ff',
        textAlign: 'center',
        alignContent: 'space-between',
    }

});


export default Request;