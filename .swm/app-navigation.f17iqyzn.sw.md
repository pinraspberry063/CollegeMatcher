---
title: App Navigation
---
<SwmSnippet path="App.jsx" line="44">

---

Navigation Stack For Home Page:\
&nbsp;&nbsp;&nbsp;&nbsp;-- Handles navigation away from the homepage&nbsp;\
&nbsp;&nbsp;&nbsp;&nbsp;-- Includes the top navigation bar (Settings)

```
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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="63">

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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="72">

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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="78">

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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="85">

---

Icons For Bottom Tab Navigator:\
-- stores the "MaterialCommunityIcon" references for the Tabs in the Bottom Tab Navigator&nbsp;\
-- Can search for Icons here: <https://expo.github.io/vector-icons/>\
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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="93">

---

Bottom Tab Navigator:\
--  references Stack Navigators to redirect to pages represented by Tabs\
-- default setting: header not shown

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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="127">

---

Navigation Stack for Root Navigation:\
-- Handles Navigation from Login page to Home Page\
\
Note:&nbsp;\
-- "Launch" page is the first page you see when launching the app\
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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="140">

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

</SwmSnippet>

<SwmSnippet path="/App.jsx" line="63">

---

hasn't been taken by a new user.\
-- have an option to retake the quiz in user settings

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

</SwmSnippet>

<SwmSnippet path="App.jsx" line="55">

---

Navigation Stack For DMs:\
-- Handles navigation away from the DMs page (RecConvs)\
-- base page is the DMs page accessed from the Bottom Navigation Bar

```
const MessageStack = createNativeStackNavigator();
const MessageStackScreen = () => (
  <MessageStack.Navigator screenOptions={screenOptions}>
    <MessageStack.Screen name="RecConvs" component={RecConvs} />
    <MessageStack.Screen name="Message" component={Message} />
  </MessageStack.Navigator>
)
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
