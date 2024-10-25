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

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
