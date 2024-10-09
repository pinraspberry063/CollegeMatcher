import { StyleSheet, Text, View } from 'react-native';
import React , {useState, useEffect} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

  const DropdownComponent = ({data, value, onChange}) => {
    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    const handleSelect = (item) => {
        setSelectedValue(item.value);
        if (onChange) {
            onChange(item.value);
        }
    };

    return (
      <View style={styles.container}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select"
                searchPlaceholder="Search..."
                value={selectedValue}
                onChange={handleSelect}
            />
        </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    container:{
      flex:1, 
      paddingTop: 0,
      alignContent: 'left'
    },
    dropdown: {
      margin: 3,
      height: 50,
      width: 375,
      backgroundColor: 'white',
      borderRadius: 12,
      //padding: 12,
      paddingLeft: 20,
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