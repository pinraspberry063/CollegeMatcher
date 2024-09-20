import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { ScrollView } from 'react-native-gesture-handler';

const DropdownComponent = ({ data, value, onChange, style, multiSelect = false }) => {
    const [selectedValues, setSelectedValues] = useState(value || []);

    useEffect(() => {
        setSelectedValues(value || []);
    }, [value]);

    const handleSelect = (item) => {
        let newValues;
        if (multiSelect) {
            if (selectedValues.includes(item.value)) {
                // If already selected, remove it
                newValues = selectedValues.filter(val => val !== item.value);
            } else {
                // Otherwise, add it
                newValues = [...selectedValues, item.value];
            }
        } else {
            newValues = [item.value];
        }

        setSelectedValues(newValues);
        if (onChange) {
            onChange(newValues);
        }
    };

    const renderSelectedValues = () => {
        return selectedValues.map((val, index) => (
            <Text key={index} style={styles.selectedText}>
                {index > 0 && ', '}
                <Text style={{ fontWeight: 'bold' }}>{val}</Text>
            </Text>
        ));
    };

    return (
        <View style={styles.container}>
            <ScrollView style={[styles.dropdown, style]}>
                {renderSelectedValues()}
            </ScrollView>
            <Dropdown
                style={[styles.dropdown, style]}
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
                value={selectedValues}
                onChange={handleSelect}
                renderItem={(item) => (
                    <View style={styles.item}>
                        <Text
                            style={[
                                styles.textItem,
                                { fontWeight: selectedValues.includes(item.value) ? 'bold' : 'normal' },
                            ]}
                        >
                            {item.label}
                        </Text>
                    </View>
                )}
                multiple={multiSelect} // Enable multiple selections
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        alignContent: 'left',
    },
    dropdown: {
        margin: 3,
        height: 50,
        width: 375,
        backgroundColor: 'white',
        borderRadius: 12,
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
    selectedText: {
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
