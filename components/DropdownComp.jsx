import { StyleSheet, Text, View } from 'react-native';
import React , {useState, useEffect} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';


const data = [
    { label: 'TX', value: '1' },
    { label: 'LA', value: '2' },
    { label: 'CL', value: '3' },
    { label: 'TN', value: '4' },
    { label: 'NY', value: '5' },
    { label: 'MN', value: '6' },
    { label: 'KT', value: '7' },
    { label: 'MS', value: '8' },
  ];
  const DropdownComponent = () => {
    const [value, setValue] = useState(null);

    // useEffect(() => {
    //   var config = {
    //     method: 'get',
    //     url: 'https://api.countrystatecity.in/v1/states',
    //     headers: {
    //       'X-CSCAPI-KEY': 'API_KEY'
    //     }
    //   };
    // })
    return (
      <View style={styles.container}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={value}
          onChange={item => {
            setValue(item.value);
          }}
          
        />
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    container:{
      flex:1, 
      paddingTop: 100,
      alignContent: 'center'
    },
    dropdown: {
      margin: 16,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    icon: {
      marginRight: 5,
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      flex: 1,
      fontSize: 16,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });