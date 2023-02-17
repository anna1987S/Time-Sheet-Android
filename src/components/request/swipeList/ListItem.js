import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {Card, CardItem,Icon} from 'native-base';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: '#4a4a4a',
    fontSize: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e4e4',
    marginLeft: 10,
  },
  leftAction: {
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    flex: 1,
    borderRadius:10,
    marginTop:10,
    paddingHorizontal:5,
    marginBottom:5
  },
  rightAction: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
    borderRadius:10,
    marginTop:10,
    paddingHorizontal:5,
    marginBottom:5
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 20,
  },
  content:{ 
    flexDirection: 'column',
    width: '80%', 
    flexDirection: 'row',
    // paddingHorizontal: 2,
    paddingVertical:2
  },
  header: {
    // alignItems: 'center',
    // alignContent: 'center',
    justifyContent:'center',
    width: '20%',
  },
  hours: {
    fontSize: 15,
    color: 'black',
    // marginTop:20,
    // textAlign: 'center',
    fontWeight:'bold',
    // alignContent: 'space-between',
  }
});
const _menu = null
export const Separator = () => <View style={styles.separator} />;



const LeftActions = (progress, dragX) => {
  debugger
  // console.log("Props",this.props)
  const scale = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <View  style={styles.leftAction}>
      <Animated.Text style={[styles.actionText, { transform: [{ scale : scale }] }]}>
        Approve
      </Animated.Text>
    </View>
  );
};

const RightActions = ( progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  return (
    // <TouchableOpacity onPress={onPress}>
      <View style={styles.rightAction}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale: scale }] }]}>
          Reject
        </Animated.Text>
      </View>
    // </TouchableOpacity>
  );
};
const screen = Dimensions.get('window');
const ListItem = ({ itemVal, onSwipeFromLeft, onRightPress,Login,index }) => {
  
  console.log("List Item Val",itemVal)
    return(
      Login 
        ?
        <Swipeable>
          {
            <Card style={{width:'99%',borderRadius:10,marginTop:20,paddingHorizontal:5}}>    
              <CardItem>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width }}>
                    <View style={  styles.header}>
                        <Text style={styles.hours}> 
                        {/* {itemVal[0].EMPLOYEE_NAME} */}
                        Login Employee Name
                        </Text>
                    </View>
                    {/* <View style={{flexDirection: 'column',width:'80%',}}> */}
                      <View  style={ styles.content }>
                        <View style={{ width: '80%',  flexDirection: 'column' }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, margin: 2,textAlign: 'left',color: '#7666fe' }}> {itemVal.TASK_NUMBER} </Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> { itemVal.PROJECT_TITLE } </Text>
                            <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{ itemVal.COMMENTS} </Text>
                            <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> { itemVal.TASK_SUB_TYPE } </Text>
                            </View>
                        </View>
                        {/* <View style={{width:'10%',justifyContent:'center'}}>
                            <Text style={{fontWeight:'bold',color:'#434a54',textAlign:'center',fontSize:14}}> {itemVal.DURATION} Hrs</Text>    
                        </View> */}
                        <View style={{ width:'15%',justifyContent:'center',height:65, borderRadius:10,backgroundColor:'#006fb1',padding:5, borderWidth:2, marginTop:-25,borderColor:'transparent'}}>
                            <Text style={{color:'#fff',fontWeight:'bold',textAlign:'center',fontSize:10}}>{itemVal.DURATION} Hrs</Text>
                        </View>
                      </View>
                    </View>
                  {/* </View> */}
              </CardItem>
            </Card>
          }
        </Swipeable>
      :
        // itemVal.length > 1 
        //   ?
        //   // Object.keys(itemVal).length > 0 &&
        //     <Swipeable
        //         renderLeftActions={LeftActions}
        //         onSwipeableLeftOpen={onSwipeFromLeft}
        //         // renderRightActions={RightActions}
        //         // onSwipeableRightOpen={onRightPress}
        //     >
        //         {/* <View style={styles.container}> */}
        //             <Card style={{width:'99%',borderRadius:10,marginTop:10,paddingHorizontal:5}}>    
        //                 <CardItem>
        //                     <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width }}>
        //                         <View style={  styles.header}>
        //                             <Text style={styles.hours}> 
        //                             {itemVal[1].EMPLOYEE_NAME}
        //                             </Text>
        //                         </View>
                                
        //                           <View style={{flexDirection: 'column',width:'80%',}}>
        //                             {
        //                           Object.entries(itemVal)
        //                               .map(([key, value], i) => (
        //                             <React.Fragment key={i}>
        //                               <Card style={{width:'99%',borderRadius:10,paddingHorizontal:2}}>
        //                               <CardItem>
        //                                     <View  style={ styles.content }>
        //                                         <View style={{width:'10%',justifyContent:'center',marginRight:5}}>
        //                                          { 
        //                                             !value.IsSelect 
        //                                             ?
        //                                               <Icon type="MaterialCommunityIcons" name="checkbox-blank-outline"  style={{ fontSize: 26, color: '#7666fe' }} />
        //                                             :
        //                                               <Icon type="MaterialCommunityIcons" name="check-box-outline"  style={{ fontSize: 26, color: '#7666fe' }} />
        //                                           }
        //                                           </View>
        //                                         <View style={{ width: '100%',  flexDirection: 'column' }}>
        //                                             <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, margin: 2,textAlign: 'left',color: '#7666fe' }}> {value.TASK_NUMBER} </Text>
        //                                             <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> { value.PROJECT_TITLE } </Text>
        //                                             <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{ value.COMMENTS} </Text>
        //                                             <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
        //                                                 <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> { value.TASK_SUBTYPE } </Text>
        //                                             </View>
        //                                         </View>
        //                                         <View style={{width:'20%',justifyContent:'center'}}>
        //                                             <Text style={{fontWeight:'bold',color:'#434a54',textAlign:'center',fontSize:14}}> {value.DURATION} Hrs</Text>    
        //                                         </View>
        //                                     </View>
        //                                 </CardItem>
        //                               </Card>
        //                             </React.Fragment>
        //                           ))
        //                           }
        //                           </View>
                                
        //                     </View>    
        //                 </CardItem>
        //             </Card>
        //         {/* </View> */}
        //     </Swipeable>
        //   :
          // itemVal.length > 0 && 

          //   Object.entries(itemVal)
          //     .map(([key, value], i) => (
                
                <Swipeable
                  key = {index}
                  renderLeftActions={LeftActions}
                  onSwipeableLeftOpen={onSwipeFromLeft}
                  renderRightActions={RightActions}
                  onSwipeableRightOpen={onRightPress}
                  >
                {/* <React.Fragment key={i}> */}
                  <Card style={{width:'99%',borderRadius:10,marginTop:10,paddingHorizontal:5}}>    
                    <CardItem>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width }}>
                          <View style={  styles.header}>
                              <Text style={styles.hours}> 
                              {itemVal.EMPLOYEE_NAME}
                              </Text>
                          </View>
                          <View style={{flexDirection: 'column',width:'80%',}}>
                            <View  style={ styles.content }>
                              <View style={{ width: '100%',  flexDirection: 'column' }}>
                                  <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, margin: 2,textAlign: 'left',color: '#7666fe' }}> {itemVal.TASK_NUMBER} </Text>
                                  <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, margin: 2,padding: 2,fontWeight:'bold', color: '#434a54' }}> { itemVal.PROJECT_TITLE } </Text>
                                  <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, margin: 2,padding: 2, color: '#959595' }}>{ itemVal.COMMENTS} </Text>
                                  <View style={[{minWidth:40,maxWidth:140, height:25, borderRadius:50,backgroundColor:'#f1efff',padding:5, borderWidth:2,borderColor:'transparent'}]}>
                                      <Text style={{color:'#7666fe',textAlign:'center',fontSize:10}}> { itemVal.TASK_SUBTYPE } </Text>
                                  </View>
                              </View>
                              <View style={{width:'20%',justifyContent:'center'}}>
                                  <Text style={{fontWeight:'bold',color:'#434a54',textAlign:'center',fontSize:14}}> {itemVal.DURATION} Hrs</Text>    
                              </View>
                            </View>
                          </View>
                        </View>
                    </CardItem>
                  </Card>
                {/* </React.Fragment> */}
                </Swipeable>
              // ))
    );
}

export default ListItem;