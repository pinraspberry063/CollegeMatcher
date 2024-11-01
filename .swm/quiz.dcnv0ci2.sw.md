---
title: Quiz
---
<SwmSnippet path="/app/Quiz.jsx" line="174">

---

The handleSubmit function checks if there are any blank fields on each question once the user clicks submit. If the user clicks submit and there were blank fields, an alert will display saying which of the following fields were empty.&nbsp;

```javascript
    const handleSubmit = async () => {
        const missingFields = [];

        if (!address) missingFields.push('Address');
        if (!gpa) missingFields.push('GPA');
        if (!major.length) missingFields.push('Major');
        if (!stateChoice.length) missingFields.push('State Choice');
        if (!distanceFromCollege) missingFields.push('Distance from College');
        if (!tuitionCost) missingFields.push('Tuition Cost');
        if (!religiousAffiliation) missingFields.push('Religious Affiliation');
        if (!sportCollege) missingFields.push('Sporting Events');
        if (!collegeDiversity) missingFields.push('College Diversity');
        if (!size) missingFields.push('College Size');
        if (!schoolClassification) missingFields.push('School Classification');
        if (!urbanizationLevel) missingFields.push('Urbanization Level');
    
        if (missingFields.length > 0) {
            const fields = missingFields.join(', ');
            alert(`Please fill out the following required fields: ${fields}`);
            return;
        }
    
```

---

</SwmSnippet>

<SwmSnippet path="/app/Quiz.jsx" line="252">

---

This is the logic for the `handleSubmit` function to handle the submission of the user's quiz answers to Firebase and navigates to results screen which is displaying matched colleges.\
How it works:

- Within a `try` , `setDoc` is used to add  the user's quiz responses in the Firebase.

- The document is saved to the `"Users"` collection and using the user's `uid` as the document ID,  which makes sure the data is associated with the correct user.

- It will notify the user if submitted correctly

- After the quiz data is saved, the function calls `matchColleges` and sends the user's `answers` and available `colleges`.

- The `matchColleges` function returns an array of the top 100 matched colleges from the matching algorithm.

```javascript
        try {
            await setDoc(doc(collection(firestore, "Users"), auth().currentUser.uid), answers);
            alert('Quiz submitted successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
        }

        const result = (await matchColleges( answers,  colleges)).top100Colleges;
        navigation.navigate('QuizStack', { top100: result });
    };
```

---

</SwmSnippet>

<SwmSnippet path="/app/Quiz.jsx" line="263">

---

This function renders the first page (same for the others) of the quiz in the form of a React component. This allows the user to select their desired answer and then specify its importance to themselves by positioning the slider in between Not Important, Neutral, and Very Important. The values increment by 0.1 from 0-1.&nbsp;

```javascript
    const renderPageOne = () => (
        <View>
          <Text style={[styles.text]}>What do you plan on studying?</Text>
          <DropdownComponent
            data={majorData}
            value={major}
            onChange={setMajor}
            multiSelect={true}
            maxSelect={3}
          />
          <Slider
            value={majorImportance || 0.5}
            onValueChange={setMajorImportance}
            step={0.1}
            minimumValue={0}
            maximumValue={1}
            thumbTintColor="silver"
            minimumTrackTintColor="purple"
          />
          <View style={styles.sliderLabels}>
            <Text>Not Important</Text>
            <Text>Neutral</Text>
            <Text>Very Important</Text>
          </View>
```

---

</SwmSnippet>

<SwmSnippet path="/app/Quiz.jsx" line="487">

---

On this page, it renders a dropdown for a user to select whether they have taken the ACT, with "Yes" or "No" options. If they select "Yes", input fields appear for entering ACT Composite and section scores. It also ensures the user can only type numbers between 0-36 and N/A. This check is applied on blur to ensure the user's answers are within the valid ACT ranges and/or N/A, displaying alerts if out of range. If they select "No", then all ACT scores are reset to N/A.&nbsp;

*(Same process for SAT except ranges are now from 400-1600 for total score and 200-800 for its subsections*)

```javascript
          <View>
            <Text style={[styles.text]}>Did you take the ACT?</Text>
            <DropdownComponent
              data={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
              value={tookACT}
              onChange={(value) => {
                setTookACT(value);
    
                if (value.includes('No')) {
                  setActScore('');
                  setActMath('');
                  setActEnglish('');
                  setActReading('');
                  setActScience('');
                  setActWriting('');
                }
              }}
            />
    
            {tookACT.includes('Yes') && (
              <>
                <Text style={[styles.text]}>ACT Composite score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={actScore}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setActScore(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(actScore, 10);
                        if (value > 36) {
                            setActScore('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (value < 0) {
                            setActScore('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (isNaN(value)) {
                            setActScore('N/A');
                        }
                    }}
                  placeholder="Ex: 25..."
                  keyboardType="numeric"
                />
    
```

---

</SwmSnippet>

<SwmSnippet path="/app/Quiz.jsx" line="744">

---

The last question on the quiz renders an address input field using Google Places Autocomplete, allowing users to search and select their address. The component includes a placeholder and maintains a limited dropdown list view for search results. The Google Places API key and language are specified in the query for autocomplete functionality.

```javascript
            <Text style={[styles.text]}>What is your address?</Text>
            <GooglePlacesAutocomplete
              placeholder="123 Main St..."
              fetchDetails={true}
              onPress={(data, details = null) => {
                setAddress(details?.formatted_address || data.description);
              }}
              value={address}
              textInputProps={{ value: placeSearch, onChangeText: setPlaceSearch }}
              query={{ key: 'AIzaSyB_0VYgSr15VoeppmqLur_6LeHHxU0q0NI', language: 'en' }}
              styles={{ listView: { maxHeight: 200 } }}
            />
          </View>
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
