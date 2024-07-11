import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Index';
import Settings from '../screens/Settings';
import SetDetail from '../screens/SetDetail';
import Quiz from '../screens/Quiz';
import Picker from '../components/ProfileImageComp'

const HomeStack = createNativeStackNavigator();

const NavStack = () => {
    return (
        <NavigationContainer>
            <HomeStack.Navigator 
            screenOptions={{
                headerMode: "screen",
                headerTitleAlign: "center",
                headerTintColor: "blue",
                headerStyle: {backgroudColor: "grey"}
            }}
            >

                <HomeStack.Screen name="Home" component={Home} />
                <HomeStack.Screen name="Settings" component={Settings} />
                <HomeStack.Screen name="SetDetail" component={SetDetail} />
                <HomeStack.Screen name="Quiz" component={Quiz} />
                <HomeStack.Screen name="Picker" component={Picker} />
            </HomeStack.Navigator>
        </NavigationContainer>
    );
}

export default NavStack;

