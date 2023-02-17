import React,{ Component } from 'react';
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
    Switch,Picker
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal, ScrollView,ActivityIndicator
 } from 'react-native';
import CSIcon from '../../icon-font';
import { Validate, Constants } from '../../utils';
import * as Api from '../../services/api/home';
import { TabView, SceneMap, TabBar} from 'react-native-tab-view';
import NoRecordsFound from '../noRecordFound';

 const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export default class Blood extends Component {

    constructor(props){
      super(props)
      this.state = {
        userInfo: {},
        sessionData : '',
        modalVisible : false,
        bloodData :[],
        employeeRecordsFrom: "0",
        employeeRecordsTo: "0",
        next: "Y",
        previous: "N",
        mobileSyncDate: "",
        profilePictureRequired: "Y",
        category:"",
        hasNextRecord : 'N',
        loadRecordData : [],
        BloodGroupList : [],
        selectedGroup : "All",
        searchValue : "",
        isLoading : false,
        isLazyLoading: false,
        searchField: false,
        }
    }

    async componentDidMount(){
        
        var UserInfo = await AsyncStorage.getItem('userInfo');
        var seessionKey = await AsyncStorage.getItem('sessionKey');
        // console.log("tomorrow",tomorrow,"yesterDay",yesterday,"Future",future,"Past",past);
        this.setState({
            userInfo : JSON.parse(UserInfo),
            sessionData : seessionKey,
        },()=>{
            this.getBloodInfo();
        })
         
    }

    getBloodInfo = () => {
        var {today,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,searchValue,
            profilePictureRequired,sessionData,bloodData,selectedGroup} = this.state;
        // var date = this.ChangeDate(selected)
        let items = [];
        let recordInfo = []
        var birthdayValues = {
            fromDate: "",
            toDate: "",
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "B",
            searchParam: searchValue,
            departmentId: "0",
            bloodGroup: selectedGroup == "All" ? "" :selectedGroup,
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLoading: true,
            bloodData: [],
        })
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday today",response)
            if(response.success){
                if(response.data.length > 0){
                    var items = Validate.sortByAlphabet(response.data, 'EmployeeName');
                    recordInfo = response.nextBatch

                    items = {
                        ...this.state.bloodData,
                        ...items
                    }
                    
                    this.setState({
                        isLoading: false,
                        bloodData : items,
                        hasNextRecord : recordInfo.hasNextRecord,
                        loadRecordData : recordInfo
                    },()=>{
                        this.getbloodgroupList()
                    })
                }
                
            }else{
                this.setState({
                    isLoading: false,
                    bloodData : items
                },()=>{
                    this.getbloodgroupList()
                })
            }
        }.bind(this))
    }

    loadBloodInfo = () => {
        var {today,loadRecordData,next,previous,mobileSyncDate,selectedGroup,searchValue,
            profilePictureRequired,sessionData,bloodData} = this.state;
        // var date = this.ChangeDate(selected)
        
        let recordInfo = []
        var birthdayValues = {
            fromDate: "",
            toDate: "",
            sessionData : loadRecordData.nextBatchResult.params.sessionId,
            employeeRecordsFrom: loadRecordData.nextBatchResult.params.employeeRecordsFrom,
            employeeRecordsTo: loadRecordData.nextBatchResult.params.employeeRecordsTo,
            next : loadRecordData.nextBatchResult.params.next,
            previous : "Y",
            mobileSyncDate,
            profilePictureRequired,
            category : "B",
            searchParam: searchValue,
            departmentId: "0",
            bloodGroup: selectedGroup == "All" ? "" :selectedGroup,
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLazyLoading: true
        })
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday load data",response)
            if(response.success){
                if(response.data.length > 0){
                    var items = Validate.sortByAlphabet(response.data, 'EmployeeName');
                    recordInfo = response.nextBatch
                    var lastProperty = Object.keys(bloodData)[Object.keys(bloodData).length - 1];
                    var firstProperty = Object.keys(items)[0];
                    if (lastProperty === firstProperty) {
                        bloodData[lastProperty] = bloodData[lastProperty].concat(items[firstProperty])
                        delete items[firstProperty];
                    }

                    items = {
                        ...bloodData,
                        ...items
                    }
                console.log("Reload item",items)
                this.setState({
                    isLazyLoading: false,
                    bloodData : items,
                    hasNextRecord : recordInfo.hasNextRecord,
                    loadRecordData : recordInfo
                })
            }
            }else{
                this.setState({
                    isLazyLoading: false,
                    bloodData : items
                })
            }
        }.bind(this))
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    };


    getbloodgroupList = () =>{
        var {sessionData} = this.state
        this.setState({
            isLoading: true
        })
        Api.getBloodgroupList(sessionData,function(response){
            
            var items =[];
            if(response.success){
                if(response.data.length > 0){
                    response.data.unshift( "All" )
                    items = response.data
                    console.log("response bloodGroupList",items)
                }
                this.setState({
                    isLoading: false,
                    BloodGroupList: items
                })
            }else{
                this.setState({
                    isLoading: false,
                    BloodGroupList: items
                })
            }

        }.bind(this));
    }

    onValueBloodChange = (value) =>{
        this.setState({
            selectedGroup : value
        },()=>{
            this.getBloodInfo()
        })
    }


    _onSearchIconClick =(value)=> {
        if(value){
            this.setState({
                searchField: value
            });
        }else if(!value){
            this.setState({
                searchField: value,
                searchValue : ""
            },()=>{
                this.getBloodInfo()
            });
        }

    }
    _onSearchValueChange =(value) =>{
        this.setState({
            searchValue : value
        },()=>{
            this.getBloodInfo()
        })
    }

    render(){
        let {bloodData,isLoading,isLazyLoading,selectedGroup,BloodGroupList} = this.state;
        return(
            <Container >
                <Header  style={{ backgroundColor: 'white' }}>
                    {/* <Left> */}
                        <Button dark transparent onPress ={() => {this.props.navigation.navigate('Home')}}>
                            {/* <CSIcon name='Artboard-73' size={24} color="#580073" /> */}
                            <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} />
                        </Button>
                    {/* </Left> */}
                    <Body>
                        <HeaderTitle title= "Blood"
                        searchField={this.state.searchField} 
                        onSearchValueChange={(value) => this._onSearchValueChange(value)} 
                        onSearchIconClick={(value)=>this._onSearchIconClick(value)}
                         />
                    </Body>
                    {
                        this.state.searchField !== true
                        &&
                        <Button dark transparent onPress={() => this._onSearchIconClick(true)}>
                            <CSIcon name={"search"} size={22} color="#580073"/>
                        </Button>
                    }
                    {/* <Right>
                    </Right> */}
                </Header>
                <View style={{ height: 50, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Filter by Blood Group"
                        placeholderStyle={{ color: "#ccc" }}
                        placeholderIconColor="#007aff"
                        selectedValue={selectedGroup}
                        onValueChange={(value) => { this.onValueBloodChange(value) }}
                    >
                        {
                            BloodGroupList.map((dept, i) => (
                                <Picker.Item key={i} label={dept} value={dept} />
                            ))
                        }
                    </Picker>
                </View>
                <Content
                onScroll={({ nativeEvent }) => {
                    if (this.isCloseToBottom(nativeEvent)) {
                        (this.state.hasNextRecord == "Y") ? this.loadBloodInfo() : '';
                    }
                }}
                scrollEventThrottle={0}
                >
                    <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
                        {
                            isLoading
                            ?
                            <ActivityIndicator />
                            :
                            Object.keys(bloodData).length > 0
                            ?
                            Object.entries(bloodData)
                            .map(([key, items], i) => (
                            <React.Fragment key={i}>
                            {
                                items.map((value,j) => (
                            <Card padder key={j} style={{width:'100%',borderRadius:10,padding:5}}>    
                                <CardItem cardBody>
                                    <TouchableOpacity activeOpacity={0.8} onPress ={() => {this.props.navigation.navigate('EmpInfo',{ EmpDetail : value, navigateVal: "Blood"})}}>
                                        <View padder style={{flexDirection: 'row',width:'100%'}}>
                                            {
                                                Validate.isNotNull(value.EmployeeImageUri)
                                                ?
                                                <View style={styles.assignedcircle}>
                                                    <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',padding:5}}/>
                                                </View>
                                                :
                                                <View style={styles.assignedcircle}>
                                                    <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',padding:5}} />
                                                </View>
                                            }
                                            <View style={{width:'65%',marginLeft:2,justifyContent:'center'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text>
                                            </View>
                                            <View style={{width:'20%',justifyContent:'center',alignContent:'center'}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 18, padding: 2, color: '#580073',fontWeight:'bold' }}>  {value.BloodGroup} </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </CardItem>
                            </Card>
                            ))
                            }
                            </React.Fragment>
                            ))
                            :
                            <NoRecordsFound/>
                        }
                        {isLazyLoading && <ActivityIndicator style={styles.bottomIndicator} />}
                    </View>
                </Content>
            </Container>
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
        bottomIndicator: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex:10
    
        }
})
