import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SetDetail = ({route, navigation}) => {
    const {title} = route.params;
    return (
        <View>
        <Text>{title}</Text>
        </View>
    )
}

export default SetDetail

const styles = StyleSheet.create({})