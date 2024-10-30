import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, View } from 'react-native'
import PieChart from 'react-native-pie-chart'

const Piechart = ({percentages}) =>  {
  
    const widthAndHeight = 200
    const series = percentages
    const sliceColor = [ '#8a05f7','#05aff7', '#f7e705', '#c72246', '#ff00fb' , '#00ff77','#00ffdd', '#f77e05']

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PieChart widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} />
        </View>
      </ScrollView>
    )
  
}
export default Piechart
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 0,
      },
})