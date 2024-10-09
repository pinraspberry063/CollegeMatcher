---
title: Results Page
---
<SwmSnippet path="/app/Results.jsx" line="18">

---

Num Results Setting:\
&nbsp;&nbsp;&nbsp;&nbsp;-- Allows user to modify the number of college match results that appear on the results page

```javascript
    const numResultsData = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
        
    ];
```

---

</SwmSnippet>

<SwmSnippet path="/app/Quiz.jsx" line="282">

---

matchColleges Function Call:\
&nbsp;&nbsp;&nbsp;&nbsp;-- returns the top 100 college matches\
&nbsp;&nbsp;&nbsp;&nbsp;-- used for the result settings tp return 5, 10, 25, 50, or 100 results

```javascript
        const result = ( await matchColleges(answers)).top100Colleges;
        navigation.navigate("Results", {top100: result});
```

---

</SwmSnippet>

<SwmSnippet path="/app/Results.jsx" line="26">

---

Base Result Page:\
&nbsp;&nbsp;&nbsp;&nbsp;-- used to review college matches after taking college matcher quiz

```javascript
    const resultpage = () => (
        <View style={styles.container}>
            <Text style={styles.title}>Top {numResults} College Matches</Text>
            <DropdownComponent style={styles.dropdown} data={numResultsData} value={numResults} onChange={setNumResults} />
            <FlatList
                data={top100.slice(0,numResults)}
                renderItem={renderItem}
                // keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </View>

    )
```

---

</SwmSnippet>

<SwmSnippet path="/app/Results.jsx" line="10">

---

SetPage:\
&nbsp;&nbsp;&nbsp;&nbsp;-- DEFAULT: results page\
TODO:

&nbsp;&nbsp;&nbsp;&nbsp;-- add a College About page\
&nbsp;&nbsp;&nbsp;&nbsp;-- maybe add a demographics page\
&nbsp;&nbsp;&nbsp;&nbsp;-- maybe add an info page or view component that explains the match score\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-- ACT, SAT scores, State, Major Program...etc

```javascript
    const [page, setPage] = useState('results');
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
