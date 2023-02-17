import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager,Dimensions} from "react-native";
import { Colors } from './Colors';
import {Card, CardItem,} from 'native-base';
import Icon from "react-native-vector-icons/MaterialIcons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export default class Accordian extends Component{

    constructor(props) {
        console.log("Values",props)
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
  
  render() {
        console.log("Values",this.props.title,"Content",this.props.data)
    return (
        
            <TouchableOpacity ref={this.accordian} activeOpacity={0.8} style={styles.row} onPress={()=>this.toggleExpand()}>
                <Card padder style={{width:SCREEN_WIDTH-20,marginLeft:10,borderRadius:20}}>
            <CardItem style={{margin:5}}>
                {/* <TouchableOpacity ref={this.accordian} activeOpacity={0.8} style={styles.row} onPress={()=>this.toggleExpand()}> */}
                    <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
                    <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={Colors.DARKGRAY} />
                {/* </TouchableOpacity> */}
                <View style={styles.parentHr}/>
                {
                    this.state.expanded &&
                    <View style={styles.child}>
                        <Text>{this.props.data}</Text>    
                    </View>
                }
            </CardItem>
            </Card>
            </TouchableOpacity>
        
    )
  }

  toggleExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    title:{
        fontSize: 14,
        fontWeight:'bold',
        color: Colors.DARKGRAY,
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        
        margin:4,
        alignItems:'center',
        // backgroundColor: Colors.CGRAY,
    },
    parentHr:{
        height:1,
        color: Colors.WHITE,
        width:'100%'
    },
    child:{
        backgroundColor: Colors.LIGHTGRAY,
        padding:16,
    }
    
});