---
title: MatchingAlgorithm
---
<SwmSnippet path="/src/utils/matchingAlgorithm.jsx" line="10">

---

This helper function calculates the distance between two sets of coordinates (`coords1` and `coords2`) using the Haversine formula found online (<https://www.movable-type.co.uk/scripts/latlong.html>) which is used to compute the shortest distance between two points on the Earth’s surface.

```javascript
const findDist= (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const lat1 = coords1.lat;
    const lon1 = coords1.lng;
    const lat2 = coords2.lat;
    const lon2 = coords2.lng;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/matchingAlgorithm.jsx" line="27">

---

This function uses the Google Geocoding API to convert an address into coordinates of latitude and longitude.

```javascript
const geoCodeAddress = async (address) => {
    const apiKey = 'AIzaSyB_0VYgSr15VoeppmqLur_6LeHHxU0q0NI'
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
            address: address,
            key: apiKey
        }
    });
    if (response.data.status === 'OK'){
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } else {
        throw new Error('Geocoding not found');
    }
};
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/matchingAlgorithm.jsx" line="44">

---

This function adjusts the importance value used in the college matching algorithm by applying a multiplier to importance ratings when a user picks how important that specific question is to them.

```javascript
const importanceMultiplier = (importance) => {
    if (importance < 0.8) {
      return 0.75;
    }
    return importance;
  };
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/matchingAlgorithm.jsx" line="157">

---

When calculating the matches between a user and colleges, it takes account for each question. This is the snippet for matching user selected majors with the college's available majors to calculate a score based on the colleges that has the major and taking account its importance score the user selected. For each selected major, if the college offers it at a significant level (I chose  greater than 4% enrollment based on my own intuition), 25 points are added. Otherwise, 10 points are added for lower levels (0.1-3.99% which is also based on my own intuition). If no matching major is found, no points are awarded for majors at those colleges. The score is adjusted by the user's major importance preference to reflect its weight in the score.\
(*This same process is used for each question to generate the points individually*)

&nbsp;

```javascript
      // Major Offered Matching
      if (studentPreferences.major.length > 0) {
          const userSelectedMajors = studentPreferences.major;
          let majorMatch = false;
  
          userSelectedMajors.forEach((major) => {
              const majorInfo = majorData.find((m) => m.value === major);
  
              if (majorInfo && majorInfo.categories && college[majorInfo.categories]) {
                const majorPercentage = parseFloat(college[majorInfo.categories]);
  
                if (majorPercentage > 4) {
                  score += 25 * studentPreferences.major_importance;
                  majorMatch = true;
                }
                else if (majorPercentage >= 0.1 && majorPercentage <= 3.99) {
                  score += 10 * studentPreferences.major_importance;
                  majorMatch = true;
                }
              }
          });
          if (!majorMatch) {
              score += 0 * studentPreferences.major_importance;
          }
      }
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/matchingAlgorithm.jsx" line="379">

---

After all the scores are calculated for the colleges, it sorts the colleges by their matching score in descending order and selects the top 100 scoring colleges. Stores the top 100 colleges in the 'Users' collection in Firestore, associated with the current user's ID and preferences from the quiz. Each entry includes the college's name, score, and ID, with the document (in Firebase) merged if it already exists. Returns the top 50 colleges as a final result for display on the Results page.&nbsp;

```javascript
    scores.sort((a, b) => b.score - a.score);

    const top100Colleges = scores
      .map(s => ({
        name: s.college.shool_name,
        score: s.score,
        id: s.college.school_id,
      }));
    const resultsRef = collection(firestore, 'Users');
    const resultDoc = query(
      resultsRef,
      where('User_UID', '==', auth().currentUser.uid),
    );
    const docID = (await getDocs(resultDoc)).docs[0].ref;
  
    try {
      await setDoc(
        docID,
        {
          userPreferences: studentPreferences,
          top100Colleges: top100Colleges
        },
        {merge: true},
      );
  
      alert('Algo submitted successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    const top100 = top100Colleges.slice(0, 50);
    return {top100};
  };
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
