import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, View } from 'react-native'
import PieChart from 'react-native-pie-chart'

const Piechart = ({percentages}) =>  {
  
    const widthAndHeight = 200
    const series = percentages
    const sliceColor = [ '#8a05f7','#05aff7', '#ffb300', '#ff9100', '#ff00fb' , '#00ff77','#00ffdd', '#fbd203']

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
    paddingTop: 40
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
})