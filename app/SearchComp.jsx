import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { fetchColleges } from '../app/AccessCollegeData';
import { CollegesContext } from '../components/CollegeContext';

const CollegeSearch = ({ onCollegeSelect }) => {
    const [searchText, setSearchText] = useState('');
    // const [colleges, setColleges] = useState([]);
    const [filteredColleges, setFilteredColleges] = useState([]);
    const {colleges, loading} = useContext(CollegesContext);

    // useEffect(() => {
    //     const getData = async () => {
    //         const collegesData = await fetchColleges();
    //         setColleges(collegesData);
    //     };
    //     getData();
    // }, []);

    useEffect(() => {
        if (searchText.trim()) {
            const filtered = colleges
                .filter(college =>
                    college?.shool_name?.toLowerCase().includes(searchText.toLowerCase())
                )
                .slice(0, 5);
            setFilteredColleges(filtered);
        } else {
            setFilteredColleges([]);
        }
    }, [searchText, colleges]);

    const handleCollegeSelect = (college) => {
        onCollegeSelect(college);

        setSearchText('');
        setFilteredColleges([]);
    };

    return (
        <View>
            <TextInput
                placeholder="Search for a college"
                value={searchText}
                onChangeText={setSearchText}
                style={{ borderBottomWidth: 1, padding: 10, marginBottom: 10 }}
            />
            {filteredColleges.length > 0 && (
                <FlatList
                    data={filteredColleges}
                    keyExtractor={(item) => item?.shool_name || item?.id || item?.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleCollegeSelect(item)}>
                            <Text style={{ padding: 10 }}>
                                {item?.shool_name || "Unknown College"}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default CollegeSearch;
