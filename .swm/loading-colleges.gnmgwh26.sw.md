---
title: 'Loading Colleges '
---
Colleges are loaded into the app using CollegesProvider which is wrapped aroung the App Navigation Stack.  It loads all colleges from the CompleteColleges Collection in Firebase. To access the colleges import useContext from 'react':

```javascriptreact
import React, { useContext, useState, useEffect } from 'react';
```

You'll also need to import CollegesContext:

```javascriptreact
import { CollegesContext } from '../components/CollegeContext';
```

Then set it to a state variable using useContext:

```javascriptreact
const {colleges, loading} = useContext(CollegesContext);
```

Then to check if colleges are still loading

```javascriptreact
return (
{loading? <Text> Loading... <Text/> : 
    <Flatlist 
        data={colleges} 
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
    />
}
)
```

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
