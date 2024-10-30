
import React, {useContext, useEffect, useState} from 'react';
const diverses = [
    "AmericanIndian_or_AlaskaNative",
    'American_Nonresident',
    'NativeHawaiian_or_OtherPacificIslander',
    'asian',
    'black',
    'hispanicLatino',
    'twoPlus_races',
    'raceUnknown'
]


const computeDiverse = ({college}) => {
    const percentages = [];

    {diverses.map((diverse => {
        const field = 'percent_' + diverse
        percentages.push(college[field])
    }))}


    console.log(percentages);
    return percentages
    
}

export default computeDiverse