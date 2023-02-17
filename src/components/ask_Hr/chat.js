import React ,{ Component } from "react";
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
    Switch,
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal, ScrollView,
    ActivityIndicator,KeyboardAvoidingView,TouchableWithoutFeedback
 } from 'react-native';
import CSIcon from '../../icon-font';
import { Validate, Constants } from '../../utils';
import * as Api from '../../services/api/askHR';
import NoRecordsFound from '../noRecordFound';
import { values } from "underscore";
import { CommonData } from '../../utils';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0

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

export default class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            myDate: new Date(),
            isLoading : false,
            isLazyLoading : false,
            userInfo: {},
            mailID:'',
            sessionData : '',
            modalVisible : false,
            selected: this.MarkedDatePass(new Date()),
            popupModuleVal : '',
            popupModuleId : 0,
            popupCategoryVal : '',
            popupCategoryId : 0,
            priorityVal : 'P2',
            severityVal : 'S2',
            comments:"",
            statusId: "O",
            statusVal: "Open",
            modalList : [],
            categoryList : [],
            actionfooterHeightObj: { display: "none" },
            chatList: [],
            values : {},
            type : '',
            // tasktype : '',
            isModuleView: true,
        }
        this.callNoteInput = React.createRef();
    }

    async componentDidMount(){
        var isNotification = this.props.navigation.getParam("filterType") == "notification" ? true : false;
        if(!isNotification){
            var MailID = await AsyncStorage.getItem('Email');
            var UserInfo = await AsyncStorage.getItem('userInfo');
            var seessionKey = await AsyncStorage.getItem('sessionKey');
            var datainfo = this.props.navigation.getParam("EmpDetail");
            var type = this.props.navigation.getParam("Type");
            // var tasktype = this.props.navigation.getParam("user");
            console.log("Data info",datainfo)
            if(type == 'View'){
                this.setState({
                    mailID: MailID,
                    userInfo : JSON.parse(UserInfo),
                    sessionData : seessionKey,
                    values : datainfo,
                    type,
                    // tasktype,

                }, () => {
                    
                var postData = {
                    sessionKey: seessionKey,
                    popupName: "MODULE"
                }
                    this.popupFetchService(postData);
                    this.myTaskPress(datainfo);
                })
            }else{

                this.setState({
                    mailID: MailID,
                    userInfo : JSON.parse(UserInfo),
                    sessionData : seessionKey,
                    type,
                    // tasktype,

                }, () => {
                    
                var postData = {
                    sessionKey: seessionKey,
                    popupName: "MODULE"
                }
                    this.popupFetchService(postData);
                })
            }
        }else{
            
            var MailID = await AsyncStorage.getItem('Email');
            var UserInfo = await AsyncStorage.getItem('userInfo');
            var seessionKey = await AsyncStorage.getItem('sessionKey');
            var datainfo = this.props.navigation.getParam("data");
            var type = "View";
            console.log("Notification View AskHR",datainfo.askHrData)
            this.setState({
                mailID: MailID,
                userInfo : JSON.parse(UserInfo),
                sessionData : seessionKey,
                values : datainfo.askHrData,
                type,
                // tasktype,

            }, () => {
                
            var postData = {
                sessionKey: seessionKey,
                popupName: "MODULE"
            }
                this.popupFetchService(postData);
                this.myTaskPress(datainfo.askHrData);
            })
        }
    }

    MarkedDatePass(StringDate) {
        var d = new Date(StringDate);
        var beforeChange = d.getFullYear().toString() + "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + ("0" + d.getDate()).slice(-2).toString();
        return beforeChange;
    }

    popupFetchService = (postData) => { 
        Api.popupFetchHR(postData,function(response){
            console.log("popup Response",response);
            if (response.success) {
                if(response.data.length > 0){
                    // response.data.unshift({ hiddenId: 0, hiddenCode: "-- Select --" })
                    if(response.PopupName == "MODULE"){
                        this.setState({
                            modalList : response.data
                        },()=>{
                            var postInfo = {
                                sessionKey: postData.sessionKey,
                                popupName: "CATEGORY"
                            }
                            this.popupFetchService(postInfo);
                        })
                    }else if(response.PopupName == "CATEGORY"){
                        this.setState({
                            categoryList: response.data,
                        })
                    }
                }else{
                    if(response.PopupName == "MODULE"){
                        this.setState({
                            modalList : [],
                        })
                    }
                    if(response.PopupName == "CATEGORY"){
                    this.setState({
                        categoryList : [],
                    })
                    }
                }
            }else{
                this.toastRej.show(response.errorMessage)
            }
        }.bind(this));
    }

    statusVal = (status) =>{
        var selectId = statusList.filter((item,index)=>{
            return(item.Id === status)
        })
        console.log("selectID",selectId[0])
        // this.setState({
        //     statusId: selectId[0].Id,
        //     statusVal: selectId[0].hiddenCode
        // })
        return selectId[0].hiddenCode
    }

    
    onModuleChange = (value) =>{
        console.log("Module Values",value)
        var selectId = this.state.modalList.filter((item,index)=>{
            return(item.hiddenId === value)
       })
       console.log("Module selected",selectId);
       this.setState({
           popupModuleId: value,
           popupModuleVal: selectId[0].hiddenCode,
           isModuleView : false,
       })
    }

    onCategoryChange = (value) =>{
        console.log("Category Values", value)
        var selectId = this.state.categoryList.filter((item,index)=>{
            return(item.hiddenId === value)
       })
       console.log("Category selected",selectId);
       this.setState({
           popupCategoryId: value,
           popupCategoryVal: selectId[0].hiddenCode,
       })

    }

    myTaskPress = (value) => {

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
                // if(val == ""){
                //     taskType == "MyTask" ? this.props.updateValue(id,value) : this.props.updateAppliedLayout(id,value);
                // }
            }else{
            this.toastRej.show(response.errorMessage)
            this.setState({
                istaskLoading : false,
            })
            }
                
        }.bind(this))
    }

    _saveQueryInfo = () => {
        this.callNoteInput.current._root.clear();
        var {popupModuleId,popupCategoryId,priorityVal,severityVal,statusId,expectedDate,comments,sessionData} = this.state;
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
                expectedDate:"",
                status:statusId,
                description:comments,
                deliveryDate:"",
            }
            console.log("Request postData",postData)
            Api.HRsave(postData, function(response){
                if (response.success) {
                    if(response.data !== null){
                        console.log("Save HR Response",response.data)
                        this.setState({
                            chatList : response.data.commentArray,
                            values : response.data,
                            comments : ''
                        })
                        this.props.navigation.navigate("AskHR")
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

    querySubmit = () =>{
        this.callNoteInput.current._root.clear();
        var checkValidation = this.queryValidate();
            if(checkValidation.isValid){
            var postData = {
                sessionKey : this.state.sessionData,
                internalRequestId:this.state.values.internalRequestId,
                internalRequestNo:this.state.values.internalRequestNo,
                componentId:this.state.values.moduleId,
                moduleCategoryId:this.state.values.categoryId,
                priority:this.state.values.priority,
                severity:this.state.values.severity,
                expectedDate:this.state.values.expectedDate,
                status:this.state.statusId,
                description:this.state.comments,
                deliveryDate:  "",
            }
            console.log("Request postData",postData)
            Api.HRsave(postData, function(response){
                if (response.success) {
                    if(response.data !== null){
                        console.log("Save HR Response",response.data)
                        this.setState({
                            comments : ''
                        },()=>{
                            this.myTaskPress(this.state.values);
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
        }else if (this.state.comments.trim() == '' || this.state.comments == null){
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

    queryValidate = () => {

        if (this.state.comments.trim() == '' || this.state.comments == null ) {
            return {
                isValid: false,
                message:  "Enter the Comments"
            };
        } else {
            return {
                isValid: true
            };
        }
    }

    onChangeMessage = (value) => {
        this.setState({ comments: value })
    }

    render(){
         var { actionfooterHeightObj,values,modalList,categoryList,popupModuleVal} = this.state;
         var screen = Dimensions.get('window');
        var inputWidth = parseInt(screen.width * 3.4 / 4);
        var sendBtnWidth = parseInt(screen.width * 0.6 / 4);
        var iconWidth = screen.width / 3;
        console.log("Data values",values);
        return(
            <Container >
                    <Header  style={{ backgroundColor: 'white', marginTop:5}}>
                        <Left style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate("AskHR")} style={{alignItems:'center', marginRight:2}}>
                                <CSIcon name={"Artboard-2-copy-21"} style={{color:'#580073',fontSize:25,alignSelf:'center'}}/>
                            </TouchableOpacity>
                            <View>
                                {
                               this.state.type == 'View'
                                ?
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginBottom:5, fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.values.requesterEmployeeId == this.state.userInfo.employeeId ? this.state.values.module: this.state.values.requesterName}  </Text>
                                :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginBottom:5, fontSize: 15, color: '#000',fontWeight:'bold' }} > {this.state.popupModuleVal} </Text>
                                }
                                
                                <TouchableOpacity 
                                // onPress={()=> this.onStatuspress()}
                                >
                                    {
                                    this.state.type == 'View'
                                    ?
                                        <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:14,fontWeight:'bold'}}> {this.statusVal(values.status)} </Text>
                                    :
                                        <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:14,fontWeight:'bold'}}> {this.statusVal(this.state.statusId)} </Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </Left>
                        <Right>
                            <TouchableOpacity 
                            // onPress={()=> this.onStatuspress()}
                            >
                            {
                                this.state.type == 'View'
                                ?
                                <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                    <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> {this.state.values.priority } </Text>
                                </View>
                                :
                                <View style={[{minWidth:40,maxWidth:140, height:30, borderRadius:50,backgroundColor:'#f4e1fa',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                    <Text numberOfLines={1} style={{color:'#580073',textAlign:'center',fontSize:12}}> { this.state.priorityVal } </Text>
                                </View>
                            }
                            </TouchableOpacity>
                        </Right>
                    </Header>
                    <Content>
                    
                    {/* <View> */}
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                        <View style={styles.body}>
                            {
                            this.state.istaskLoading 
                                ? 
                                <ActivityIndicator/>
                                :
                                this.state.chatList.length > 0 
                                ?
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
                                :
                                <NoRecordsFound/>
                                }
                        </View>
                        </ScrollView>
                        </Content>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'position' :'null'}
                        keyboardVerticalOffset = {keyboardVerticalOffset}>
                        {
                            this.state.type == 'Create' &&
                            <View>
                                {
                                this.state.isModuleView
                                ?
                                <View>    
                                    <View style={{ backgroundColor: 'whitesmoke', padding:5 }}>
                                        <Title style={{color:'#000000',fontSize:12}}>Select Modal</Title>
                                    </View>
                                    <ScrollView horizontal={true} style={{ backgroundColor: 'whitesmoke'}} showsHorizontalScrollIndicator={false}> 
                                    <View style={{ flexDirection: 'row', backgroundColor: 'whitesmoke', justifyContent:'space-around', padding:5, width:"100%" }}>
                                            {
                                                modalList.map((item, index) => (
                                                        <TouchableWithoutFeedback onPress={()=> this.onModuleChange(item.hiddenId) } key={index}>
                                                            <View style={[{minWidth:100, height:30, borderRadius:50,backgroundColor:item.color,padding:5, borderWidth:2, marginRight:10}, { borderColor:  "#000" }]}>
                                                                <Text style={{color:'#580073',textAlign:'center'}}>{item.hiddenCode}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    ))
                                            }
                                        
                                    </View>
                                    </ScrollView>
                                </View>
                                :
                                <View>    
                                    <View style={{ backgroundColor: 'whitesmoke', padding:5 }}>
                                        <Title style={{color:'#000000',fontSize:12}}>Select Category</Title>
                                    </View>
                                    <ScrollView horizontal={true} style={{ backgroundColor: 'whitesmoke'}} showsHorizontalScrollIndicator={false}> 
                                    <View style={{ flexDirection: 'row', backgroundColor: 'whitesmoke', justifyContent:'space-around', padding:5, width:"100%" }}>
                                            {
                                                categoryList.map((item, index) => (
                                                        <TouchableWithoutFeedback onPress={()=> this.onCategoryChange(item.hiddenId) } key={index}>
                                                            <View style={[{minWidth:100, height:30, borderRadius:50,backgroundColor:'#fff',padding:5, borderWidth:2, marginRight:10}, { borderColor: this.state.popupCategoryVal === item.hiddenCode ? "#000" : "transparent" }]}>
                                                                <Text style={{color:'#580073',textAlign:'center'}}>{item.hiddenCode}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    ))
                                            }
                                    </View>
                                    </ScrollView>
                                </View>
                                }
                            </View>
                        }
                        <View style={{ flexDirection: 'row', backgroundColor: '#ccc' }}>
                            <View style={{ width: inputWidth, height: 55, alignItems: 'center', justifyContent: 'center' }}>
                                <Item regular style={{ width: inputWidth * 3.7 / 4, backgroundColor: '#fff', borderRadius: 5 }}>
                                    {/* <Icon name='add' style={{ fontSize: 26, color: '#580073' }} /> */}
                                    <Input ref={this.callNoteInput} placeholder='Type a message' onChangeText={ this.onChangeMessage}  onBlur={this.closeFooterAction} style={{ height: 36, fontSize: 14 }} />
                                </Item>
                            </View>
                            <View style={{ width: sendBtnWidth, height: 55, alignItems: 'center', justifyContent: 'center' }}>
                                <Button transparent onPress={() => { this.state.type == 'Create' ? this._saveQueryInfo() : this.querySubmit() }}>
                                    {/* this.showSaveModal(),this.closeFooterAction(); }}> */}
                                    <CSIcon name="Artboard-67" size={32} color="#580073" />
                                </Button>
                            </View>
                        </View>
                    {/* </View> */}
                </KeyboardAvoidingView>
                
            </Container>
        )
    }

}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    body: {
      minHeight: height-150, // This is where the magic happens
      backgroundColor: 'white', // This is just for visual indication
      marginTop: 10
    },
    footer: {
      minHeight: 150,
      flexDirection: 'row',
      backgroundColor: '#ccc' // This is just for visual indication
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