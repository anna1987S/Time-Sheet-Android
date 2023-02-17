import React from 'react';
import { Title, Item, Icon, Input } from 'native-base';
import { Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

const HeaderTitle = (props) => {
    return (        
           <>
            {
                
                props.searchField 
                ? 
                <Item>
                    {/* <Icon name="ios-search" style={{color: Platform.OS === 'android' ? '#580073' : '#580073'}}/> */}
                    <Input placeholder="Search" placeholderTextColor={ Platform.OS === 'android' ? '#ccc' : '#333333' }  style={[{height: Platform.OS === 'android' ? 40 : 35},{color : Platform.OS === 'android' ? '#000' : '#333333'}]} onSubmitEditing={(event) => props.onSearchValueChange(event.nativeEvent.text)} autoFocus/>
                    <TouchableOpacity onPress={()=> props.onSearchIconClick(false)}>
                    <Icon name="close" style={{color: Platform.OS === 'android' ? '#580073' : '#580073'}}/>
                    </TouchableOpacity>
                </Item> 
                :
                <Title style={{color:'#580073',marginLeft: Platform.OS==='android'? 10 : "" }}>{props.title}</Title>
                
            }
            </>            
    )
}

export default HeaderTitle;