// import { ISSUE_TRACKERS } from 'models/enums/IssueTrackers';
// import EnglishMessages from './i18n/en.json';
// import RomanianMessages from './i18n/ro.json';
// import { ISSUE_STATUSES } from 'models/enums/IssueStatuses';
// import { translate } from 'services/intlService';
// import { getItemFromStore } from 'helpers/utils';
// import { settings } from 'config';

// export const GAP_SIZE = 10;

// export const DISPLAY_SUBJECT_MAX_LEN = 50; //for displaying
// export const DISPLAY_PROJECT_TITLE_MAX_LEN = 70; //for displaying
// export const INPUT_DESC_MAX_LEN = 100; //form input validation
// export const INPUT_SUBJECT_MAX_LEN = 100; //form input validation
// export const INPUT_COMMENT_MAX_LEN = 100;
// export const INPUT_NOTES_MAX_LEN = 100;

// export const languages = {
//   en: EnglishMessages,
//   ro: RomanianMessages
// };

// export const RATIO_ARRAY = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// export const NO_OF_PROJ_ARR = [1,2,3,4,5]//[7,8,9,10,11,12,13,14,15];

// export const getBadgeColor = status => {
//   switch (status) {
//     case 'New':
//       return `info`; //${getItemFromStore('isDark', settings.isDark)? `dark-new` : `light-new`}
//     case 'In Progress':
//       return `${
//         getItemFromStore('isDark', settings.isDark)
//           ? 'dark-inProgress'
//           : 'light-inProgress'
//       }`;
//     case 'On Hold':
//       return `${
//         getItemFromStore('isDark', settings.isDark)
//           ? 'dark-onHold'
//           : 'light-onHold'
//       }`;
//     case 'Resolved':
//       return `success`; //${getItemFromStore('isDark', settings.isDark)? 'dark-resolved': 'light-resolved'}
//   }
// };
// export const deepClone = obj => JSON.parse(JSON.stringify(obj));

// export const getItemLabel = trackerId => {
//   switch (trackerId) {
//     case ISSUE_TRACKERS.BUG:
//       return { type: 'danger', id: 'issue.label.bug' };
//     case ISSUE_TRACKERS.FEATURE:
//       return { type: 'info', id: 'issue.label.feature' };
//     case ISSUE_TRACKERS.SUPPORT:
//       return { type: 'secondary', id: 'issue.label.support' };
//     case ISSUE_TRACKERS.MEETING:
//       return { type: 'warning', id: 'issue.label.meeting' };
//     case ISSUE_TRACKERS.PLANNING:
//       return { type: 'dark', id: 'issue.label.planning' };
//     case ISSUE_TRACKERS.USER_STORY:
//       return { type: 'success', id: 'issue.label.userStory' };
//     case ISSUE_TRACKERS.USER_STORY_CLOSED:
//       return { type: 'dark', id: 'issue.label.userStoryClosed' };
//     case ISSUE_TRACKERS.TEST_CREATE:
//       return { type: 'primary', id: 'issue.label.testCreate' };
//     case ISSUE_TRACKERS.TEST_ANALYSIS:
//       return { type: 'success', id: 'issue.label.testAnalysis' };
//     // case ISSUE_TRACKERS.EPIC:
//     //   return {type: 'light', id: 'issue.label.epic'};
//     case ISSUE_TRACKERS.CODE_REVIEW:
//       return { type: 'info', id: 'issue.label.codeReview' };
//     default:
//       return { type: 'primary', id: 'issue.label.task' };
//   }
// };

// export const getStatusTranslation = status => {
//   switch (status) {
//     case 'New':
//       return 'issue.status.new';
//     case 'In Progress':
//       return 'issue.status.inProgress';
//     case 'On Hold':
//       return 'issue.status.onHold';
//     case 'Resolved':
//       return 'issue.status.resolved';
//     case 'User Stories':
//       return 'issue.status.userStories';
//   }
// };

// export const getTrackerColor = key => {
//   switch (key) {
//     case 'BUG':
//       return 'danger';
//     case 'FEATURE':
//       return 'info';
//     case 'SUPPORT':
//       return 'secondary';
//     case 'MEETING':
//       return 'warning';
//     case 'PLANNING':
//       return 'dark';
//     case 'TEST_CREATE':
//       return 'primary';
//     case 'TEST_ANALYSIS':
//       return 'success';
//     case 'EPIC':
//       return 'light';
//     case 'CODE_REVIEW':
//       return 'info';
//   }
// };

// export const TEMP_USERS = [
//   { id: '153', name: 'Anda Cozminca' },
//   { id: '154', name: 'Octavian Simionescu' },
//   { id: '149', name: 'Claudiu Rindasu' }
// ];

// export const toCamelCase = inputString => {
//   //used to translate tackers
//   // Split the input string by spaces or other non-alphanumeric characters
//   const words = inputString.split(/[^a-zA-Z0-9]+/);
//   // Convert each word to lowercase, except the first one
//   for (let i = 0; i < words.length; i++) {
//     if (i === 0) {
//       words[i] = words[i].toLowerCase();
//     } else {
//       words[i] =
//         words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
//     }
//   }
//   // Join the words and return the camelCase string
//   return words.join('');
// };

// export const fromCamelCaseToWords = camelCaseString => {
//   // Use a regular expression to split the camelCase string
//   const words = camelCaseString.split(/(?=[A-Z])/);
//   // Capitalize the first letter of each word and join them with spaces
//   const textString = words
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
//   return textString;
// };

// export const convertFromRedmineTime = time => {
//   // time comes in miliseconds
//   const hours = Math.floor(time / 3600);
//   const minutes = Math.floor((time % 3600) / 60);


//   return {hours, minutes};
// };

// export const convertToRedmineTime = (hours, minutes) => {
//   const time = `${hours === '' ? 0 : hours}.${
//     minutes === '' ? 0 : (minutes / 60).toString().split('.')[1]
//   }`;

//   return time;
// };

// export const formatDate = (unixTimestamp) => {
//   if (!unixTimestamp) {
//     return 'No date available';
//   }
//   const date = new Date(+unixTimestamp).toLocaleString();
//   return date;
// }
