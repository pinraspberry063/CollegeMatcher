import { StyleSheet, Text, View, TouchableOpacity, Alert, } from 'react-native';
import React , {useState, useEffect} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

  const DropdownComponent = ({ data, value, onChange, multiSelect = false, maxSelect }) => {
      const [selectedValue, setSelectedValue] = useState(multiSelect ? [] : value);

      useEffect(() => {
          if (multiSelect) {
              setSelectedValue(Array.isArray(value) ? value : []);
          } else {
              setSelectedValue(value);
          }
      }, [value, multiSelect]);

      const handleSelect = (item) => {
          if (multiSelect) {
              let updatedValues = [...selectedValue];

              if (updatedValues.includes(item.value)) {
                  updatedValues = updatedValues.filter(val => val !== item.value);
              } else {
                  if (maxSelect && updatedValues.length >= maxSelect) {
                      Alert.alert("Maximum number of choices have been selected.");
                      return;
                  }
                  updatedValues.push(item.value);
              }

              setSelectedValue(updatedValues);
              if (onChange) {
                  onChange(updatedValues);
              }
          } else {
              setSelectedValue(item.value);
              if (onChange) {
                  onChange(item.value);
              }
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
            value={multiSelect ? null : selectedValue}
            onChange={handleSelect}
          />
          {multiSelect && (
            <View style={styles.choiceBoxContainer}>
              {selectedValue.map((val, index) => (
                <View key={index} style={styles.choiceBox}>
                  <Text style={styles.choiceBoxText}>{val}</Text>
                  <TouchableOpacity onPress={() => handleSelect({ value: val })}>
                    <Text style={styles.removeText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
      color: 'gray',
    },
    selectedTextStyle: {
      fontSize: 16,
      color: 'gray',
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    choiceBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    choiceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: 5,
        marginBottom: 5,
    },
    choiceBoxText: {
        marginRight: 5,
    },
    removeText: {
        color: 'red',
        fontWeight: 'bold',
    },
  });