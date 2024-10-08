
import college_data from './college_data';
const majorData = [
    { label: 'Aerospace Engineering', value: 'Aerospace Engineering' , categories: 'EngineeringDegrees'  },
    { label: 'Accounting', value: 'Accounting' , categories:  'Business_Management_Marketing_and_RelatedDegrees' },
    { label: 'Agriculture', value: 'Agriculture', categories:  'agriculturalDegrees'  },
    { label: 'Architecture', value: 'Architecture',  categories: 'ArchitectureDegrees' },
    { label: 'Biology', value: 'Biology', categories: 'Biological_and_BiomedicalSciencesDegrees'  },
    { label: 'Biomedical Engineering', value: 'Biomedical Engineering', categories: 'Biological_and_BiomedicalSciencesDegrees' },
    { label: 'Biomedical Science', value: 'Biomedical Science', categories: 'Biological_and_BiomedicalSciencesDegrees'  },
    { label: 'Business Administration', value: 'Business Administration',categories:  'Business_Management_Marketing_and_RelatedDegrees'  },
    { label: 'Business Management', value: 'Business Management', categories:  'Business_Management_Marketing_and_RelatedDegrees'  },
    { label: 'Civil Engineering', value: 'Civil Engineering', categories: 'EngineeringDegrees'  },
    { label: 'Chemical Engineering', value: 'Chemical Engineering', categories: 'EngineeringDegrees'  },
    { label: 'Chemistry', value: 'Chemistry', categories:  'PhysicalSciencesDegrees'  },
    { label: 'Communications', value: 'Communication', categories: 'CommunicationTechnologiesDegrees'   },
    { label: 'Communication Technology', value: 'Communication Technology', categories: 'CommunicationTechnologiesDegrees'  },
    { label: 'Computer Information Systems', value:  'Computer Information Systems'   },
    { label: 'Computer Engineering', value: 'Computer Engineering', categories: 'Computer_and_ComputerInfoScienciesDegrees' },
    { label: 'Computer Science', value: 'Computer Science' , categories: 'Computer_and_ComputerInfoScienciesDegrees' },
    { label: 'Construction Management', value: 'Construction Management' , categories: 'ConstructionTradesDegrees' },
    { label: 'Construction Trades', value: 'Construction Trades' , categories: 'ConstructionTradesDegrees' },
    { label: 'Criminal Justice', value: 'Criminal Justice' , categories: 'LegalStudiesDegrees' },
    { label: 'Culinary', value: 'Culinary' , categories: 'CulinaryDegrees' },
    { label: 'Ecology', value: 'Ecology' , categories:  'Biological_and_BiomedicalSciencesDegrees' },
    { label: 'Economics', value: 'Economics' , categories: 'Business_Management_Marketing_and_RelatedDegrees' },
    { label: 'Education', value: 'Education' , categories: 'EducationsDegrees' },
    { label: 'Engineering Technologies', value: 'Engineering Technology', categories: 'EngineeringDegrees'  },
    { label: 'Electrical Engineering', value: 'Electrical Engineering', categories: 'EngineeringDegrees'  },
    { label: 'English', value: 'English' , categories: 'EnglishDegrees' },
    { label: 'Entrepreneurship', value: 'Entrepreneurship' , categories: 'Business_Management_Marketing_and_RelatedDegrees' },
    { label: 'Environmental Engineering', value: 'Environmental Engineering', categories:  'EngineeringDegrees' },
    { label: 'Environmental Protections', value: 'Environmental Protections', categories:  'naturalResourceAndConservationDegrees'  },
    { label: 'Environmental Sciences', value: 'Environmental Sciences', categories: 'naturalResourceAndConservationDegrees' },
    { label: 'Ethnic Studies', value: 'Ethnic Studies' , categories: 'Ethinc_Cultural_GenderStudiesDegrees' },
    { label: 'Fashion', value: 'Fashion', categories:  'Visual_and_PerformingArtsDegrees'},
    { label: 'Finance', value: 'Finance' , categories: 'Business_Management_Marketing_and_RelatedDegrees' },
    { label: 'Fitness Studies', value: 'Fitness Studies' , categories: 'Parks_Recreation_Leisure_and_FitnessStudiesDegrees' },
    { label: 'Foreign Language', value: 'Foreign Language', categories: 'ForeignLanguagesDegrees' },
    { label: 'Forestry', value: 'Forestry' , categories: 'naturalResourceAndConservationDegrees' },
    { label: 'General Studies', value: 'General Studies' , categories: 'LiberalArts_and_GeneralStudiesDegrees' },
    { label: 'History', value: 'History' , categories: 'HistoryDegrees' },
    { label: 'Human Resources', value: 'Human Resources' , categories: 'Business_Management_Marketing_and_RelatedDegrees' },
    { label: 'Human Sciences', value: 'Human Sciences', categories: 'HumanSciencesDegrees' },
    { label: 'Industrial Engineering', value: 'Industrial Engineering' , categories: 'EngineeringDegrees' },
    { label: 'Interdisciplinary Studies', value: 'Interdisciplinary Studies' , categories: 'Multi_InterdisciplinaryStudiesDegrees' },
    { label: 'Journalism', value: 'Journalism' , categories: 'Communication_and_JournalismDegrees' },
    { label: 'Legal Studies', value: 'Legal Studies' , categories: 'LegalStudiesDegrees' },
    { label: 'Liberal Arts', value: 'Liberal Arts' , categories: 'LiberalArts_and_GeneralStudiesDegrees' },
    { label: 'Marketing', value: 'Marketing' , categories: 'Business_Management_Marketing_and_RelatedDegrees' },
    { label: 'Mathematics', value: 'Mathematics' , categories: 'Math_and_StatsDegrees' },
    { label: 'Mechanic and Repair Technologies', value: 'Mechanic and Repair Technologies' , categories: 'Mechanic_and_RepairTechnologiesDegrees' },
    { label: 'Mechanical Engineering', value: 'Mechanical Engineering', categories: 'EngineeringDegrees'  },
    { label: 'Multidisciplinary Studies', value: 'Multidisciplinary Studies' , categories: 'Multi_InterdisciplinaryStudiesDegrees' },
    { label: 'Musical Studies', value: 'Musical Studies' , categories: 'Visual_and_PerformingArtsDegrees' },
    { label: 'Natural Resource Management', value: 'Natural Resource Management' , categories: 'naturalResourceAndConservationDegrees' },
    { label: 'Performing Arts', value: 'Performing Arts' , categories: 'Visual_and_PerformingArtsDegrees' },
    { label: 'Philosophy', value: 'Philosophy' , categories: 'Philosophy_and_ReligiousStudiesDegrees' },
    { label: 'Psychology', value: 'Psychology' , categories: 'PsychologyDegrees' },
    { label: 'Physical Sciences', value: 'Physical Sciences', categories:  'PhysicalSciencesDegrees' },
    { label: 'Political Science', value: 'Political Science', categories:  'SocialSciencesDegrees' },
    { label: 'Precision Production', value: 'Precision Production' , categories: 'PrecisionProductionDegrees' },
    { label: 'Protective Services', value: 'Protective Services' , categories: 'HomelandSecurity_LawEnforcement_Firefighting_and_RelatedProtectiveServicesDegrees' },
    { label: 'Public Administration', value: 'Public Administration', categories:  'PublicAdmin_and_SocialServiceDegrees' },
    { label: 'Religious Studies', value: 'Religious Studies' , categories: 'Philosophy_and_ReligiousStudiesDegrees' },
    { label: 'Religious Vocations', value: 'Religious Vocations' , categories: 'Philosophy_and_ReligiousStudiesDegrees' },
    { label: 'Social Services', value: 'Social Services' , categories:'PublicAdmin_and_SocialServiceDegrees'},
    { label: 'Social Sciences', value: 'Social Sciences', categories: 'SocialSciencesDegrees'},
    { label: 'Sociology', value: 'Sociology' , categories:'SocialSciencesDegrees'},
    { label: 'Statistics', value: 'Statistics' , categories:'Math_and_StatsDegrees'},
    { label: 'Supply Chain', value: 'Supply Chain' , categories:'Business_Management_Marketing_and_RelatedDegrees'},
    { label: 'Theology', value: 'Theology' , categories:'Theology_and_ReligiousVocationsDegrees'},
    { label: 'Visual Arts', value: 'Visual Arts' , categories:'Visual_and_PerformingArtsDegrees'},
];

const unique_Majors = async() => {

    const uniqueMajors = [];
    const majorSet = new Set();
    majorData.forEach(major => {
        const majorCategory = major.categories || [' '];

        if (!majorSet.has(majorCategory)) {
          majorSet.add(majorCategory);
          uniqueMajors.push(majorCategory);
        }
      });
      uniqueMajors.reduce((acc, curr) => {
        const majorCategory = curr.categories;

        if (!acc.some(major => major.categories === majorCategory)) {
          acc.push(curr);
        }

        return acc;
      }, []);
    
    return uniqueMajors;
}

export default  majorData;
