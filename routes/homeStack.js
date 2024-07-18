import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../app/index';
import Settings from '../app/Settings';
import Account from '../app/AccSettings';
import Quiz from '../app/Quiz';
import Picker from '../app/ProfileImageComp'
import Login from '../app/Login'
import AccountCreation from '../app/AccountCreation'
import Preferences from '../app/Preferences';


const HomeStack = createNativeStackNavigator();

const NavStack = ({theme}) => {
    return (
        <NavigationContainer theme={theme}>
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
                <HomeStack.Screen name="Account" component={Account} />
                <HomeStack.Screen name="Picker" component={Picker} />
                <HomeStack.Screen name="Quiz" component={Quiz} />
                
                <HomeStack.Screen name="Preferences" component={Preferences} />
                <HomeStack.Screen name="Login" component={Login} />
                <HomeStack.Screen name="AccountCreation" component={AccountCreation} />
                
            </HomeStack.Navigator>
        </NavigationContainer>
    );
}

export default NavStack;

