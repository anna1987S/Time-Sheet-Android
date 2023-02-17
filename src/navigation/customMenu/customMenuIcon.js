import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,AsyncStorage} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import CSIcon from '../../icon-font';
import {Thumbnail,Card,CardItem} from 'native-base';
import { Validate, Constants } from '../../utils';

export default class CustomMenuIcon extends Component{
    _menu = null
    setMenuRef = ref =>{
        this._menu = ref;
    };
    showMenu = () => {
        this._menu.show();
    };
    hideMenu = () => {
        this._menu.hide();
    };
    option1Click = () => {
    this._menu.hide();
    this.props.option1Click();
    };
    option2Click = () => {
    this._menu.hide();
    this.props.option2Click();
    };


    render() {
        return (
          <View style={this.props.menustyle}>
            <Menu
              ref={this.setMenuRef}
              button={
                
                  Validate.isNotNull(this.props.employeeUrl)
                  ?
                  <TouchableOpacity onPress={this.showMenu}>
                    <Thumbnail square large source={{ uri: 'data:image/png;base64,' + this.props.employeeUrl }} style={{ borderRadius: 50, height: 40, width: 40 }} />
                  </TouchableOpacity>
                    :
                  <TouchableOpacity onPress={this.showMenu}>
                    <Thumbnail square large source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 40, width: 40 }} />
                  </TouchableOpacity>
                // }
                // <TouchableOpacity onPress={this.showMenu}>
                //     <Thumbnail square source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 30, width: 30 }} />
                // </TouchableOpacity>
                
              }>

            {/* <MenuItem> {this.props.employeeName}
            </MenuItem>
            <MenuItem>
             {this.props.employeeId}
            </MenuItem> */}
            {/* <MenuDivider /> */}
              <MenuItem style={{width:80}} onPress={this.option1Click}>
                  Settings                   
                  {/* <CSIcon  style={{padding:20}} name='Artboard-381x-100' size={22} color="#580073" /> */}
                  {/* <View style={{width:70}}>
                    <Text style={{width:'70%'}}>Settings </Text>
                    <CSIcon style={{width:'30%'}} name='Artboard-381x-100' size={22} color="#580073" />
                  </View> */}
              </MenuItem>
              <MenuItem onPress={this.option2Click}>Logout
              {/* <CSIcon name='Artboard-651' size={22} color="#580073" /> */}
              </MenuItem>
            </Menu>
          </View>
        );
      }
}