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
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal,Linking
 } from 'react-native';
import CSIcon from '../../icon-font';
import CustAccordion from './settingsexpand';
import { Validate, Constants } from '../../utils';
import ApiInfo from '../../config/api-info';

 const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

 export default class InstanceInfo extends Component{
    constructor(props){
        super(props)
        
        this.state = {
          userInfo : {},
          auth_Info : {
            Ssl:ApiInfo.Ssl,
            Port: ApiInfo.localIp,
            IPAddress: ApiInfo.localaddress,
            AddOnIp: ApiInfo.baseaddress,
            AddOnSsl:ApiInfo.supportssl,
            AddOnPort: ApiInfo.baselocalIp,
          },
          modalVisible : false,
          navigateVal : this.props.navigation.getParam("navigateVal")
        }
        
      }
      async componentDidMount(){
        var UserInfo = await AsyncStorage.getItem('userInfo');
        // var auth_Info = await AsyncStorage.getItem('QR_Info');
        this.setState({
          userInfo : JSON.parse(UserInfo),
        //   auth_Info : JSON.parse(auth_Info)
        })
      }

      render(){
        var {userInfo,auth_Info,navigateVal} = this.state;
        console.log("Auth",auth_Info,"user",userInfo)
        return(
            <Container >
                {/* <ImageBackground source={require('../../assets/background.png')} style={styles.background}> */}
                    <Header  style={{ backgroundColor: 'white' }}>
                        <Left>
                          <TouchableOpacity onPress ={() => {this.props.navigation.navigate(navigateVal)}}>
                            <CSIcon name='Artboard-58' size={24} color="#580073" />
                          </TouchableOpacity>
                        </Left>
                        <Body>
                            <HeaderTitle title="Instance Detail" />
                        </Body>
                        <Right>
                          {/* <TouchableOpacity onPress ={() => { Alert.alert(
                                  //title
                                  'Alert!',
                                  //body
                                  'Do you want to Sign Out?',
                                  [
                                      { text: 'Yes', onPress: () => this.props.navigation.navigate('Auth') },
                                      { text: 'No', onPress: () => { cancelable: true }, style: 'cancel' },
                                  ],
                                  { cancelable: true }
                              );}}>
                              <Icon name="logout" type="MaterialCommunityIcons" style={{ fontSize: 30, color: "#580073" }} />
                            </TouchableOpacity> */}
                        </Right>
                    </Header>
                    <Content>
                        <View style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,justifyContent:'space-between',padding:10}}>
                            <Card style={{marginLeft:0,marginRight:0,borderTopRightRadius:30,borderTopLeftRadius:30,
                                borderBottomRightRadius:30,borderBottomLeftRadius:30,justifyContent:'space-between'}}>
                                <View style={{margin:20}}>
                                    <View padder style = {{flexDirection:'row'}}> 
                                        <View style={{flex:.6,alignItems:'flex-start'}}>
                                            <Text style ={{color:"#000",fontSize:18,marginBottom:10,fontWeight:'600'}}>Setup Configuration</Text>
                                        </View>
                                        <View style={{flex:.4,alignContent:'flex-end'}}>
                                            {/* <Text style ={{color:"#4c1763",fontSize:30,marginLeft:30}}>Logo</Text> */}
                                        </View> 
                                    </View>
                                    <Form>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Host URL </Text>
                                        <View style={[{ height:45, borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                            <Input disabled placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                                 value={auth_Info.IPAddress}/>
                                        </View>
                                        <View  style = {{flexDirection:'row',alignItems:'flex-start'}}> 
                                            <View style={{flex:.6,alignItems:'flex-start'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Port </Text>
                                                <View style={[{ height:45,width:'90%', borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5,borderColor:'transparent'}]}>
                                                    <Input disabled placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                                        keyboardType={'numeric'}  value={`${auth_Info.Port}`}
                                                        />
                                                </View>
                                            </View>
                                            <View style={{flex:.4,alignContent:'flex-start'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>SSL </Text>
                                                <Switch disabled trackColor={{ true: '#580073', false: '#ccc'  }} style={{marginTop:15,alignItems:'flex-start'}}
                                                 value={ApiInfo.Ssl}
                                                />
                                            </View> 
                                        </View>
                                        {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>User Name </Text>
                                        <View style={[{ height:45, borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                            <Input disabled placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                                value={userInfo.userName}
                                                />
                                        </View> */}

                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Add-on Host </Text>
                                        <View style={[{ height:45, borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                            <Input disabled placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                                 value={ (auth_Info.AddOnIp == "" || auth_Info.AddOnIp == null) ? ApiInfo.baseaddress : auth_Info.AddOnIp }/>
                                        </View>
                                        <View  style = {{flexDirection:'row',alignItems:'flex-start'}}> 
                                            <View style={{flex:.6,alignItems:'flex-start'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Add-on Port </Text>
                                                <View style={[{ height:45,width:'90%', borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5,borderColor:'transparent'}]}>
                                                    <Input disabled placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                                        keyboardType={'numeric'}  value={(auth_Info.AddOnPort == "" || auth_Info.AddOnPort == null ) ?  `${ApiInfo.baselocalIp}` : `${auth_Info.AddOnPort}`}
                                                        />
                                                </View>
                                            </View>
                                            <View style={{flex:.4,alignContent:'flex-start'}}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Add-on SSL </Text>
                                                <Switch disabled trackColor={{ true: '#580073', false: '#ccc'  }} style={{marginTop:15,alignItems:'flex-start'}}
                                                 value={ApiInfo.supportssl}
                                                />
                                            </View> 
                                        </View>
                                    </Form>
                                    {/* <View style={{justifyContent:'center',marginTop:10, flexDirection:'row'}}>
                                        <View style={{flex:.5,alignItems:'center'}}>
                                            <Button block rounded light onPress={this._authendicateInfo} style={styles.authBtn}>
                                            {this.state.isLoading ? <ActivityIndicator /> : <Text style={{color:'#ffffff',fontWeight:'bold',fontSize:14}}>Authenticate</Text>}
                                            </Button>
                                        </View>
                                        <View style={{flex:.5,alignItems:'center'}}>
                                            <Button block rounded light onPress ={() => this.props.navigation.navigate('Scanner')} style={styles.signInBtn}>
                                            {this.state.isLoading ? <ActivityIndicator /> : <Text style={{color:'#ffffff',fontWeight:'bold',fontSize:14}}>Scan QR</Text>}
                                            </Button>
                                        </View>
                                    </View> */}
                                </View>
                            </Card>
                        </View>
                    </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    background:{
        flex:1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    backgroundImage: {
      flex: 1,
      // resizeMode: 'cover',
      width: null,
      height:500

      // or 'stretch'
      // alignSelf: 'stretch', 
    }
});