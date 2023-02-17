import React from 'react';
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
    H3,
    Item,
    Picker,
    Input,View,Footer
} from "native-base";
import {  StatusBar,Dimensions,StyleSheet,AsyncStorage, TouchableOpacity, Keyboard, ScrollView,ImageBackground } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    StackedBarChart,
    ContributionGraph
  } from 'react-native-chart-kit'
import CSIcon from '../../icon-font';
import * as Api from '../../services/api';
import moment from 'moment';
import _ from 'underscore';
import HeaderTitle from '../HeaderTitle';
// Mock data object for Pie Chart

// const pieChartData = [
//     { name: 'Approved', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
//     { name: 'UnApproved', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
// ]

// Stacked Bar chart

// const stackedData = {
//     labels: ["Test1", "Test2","Test3", "Test4","Test5", "Test6","Test7", "Test4","Test5", "Test6","Test7","Test1", "Test2","Test3", "Test4","Test5", "Test6","Test7", "Test4","Test5", "Test6","Test7"],
//     legend: ["Approved", "Not Approved"],
//     data: [
//       [6, ""],
//       [3, 3],
//       [0, 0],
//       [3, 3],
//       [2, 6],
//       [2, 3],
//       [4, 3],
//       [3, 3],
//       [2, 6],
//       [2, 3],
//       [4, 3],
//       [6, 2],
//       [3, 3],
//       [0, 0],
//       [3, 3],
//       [2, 6],
//       [2, 3],
//       [4, 3],
//       [3, 3],
//       [2, 6],
//       [2, 3],
//       [4, 3],
//     ],
//     barColors: ["rgba(131, 167, 234, 1)", "#F00"]
// };

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    }
}

const labelStyle = {
    color: chartConfig.color(),
    marginVertical: 5,
    textAlign: 'center',
    fontSize: 16
}

const graphStyle = {
    marginVertical: 8,
    ...chartConfig.style
  }


  
class Status extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mailID: undefined,
            startDate : '',
            endDate : '',
            startDateService:'',
            endDateService:'',
            calendarMode: 'date',
            calendarFor: 'startDate',
            isDateTimePickerVisible: false,
            isLoading: false,
            modalVisible: false,
            filterdmodalVisible: false,
            selectedItems: [],
            userItems:[],
            contacts: [],
            filterContact: [],
            selectedUser: "",
            chartView: false,
            pieChartData: [],
            stackedData : []
        }
        this.getuserslistData = this.getuserslistData.bind(this);
    }

    async componentDidMount(){
        var emailID = await AsyncStorage.getItem('Email');
        this.setState({
            mailID : emailID
        })
        this.getuserslistData(emailID);
    }

    getuserslistData = (mailID) => {
        Api.Approval.managedEmployeeList(mailID,function (response){
            
            // var item = {};
            if (response.success) {
                if (response.data.length > 0) {
                    // item = response.data 
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i]['Id']= i + 1;
                    }
                    this.setState({
                        userItems: response.data
                    })
                }
                console.log("info Data: ",this.state.userItems)   
            }   
        }.bind(this));
    }

    handleDatePicked = date => {
        var {startDateService,endDateService} = this.state;
        var inputKey = this.state.calendarFor;
        var calendarValue = "";
        var tempCalendarValue = "";
        if (inputKey == 'startDate') {
            calendarValue = this.timeToString(date);
            startDateService = this.timeToStringService(date);
        }else{
            calendarValue = this.timeToString(date);
            endDateService = this.timeToStringService(date);
        }
        this.setState({
            [inputKey]: calendarValue,
            [inputKey + 'Temp']: tempCalendarValue,
            startDateService,
            endDateService
        }, () => {
            this.hideDateTimePicker();
        })
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    timeToStringService(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    timeToString(time){
        const date = new Date(time);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = date.getDate().toString() + "-" + months[date.getMonth()] + "-" + date.getFullYear().toString();
        return timeToString;
    }

    showDateTimePicker = (key, mode) => {
        Keyboard.dismiss();
        this.setState({
            calendarMode: mode,
            isDateTimePickerVisible: true,
            calendarFor: key
        });
    };

    onValueDeptChange(value) {
        this.setState({
            selectedUser : value
        })
    }

    statusValues(){
        var {startDateService,endDateService,selectedUser,mailID} = this.state;
        var startDate = this.timeToString(startDateService);
        var endDate = this.timeToString(endDateService);
        
        var payloadData = {
            emailID : mailID,
            fromDate : startDate,
            toDate: endDate,
            userID: selectedUser
        }

        var betweenDays = this.getDates(startDateService,endDateService);
        var chartVal = [];
        
        
        console.log("Between Days",betweenDays);
        
        Api.Status.timesheetStatusReport(payloadData,function(response){
            console.log("Result status Info",response.data)
            if(response.success){
                var data = response.data
                if(data.length > 0){
                   var approveLen =  data.filter(val => val["LINE_STATUS"] === "APPROVED").length;
                   var rejectLen = data.length - approveLen
                //    console.log("Length Approve",approveLen,"Reject Length",rejectLen)
                    var piedata = [ 
                    { 
                        name: 'Approved', 
                        population: approveLen, 
                        color: 'rgba(131, 167, 234, 1)', 
                        legendFontColor: '#7F7F7F', 
                        legendFontSize: 15 
                    },
                    { 
                        name: 'UnApproved', 
                        population: rejectLen, 
                        color: '#F00', 
                        legendFontColor: '#7F7F7F', 
                        legendFontSize: 15 
                    }
                   ]

                   var dateBasedVal = _.groupBy(data,"TIMESHEET_DATE")
                   console.log("Grouped Val",dateBasedVal)
                   
                   for(let i= 0; i < betweenDays.length; i++){
                       var val = [];
                        if(dateBasedVal[betweenDays[i]] !== undefined){
                            var approved = dateBasedVal[betweenDays[i]].filter(function(items){
                                return items["LINE_STATUS"] === "APPROVED"
                            })
                            
                            if(approved.length > 0){
                            var approve_Total = 0;
                                for (let k=0; k < approved.length; k++) {
                                    var duration = approved[k]["DURATION"]
                                    approve_Total =  approve_Total + parseFloat(duration);
                                }
                                console.log("approve Total",approve_Total);
                            }else{
                                var approve_Total = "";
                            }

                            var rejected = dateBasedVal[betweenDays[i]].filter(function(items){
                                return items["LINE_STATUS"] !== "APPROVED"
                            })
                            if(rejected.length > 0){
                                var reject_Total = 0;
                                for (let k=0; k < rejected.length; k++) {
                                    var duration = rejected[k]["DURATION"]
                                    reject_Total =  reject_Total + parseFloat(duration);
                                }
                                console.log("approve Total",reject_Total);
                            }else{
                                var reject_Total = "";
                            }
                            val.push(approve_Total);
                            val.push(reject_Total);
                            console.log("Chart val", val);
                        }
                        chartVal.push(val);
                        console.log("Chart result", chartVal);
                    }
                }
            }

            var stacked = {
                labels: betweenDays,
                legend: ["Approved", "Not Approved"],
                data: chartVal,
                barColors: ["rgba(131, 167, 234, 1)", "#F00"],
                onPress: () => console.log("value is clicked")
            };
    

            this.setState({
                chartView: true,
                pieChartData : piedata,
                stackedData : stacked
            })
        }.bind(this));
        
    }

    getDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
            dateArray.push( moment(currentDate).format('DD-MMM-YYYY') )
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    render() {
        const screen = Dimensions.get('window');
        const width = Dimensions.get('window').width
        const height = 220
        var {selectedUser,userItems,startDateService,endDateService,chartView,pieChartData,stackedData } = this.state;
        console.log("PieChart val",pieChartData)
        return (
            <Container>
                <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                    <Header  style={{ backgroundColor: 'transparent' }}>
                        <Left>
                          <TouchableOpacity onPress ={() => {this.props.navigation.navigate('Timesheet')}}>
                            <CSIcon name='Artboard-73' size={22} color="#fff" />
                          </TouchableOpacity>
                        </Left>
                        <Body>
                            <HeaderTitle title="Status" />
                        </Body>
                        <Right>
                            {/* <Thumbnail square source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 30, width: 30 }} /> */}
                        </Right>
                    </Header>
                <Content>
                    <View padder style={{ flex: 1,  flexDirection: 'row', width: screen.width, height: '100%', justifyContent: 'center' }}>
                        <View style = {{width:'45%',marginRight:10}}>
                            <Item  >
                                <Input  style = {{color:'#ffffff'}} placeholderTextColor={'#fff'}  value={this.state.startDate}  placeholder='Start Date'  editable={Platform.OS === 'ios' ? 'false' : true} onTouchEnd ={() => this.showDateTimePicker('startDate', 'date')}  name="startDate" />
                            </Item>
                        </View>
                        {/* <View >
                            <Icon size={24} style={{ marginTop: 10,marginLeft:10 ,color:'#fff',alignItems: 'center',justifyContent: 'center'}} type ='FontAwesome' name='search'/>
                        </View> */}
                        <View style = {{width:'45%',marginLeft:10}}>
                            <Item  >
                                <Input style = {{color:'#ffffff'}} placeholderTextColor={'#fff'} value={this.state.endDate}  placeholder='End Date'  editable={Platform.OS === 'ios' ? 'false' : true} onTouchEnd ={() => this.showDateTimePicker('endDate', 'date')}  name="endDate" />
                            </Item>
                        </View>
                    </View>
                    
                    <Item regular style={{marginRight:15,marginLeft:15,marginTop:10}}>
                        {/* <View style={{ height: 50, borderBottomColor: '#ccc', borderBottomWidth: 1 }}> */}
                        <View style={{ flex: 1 }}>
                            <Picker
                                mode="dropdown"
                                // iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="Pick user"
                                placeholderStyle={{ color: "#ccc" }}
                                placeholderIconColor="#007aff"
                                selectedValue={selectedUser}
                                onValueChange={(value) => { this.onValueDeptChange(value) }}
                            >
                                {
                                    userItems.map((dept, i) => (
                                        <Picker.Item key={i} label={dept.EMPLOYEE_NAME} value={dept.USER_ID} />
                                    ))
                                }
                            </Picker>
                            </View>
                        </Item>
                    {/* </View> */}
                    {
                     chartView &&
                    <View>
                    <ScrollView horizontal={true}>
                        <PieChart
                            data={pieChartData}
                            height={height}
                            width={width}
                            chartConfig={chartConfig}
                            accessor="population"
                            style={graphStyle}
                        />
                    </ScrollView>

                    <ScrollView horizontal={true}>
                        
                        <StackedBarChart
                            style={graphStyle}
                            barPercentage = {6}
                            data={stackedData }
                            width= {stackedData.data.length*120+50}
                            // width={width}
                            height={height}
                            chartConfig={chartConfig}
                            showLegend={false}
                        />
                    </ScrollView>
                    </View>
                    }
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        mode={this.state.calendarMode}
                    />
                </Content>
                <TouchableOpacity  
                onPress={() => this.statusValues()}
                >
                { (startDateService!== '' && endDateService !== '') && 
                 <Footer style={Platform.OS ==='android'? {backgroundColor:"#009688",alignContent:'center'} : {alignContent:'center'} }>   
                        <Text style={Platform.OS ==='android' ? {marginTop:15,color:"#ffffff"}:{marginTop:15,color:"#009688"}}>Display Status</Text>
                </Footer>
                }
                </TouchableOpacity>
                </ImageBackground>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    circle: {
        width: 50,
        height: 50,
        borderRadius: 100/2,
        backgroundColor: '#009688'
    },
    background:{
        flex:1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
})

export default Status;