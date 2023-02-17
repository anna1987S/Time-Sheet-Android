import React,{ useRef } from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Button, Icon, Footer, Text, FooterTab,Thumbnail } from 'native-base';
import {View,FlatList,Dimensions,StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HomeStack,TimesheetStack,TravelStack,LeaveStack,AskHrStack } from './dashboardNav';
import CSIcon from '../icon-font';

const numColumns = 4;
const size = Dimensions.get('window').width/numColumns;
const styles = StyleSheet.create({
  itemContainer: {
    width: size,
    height: size,
  },
  item: {
    flex: 1,
    margin: 3,
    justifyContent:'flex-start'
  }
});
const BottomModalView = (props) =>{
    var footerData = [
        // { id: 1, name:"Contacts", title: "Contacts", active_icon: 'Artboard-2-copy-8', inactive_icon: 'Artboard-2-copy-8' },
        // { id: 2, name:"Blood", title: "Blood", active_icon: 'Artboard-81', inactive_icon: 'Artboard-81'},
        // { id: 3, name:"ServiceAnniversary", title: "ServiceAnniversary", active_icon: 'Artboard-84', inactive_icon: 'Artboard-84'},
        // { id: 4, name:"Birthday", title: "Birthday", active_icon: 'Artboard-82', inactive_icon: 'Artboard-82'},
        { id: 1, name:"Holiday", title: "Holiday", active_icon: 'Artboard-79', inactive_icon: 'Artboard-79'},
        { id: 2, name:"SwipeRequest", title: "SwipeRequest", active_icon: 'Artboard-621', inactive_icon: 'Artboard-621' },
        { id: 3, name:"Travel", title: "Travel", active_icon: 'Artboard-631', inactive_icon: 'Artboard-631' },
    ]
    return(
        
            <View style={{flexDirection:'row',justifyContent:'flex-start',width:'100%'}}>
            {
                // footerData.map((item, index) => (
                    <FlatList
                    data={footerData}
                    renderItem={({item}) => (
                        <Button key={item.id} style={styles.item} onPress={() => {                                
                            var {navigation} = props.data
                            console.log("Navigation info",navigation);
                            if(item.title != "SwipeRequest" &&
                                item.title != "Travel"
                                ){
                                    props.done()
                                    // navigation.push(item.title);
                                // navigation.navigate(navigation.state.routeName);
                                    navigation.navigate(item.title)
                            }
                            else
                            {
                                alert("Development in Progress...");
                            }
                        }}>
                            
                                <CSIcon 
                                    name={item.active_icon} 
                                    size={26}
                                    color={"#000"}
                                />
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{color: "#a1a1a1", fontSize: 9, textTransform:'uppercase'}}>{item.name}</Text>
                            
                        </Button>
                    )}
                    keyExtractor={item => item.id}
                    numColumns={numColumns} />
                // ))
            }
        </View>
        
    )
}


const MainTabs = createBottomTabNavigator({


    Home: {
        screen: HomeStack,
        navigationOptions: {
            tabBarLabel: 'Home'
        }
    },
    Timesheet: {
        screen: TimesheetStack,
        navigationOptions: {
            tabBarLabel: 'Timesheet'
        }
    },
    Leave: {
        screen: LeaveStack,
        navigationOptions: {
            tabBarLabel: 'Leave'
        }
    },
    AskHR: {
        screen: AskHrStack,
        navigationOptions: {
            tabBarLabel: 'AskHR'
        }
    },
    More: {
        screen: TravelStack,
        navigationOptions: {
            tabBarLabel: 'More'
        }
    }
}, {
    tabBarComponent: (props) => {
        const refRBSheet = useRef();
        var dataInfo = props;
        var footerData = [
            { id: 1, name:"Home", title: "Home", active_icon: 'Artboard-73', inactive_icon: 'Artboard-73'},
            { id: 2, name:"Timesheet", title: "Timesheet", active_icon: 'Artboard-621', inactive_icon: 'Artboard-621' },
            { id: 3, name:"Leave", title: "Leave", active_icon: 'Artboard-611', inactive_icon: 'Artboard-611' },
            { id: 4, name:"Ask HR", title: "AskHR", active_icon: 'Artboard-88', inactive_icon: 'Artboard-88' },
            { id: 5, name:"More", title: "More", active_icon: 'Artboard-76', inactive_icon: 'Artboard-76'}
        ]

        return (
        
            <Footer style={{borderTopLeftRadius:40,borderTopRightRadius:40,color:'#ffffff'}}>
                <FooterTab style={{backgroundColor:'#fff'}}>
                    {
                        footerData.map((item, index) => (
                            <Button key={item.id} vertical onPress={() => {                                
                                var {navigation} = props
                                console.log("Data Nav",navigation)
                                   if(item.title != "More"){
                                    navigation.popToTop();
                                    navigation.navigate(navigation.state.routeName);
                                    props.navigation.navigate(item.title)
                                }else if(item.title == "More")
                                {
                                    refRBSheet.current.open()
                                }
                                else
                                {
                                    alert("Development in Progress...");
                                }
                            }
                            }>
                                {
                                    item.title == "Home"
                                    ?
                                    <Thumbnail square source={require('../assets/Icon-1024.png')} 
                                    style={{height:20,width:35}} />
                                    :
                                    <CSIcon 
                                    name={props.navigation.state.index === index ? item.active_icon : item.inactive_icon} 
                                    size={22}
                                    color={props.navigation.state.index === index ? "#580073" : "#000"}
                                />
                                }
                                
                                {/* <Icon type="FontAwesome" name={item.default_icon} /> */}
                                <Text style={{color: props.navigation.state.index === index ? "#580073" : "#a1a1a1", fontSize: 8, textTransform:'capitalize'}}>{item.name}</Text>
                            </Button>
                        ))
                    }
                    {
                    <RBSheet
                        ref={refRBSheet}
                        height= {200}
                        animationType = 'fade'
                        openDuration={10}
                        customStyles={{
                            
                            container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius:15
                            }
                        }}
                        >
                        <BottomModalView 
                           data = {dataInfo}
                           done = {()=>refRBSheet.current.close()}
                        //    itemList = {this.state.dayList}
                        //    onPickerSelect = {this.onValueChange.bind(this)}
                        />
                    </RBSheet>
                    }
                </FooterTab>
            </Footer>
        );

    }
});


export default createAppContainer(MainTabs);