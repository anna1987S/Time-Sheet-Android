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


export default class Holiday extends Component {

    constructor(props){
      super(props)
      this.state = {
        userInfo: {},
        employeeRecordsFrom: "0",
        employeeRecordsTo: "0",
        next: "Y",
        previous: "N",
        mobileSyncDate: "",
        profilePictureRequired: "Y",
        hasNextRecord : 'N',
        sessionData : '',
        modalVisible : false,
        holidayData :[],
        hasNextRecord : 'N',
        isLoading : false,
        isLazyLoading: false,
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
            this.getHolidayList()
        })
         
    }


    // loadBloodInfo = () => {
    //     var {today,loadRecordData,next,previous,mobileSyncDate,selectedGroup,searchValue,
    //         profilePictureRequired,sessionData,bloodData} = this.state;
    //     // var date = this.ChangeDate(selected)
        
    //     let recordInfo = []
    //     var birthdayValues = {
    //         fromDate: "",
    //         toDate: "",
    //         sessionData : loadRecordData.nextBatchResult.params.sessionId,
    //         employeeRecordsFrom: loadRecordData.nextBatchResult.params.employeeRecordsFrom,
    //         employeeRecordsTo: loadRecordData.nextBatchResult.params.employeeRecordsTo,
    //         next : loadRecordData.nextBatchResult.params.next,
    //         previous : "Y",
    //         mobileSyncDate,
    //         profilePictureRequired,
    //         category : "B",
    //         searchParam: searchValue,
    //         departmentId: "0",
    //         bloodGroup: selectedGroup == "All" ? "" :selectedGroup,
    //     }

    //     this.setState({
    //         isLazyLoading: true
    //     })
    //     Api.getBirthdayInfo(birthdayValues,function(response){
    //         console.log("response Birthday load data",response)
    //         if(response.success){
    //             if(response.data.length > 0){
    //                 var items = Validate.sortByAlphabet(response.data, 'EmployeeName');
    //                 recordInfo = response.nextBatch
    //                 var lastProperty = Object.keys(bloodData)[Object.keys(bloodData).length - 1];
    //                 var firstProperty = Object.keys(items)[0];
    //                 if (lastProperty === firstProperty) {
    //                     contacts[lastProperty] = bloodData[lastProperty].concat(items[firstProperty])
    //                     delete items[firstProperty];
    //                 }

    //                 items = {
    //                     ...bloodData,
    //                     ...items
    //                 }
    //             console.log("Reload item",items)
    //             this.setState({
    //                 isLazyLoading: false,
    //                 bloodData : items,
    //                 hasNextRecord : recordInfo.hasNextRecord,
    //                 loadRecordData : recordInfo
    //             })
    //         }
    //         }else{
    //             this.setState({
    //                 isLazyLoading: false,
    //                 bloodData : items
    //             })
    //         }
    //     }.bind(this))
    // }


    getHolidayList = () =>{
        var {sessionData} = this.state
        this.setState({
            isLoading: true
        })
        Api.getHolidayInfo(sessionData,function(response){
            
            var items =[];
            if(response.success){
                if(response.data.length > 0){
                    for (let i = 0; i < response.data.length ;i++ ){
                        console.log("Log val",this.monthGet(response.data[i]['HolidayDate']))
                        var month = this.monthGet(response.data[i]['HolidayDate']);
                        var datainfo = this.dateGet(response.data[i]['HolidayDate'])
                        var splicDate = (response.data[i]['Day']).slice(0,3)
                        response.data[i]['Dayinfo'] = splicDate
                        response.data[i]['Month'] = month
                        response.data[i]['Date'] = datainfo
                    }
                    items = response.data;
                    console.log("response HolidayList",items)
                }
                this.setState({
                    isLoading: false,
                    holidayData: items
                })
            }else{
                this.setState({
                    isLoading: false,
                    holidayData: items
                })
            }

        }.bind(this));
    }

    monthGet(val){
        var date = new Date(val);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = months[date.getMonth()]
        return month
    }

    dateGet(val){
        var date = new Date(val);
        var day = ("0" + (date.getDate().toString())).slice(-2).toString()
        return day
    }


    render(){
        let {holidayData,isLoading,isLazyLoading,selectedGroup,BloodGroupList} = this.state;
        return(
            <Container >
                <Header  style={{ backgroundColor: 'white' }}>
                    <Left>
                        <TouchableOpacity dark transparent onPress ={() => {this.props.navigation.navigate('Home')}}>
                            {/* <CSIcon name='Artboard-73' size={24} color="#580073" /> */}
                            <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <HeaderTitle title= "Holiday"
                         />
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                    <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
                        {
                            isLoading
                            ?
                            <ActivityIndicator />
                            :
                            holidayData.length > 0
                            ?
                            holidayData.map((value,j) => (
                            <Card padder key={j} style={{width:'100%',borderRadius:10,padding:5}}>    
                                <CardItem cardBody>
                                    <TouchableOpacity activeOpacity={0.8} >
                                        <View padder style={{flexDirection: 'row',width:'100%',margin:5}}>
                            
                                            <View style={styles.assignedcircle}>
                                                <Card padder key={j} style={{width:'100%',borderRadius:5,padding:5}}>    
                                                    <CardItem cardBody style={{flexDirection:'column'}}>
                                                        <View style={{backgroundColor:'#580073',justifyContent:'center',width:'100%',padding:2}}>
                                                            <Text  style={{color:'#fff',fontSize:12,textAlign:'center'}}>{value.Month}</Text>
                                                        </View>
                                                        <Text style={{color:'#580073',fontSize:14}} >{value.Date}</Text>
                                                        <Text maxLength={3} style={{color:'#580073',fontSize:14}}>{value.Dayinfo}</Text>
                                                    </CardItem>
                                                </Card>                                                
                                            </View>
                            
                                            <View style={{width:'82%',marginLeft:2,justifyContent:'center'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000',marginLeft:10 }}> {value.leaveDescription} </Text>
                                            </View>
                                            
                                        </View>
                                    </TouchableOpacity>
                                </CardItem>
                            </Card>
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
        width:'18%',
        borderRadius: 50/2,  
        height: 52, 
        marginTop:3,
        marginBottom:3,
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
