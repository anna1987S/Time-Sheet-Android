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
    View,Item,Input,
    H3,Subtitle,DatePicker, Footer
} from "native-base";
import { StyleSheet, Dimensions, StatusBar, AsyncStorage, TouchableOpacity,Keyboard } from 'react-native';
import * as Api from '../../services/api/approval';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import DateTimePicker from "react-native-modal-datetime-picker";
import ParticipantModal from './pickusers';
import { CommonData } from '../../utils';
import CSIcon from '../../icon-font';

class Filter extends React.Component{

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

        }
        this.setModalVisible = this.setModalVisible.bind(this);
        this.getuserslistData = this.getuserslistData.bind(this);
        this.addToParticipants = this.addToParticipants.bind(this);
        this.getSelectedContacts = this.getSelectedContacts.bind(this);
    }

    async componentDidMount(){
        var mailID = await AsyncStorage.getItem('Email');
        this.getuserslistData(mailID);
    }

     getuserslistData = (mailID) => {
        Api.managedEmployeeList(mailID,function (response){
            console.log("Result Response", response.data);
            // var item = {};
            if (response.success) {
                if (response.data.length > 0) {
                    // item = response.data 
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i]['active']= false;
                    }
                    this.setState({
                        userItems: response.data
                    })
                }
                console.log("info Data: ",this.state.userItems)   
            }
        }.bind(this));
    }

    showDateTimePicker = (key, mode) => {
        Keyboard.dismiss();
        this.setState({
            calendarMode: mode,
            isDateTimePickerVisible: true,
            calendarFor: key
        });
    };

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

    timeToString(time){
        const date = new Date(time);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = date.getDate().toString() + "-" + months[date.getMonth()] + "-" + date.getFullYear().toString();
        return timeToString;
    }

    timeToStringService(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        //Set Selected Items
      };

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    setFilteredData() {
        var {startDateService,endDateService,filterContact} = this.state;
        var users = "";
        if(startDateService!== '' && 
            endDateService !== '' ){
            if(startDateService <= endDateService){
                var userslist = [];
                if(filterContact.length > 0){
                    for(let i = 0; i<filterContact.length; i++){
                        userslist.push(filterContact[i]['USER_ID'])
                    }
                    console.log("filterd record",userslist)
                    console.log("list string",userslist.toString());
                    users = userslist.toString()
                }
                var filterdDatas = {
                    startDate : startDateService,
                    endDate: endDateService,
                    usersInfo : users
                }
                this.props.navigation.navigate('SubmitFilter',{Datas: filterdDatas});
            }else{
                CommonData.toastWarningAlert("Start Date must be less then End Date")
            }
        }else{
            startDateService === '' ? 
            CommonData.toastWarningAlert("select Start Date") :
            CommonData.toastWarningAlert("select End Date")        
        }
    }

    addToParticipants(i) {
        var { userItems,filterContact } = this.state;
        userItems[i]['active'] = !userItems[i]['active'];
        if(userItems[i]['active']){
            filterContact.push(userItems[i])
        }
        else if(!userItems[i]['active']){
            filterContact = filterContact.filter(function(item) {
                return item.USER_ID !== userItems[i].USER_ID;  
            })
        }
        this.setState({
            userItems,
            filterContact
        })
    }

    getSelectedContacts() {
        return this.state.filterContact
    }

    render(){
        const screen = Dimensions.get('window');
        var { selectedItems,isLoading } = this.state;
        // console.log("Values Current Date11: ",DeviceInfo.getTimezoneOffset());
        return (
            <Container>
                <Header style={Platform.OS ==='android'? { backgroundColor: '#009688' }: null}>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()} >
                                {
                                    Platform.OS === 'android' ?
                                    <CSIcon name={"Artboard-2-copy-21"} size={22} />
                                    :
                                    <CSIcon name='Artboard-2-copy-21' size={22} color="#009688" />
                                }
                        </Button>
                    </Left>
                    <Body>
                        <Title>Filter</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <StatusBar backgroundColor='#009688' />
                <Content>
                    <View padder style={{ flex: 1, flexDirection: 'row', width: screen.width, height: '100%', justifyContent: 'center' }}>
                        <View style = {{width:'40%'}}>
                            <Item  >
                                <Input  value={this.state.startDate}  placeholder='Start Date'  editable={Platform.OS === 'ios' ? 'false' : true} onTouchEnd ={() => this.showDateTimePicker('startDate', 'date')}  name="startDate" />
                            </Item>
                        </View>
                        <View style = {styles.circle}>
                            <Icon size={24} style={{ marginTop: 10,marginLeft:10 ,color:'#fff',alignItems: 'center',justifyContent: 'center'}} type ='FontAwesome' name='search'/>
                        </View>
                        <View style = {{width:'40%'}}>
                            <Item  >
                                <Input  value={this.state.endDate}  placeholder='End Date'  editable={Platform.OS === 'ios' ? 'false' : true} onTouchEnd ={() => this.showDateTimePicker('endDate', 'date')}  name="endDate" />
                            </Item>
                        </View>
                    </View>
                    <View style={{ flex: 1, padding: 30 }}>
                    <Item regular>
                        <TouchableOpacity  onPress={() => { this.setModalVisible(true); }} >
                        <View style={{ flex: 1, flexDirection: 'row', width: screen.width, height: 45, justifyContent: 'center' }} >
                            <View style = {{width:'70%'}}>
                            {
                                this.state.filterContact.length > 0 
                                ?
                                <Text style={{marginTop:9, marginLeft:5}}>Picked {this.state.filterContact.length} Users</Text>
                                :
                                <Text style={{marginTop:9, marginLeft:5}}>Select Users</Text>
                            }
                            </View>
                            <View style = {{width:'30%'}}>
                                <Icon style={{marginTop:9,marginLeft:15}} size={22} type="Entypo" name="chevron-down"/>
                            </View>
                        </View>
                        </TouchableOpacity>
                    </Item>
                    </View>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        mode={this.state.calendarMode}
                    />
                    <ParticipantModal
                        contacts={this.state.userItems}
                        modalVisible={this.state.modalVisible}
                        setModalVisible={this.setModalVisible}
                        addToParticipants={this.addToParticipants}
                        getSelectedContacts={this.getSelectedContacts}
                        isLoading={isLoading}
                        // onSearchSubmit={this.onSearchSubmit}
                        // filterList={this.state.filterContact}
                    />
                    
                </Content>
                <TouchableOpacity  onPress={() => this.setFilteredData()} >
                <Footer style={Platform.OS ==='android'? {backgroundColor:"#009688",alignContent:'center'} : {alignContent:'center'} }>   
                        <Text style={Platform.OS ==='android' ? {marginTop:15,color:"#ffffff"}:{marginTop:15,color:"#009688"}}>Apply Filter</Text>
                </Footer>
                </TouchableOpacity>
            </Container>    
        )
    }
}
const styles = StyleSheet.create({
    circle: {
        width: 50,
        height: 50,
        borderRadius: 100/2,
        backgroundColor: '#009688'
    }
})

export default Filter;