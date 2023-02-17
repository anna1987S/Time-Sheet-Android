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
    Switch
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal, ScrollView,
 } from 'react-native';
import CSIcon from '../../icon-font';
import { Validate, Constants } from '../../utils';
import * as Api from '../../services/api/home';
import { TabView, SceneMap, TabBar} from 'react-native-tab-view';
import NoRecordsFound from '../noRecordFound';

 const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export default class ServiceAnniversary extends Component {

    constructor(props){
      super(props)
      this.state = {
        isLoading : false,
        isLazyLoading : false,
        userInfo: {},
        sessionData : '',
        modalVisible : false,
        today: this.ChangeDate(new Date()),
        yesterday : '',
        tomorrow : '',
        pastDate : '',
        futureDate : '',
        todayData :[],
        tomorrowData : [],
        yesterdayData : [],
        pastData : [],
        futureData : [],
        employeeRecordsFrom: "0",
        employeeRecordsTo: "0",
        next: "Y",
        previous: "N",
        mobileSyncDate: "",
        profilePictureRequired: "Y",
        category:"",
        index: 2,
        route : [
            { key: 'past', title: 'Past' },
            { key: 'yesterday', title: 'Yesterday' },
            { key: 'today', title: 'Today' },
            { key: 'tomorrow', title: 'Tomorrow' },
            { key: 'future', title: 'Upcoming' },
        ],
      }
      
    }

    async componentDidMount(){
        var {today} = this.state;
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var past = new Date(new Date().getFullYear(), 0, 1);
        var future = new Date(new Date().getFullYear(), 11, 31);
        var UserInfo = await AsyncStorage.getItem('userInfo');
        var seessionKey = await AsyncStorage.getItem('sessionKey');
        // console.log("tomorrow",tomorrow,"yesterDay",yesterday,"Future",future,"Past",past);
        this.setState({
            userInfo : JSON.parse(UserInfo),
            yesterday : yesterday,
            tomorrow : tomorrow,
            pastDate : past,
            futureDate : future,
            sessionData : seessionKey,
        },()=>{
            this.getTodayInfo();
            this.getTomorrowInfo();
            this.getPastInfo();
            this.futureInfo();
            this.yesterdayInfo();
        })
         
    }

    getTodayInfo = () => {
        var {today,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
        // var date = this.ChangeDate(selected)
        let items = [];
        var birthdayValues = {
            fromDate: today,
            toDate: today,
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "SA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLoading: true
        })
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday today",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    
                }else{
                    items = []
                }
                this.setState({
                    isLoading: false,
                    todayData : items
                })
            }else{
                this.setState({
                    isLoading: false,
                    todayData : items
                })
            }
        }.bind(this))
    }

    getTomorrowInfo = () => {
        var {today,tomorrow,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
        // var date = this.ChangeDate(selected)
        let items = [];
        var birthdayValues = {
            fromDate: this.ChangeDate(tomorrow),
            toDate: this.ChangeDate(tomorrow),
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "SA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLoading: true
        })
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday tomorrow",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    
                }else{
                    items = []
                }
                this.setState({
                    isLoading: false,
                    tomorrowData : items
                })
            }else{
                this.setState({
                    isLoading: false,
                    tomorrowData : items
                })
            }
        }.bind(this))
    }

    getPastInfo = () => {
        var {today,yesterday,pastDate,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
        // var date = this.ChangeDate(selected)
        let items = [];
        var birthdayValues = {
            fromDate: this.ChangeDate(pastDate),
            toDate: this.ChangeDate(yesterday),
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "SA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLoading: true
        })
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday past",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    
                }else{
                    items = []
                }
                this.setState({
                    isLoading: false,
                    pastData : items
                })
            }else{
                this.setState({
                    isLoading: false,
                    pastData : items
                })
            }
        }.bind(this))
    }

    futureInfo = () => {
        var {today,tomorrow,futureDate,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
        // var date = this.ChangeDate(selected)
        let items = [];
        var birthdayValues = {
            fromDate: this.ChangeDate(tomorrow),
            toDate: this.ChangeDate(futureDate),
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "SA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLoading: true
        })
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday future",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    
                }else{
                    items = []
                }
                this.setState({
                    isLoading: false,
                    futureData : items
                })
            }else{
                this.setState({
                    isLoading: false,
                    futureData : items
                })
            }
        }.bind(this))
    }


    yesterdayInfo = () => {
        var {today,yesterday,employeeRecordsFrom,employeeRecordsTo,next,previous,mobileSyncDate,
            profilePictureRequired,sessionData,calData} = this.state;
        // var date = this.ChangeDate(selected)
        let items = [];
        var birthdayValues = {
            fromDate: this.ChangeDate(yesterday),
            toDate: this.ChangeDate(yesterday),
            sessionData,
            employeeRecordsFrom,
            employeeRecordsTo,
            next,
            previous,
            mobileSyncDate,
            profilePictureRequired,
            category : "SA",
            searchParam:"",
            departmentId: "0",
            bloodGroup: "",
            gradeLevel: ( this.state.userInfo.gradeName == "GRADE A" || this.state.userInfo.gradeName == "GRADE B" ) ? "HIGH" : "",
        }

        this.setState({
            isLoading: true
        })
        Api.getBirthdayInfo(birthdayValues,function(response){
            console.log("response Birthday yesterDay",response)
            if(response.success){
                if(response.data.length > 0){
                    items = response.data;
                    
                }else{
                    items = []
                }
                this.setState({
                    isLoading: false,
                    yesterdayData : items
                })
            }else{
                this.setState({
                    isLoading: false,
                    yesterdayData : items
                })
            }
        }.bind(this))
    }


    ChangeDate(selectedDate){
        var d = new Date(selectedDate);
        var timeToString = ("0" + (d.getDate().toString())).slice(-2).toString() +  "-" + ("0" + (d.getMonth() + 1)).slice(-2).toString() + "-" + d.getFullYear().toString();
        return timeToString;
    }

    renderScene = ({ route, data}) => {
        switch (route.key) {
            case 'past':
                return <PastTab  
                dataInfo = {this.state.pastData}
                stateInfo = {this.state}
                propVal = {this.props}
                />;
            case 'yesterday':
                return <YesterdayTab 
                dataInfo = {this.state.yesterdayData}
                stateInfo = {this.state}
                propVal = {this.props}
                />;
            
            case 'today' :
                return <TodayTab
                dataInfo = {this.state.todayData}
                stateInfo = {this.state}
                propVal = {this.props}
                />

            case 'tomorrow':
                return <TomorrowTab 
                dataInfo = {this.state.tomorrowData}
                stateInfo = {this.state}
                propVal = {this.props}
                />

            case 'future':
                return <FutureTab 
                dataInfo = {this.state.futureData}
                stateInfo = {this.state}
                propVal = {this.props}
                />
        }
    }

    // renderScene(){
    //     return(
    //         <View>
    //             <Text>Tab informations</Text>
    //         </View>
    //     )
    // }
    render(){
        let {EmployeeInfo,navigateVal,index,route} = this.state;
        return(
            <Container >
                <Header  style={{ backgroundColor: 'white' }}>
                    <Left>
                        <TouchableOpacity onPress ={() => {this.props.navigation.navigate('Home')}}>
                            <CSIcon name='Artboard-73' size={24} color="#580073" />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <HeaderTitle title= "Service Anniversary" />
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                        <TabView
                            navigationState={{index: index, routes: route}}
                            renderScene={this.renderScene}
                            renderTabBar={props => 
                            <TabBar {...props} 
                            renderLabel = {({route,focused,color})=>(
                                <Text style={{color, fontSize:13}} >{route.title}</Text>
                            )}
                            indicatorStyle={ {backgroundColor: '#580073'}}
                            indicatorContainerStyle = {{backgroundColor:'#f4ebf9'}}
                            style={{ backgroundColor: '#fff' }}
                            activeColor = {"#580073"}
                            inactiveColor = {'black'}
                            />}
                            onIndexChange={index => this.setState({index})}
                            initialLayout={SCREEN_WIDTH}
                            style={styles.tabcontainer}
                            swipeEnabled ={true}
                        />
                </Content>
            </Container>
        )
    }
}

const PastTab = props => {
    var {isLoading,stateInfo,dataInfo,propVal} = props

    return(
        <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
            <ScrollView>
            {
                isLoading
                ?
                <ActivityIndicator />
                :
                dataInfo.length > 0 
                ?
                dataInfo.map((value,key)=>(
                <Card padder style={{width:'99%',borderRadius:10,padding:5}}>    
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8} onPress ={() => {propVal.navigation.navigate('EmpInfo',{ EmpDetail : value, navigateVal: "ServiceAnniversary"})}}>
                            <View padder style={{flexDirection: 'row',width:'100%'}}>
                                {
                                    Validate.isNotNull(value.EmployeeImageUri)
                                    ?
                                    <View style={styles.assignedcircle}>
                                        <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',padding:5}} />
                                    </View>
                                    :
                                    <View style={styles.assignedcircle}>
                                        <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',padding:5}} />
                                    </View>
                                }
                                <View style={{width:'70%',marginLeft:2,justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text>
                                </View>
                                <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                <CSIcon name={"a5"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                ))
                :
                <NoRecordsFound/>
            }
            </ScrollView>
        </View>
    )
}

const YesterdayTab = props => {
    var {isLoading,stateInfo,dataInfo,propVal} = props

    return(
        <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
            <ScrollView>
            {
                isLoading
                ?
                <ActivityIndicator />
                :
                dataInfo.length > 0 ?
                dataInfo.map((value,key)=>(
                <Card padder style={{width:'99%',borderRadius:10,padding:5}}>    
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8} onPress ={() => {propVal.navigation.navigate('EmpInfo',{ EmpDetail : value, navigateVal: "ServiceAnniversary"})}}>
                            <View padder style={{flexDirection: 'row',width:'100%'}}>
                                {
                                    Validate.isNotNull(value.EmployeeImageUri)
                                    ?
                                    <View style={styles.assignedcircle}>
                                        <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',padding:5}} />
                                    </View>
                                    :
                                    <View style={styles.assignedcircle}>
                                        <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',padding:5}} />
                                    </View>
                                }
                                <View style={{width:'70%',marginLeft:2,justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text>
                                </View>
                                <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                <CSIcon name={"a5"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                ))
                :
                <NoRecordsFound/>
            }
            </ScrollView>
        </View>
    )

}

const TodayTab = props => {
    var {isLoading,stateInfo,dataInfo,propVal} = props

    return(
        <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
            <ScrollView>
            {
                isLoading
                ?
                <ActivityIndicator />
                :
                dataInfo.length > 0 ?
                dataInfo.map((value,key)=>(
                <Card padder style={{width:'99%',borderRadius:10,padding:5}}>    
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8} onPress ={() => {propVal.navigation.navigate('EmpInfo',{ EmpDetail : value, navigateVal: "ServiceAnniversary"})}}>
                            <View padder style={{flexDirection: 'row',width:'100%'}}>
                                {
                                    Validate.isNotNull(value.EmployeeImageUri)
                                    ?
                                    <View style={styles.assignedcircle}>
                                        <Thumbnail circular  source={{ uri: 'data:image/png;base64,' + value.EmployeeImageUri}} style={{alignSelf:'center',padding:5}} />
                                    </View>
                                    :
                                    <View style={styles.assignedcircle}>
                                        <Thumbnail circular  source={require('../../assets/avatar.png')} style={{alignSelf:'center',padding:5}} />
                                    </View>
                                }
                                <View style={{width:'70%',justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text>
                                </View>
                                <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                <CSIcon name={"a5"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                ))
                :
                <NoRecordsFound/>
            }
            </ScrollView>
        </View>
    )

}

const TomorrowTab = props => {
    var {isLoading,stateInfo,dataInfo,propVal} = props

    return(
        <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
            <ScrollView>
            {
                isLoading
                ?
                <ActivityIndicator />
                :
                dataInfo.length > 0 
                ?
                dataInfo.map((value,key)=>(
                <Card padder style={{width:'99%',borderRadius:10,padding:5}}>    
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8} onPress ={() => {propVal.navigation.navigate('EmpInfo',{ EmpDetail : value, navigateVal: "ServiceAnniversary"})}}>
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
                                <View style={{width:'70%',marginLeft:2,justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text>
                                </View>
                                <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                <CSIcon name={"a5"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                ))
                :
                <NoRecordsFound/>
            }
            </ScrollView>
        </View>
    )

}

const FutureTab = props => {
    var {isLoading,stateInfo,dataInfo,propVal} = props

    return(
        <View style={{width:SCREEN_WIDTH,flexDirection:'column',padding:10}}>
            <ScrollView>
            {
                isLoading
                ?
                <ActivityIndicator />
                :
                dataInfo.length > 0 ?
                dataInfo.map((value,key)=>(
                <Card padder style={{width:'99%',borderRadius:10,padding:5}}>    
                    <CardItem cardBody>
                        <TouchableOpacity activeOpacity={0.8} onPress ={() => {propVal.navigation.navigate('EmpInfo',{ EmpDetail : value, navigateVal: "ServiceAnniversary"})}}>
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
                                <View style={{width:'70%',marginLeft:2,justifyContent:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16, padding: 2,fontWeight:'bold', color: '#000' }}>  {value.EmployeeName}</Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#969595' }}>  {value.EmpCode} </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#000' }}>  {value.DepartmentName} </Text>
                                </View>
                                <View style={{width:'15%',justifyContent:'center',alignContent:'center'}}>
                                <CSIcon name={"a5"} size={35} color={'#580073'}  style={{justifyContent:'center',alignItems:'center'}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>
                ))
                :
                <NoRecordsFound/>
            }
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    tabcontainer: {
        marginTop: StatusBar.currentHeight,
      },
      assignedcircle:{ 
        justifyContent:'center',
        width:'15%',
        borderRadius: 50/2,  
        height: 52, 
        marginTop:3,
        backgroundColor:'#fff',
        },
})
