import EnglishMessages from '../i18n/en.json';
import RomanianMessages from '../i18n/ro.json';

export const GAP_SIZE = 1;

export const INPUT_COMMENT_MAX_LEN = 1000;
export const INPUT_DESC_MAX_LEN = 1000;
export const INPUT_NOTES_MAX_LEN = 1000;
export const INPUT_SUBJECT_MAX_LEN = 1000;
export const DISPLAY_PROJECT_TITLE_MAX_LEN = 50;
export const DISPLAY_SUBJECT_MAX_LEN = 50;

export const languages = {
  en: EnglishMessages,
  ro: RomanianMessages
};

export const RATIO_ARRAY = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export const ITEMS_PER_PAGE_ARRAY = [5,10,15,20,25,50,100]//[7,8,9,10,11,12,13,14,15];

export const TEMP_USERS = [
    { id: '153', name: 'Anda Cozminca' },
    { id: '154', name: 'Octavian Simionescu' },
    { id: '149', name: 'Claudiu Rindasu' }
];

export const noWhiteSpaceRegex = /\S/;