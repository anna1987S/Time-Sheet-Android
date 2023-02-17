import React from 'react';
import {  Image,Dimensions } from 'react-native';
import { View , Title,Text} from 'native-base';

const NoRecordsFound = () => {
    var screen = Dimensions.get('window');
    return (
        <View style={{width: screen.width,alignItems:'center', height:300}}>
            <Image style={{ width: '60%',height:'100%',textAlign:'center', resizeMode:'contain' }} source={require('../assets/no_data.png')} />
            {/* <Text style={{fontSize: 20, height:'10%',textAlign: 'center',marginBottom:10}}>No records found</Text> */}
        </View>
    )
}

export default NoRecordsFound;
