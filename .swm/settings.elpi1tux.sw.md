---
title: Settings
---
<SwmSnippet path="/app/Settings.jsx" line="11">

---

Settings Page:\
-- Account --> users account page\
-- Preferences --> contains toggle of dark mode\
-- Favorited Colleges --> Not Yet Implemented\
-- Privacy --> Not yet Implemented\
\
Plan:&nbsp;\
&nbsp;&nbsp;&nbsp;&nbsp;-- Retake the College Matcher Quiz Option\
&nbsp;&nbsp;&nbsp;&nbsp;-- Modify the Navigation so that Settings is accessed through the&nbsp;

```javascript
const Settings = ({navigation}) => {
  const theme = useContext(themeContext);

  return (
    <View style={styles.container}>
      <ScrollView>

          <TouchableOpacity onPress={() => navigation.navigate('Account')}>

            <Text style={[styles.item, {color: theme.color}]}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Preferences')}>

            <Text style={[styles.item, {color: theme.color}]}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Favorited Colleges")}>

            <Text style={[styles.item, {color: theme.color}]}>Favorited Colleges</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Saved MAKK Chats")}>

            <Text style={[styles.item, {color: theme.color}]}>Saved MAKK Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Privacy")}>

            <Text style={[styles.item, {color: theme.color}]}>Privacy</Text>
          </TouchableOpacity>


      </ScrollView>
    </View>
  );
};
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
