import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const TabBarContext = createContext();


// // Custom hook to use the TabBarContext
// export const useTabBar = () => useContext(TabBarContext);

// Provider component
export const TabBarProvider = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);


  const Tab = createBottomTabNavigator();
  const BottomStack = createNativeStackNavigator();

  const BottomTabScreen = () => {
    const [topColleges, setTopColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const user = auth().currentUser.uid;
  
    useEffect(() => {
      const checkQuiz = async () => {
        const usersRef = collection(firestore, 'Users');
        const userQuery = query(
          usersRef,
          where('User_UID', '==', auth().currentUser.uid),
        );
        try {
          const querySnapshot = await getDocs(userQuery);
  
          if (!querySnapshot.empty) {
            const firstDoc = querySnapshot.docs[0];
            const collegeData = firstDoc.data();
            const top100 = collegeData.top100Colleges;
  
            setTopColleges(top100);
          } else {
            console.log('No matching document found.');
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error retrieving document:', error);
        }
      };
      checkQuiz();
    }, [topColleges, isLoading]);
  
    if (isLoading) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    return(
    <Tab.Navigator
      screenOptions={screenOptions}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen
          name="QuizStack"
          initialParams={{Top100: topColleges}}
          component={ResultStackScreen}
        />
      <Tab.Screen name="ColForumSelectorTab" component={ForumStackScreen} />
      <Tab.Screen name="Messages" component={MessageStackScreen} />
      <Tab.Screen name="AI" component={AIStackScreen} />
  {/*     {checkUserStatus === 'moderator' && ( */}
                <Tab.Screen name="Moderation" component={ModeratorScreen} />
  {/*             )} */}
          <Tab.Screen
                name="UserActivityScreen"
                component={UserActivityScreen}
                options={{ tabBarButton: () => null }}
              />
    </Tab.Navigator>
  )};

  return (
    <TabBarContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
        <NavigationContainer>
            <BottomStack.Navigator>
                <BottomStack.Screen name='children' component={children} options={{headerShown: false}}/>
                <BottomStack.Screen name='tabbar' component={BottomTabScreen} options={{ headerShown: false }}/>
            </BottomStack.Navigator>
        </NavigationContainer>
      
      
    </TabBarContext.Provider>
  );
};

