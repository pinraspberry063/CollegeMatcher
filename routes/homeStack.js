import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Index';
import Settings from '../screens/Settings';
import SetDetail from '../screens/SetDetail';
import CollegePage from '../screens/CollegePage';

const HomeStack = createNativeStackNavigator();

const NavStack = () => {
    return (
        <NavigationContainer>
            <HomeStack.Navigator 
            screenOptions={{
                headerMode: "screen",
                headerTitleAlign: "center",
                headerTintColor: "blue",
                headerStyle: {backgroundColor: "grey"}
            }}
            >

                <HomeStack.Screen name="Home" component={Home} />
                <HomeStack.Screen name="Settings" component={Settings} />
                <HomeStack.Screen name="SetDetail" component={SetDetail} />
                <HomeStack.Screen name="CollegePage" component={CollegePage} />
            </HomeStack.Navigator>
        </NavigationContainer>
    );
}

console.log("Navigator is loaded");

export default NavStack;

