---
title: App Navigation
---
&nbsp;

<SwmSnippet path="/App.jsx" line="196">

---

TabStack Navigator handles all the screens in the home animation of the orniting planets. The buttons themselves are handled in the PlanetSlider component file. The Tab navigator itself has been removed.

```javascript
  <TabStack.Navigator
    screenOptions={screenOptions}
  >
    <TabStack.Screen name="Home" component={HomeStackScreen} />
    <TabStack.Screen
        name="QuizStack"
        initialParams={{Top100: topColleges}}
        component={ResultStackScreen}
      />
    <TabStack.Screen name="ColForumSelectorTab" component={ForumStackScreen} />
    <TabStack.Screen name="Messages" component={MessageStackScreen} />
    <TabStack.Screen name="AI" component={AIStackScreen} />
{/*     {checkUserStatus === 'moderator' && ( */}
              <Tab.Screen name="Moderation" component={ModeratorScreen} />
{/*             )} */}
        <TabStack.Screen
              name="UserActivityScreen"
              component={UserActivityScreen}
              options={{ tabBarButton: () => null }}
            />
  </TabStack.Navigator>
```

---

</SwmSnippet>

Navigation Stack For Home Page:\
&nbsp;&nbsp;&nbsp;&nbsp;-- Handles navigation away from the homepage&nbsp;\
&nbsp;&nbsp;&nbsp;&nbsp;-- Includes the top navigation bar (Settings)

```javascript
const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Index" component={Home} />
    <HomeStack.Screen name="Settings" component={Settings} />
    <HomeStack.Screen name="Account" component={Account} />
    <HomeStack.Screen name="Picker" component={Picker} />
    <HomeStack.Screen name="Preferences" component={Preferences} />
  </HomeStack.Navigator>
)

```

---

---

Navigation Stack for Quiz:\
&nbsp;&nbsp;&nbsp;&nbsp;-- Handles navigation from the "Take the Quiz" button on the home page\
&nbsp;&nbsp;&nbsp;&nbsp;-- Also handles navigation from the "QuizStack" tab on the Bottom Tab Bar\
\
TODO:\
&nbsp;&nbsp;&nbsp;&nbsp;-- to make the "Take the Quiz button only appear on the HomePage so when the quiz&nbsp;

```javascript
const QuizStack = createNativeStackNavigator();
const QuizStackScreen = () => (
  <QuizStack.Navigator screenOptions={screenOptions}>
    <QuizStack.Screen name="Quiz" component={Quiz} />
    <QuizStack.Screen name="Results" component={Results} />

  </QuizStack.Navigator>
)

```

---

---

Navigation Stack For Forums Page:\
&nbsp;&nbsp;&nbsp;&nbsp;-- handles naviagtion from the "Forum" tab on the Bottom Tab Bar\
&nbsp;&nbsp;&nbsp;&nbsp;-- "Reddit style" page

```javascript
const ForumStack = createNativeStackNavigator();
const ForumStackScreen = () => (
  <ForumStack.Navigator screenOptions={screenOptions}>
    <ForumStack.Screen name="Forum" component={ColForum} />
  </ForumStack.Navigator>
)

```

---

---

Navigation Stack For MAKK AI:\
&nbsp;&nbsp;&nbsp;&nbsp;-- handles navigation from the "AI" Tab in Bottom Navigation Bar

```javascript
const AIStack = createNativeStackNavigator();
const AIStackScreen = () => (
  <AIStack.Navigator screenOptions={screenOptions}>
    <AIStack.Screen name="MakkAI" component={MakkAI} />
  </AIStack.Navigator>
)

```

---

---

Icons For Bottom Tab Navigator:\
&nbsp;&nbsp;&nbsp;&nbsp;-- stores the "MaterialCommunityIcon" references for the Tabs in the Bottom Tab Navigator&nbsp;\
&nbsp;&nbsp;&nbsp;&nbsp;-- Can search for Icons here: [https://expo.github.io/vector-icons/](https://expo.github.io/vector-icons/%EF%BF%BC)\
&nbsp;&nbsp;&nbsp;&nbsp;-- use "MaterialCommunityIcon" filter

```javascript
const icons = {
  Home: 'home',
  QuizStack: 'magnify',
  Forum: 'forum',
  Messages: 'message',
  AI: 'head'
}

```

---

---

Bottom Tab Navigator:\
&nbsp;&nbsp;&nbsp;&nbsp;-- references Stack Navigators to redirect to pages represented by Tabs\
&nbsp;&nbsp;&nbsp;&nbsp;-- default setting: header not shown

```javascript
const Tab = createBottomTabNavigator();
const TabScreen = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        return (
          <MaterialCommunityIcons
            name={icons[route.name]}
            color={color}
            size={size}
          />
        );
      },
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 60,
        background: "#fff"
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeStackScreen} />
    <Tab.Screen name="QuizStack" component={QuizStackScreen} />
    <Tab.Screen name="Forum" component={ForumStackScreen} />
    <Tab.Screen name="Messages" component={MessageStackScreen} />
    <Tab.Screen name="AI" component={AIStackScreen} />
  </Tab.Navigator>
)

```

---

---

Navigation Stack for Root Navigation:\
&nbsp;&nbsp;&nbsp;&nbsp;-- Handles Navigation from Login page to Home Page\
\
NOTE:&nbsp;\
&nbsp;&nbsp;&nbsp;&nbsp;-- "Launch" page is the first page you see when launching the app\
&nbsp;&nbsp;&nbsp;&nbsp;-- prompts user to login or create an account

```javascript
const RootStack = createNativeStackNavigator();
const LaunchStack = createNativeStackNavigator();
const LaunchStackScreen = () => (
  <LaunchStack.Navigator screenOptions={screenOptions}>
    <LaunchStack.Screen name="LaunchScreen" component={Launch} />
    <LaunchStack.Screen name="Login" component={Login} />
    <LaunchStack.Screen name="CreateAccount" component={AccountCreation} />
  </LaunchStack.Navigator>
)

```

---

---

Event Regestration to Handle DarkMode Preferences of the App

```javascript
  useEffect(() => {
    const listener = EventRegister.addEventListener('Change Theme', (data) => {
      setDarkMode(data)
    })
    return () => {
      EventRegister.removeAllListeners(listener)
    }
  }, [darkMode])

```

---

---

Button or tab redirects to the quiz page if it hasn't been taken by a new user.\
\
TODO:\
&nbsp;&nbsp;&nbsp;&nbsp;-- have an option to retake the quiz in user settings\
&nbsp;&nbsp;&nbsp;&nbsp;-- Have the button disappear if the user has already taken the quiz

```javascript
const QuizStack = createNativeStackNavigator();
const QuizStackScreen = () => (
  <QuizStack.Navigator screenOptions={screenOptions}>
    <QuizStack.Screen name="Quiz" component={Quiz} />
    <QuizStack.Screen name="Results" component={Results} />

  </QuizStack.Navigator>
)

```

---

---

Navigation Stack For DMs:\
-- Handles navigation away from the DMs page (RecConvs)\
-- base page is the DMs page accessed from the Bottom Navigation Bar

```javascript
const MessageStack = createNativeStackNavigator();
const MessageStackScreen = () => (
  <MessageStack.Navigator screenOptions={screenOptions}>
    <MessageStack.Screen name="RecConvs" component={RecConvs} />
    <MessageStack.Screen name="Message" component={Message} />
  </MessageStack.Navigator>
)
```

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
