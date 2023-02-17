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
    View,Item,Input,Form,Textarea,
    H3,Subtitle,DatePicker, Footer
} from "native-base";
import { StyleSheet, Dimensions, StatusBar, AsyncStorage,TouchableWithoutFeedback, 
    TouchableOpacity,Keyboard,ActivityIndicator,Modal } from 'react-native';
import * as Api from '../../services/api/approval';
import moment from 'moment';
import _ from 'underscore';
import { SwipeRow } from 'react-native-swipe-list-view';
import NoRecordsFound from '../noRecordFound';
import { CommonData } from '../../utils';
import CSIcon from '../../icon-font';


const RejectinfoModel = (props) => {
    var screen = Dimensions.get('window');
    return(
        <Modal 
        animationType="fade"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
            props.showrejectionModal(false,{})
    }}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View padder style={{width: 300, height: 250, backgroundColor: '#fff', borderRadius: 5, justifyContent: 'center'}}>
                <Text>Enter reason for Rejection :</Text>
                <Form>
                    <Textarea rowSpan={5} bordered placeholder="Rejection reason" onChangeText={(value) => props.onChangeData(value)} />
                </Form>
                <View style={{flex:1,flexDirection: 'row', justifyContent: 'center',marginTop:5,marginBottom:5 }}>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Button style={{width:'70%'}} onPress={() => props.typeReject.lenth == 0 ? props.rejectService() : props.singleReject(props.typeReject)} >
                            <Text style={{ color: 'white',marginLeft:20 }}>Ok</Text>
                        </Button>
                    </View>
                    <View style={{ width:  '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Button style={{width:'70%'}} onPress={() => props.showrejectionModal(false,{})}>
                            <Text style={{ color: 'white',marginLeft:5 }}>cancel</Text>
                        </Button>
                    </View>
                </View>
            </View>
            </View>
            
        </Modal>
    )
} 


class Filtersubmit extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            filtered_List:[],
            filter_select: [],
            emailID: undefined,
            startDate : '',
            endDate : '',
            usersID : '',
            isLoading : false,
            selectedList:[],
            listData :[],
            showRejectionview : false,
            typeReject: {},
            onChangeTextArea: ''
        }
        this.getFilteredapprovelist = this.getFilteredapprovelist.bind(this);
        this.approveService = this.approveService.bind(this);
        this.rejectService = this.rejectService.bind(this);
        this.showrejectionModal = this.showrejectionModal.bind(this);
        this.onChangeData = this.onChangeData.bind(this);
        this.singleApproval = this.singleApproval.bind(this);
        this.singleReject = this.singleReject.bind(this);
    }

    async componentDidMount(){
        var mailID = await AsyncStorage.getItem('Email');
        var filterdata = this.props.navigation.getParam('Datas', '');
        
        var listDatas = {
            MailID : mailID,
            startDate: this.ChangeUrlDate(filterdata.startDate),
            endDate:this.ChangeUrlDate(filterdata.endDate),
            usersID: filterdata.usersInfo
        }

        this.setState({
            emailID: mailID,
            startDate: filterdata.startDate,
            endDate: filterdata.endDate,
            usersID : filterdata.usersInfo,
            isLoading: true,
        },()=>{
            this.getFilteredapprovelist();
        })
    }

    getFilteredapprovelist(){
        var {emailID,startDate,endDate,usersID} = this.state;
        var listDatas = {
            MailID : emailID,
            startDate: this.ChangeUrlDate(startDate),
            endDate:this.ChangeUrlDate(endDate),
            usersID: usersID
        }
        console.log("filtered values",listDatas)
        Api.approvalRequestList(listDatas, function (response) {
            console.log("Result Response", response);
            var items = {};
            if (response.success) {
                if (response.data.length > 0) {
                    console.log("Result",response.data);
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i]['IsSelect']= false;
                        response.data[i]['IsSuccess'] = '';
                        response.data[i]['Message'] = '';
                    }
                    items = response.data;
                    var groupedVal = _.groupBy(items,'TIMESHEET_DATE');
                    console.log("Grouped Val: ",groupedVal);
                    this.setState({
                        filtered_List : groupedVal,
                        listData: response.data,
                        isLoading: false
                    })
                }else{
                    this.setState({
                        isLoading: false
                    })
                }
            }else{
                this.setState({
                    isLoading: false,
                    filtered_List:[],
                    listData:[],
                })
                CommonData.toastFailureAlert(response.errorMessage);    
            }
        }.bind(this));
    }

    ChangeUrlDate(selectedDate) {
        var d = new Date(selectedDate);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeToString = d.getDate().toString() + "-" + months[d.getMonth()] + "-" + d.getFullYear().toString();
        return timeToString;
    }

    CheckActivity(item) {
        var {listData,selectedList} = this.state;
        for(let i = 0;i < listData.length; i++){
            if(item["TIMESHEET_LINE_ID"] === listData[i]["TIMESHEET_LINE_ID"] ){
                listData[i]['IsSelect'] = !listData[i]['IsSelect'];
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
            listData,
            selectedList
        },()=>{
            console.log("List",selectedList)
        })
    }

    
    selectallOption() {
        var {listData,selectedList,filter_select} = this.state;
        
        var filtered = listData.filter(function(items) {
            return items["IsSuccess"] === '' ;  
        })
        if(filtered.length > 0){
            
            for(let i = 0; i< filtered.length;i++){
                if(!filtered[i]['IsSelect']){
                    filtered[i]['IsSelect'] = true;
                    selectedList.push(filtered[i])
                }
            }
            this.setState({
                listData,
                selectedList,
                filter_select : filtered
            })
        }
    }

    deselectOption() {
        var {listData,selectedList,filter_select} = this.state;

        var filtered = listData.filter(function(items) {
            return items["IsSuccess"] === '' ;  
        })
        if( filtered.length > 0 ){
            for(let i = 0; i< filtered.length;i++){
                if(filtered[i]['IsSelect']){
                    filtered[i]['IsSelect'] = false;
                }
            }
            this.setState({
                listData,
                selectedList : [],
                filter_select : filtered
            })
        }
    }

    
    approveService(){
        var {selectedList,emailID,listData} = this.state
        console.log("selectedList",selectedList)
        for(let i = 0;i<selectedList.length ; i++){
            var payload = {
                sheetNumber: selectedList[i].TIMESHEET_NUMBER,
                lineId: selectedList[i].TIMESHEET_LINE_ID,
                MailID: emailID
            }
            Api.apporveSheet(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        for(let j=0;j<listData.length;j++){
                            if(listData[j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                                listData[j]['IsSuccess'] = 'Y';
                                listData[j]['Message'] = ' Approved ';
                                listData[j]['IsSelect'] = false;
                            }
                        }
                        // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully approved")
                    }
                }else{
                    for(let j=0;j<listData.length;j++){
                        console.log("line id 2",selectedList[i].TIMESHEET_LINE_ID )
                        if(listData[j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                            console.log("line id 1",listData[j]['TIMESHEET_LINE_ID'] )
                            listData[j]['IsSuccess'] = 'N';
                            listData[j]['Message'] = response.errorMessage;
                            listData[j]['IsSelect'] = false;
                        }
                    }
                    // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                }
                this.setState({
                    listData,
                    selectedList: []
                })
            }.bind(this))
            
        }
    }

    rejectService(){
        var {selectedList,listData,emailID,onChangeTextArea,showRejectionview} = this.state

        console.log("selectedList",selectedList)

        for(let i = 0;i<selectedList.length ; i++){
            var payload = {
                sheetNumber: selectedList[i].TIMESHEET_NUMBER,
                lineId: selectedList[i].TIMESHEET_LINE_ID,
                MailID: emailID,
                reason:onChangeTextArea
            }
            Api.rejectionSheet(payload,function(response){
                if (response.success) {
                    if (response.data.length > 0) {
                        // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully Rejected")
                        for(let j=0;j<listData.length;j++){
                            if(listData[j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                                listData[j]['IsSuccess'] = 'Y';
                                listData[j]['Message'] = ' Rejected ';
                                listData[j]['IsSelect'] = false;
                            }
                        }
                        this.setState({
                            showRejectionview: false,
                            listData
                        })
                    }
                }else{
                    // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                    for(let j=0;j<listData.length;j++){
                        if(listData[j]['TIMESHEET_LINE_ID'] === selectedList[i].TIMESHEET_LINE_ID){
                            listData[j]['IsSuccess'] = 'N';
                            listData[j]['Message'] = response.errorMessage;
                            listData[j]['IsSelect'] = false;
                        }
                    }
                }
                this.setState({
                    showRejectionview: false,
                    listData,
                    selectedList: []
                })
            }.bind(this))
        }
    }
    
    showrejectionModal(visible,type) {
        console.log('Test val',type)
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
        var {emailID,selectedList,filtered_List,listData} = this.state
        var payload = {
            sheetNumber: item.TIMESHEET_NUMBER,
            lineId: item.TIMESHEET_LINE_ID,
            MailID: emailID
        }
    
        Api.apporveSheet(payload,function(response){
            console.log("Test approve",response)
            if (response.success) {
                if (response.data.length > 0) {
                    // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully approved")
                    console.log("Values test info",listData)
                    for(let i=0;i<listData.length;i++){
                        console.log("Values testing")
                        if(listData[i]['TIMESHEET_LINE_ID'] === payload.lineId){
                            console.log("Values comeing")
                            listData[i]['IsSuccess'] = 'Y';
                            listData[i]['Message'] = ' Approved ';
                        }
                    }
                }
            }else{
                // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
                for(let i=0;i<listData.length;i++){
                    console.log("Values test info new",listData)
                    if(listData[i]['TIMESHEET_LINE_ID'] === payload.lineId){
                        listData[i]['IsSuccess'] = 'N';
                        listData[i]['Message'] = response.errorMessage;
                    }
                }
            }
            this.setState({
                selectedList: [],
                listData,
                filtered_List
            });
        }.bind(this))
        
        
        

        // this.getFilteredapprovelist();
    }

    singleReject(item){
        var {emailID,onChangeTextArea,selectedList,listData} = this.state;
        console.log("Results item reject",item)
        var payload = {
            sheetNumber: item.TIMESHEET_NUMBER,
            lineId: item.TIMESHEET_LINE_ID,
            MailID: emailID,
            reason:onChangeTextArea
        }
        Api.rejectionSheet(payload,function(response){
            if (response.success) {
                if (response.data.length > 0) {
                    for(let i=0;i<listData.length;i++){
                        if(listData[i]['TIMESHEET_LINE_ID'] === payload.lineId){
                            listData[i]['IsSuccess'] = 'Y';
                            listData[i]['Message'] = 'Rejected';
                        }
                    }
                    // CommonData.toastSuccessAlert(payload.sheetNumber+" is successfully Rejected")
                }
            }else{
                for(let i=0;i<listData.length;i++){
                    if(listData[i]['TIMESHEET_LINE_ID'] === payload.lineId){
                        listData[i]['IsSuccess'] = 'N';
                        listData[i]['Message'] = response.errorMessage;
                    }
                }
                // CommonData.toastFailureAlert(payload.sheetNumber+" is "+response.errorMessage);
            }
            this.setState({
                showRejectionview: false,
                typeReject: [],
                selectedList: [],
                listData
            })
        }.bind(this))
        
        // this.getFilteredapprovelist();
    }

    render(){
        var {isLoading,filtered_List,selectedList,listData,filter_select} = this.state;
        const screen = Dimensions.get('window');
        return(
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
                        <Title>Filtered Values</Title>
                    </Body>
                    <Right>
                    <Right>
                        {selectedList.length > 0 && filter_select.length > 0 
                            && selectedList.length === filter_select.length
                            ?
                            <Button  hasText transparent onPress={() => this.deselectOption()} >
                                <Text style={ Platform.OS === 'ios' ? {color:'#009688'} : null}>DeSelect All</Text>
                            </Button>
                            :
                            <Button  hasText transparent onPress={() =>this.selectallOption() } >
                                <Text style={ Platform.OS === 'ios' ? {color:'#009688'} : null}>Select All</Text>
                            </Button>
                            }
                        
                    </Right>
                    </Right>
                </Header>
                <StatusBar backgroundColor='#009688' />
                <Content>
                    {
                        isLoading 
                        ?
                        <ActivityIndicator />
                        :
                        Object.keys(filtered_List).length > 0
                        ?
                        <React.Fragment>
                            {
                                Object.entries(filtered_List)
                                    .map(([key, value], i) => (
                                        <React.Fragment key={i}>
                                            <ListItem itemDivider ><Text>{this.ChangeUrlDate(key)}</Text></ListItem>
                                            {
                                                value.map((item, j) => (
                                                    
                                                    <SwipeRow key={j} rightOpenValue={-120} disableRightSwipe={true} >
                                                        <View style={styles.standaloneRowBack} icon>
                                                            
                                                            <TouchableOpacity disabled={item.IsSuccess !== '' ? true : false } transparent style={styles.approveButton} onPress={()=> this.singleApproval(item)} >
                                                                <View>
                                                                    <Icon iconLeft style={{ color: '#fff' }} type="Feather" name="check" />
                                                                </View>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity transparent disabled={item.IsSuccess !== '' ? true : false } style={styles.rejectButton} onPress={() => this.showrejectionModal(true,item)} >
                                                                <View>
                                                                    <Icon iconLeft style={{ color: '#fff' }} type="AntDesign" name="close" />
                                                                </View>
                                                            </TouchableOpacity>
                                                            
                                                        </View>
                                                        <TouchableWithoutFeedback >
                                                        <View style={styles.standaloneRowFront} icon>
                                                            <View padder style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width, height: 180 }}>
                                                                <View style={ (item.IsSuccess == 'Y') ? styles.headerSucess : (item.IsSuccess == 'N') ? styles.headerFail : styles.header}>
                                                                    <Text style={styles.duration}> {item.DURATION}{"\n"}
                                                                        <Text style={styles.hours}>hrs</Text></Text>
                                                                        <TouchableOpacity disabled={item.IsSuccess !== '' ? true : false } transparent onPress={() => this.CheckActivity(item)}>
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
                                                                    
                                                                    <View style={{ width: '100%', height: '25%', justifyContent: 'flex-start' }}>
                                                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2, color: '#434a54' }}>{item.PROJECT_TITLE}</Text>
                                                                    </View>
                                                                    <View style={{ width: '100%', height: '30%', justifyContent: 'flex-start' }}>
                                                                        <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, padding: 2, color: '#999999' }}>{item.COMMENTS}</Text>
                                                                    </View>
                                                                    </View>
                                                                    <View style={{ width: '100%', height: '35%', flexDirection: 'row', }}>
                                                                        <View style={{ width: '15%', height: '100%', alignContent: 'flex-start' }}>
                                                                            <Icon type="Ionicons" name="ios-contact" style={{ fontSize: 35, color: '#009688' }} />
                                                                        </View>
                                                                        <View style={{ width: '85%', height: '100%', alignContent: 'flex-start' }}>
                                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, textAlign: 'left', marginTop: 7, color: '#434a54' }} > {item.EMPLOYEE_NAME} </Text>
                                                                        </View>
                                                                        {/* <View style={{ width: '35%', height: '100%', alignContent: 'flex-end' }}>
                                                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, textAlign: 'right',marginTop:7, color: '#999999' }} > {item.TIMESHEET_LINE_ID} </Text>
                                                                            </View> */}
                                                                    </View>
                                                                    { item.Message != '' ?
                                                                        <Text style={{color:"#fff",flex:1,marginTop:60,textAlign:'center',fontSize:20 ,top:0 , bottom:0,right:0,left:0,position:'absolute'}}>{item.Message} </Text>
                                                                        :
                                                                        null
                                                                    }
                                                                </View>
                                                             </View>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </SwipeRow>
                                                ))
                                            }
                                        </React.Fragment>
                                ))
                            }
                            </React.Fragment>       
                        :
                            <NoRecordsFound/>
                            
                    }
                    <RejectinfoModel 
                                modalVisible={this.state.showRejectionview} 
                                showrejectionModal={this.showrejectionModal} 
                                onChangeTextArea={this.state.onChangeTextArea}
                                rejectService={this.rejectService} 
                                onChangeData = {this.onChangeData}
                                typeReject= {this.state.typeReject}
                                singleReject = {this.singleReject.bind(this)}

                            />
                </Content>
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
                        <Button  iconRight rounded light danger onPress={() => this.showrejectionModal(true,{})} >
                            <Text style={{ color: 'white' }}>Reject</Text>
                            <Icon name='close'style={{ color: 'white' }} />
                        </Button>
                        </View> */}
                    </View>
                </Footer>
                }
            </Container>
        )
    }

}


var styles = StyleSheet.create({
    companyName: {
        color: '#A9A9A9',
        fontSize: 15
    },
    isFavourite: {
        backgroundColor: "orange",
        width: 20,
        height: 20
    },
    isNotFavourite: {
        backgroundColor: "#d3d3d3",
        width: 20,
        height: 20
    },
    favouriteIconSize: {
        fontSize: 10
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
    innerWrap: {
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#d3d3d3',
        flex: 1,
        flexDirection: 'row',
    },
    noBorder: {
        borderTopWidth: 0
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
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        backgroundColor: 'transparent',
       }
})
export default Filtersubmit;