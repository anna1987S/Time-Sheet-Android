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
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal, ScrollView,Linking
 } from 'react-native';
import CSIcon from '../../icon-font';
import { Validate, Constants } from '../../utils';
import ApiInfo from '../../config/api-info';

 const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export default class EmpInfo extends Component{

    constructor(props){
      super(props)
      
      this.state = {
        EmployeeInfo : this.props.navigation.getParam("EmpDetail"),
        navigateVal : this.props.navigation.getParam("navigateVal"),
        selectedDate : this.props.navigation.getParam("selectedDate"),
        authInfo : {},
        modalVisible : false,
        }  
    }

    async componentDidMount(){
         this.props.navigation.getParam("filterType"),
         this.yearCalculator()
    }

    yearCalculator(){
        var {EmployeeInfo,selectedDate} = this.state;
        var toDate = new Date(selectedDate);
        var numberofYears = 0
        if(EmployeeInfo.hasOwnProperty("WeddingAnniversary")){
            var newdate = EmployeeInfo.WeddingAnniversary.split("-").reverse().join("-");
            var fromDate = new Date(newdate)
            console.log("From WeddingAnniversary", fromDate,"Todate", toDate)
            numberofYears = toDate.getFullYear() - fromDate.getFullYear()
        }else if(EmployeeInfo.hasOwnProperty("DateOfJoining")){
            var newdate = EmployeeInfo.DateOfJoining.split("-").reverse().join("-");
            var fromDate = new Date(newdate)
            console.log("From DateOfJoining", fromDate,"Todate", toDate)
            numberofYears = toDate.getFullYear() - fromDate.getFullYear()
        }
        this.setState({
            totalYears : numberofYears
        })
        // else if(EmployeeInfo.hasOwnProperty("DateOfBirth")){
        //     var fromDate = new Date(EmployeeInfo.DateOfBirth)
        //     console.log("From DateOfBirth", fromDate,"Todate", toDate)
        //     numberofYears = toDate.getFullYear() - fromDate.getFullYear()
        // }
        console.log("Years info on Click", parseInt(numberofYears))
    } 

    openMailer(url,employee) {
        var {EmployeeInfo,totalYears} = this.state;
        if(EmployeeInfo.hasOwnProperty("WeddingAnniversary")){
            Validate.isNotNull(url) ? Linking.openURL('mailto:'+ url+'?subject= Wedding Anniversary Wishes!!!&body=Dear '+ employee +'\n \n Congratulation, Happy ['+ totalYears +'] anniversary, \n Wishing a perfect pair a perfectly happy day') : Validate.toastAlert('Please Update your email in echain')
        }else if(EmployeeInfo.hasOwnProperty("DateOfJoining")){
            Validate.isNotNull(url) ? Linking.openURL('mailto:'+ url+'?subject= Service Anniversary Wishes!!!&body=Dear '+ employee +'\n \n Congratulation on completion of '+ totalYears +' service.') : Validate.toastAlert('Please Update your email in echain')
        }else if(EmployeeInfo.hasOwnProperty("DateOfBirth")){ 
            Validate.isNotNull(url) ? Linking.openURL('mailto:'+ url+'?subject= Birthday Wishes!!!&body=Dear '+ employee +'\n \n Many more happy returns of the day.') : Validate.toastAlert('Please Update your email in echain')
        }   
    }

    openDialer = (number) => {
        console.log("Number",number)
        if(Validate.isNotNull(number)){
            let phoneNumber = '';
            if (Platform.OS === 'android') {
                phoneNumber = `tel:${number}`;
            }
            else {
                phoneNumber = `telprompt://${number}`;
            }
            Linking.openURL(phoneNumber);
        } else {
            Validate.toastAlert('Please update your mobile number in echain');
        }
    };

    render(){
        let {EmployeeInfo,navigateVal} = this.state;
        console.log("Employee Info", EmployeeInfo.hasOwnProperty("ContactDetails") && EmployeeInfo.ContactDetails.map((item,i)=>(item.ContactNumber)),"Async Data",this.props.navigation.getParam("EmpDetail"))
        return(
            
            <Container >
                <Header  style={{ backgroundColor: 'white' }}>
                    <Left>
                        <TouchableOpacity onPress ={() => {this.props.navigation.navigate(navigateVal)}}>
                        <CSIcon name='Artboard-58' size={24} color="#580073" />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        {
                            navigateVal == "Settings" 
                            ?
                            <HeaderTitle title= {EmployeeInfo.employeeName} />
                            :
                            <HeaderTitle title= {EmployeeInfo.EmployeeName} />
                        }
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                {
                navigateVal == "Settings" 
                ?
                <ScrollView>
                    <View style={{width : SCREEN_WIDTH}}>
                        <View style={{margin: 10}}>
                        {
                            Validate.isNotNull(EmployeeInfo.employeeImageUri)
                            ?
                            <View style={styles.assignedcircle}>
                                <Thumbnail  circular large source={{ uri: 'data:image/png;base64,' + EmployeeInfo.employeeImageUri}} style={{alignSelf:'center',marginLeft:2,height:250,width:SCREEN_WIDTH-20}}/>
                            </View>
                            :
                            <View style={styles.assignedcircle}>
                                <Thumbnail circular large source={require('../../assets/avatar.png')} style={{alignSelf:'center',marginTop:10,padding:2,marginLeft:2,height:250,width:SCREEN_WIDTH-20}} />
                            </View>
                        }
                            <Card padder style={{marginTop:20,borderRadius:10,padding:5}}>
                                <CardItem header>
                                    <Text style={{color:'#580073',fontSize:20,fontWeight:'600'}}> Basic Info</Text>
                                </CardItem>    
                                <CardItem cardBody >
                                    <View style={{flexDirection:'column',width:'100%'}}>

                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.employeeCode}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Employee Code</Text>
                                        </View>

                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>

                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.designation}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Title </Text>
                                        </View>

                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>

                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.department}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Department</Text>
                                        </View>
                                        {
                                        EmployeeInfo.hasOwnProperty("BloodGroup") &&
                                        EmployeeInfo.BloodGroup != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        {
                                        EmployeeInfo.hasOwnProperty("BloodGroup") &&
                                        EmployeeInfo.BloodGroup != "" && 
                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.BloodGroup}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Blood Group</Text>
                                        </View>
                                        }
                                        
                                        {EmployeeInfo.hasOwnProperty("Sex") &&
                                        EmployeeInfo.Sex != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        {EmployeeInfo.hasOwnProperty("Sex") &&
                                        EmployeeInfo.Sex != "" && 
                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.Sex == "M" ? "Male":EmployeeInfo.Sex == "F" ? "Female": "Other"}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Gender</Text>
                                        </View>
                                        }
                                        {EmployeeInfo.hasOwnProperty("MartialStatus") &&
                                        EmployeeInfo.MartialStatus != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        {EmployeeInfo.hasOwnProperty("MartialStatus") &&
                                        EmployeeInfo.MartialStatus != "" && 
                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.MartialStatus}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Martial Status</Text>
                                        </View>
                                        }
                                        {
                                        EmployeeInfo.mailId != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        { EmployeeInfo.mailId != "" &&
                                        <View style={{width:'100%',flexDirection:'row',marginTop:5,marginLeft: 30,marginBottom:5}}>
                                            <View  style={{width:'80%',flexDirection:'column',justifyContent:'center'}}>                                    
                                                <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.mailId}</Text>
                                                <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Email</Text>
                                            </View>
                                            <View style={{width:'20%',justifyContent:'center'}}>
                                                <TouchableOpacity onPress={()=> this.openMailer(EmployeeInfo.mailId,EmployeeInfo.employeeName)}>
                                                <CSIcon name='Artboard-49' size={30} color="#580073" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        }
                                        {/* {EmployeeInfo.hasOwnProperty("ContactDetails") &&
                                        EmployeeInfo.ContactDetails != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        } */}
                                        { EmployeeInfo.hasOwnProperty("ContactDetails") &&
                                        EmployeeInfo.ContactDetails.map((item,i)=>(
                                        <View key={i}>
                                            <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                            <View style={{width:'100%',flexDirection:'row',marginTop:5,marginLeft: 30,marginBottom:5}}>
                                                <View  style={{width:'80%',flexDirection:'column',justifyContent:'center'}}>                                    
                                                    <Text style={{fontSize:18,fontWeight:'500'}}> {item.ContactNumber}</Text>
                                                    <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> {item.ContactType}</Text>
                                                </View>
                                                <View style={{width:'20%',justifyContent:'center'}}>
                                                    <TouchableOpacity onPress={()=> this.openDialer(item.ContactNumber)}>
                                                    <CSIcon name='Artboard-52' size={30} color="#580073" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        ))}
                                    </View>
                                </CardItem>
                            </Card>
                        </View>
                    </View>
                    </ScrollView>
                    :
                    <ScrollView>
                    <View style={{width : SCREEN_WIDTH}}>
                        <View style={{margin: 10}}>
                        {
                            Validate.isNotNull(EmployeeInfo.EmployeeImageUri)
                            ?
                            <View style={styles.assignedcircle}>
                                <Image source={{ uri: 'data:image/png;base64,' + EmployeeInfo.EmployeeImageUri}} style={{alignSelf:'center',marginLeft:2}}/>
                            </View>
                            :
                            <View style={styles.assignedcircle}>
                                <Image  source={require('../../assets/avatar.png')} style={{alignSelf:'center',marginTop:10,padding:2,marginLeft:2}} />
                            </View>
                        }
                            <Card padder style={{marginTop:20,borderRadius:10,padding:5}}>
                                <CardItem header>
                                    <Text style={{color:'#580073',fontSize:20,fontWeight:'600'}}> Basic Info</Text>
                                </CardItem>    
                                <CardItem cardBody >
                                    <View style={{flexDirection:'column',width:'100%'}}>

                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.EmpCode}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Employee Code</Text>
                                        </View>

                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>

                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.TitleName}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Title </Text>
                                        </View>

                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>

                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.DepartmentName}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Department</Text>
                                        </View>
                                        {
                                        EmployeeInfo.hasOwnProperty("BloodGroup") &&
                                        EmployeeInfo.BloodGroup != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        {
                                        EmployeeInfo.hasOwnProperty("BloodGroup") &&
                                        EmployeeInfo.BloodGroup != "" && 
                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.BloodGroup}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Blood Group</Text>
                                        </View>
                                        }
                                        
                                        {EmployeeInfo.Sex != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        {EmployeeInfo.Sex != "" && 
                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.Sex == "M" ? "Male":EmployeeInfo.Sex == "F" ? "Female": "Other"}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Gender</Text>
                                        </View>
                                        }
                                        {EmployeeInfo.MartialStatus != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        {
                                        EmployeeInfo.MartialStatus != "" && 
                                        <View  style={{width:'100%',flexDirection:'column',marginTop:5,marginLeft: 30,marginBottom:5}}>                                    
                                            <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.MartialStatus}</Text>
                                            <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Martial Status</Text>
                                        </View>
                                        }
                                        {
                                        EmployeeInfo.Email != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        }
                                        { EmployeeInfo.Email != "" &&
                                        <View style={{width:'100%',flexDirection:'row',marginTop:5,marginLeft: 30,marginBottom:5}}>
                                            <View  style={{width:'80%',flexDirection:'column',justifyContent:'center'}}>                                    
                                                <Text style={{fontSize:18,fontWeight:'500'}}> {EmployeeInfo.Email}</Text>
                                                <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> Email</Text>
                                            </View>
                                            <View style={{width:'20%',justifyContent:'center'}}>
                                                <TouchableOpacity onPress={()=> this.openMailer(EmployeeInfo.Email,EmployeeInfo.EmployeeName)}>
                                                <CSIcon name='Artboard-49' size={30} color="#580073" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        }
                                        {/* {EmployeeInfo.hasOwnProperty("ContactDetails") &&
                                        EmployeeInfo.ContactDetails != "" && 
                                        <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                        } */}
                                        { EmployeeInfo.hasOwnProperty("ContactDetails") &&
                                        EmployeeInfo.ContactDetails.map((item,i)=>(
                                        <View key={i}>
                                            <View style={{backgroundColor:'#ccc',height:1,width:'90%',marginLeft: 30,margin:10}}/>
                                                <View style={{width:'100%',flexDirection:'row',marginTop:5,marginLeft: 30,marginBottom:5}}>
                                                    <View  style={{width:'80%',flexDirection:'column',justifyContent:'center'}}>                                      
                                                    <Text style={{fontSize:18,fontWeight:'500'}}> {item.ContactNumber}</Text>
                                                    <Text style={{color:'#969595',fontSize:14,marginTop:5,fontWeight:'600'}}> {item.ContactType}</Text>
                                                </View>
                                                <View style={{width:'20%',justifyContent:'center'}}>
                                                    <TouchableOpacity onPress={()=> this.openDialer(item.ContactNumber)}>
                                                    <CSIcon name='Artboard-52' size={30} color="#580073" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        ))}
                                    </View>
                                </CardItem>
                            </Card>
                        </View>
                    </View>
                    </ScrollView>
                }
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    assignedcircle:{ 
    width:'100%', 
    backgroundColor:'#fff',
    },
})
