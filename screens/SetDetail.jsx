import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements';

const SetDetail = ({route, navigation}) => {
    const {title, key} = route.params;
    if(key == '1') {
        return (
            <View style={{width: '100%', marginTop: 10}}>
                <Image
                style={styles.profile}
                source={require('./profile.png')
                }
                />
                <Button
                style={styles.button}
                title="Change Profile Picture"
                onPress={console.log("Pressed")}
                />
            </View>
        )
    }else{
        return (
            <View>
            <Text>{title}</Text>
            </View>
        )
    }
    
    
}

export default SetDetail

const styles = StyleSheet.create({
    container: {
        flex: 1
        
    },
    profile: {
        width: 200, height: 200, resizeMode: "cover", alignSelf: 'center'
    },
    button: {
        
        alignSelf: 'center'
    }
})