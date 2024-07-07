import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Index';
import Settings from '../screens/Settings';
import SetDetail from '../screens/SetDetail';
import Login from '../screens/Login'
import AccountCreation from '../screens/AccountCreation'

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
                <HomeStack.Screen name="Login" component={Login} />
                <HomeStack.Screen name="AccountCreation" component={AccountCreation} />
            </HomeStack.Navigator>
        </NavigationContainer>
    );
}

export default NavStack;

