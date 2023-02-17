import React from 'react';
import { View, Text, Dimensions, ActivityIndicator,ScrollView,TouchableWithoutFeedback,AsyncStorage,TouchableOpacity } from 'react-native';
import { Button, Icon, List, ListItem, Card, CardItem, Body, Footer, Content, Container, Item, Input } from 'native-base';
import {Constants} from '../../utils'
import NoRecordsFound from '../noRecordFound';
import AddTask from './AddTask';
import CSIcon from '../../icon-font';
import * as Api from '../../services/api/request';
import { min } from 'underscore';
import { CommonData } from '../../utils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

class BottomView extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            addTask : false,
            isLoading: false,
            valuesCal: this.props.caledarVal,
            selectVal: this.props.values,
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
            mailID: undefined,
            isTaskselect: false,
            taskList: [],
            natureofWorkData: [],
            selectedNature: 0,
            selectedTask: {},
            selectedComments: null,
            selectedDuration : 0,
            hours: undefined,
            mins:undefined
        }
        // this.dateLockcall = this.dateLockcall.bind(this);
        // this.getMarkedDates = this.getMarkedDates.bind(this);
        this.GetTimesheetListData = this.GetTimesheetListData.bind(this);
        // this.dateLockValidation = this.dateLockValidation.bind(this);
    }
    
    async componentDidMount(){
        var MailID = await AsyncStorage.getItem('Email');
        var scheduledata = [];
        var List = false;

        var {selectVal,valuesCal,hours,mins} = this.state;
        this.setState({
            mailID: MailID,
            scheduleItems: scheduledata,
            scheduleList: List
        });
        
        this.onValueChange(selectVal);
        this.onSelectHours(hours)
        this.onSelectmins(mins);
        this.GetTimesheetListData(MailID,valuesCal);
    }

    onValueChange(value){
        console.log("lenth",Constants.actionItems.length)
        for(let i = 0;i<Constants.actionItems.length;i++){
            if(Constants.actionItems[i].value === value){
                Constants.actionItems[i].text = '#7666fe'
                Constants.actionItems[i].color = '#f1efff'
            }else{
                Constants.actionItems[i].text = '#969696'
                Constants.actionItems[i].color = '#eaeaea'
            }
            this.setState(Constants.actionItems)
        }
    }

    onNatureofWorkChange(Item){
        var {natureofWorkData} = this.state
        for (let i=0; i< natureofWorkData.length;i++){
            if(natureofWorkData[i].TASK_SUBTYPE_ID === Item.TASK_SUBTYPE_ID){
                natureofWorkData[i].text = '#7666fe';
                natureofWorkData[i].color = '#f1efff'
            }else{
                natureofWorkData[i].text = '#969696'
                natureofWorkData[i].color = '#eaeaea'
            }
            this.setState({
                natureofWorkData,
                selectedNature: Item.TASK_SUBTYPE_ID
            })
        }
    }


    onSelectHours(Items){
        console.log("hours",Constants.hours)
        for(let i = 0;i<Constants.hours.length;i++){
            if(Items !== undefined){
                if(Constants.hours[i].value === Items.value){
                    Constants.hours[i].text = '#7666fe'
                    Constants.hours[i].color = '#f1efff'
                }else{
                    Constants.hours[i].text = '#969696'
                    Constants.hours[i].color = '#eaeaea'
                }
                this.setState(Constants.hours)
                this.setState({hours:Items.value})
            }else{
                Constants.hours[i].text = '#969696'
                Constants.hours[i].color = '#eaeaea'
                this.setState(Constants.hours)
                this.setState({hours:undefined})
            }
        }
    }

    onSelectmins(Items){
        console.log("mins",Constants.mins)
        for(let i = 0;i<Constants.mins.length;i++){
            if(Items !== undefined){
                if(Constants.mins[i].value === Items.value){
                    Constants.mins[i].text = '#7666fe'
                    Constants.mins[i].color = '#f1efff'
                }else{
                    Constants.mins[i].text = '#969696'
                    Constants.mins[i].color = '#eaeaea'
                }
            this.setState(Constants.mins)
            this.setState({mins:Items.value})
            }else{
                Constants.mins[i].text = '#969696'
                Constants.mins[i].color = '#eaeaea'
                this.setState(Constants.mins)
            this.setState({mins:undefined})
            }
        }
    }

    onChangecomments = (Values)=> {
        this.setState({selectedComments : Values})
    }

    GetTimesheetListData(mailID, selectedDate) {
        console.log("Schedule Items")
        var TimesheetList = {
            MailID: mailID,
            date: selectedDate
        };
        Api.TimeSheetSummaryList(TimesheetList, function (response) {
            var items = {};
            var List = false;
            if (response.success) {
                if (response.data.length > 0) {
                    items = response.data;
                    List = true;
                    console.log("Item datas", items);
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
        console.log("Values of schedule", this.state.scheduleItems)
    }

    AddTask(values){
        var {hours,mins,mailID,valuesCal,selectVal,selectedTask,selectedNature,selectedComments} = this.state;
        var dataValues = {
            mailID: mailID,
            date: valuesCal
        }
        this.getTaskSheetDetails(dataValues);
        this.onSelectHours(undefined);
        this.onSelectmins(undefined);
        this.setState({
            addTask : values,
            taskList: [],
            natureofWorkData: [],
            isTaskselect: false,
            hours: undefined,
            mins: undefined,
            selectedTask : {},
            selectedNature : 0,
            selectedComments : ''
        })
        this.GetTimesheetListData(mailID,valuesCal);
    }

    getTaskSheetDetails(dataValues) {
        Api.TaskSheetList(dataValues, function (response) {
            console.log("Result Response", response);
            if (response.success) {
                var items = [];
                if (response.data.length > 0) {
                    for(let i = 0; i< response.data.length;i++){
                        response.data[i]['ID'] = i+1;
                        response.data[i]['IsSelect'] = false;
                    }
                    items = response.data;
                    console.log("Item datas", items);
                }
                else {
                    items = [];
                    console.log("Item datas empty", items);

                }
                this.setState({
                    taskList: items,
                    isLoading: false,
                    errorMessage: null,
                    timesheetData: dataValues
                })
            }
            else {
                alert(response.errorMessage);
            }
        }.bind(this))
    }

    taskSelection(taskItem){
        console.log("Task selected",taskItem);
        var {taskList,selectedTask} = this.state;
        for(let i = 0;i < taskList.length; i++){
            if(taskItem["ID"] === taskList[i]["ID"] ){
                taskList[i]['IsSelect'] = !taskList[i]['IsSelect'];
            }else{
                taskList[i]['IsSelect'] = false
            }
        }
        this.setState({
            taskList,
            selectedTask : taskItem,
            natureofWorkData:[],
        })
        this.natureofWorkdata(taskItem.TASK_ID)
    }

    natureofWorkdata(task) {
            
        var {mailID} = this.state
        var requestData = {};
        requestData = {
            taskID: task,
            mailID: mailID
        }
        Api.NatureOfWork(requestData, function (response) {
            console.log("Result Response", response);
            if (response.success) {
                var items = [];
                if (response.data.length > 0) {
                    
                    for(let i=0;i<response.data.length;i++){
                        response.data[i]["text"] ="#969696";
                        response.data[i]["color"] ="#eaeaea";
                    }
                    items = response.data;
                    console.log("nature of Work", items);
                }
                else {
                    items = [];
                    console.log("nature of Work empty", items);

                }
                this.setState({
                    natureofWorkData: items,
                    isTaskselect: true,
                })
            }
            else {
                alert(response.errorMessage);
            }
        }.bind(this))
    }

    saveAndnew(Value){
        var {hours,mins,mailID,selectVal,valuesCal,selectedTask,selectedNature,selectedComments,selectedDuration} = this.state;
        var totalHrs = hours+'.'+mins
        // console.log("selected Values",totalHrs,hours,mins,mailID,selectedTask,selectedNature,selectedComments)
        var checkValidation = this.checkFormValidation(); 
        console.log("Result",checkValidation)
        if (checkValidation.isValid) {
            this.setState({
                isLoading: true,
                errorMessage: '',
            }, () => {
                var saveCredentials = {
                    selectedDuration: this.state.selectedDuration,
                    selectedComments: this.state.selectedComments,
                    selectedNature: this.state.selectedNature,
                    taskID: this.state.selectedTask.TASK_ID,
                    date: this.state.valuesCal,
                    mailID: this.state.mailID,
                    extend_Id: this.state.selectedTask.TEAM_EXTN_ID
                }
                console.log("Saved async", saveCredentials)
                Api.SaveTaskInfo(saveCredentials, async function (response) {
                    console.log("SignIN async", response)
                    var Data = response.data;
                    if (response.success) {
                        console.log("Success")
                        CommonData.toastSuccessAlert("Created new timesheet entry!")
                        // this.navigateHome(stateData, response.data);
                        this.AddTask(Value);

                    }
                    else {
                        this.setState({
                            isLoading: false,
                            errorMessage: response.errorMessage
                        })
                        // CommonData.toastFailureAlert(response.errorMessage)
                        alert(response.errorMessage);

                    }
                }.bind(this));
            })
            if(!Value){
                this.GetTimesheetListData(mailID,valuesCal);
            }
        }
        else {
            // CommonData.toastWarningAlert(checkValidation.message)
            alert(checkValidation.message);
        }
    }

    
    checkFormValidation() {
        var {hours,mins,mailID,selectVal,selectedTask,selectedNature,selectedComments} = this.state;
        var duration = 0;
        var existDuration = parseFloat(selectedTask.REMAINING_HOURS)
        console.log("Duration Check", existDuration)
        if (hours != undefined && mins != undefined) {
            var testdur = hours+'.'+mins;
            duration = parseFloat(testdur).toFixed(2);
        }else if(hours === undefined && mins !== undefined){
            var testdur = 0 +'.'+mins;
            duration = parseFloat(testdur).toFixed(2);
        }else if(hours !== undefined && mins === undefined){
            duration = parseFloat(hours).toFixed(2);
        }else{
            duration = undefined
        }

        if(Object.keys(selectedTask).length === 0 ){
            console.log("Durat values",selectedTask);
            return {
                isValid: false,
                message: "Pick one task"
            };
        }
        else if(selectedNature === 0){
            return {
                isValid: false,
                message: "Select nature of work"
            };
        }
        else if (selectedComments == null || selectedComments.trim() === '' || duration == undefined) {
            return {
                isValid: false,
                message: duration == undefined ? "Enter the Duration of work" : "Enter the comments"
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
                message: "Your Timesheet duration limit exceeded for the task " + selectedTask.TASK_NUMBER
            };
        }
        else {
            console.log("Duration old", this.state.selectedDuration)
            this.setState({
                selectedDuration: duration
            }, () => {
                console.log("Duration", this.state.selectedDuration)
            })

            return {
                isValid: true
            };
        }
    }


    render(){   
        var { addTask,valuesCal,taskList,natureofWorkData,isTaskselect,selectedComments,scheduleItems } = this.state

        return(
            <Container>
            <View style={{width: SCREEN_WIDTH,height:SCREEN_HEIGHT - 260,paddingTop:10}}>
                <View style={{width:SCREEN_WIDTH,height:'10%'}}>
                    <ScrollView horizontal={true} style={{ backgroundColor: 'white',height:50}} showsHorizontalScrollIndicator={false}> 
                        <View style={{ flexDirection: 'row',  justifyContent:'space-around', padding:10, width:"100%" }}>
                            {
                                Constants.actionItems.map((item, index) => (
                                    <TouchableWithoutFeedback onPress={()=> this.onValueChange(item.value) } key={index}>
                                        <View style={[{minWidth:90, height:30, borderRadius:50,backgroundColor:item.color,padding:5, borderWidth:2, marginRight:10,borderColor:'transparent'}]}>
                                            <Text style={{color:item.text,textAlign:'center',fontSize:12}}>{item.label}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
                <View style={{paddingRight:10,paddingLeft:10,height:'90%',width:SCREEN_WIDTH}}>
                <Card style={{borderRadius:5}}>
                    <CardItem>
                    { addTask 
                        ?
                        <View style={{width:'100%'}}>
                            <ScrollView horizontal={true} style={{ backgroundColor: 'white',height:140}} showsHorizontalScrollIndicator={false}>
                            {
                                Object.entries(taskList)
                                .map(([key, value], i) => (
                                    <TouchableOpacity key={i} onPress = {()=> this.taskSelection(value)}>
                                        <React.Fragment  key={i}>
                                                <Card style={{width:220,height:110,borderRadius:10,marginTop:10,marginRight:10}}>    
                                                    <CardItem>
                                                        <View padder style={{flexDirection: 'column', justifyContent: 'flex-start', width: 220, paddingRight:15}}>
                                                            <View style={{ flexDirection:'row'}}>
                                                                <View style={{width:'80%'}}>
                                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, textAlign: 'left',color: '#7666fe' }}> {value.TASK_NUMBER} </Text>
                                                                </View>
                                                                <View style={{width:'20%'}}>
                                                                { !value.IsSelect 
                                                                    ?
                                                                        <Icon type="AntDesign" name="checkcircle" style={{ fontSize: 16, color: '#c0c0c0' }} />
                                                                    : 
                                                                        <Icon type="AntDesign" name="checkcircle" style={{ fontSize: 16, color: '#7666fe' }} />
                                                                }    
                                                                
                                                                </View>
                                                            </View>
                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2,fontWeight:'bold', color: '#434a54' }}>{value.PROJECT_TITLE}</Text>
                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#959595' }}>{value.TASK_TITLE} - {value.TASK_DEVELOPMENT_TYPE} </Text>
                                                            <View style={[{minWidth:20,maxWidth:60, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2, marginRight:10,borderColor:'transparent'}]}>
                                                                <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}>{value.REMAINING_HOURS} Hrs</Text>
                                                            </View>
                                                        </View>
                                                    </CardItem>
                                                </Card>  
                                            
                                        </React.Fragment>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                        
                        <CSIcon style={{textAlign:'center',color:'#7666fe',width:'100%'}} name={"Artboard-561"} size={22} />

                        <ScrollView horizontal={true} style={{ backgroundColor: 'white',height:80,width:'100%'}} showsHorizontalScrollIndicator={false}>
                            { isTaskselect
                            ?
                                <View style={{ flexDirection: 'row',  justifyContent:'space-around', padding:10, width:"100%" }}>
                                    {
                                        natureofWorkData.map((item, index) => (
                                            <TouchableWithoutFeedback onPress={()=> this.onNatureofWorkChange(item)} key={index}>
                                                <View style={[{minWidth:90, height:30, borderRadius:50,backgroundColor:item.color,padding:5, borderWidth:2, marginRight:10,borderColor:'transparent'}]}>
                                                    <Text style={{color:item.text,textAlign:'center',fontSize:12}}>{item.TASK_SUBTYPE}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        ))
                                    }
                                </View>
                            :
                                <View style={{justifyContent:'center',width:'100%'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{textAlign:'center', fontSize: 14, padding: 2, color: '#959595' }}>Select task from above list </Text>
                                </View>
                            }
                        </ScrollView>

                        <CSIcon style={{textAlign:'center',color:'#7666fe',width:'100%'}} name={"Artboard-561"} size={22} />

                        <View style={{ flexDirection: 'row', backgroundColor: 'white',width:'100%',height:100}}>
                        <View style={{flex:1}}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,textAlign:'center', marginTop:10, padding: 2, color: 'black' }}> Hours </Text>
                            <ScrollView horizontal={true} style={{ backgroundColor: 'white',height:70}} showsHorizontalScrollIndicator={false}> 
                                <View style={{ flexDirection: 'row',  justifyContent:'space-around', padding:10, width:"100%" }}>
                                    {
                                        Constants.hours.map((item, index) => (
                                            <TouchableWithoutFeedback onPress={()=> this.onSelectHours(item) } key={index}>
                                                <View style={[{minWidth:30, height:30, borderRadius:50,backgroundColor:item.color,padding:5, borderWidth:2, marginRight:10,borderColor:'transparent'}]}>
                                                    <Text style={{color:item.text,textAlign:'center',fontSize:12}}>{item.label}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{flex:1}}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, marginTop:10,textAlign:'center', padding: 2, color: 'black' }}>Minutes </Text>
                            <ScrollView horizontal={true} style={{ backgroundColor: 'white',height:70}} showsHorizontalScrollIndicator={false}> 
                                <View style={{ flexDirection: 'row',  justifyContent:'space-around', padding:10, width:"100%" }}>
                                    {
                                        Constants.mins.map((item, index) => (
                                            <TouchableWithoutFeedback onPress={()=> this.onSelectmins(item) } key={index}>
                                                <View style={[{minWidth:30, height:30, borderRadius:50,backgroundColor:item.color,padding:5, borderWidth:2, marginRight:10,borderColor:'transparent'}]}>
                                                    <Text style={{color:item.text,textAlign:'center',fontSize:12}}>{item.label}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14,marginTop:10, padding: 2, color: '#7666fe' }}>Description </Text>
                            <View style={[{width:'100%', height:30, borderRadius:5,backgroundColor:'#edebeb',padding:5, borderWidth:2,marginTop:10, marginRight:10,borderColor:'transparent'}]}>
                                <Input placeholder="" value={selectedComments} onChangeText={this.onChangecomments}/>
                            </View>
                        </View>
                        :
                        <View style={{width:'100%',height:'100%'}}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                            {   this.state.scheduleItems.length > 0
                            ?   
                                Object.entries(scheduleItems)
                                .map(([key, value], i) => (
                                    <TouchableOpacity key={i} onPress = {()=> this.onScheduleclick(value)}>
                                        <React.Fragment  key={i}>
                                            <Card style={{width:'99%',height:130,borderRadius:10,marginTop:10,marginBottom:10}}>    
                                            <CardItem>
                                            <View padder style={{flexDirection: 'column', justifyContent: 'flex-start', width: '100%'}}>
                                                <View style={{ flexDirection:'row'}}>
                                                    <View style={{width:'80%'}}>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, margin: 2,textAlign: 'left',color: '#7666fe' }}> {value.TASK_NUMBER} </Text>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> { value.PROJECT_TITLE } </Text>
                                                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{ value.TASK_TITLE } </Text>
                                                    <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                                        <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> { value.TASK_SUB_TYPE } </Text>
                                                    </View>
                                                    </View>
                                                    <View style={{width:'20%',justifyContent:'center'}}>
                                                        <Text style={{fontWeight:'bold',color:'#434a54',textAlign:'center',fontSize:14}}> {value.DURATION} Hrs</Text>    
                                                    </View>
                                                </View>
                                            </View>    
                                            </CardItem>
                                            </Card>
                                        </React.Fragment>
                                    </TouchableOpacity>
                                ))
                                 :   
                                <NoRecordsFound/>
                            }    
                            </ScrollView>
                        </View>
                    }
                    </CardItem>
                </Card>
                </View>
            </View>
            <Footer style={{backgroundColor:'white',alignItems:'center'}}>
            { addTask 
                        ?
                <View style={{ flexDirection: 'row',  justifyContent:'space-around', padding:10, width:"100%" }}>
                    <Button style={{minWidth:120,justifyContent:'center',backgroundColor:'transparent'}}
                    onPress={()=> this.AddTask(false)}>
                        <Text style={{alignSelf:'center',color:'#c0c0c0',fontSize:12}}>Cancel</Text>
                    </Button>
                    <Button rounded style={{minWidth:120,justifyContent:'center',backgroundColor:'#f1efff'}}
                    onPress={()=> this.saveAndnew(true)}>
                        <Text style={{alignSelf:'center',color:'#7666fe',fontSize:12}}>Save and New</Text>
                    </Button>
                    <Button rounded style={{minWidth:120,justifyContent:'center',backgroundColor:'#7666fe'}}
                    onPress={()=> this.saveAndnew(false)}>
                        <Text style={{alignSelf:'center',color:'#ffffff',fontSize:12}}>Save Task</Text>
                    </Button>
                </View>
                :
                <View>
                    <Button rounded style={{minWidth:140,justifyContent:'center',backgroundColor:'#7666fe'}}
                    onPress={()=> this.AddTask(true)}>
                        <Text style={{alignSelf:'center',color:'#ffffff',fontSize:14}}>Add task</Text>
                    </Button>
                </View>
            }
            </Footer>
            </Container>
        )
    }
}

export default BottomView;
