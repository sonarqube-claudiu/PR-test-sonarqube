import { getItemFromStore } from 'helpers/utils';
import { ISSUE_TRACKER } from './enums/IssueTrackers';
import { settings } from 'config';
import { GAP_SIZE } from './Constants';
import { translate } from 'services/intlService';
import { ISSUE_STATUS } from './enums/IssueStatuses';
import { JORUNAL_ACTIVITY_TYPE } from './enums/JournalActivityType';

export class Utils {
  static isEqual(value1, value2) {
    return value1 === value2;
  }

  static isEmptyString(value) {
    return value === null || value === undefined || value === '';
  }

  static sortAsc(a, b) {
    return a - b;
  }

  static sortDesc(a, b) {
    return b - a;
  }

  static formatDate = unixTimestamp => {
    if (!unixTimestamp) {
      return 'No date available';
    }
    const date = new Date(+unixTimestamp).toLocaleString();
    return date;
  };

  static formatDateToYYYYMMDD = (originalDate, format) => {
    const date = new Date(originalDate); //in case originalDate is a string
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1

    const day = String(date.getDate()).padStart(2, '0');

    switch (format) {
      case 'yyyymmdd':
        return `${year}-${month}-${day}`;
      case 'ddmmyyyy':
        return `${day}-${month}-${year}`;
      case 'mmddyyyy':
        return `${month}-${day}-${year}`;
      default:
        return `${year}-${month}-${day}`;
    }
  };

  static getTimeLeftInWeeksAndDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysLeft = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(daysLeft / 7);
    const days = daysLeft % 7;
    return { weeks, days };
  }

  static getStatusTranslation(status) {
    switch (status) {
      case 'NEW':
        return 'issue.status.new';
      case 'IN_PROGRESS':
        return 'issue.status.inProgress';
      case 'ON_HOLD':
        return 'issue.status.onHold';
      case 'RESOLVED':
        return 'issue.status.resolved';
      case 'User Stories':
        return 'issue.status.userStories';
      default:
        return 'issue.status.null';
    }
  }

  static getTrackerColor(key) {
    switch (key) {
      case 'BUG':
        return 'danger';
      case 'FEATURE':
        return 'info';
      case 'SUPPORT':
        return 'secondary';
      case 'MEETING':
        return 'warning';
      case 'PLANNING':
        return 'dark';
      case 'TEST_CREATE':
        return 'primary';
      case 'TEST_ANALYSIS':
        return 'success';
      case 'EPIC':
        return 'light';
      case 'CODE_REVIEW':
        return 'info';
      default:
        return 'primary';
    }
  }

  static getStatusColor(status) {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'IN_PROGRESS':
        return 'dark-inProgress';
      case 'ON_HOLD':
        return 'dark-onHold';
      case 'RESOLVED':
        return 'dark-resolved';
      default:
        return 'primary';
    }
  }

  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static getItemLabel(trackerId) {
    switch (trackerId) {
      case ISSUE_TRACKER.BUG:
        return { type: 'danger', id: 'issue.label.bug' };
      case ISSUE_TRACKER.FEATURE:
        return { type: 'info', id: 'issue.label.feature' };
      case ISSUE_TRACKER.SUPPORT:
        return { type: 'secondary', id: 'issue.label.support' };
      case ISSUE_TRACKER.MEETING:
        return { type: 'warning', id: 'issue.label.meeting' };
      case ISSUE_TRACKER.PLANNING:
        return { type: 'dark', id: 'issue.label.planning' };
      case ISSUE_TRACKER.USER_STORY:
        return { type: 'success', id: 'issue.label.userStory' };
      case ISSUE_TRACKER.USER_STORY_CLOSED:
        return { type: 'dark', id: 'issue.label.userStoryClosed' };
      case ISSUE_TRACKER.TEST_CREATE:
        return { type: 'primary', id: 'issue.label.testCreate' };
      case ISSUE_TRACKER.TEST_ANALYSIS:
        return { type: 'success', id: 'issue.label.testAnalysis' };
      // case ISSUE_TRACKERS.EPIC:
      //   return {type: 'light', id: 'issue.label.epic'};
      case ISSUE_TRACKER.CODE_REVIEW:
        return { type: 'info', id: 'issue.label.codeReview' };
      default:
        return { type: 'primary', id: 'issue.label.task' };
    }
  }

  static getBadgeColor(status) {
    switch (status) {
      case 'NEW':
        return `info`; //${getItemFromStore('isDark', settings.isDark)? `dark-new` : `light-new`}
      case 'IN_PROGRESS':
        return `${
          getItemFromStore('isDark', settings.isDark)
            ? 'dark-inProgress'
            : 'light-inProgress'
        }`;
      case 'ON_HOLD':
        return `${
          getItemFromStore('isDark', settings.isDark)
            ? 'dark-onHold'
            : 'light-onHold'
        }`;
      case 'RESOLVED':
        return `success`; //${getItemFromStore('isDark', settings.isDark)? 'dark-resolved': 'light-resolved'}
    }
  }

  static getJournalActivityTranslation(activity) {
    switch (activity) {
      case JORUNAL_ACTIVITY_TYPE.CREATE_ISSUE:
        return { id: 'history.created', icon: 'plus' };
      case JORUNAL_ACTIVITY_TYPE.UPDATE_ISSUE:
        return { id: 'history.updated', icon: 'edit' };
      case JORUNAL_ACTIVITY_TYPE.ISSUE_STATUS_UPDATE:
        return { id: 'history.statusChanged', icon: 'tag' };
      case JORUNAL_ACTIVITY_TYPE.ISSUE_ASSIGNMENT_UPDATE:
        return { id: 'history.asigneeChanged', icon: 'user' };
      case JORUNAL_ACTIVITY_TYPE.ISSUE_ESTIMATED_HOURS_UPDATE:
        return {
          id: 'history.estimatedTimeChanged',
          icon: ['far', 'clock']
        };
      case JORUNAL_ACTIVITY_TYPE.ISSUE_TRACKER_UPDATE:
        return { id: 'history.trackerChanged', icon: 'tag' };
      case JORUNAL_ACTIVITY_TYPE.ISSUE_SUBJECT_UPDATE:
        return { id: 'history.subjectChanged', icon: 'comment' };
      case JORUNAL_ACTIVITY_TYPE.ISSUE_DESCRIPTION_UPDATE:
        return {
          id: 'history.descriptionChanged',
          icon: 'align-left'
        };
      case JORUNAL_ACTIVITY_TYPE.ISSUE_DONE_RATIO_UPDATE:
        return {
          id: 'history.doneRatioChanged',
          icon: 'percentage'
        };
      case JORUNAL_ACTIVITY_TYPE.CREATE_PROJECT:
        return { id: 'history.created', icon: 'plus' };
      case JORUNAL_ACTIVITY_TYPE.UPDATE_PROJECT:
        return { id: 'history.updated', icon: 'edit' };
      case JORUNAL_ACTIVITY_TYPE.PROJECT_NAME_UPDATE:
        return { id: 'history.nameChanged', icon: 'comment' };
      case JORUNAL_ACTIVITY_TYPE.PROJECT_DESCRIPTION_UPDATE:
        return {
          id: 'history.descriptionChanged',
          icon: 'align-left'
        };
      case JORUNAL_ACTIVITY_TYPE.PROJECT_MEMBER_UPDATE:
        return { id: 'history.memberUpdate', icon: 'user' };
      default:
        return { id: 'history.updated', icon: 'envelope' };
    }
  }

  static getJournalDetailKeyTranslation(key, property = null) {
    switch (key) {
      case 'assigned_to_id':
        return { icon: 'user', id: 'history.label.assignee' };
      case 'status_id':
        return { icon: 'tag', id: 'history.label.issueStatus' };
      case 'subject':
        return { icon: 'comment', id: 'history.label.subject' };
      case 'name':
        return { icon: 'comment', id: 'history.label.name' };
      case 'description':
        return { icon: 'align-left', id: 'history.label.description' };
      case 'estimated_time':
        return {
          icon: ['far', 'clock'],
          id: 'history.label.estimatedTime'
        };
      case 'done_ratio':
        return { icon: 'percentage', id: 'history.label.doneRatio' };
      case 'issue_type_id':
        return { icon: 'tag', id: 'history.label.tracker' };
      case 'author_id':
        return { icon: 'user', id: 'history.label.author' };
      case 'created':
        return { icon: 'plus', id: 'history.label.created' };
      case 'member':
        return {
          icon: 'user',
          id:
            property === 'create'
              ? 'history.label.memberAdded'
              : 'history.label.memberRemoved'
        };
      case 'assignment':
        return {
          icon: 'user',
          id:
            property === 'create'
              ? 'history.label.assigneeAdded'
              : 'history.label.assigneeRemoved'
        };
      default:
        return { icon: 'envelope', id: 'history.label.notes' };
    }
  }

  static getJournalDetailKeyValueTranslation(key, old_value, new_value) {
    switch (key) {
      case 'assigned_to_id':
        return {
          old_value: old_value && old_value !== '' ? old_value : 'null',
          new_value: new_value && new_value !== '' ? new_value : 'null',
          old_value_color: 'primary',
          new_value_color: 'primary'
        };
      case 'status_id': {
        const oldStatus = Object.entries(ISSUE_STATUS).find(
          ([key, value]) => +value === +old_value
        );
        const newStatus = Object.entries(ISSUE_STATUS).find(
          ([key, value]) => +value === +new_value
        );
        return {
          old_value: translate(
            this.getStatusTranslation(oldStatus ? oldStatus[0] : 'null')
          ),
          new_value: translate(
            this.getStatusTranslation(newStatus ? newStatus[0] : 'null')
          ),
          old_value_color: this.getBadgeColor(
            oldStatus ? oldStatus[0] : 'null'
          ),
          new_value_color: this.getBadgeColor(newStatus ? newStatus[0] : 'null')
        };
      }
      case 'issue_type_id': {
        const oldTracker = Object.entries(ISSUE_TRACKER).find(
          ([key, value]) => +value === +old_value
        );
        const newTracker = Object.entries(ISSUE_TRACKER).find(
          ([key, value]) => +value === +new_value
        );
        const oldTrackerLabel = this.getItemLabel(
          oldTracker ? oldTracker[1] : null
        );
        const newTrackerLabel = this.getItemLabel(
          newTracker ? newTracker[1] : null
        );
        return {
          old_value: oldTrackerLabel ? translate(oldTrackerLabel.id) : 'null',
          new_value: newTrackerLabel ? translate(newTrackerLabel.id) : 'null',
          old_value_color: oldTrackerLabel ? oldTrackerLabel.type : 'primary',
          new_value_color: newTrackerLabel ? newTrackerLabel.type : 'primary'
        };
      }
      case 'subject':
        return {
          old_value: old_value && old_value !== '' ? old_value : 'null',
          new_value: new_value && new_value !== '' ? new_value : 'null',
          old_value_color: 'primary',
          new_value_color: 'primary'
        };
      case 'description':
        return {
          old_value: old_value && old_value !== '' ? old_value : 'null',
          new_value: new_value && new_value !== '' ? new_value : 'null',
          old_value_color: 'primary',
          new_value_color: 'primary'
        };
      case 'estimated_time': {
        const { hours: oldHours, minutes: oldMinutes } =
          this.convertToHoursAndMinutes(
            old_value && old_value !== '' ? +old_value : 0
          );
        const { hours: newHours, minutes: newMinutes } =
          this.convertToHoursAndMinutes(
            new_value && new_value !== '' ? +new_value : 0
          );
        return {
          old_value: `${oldHours && oldHours > 0 ? oldHours + 'h' : '0h'} ${
            oldMinutes && oldMinutes > 0 ? oldMinutes + 'm' : '0m'
          }`,
          new_value: `${newHours && newHours > 0 ? newHours + 'h' : '0h'} ${
            newMinutes && newMinutes > 0 ? newMinutes + 'm' : '0m'
          }`,
          old_value_color: 'primary',
          new_value_color: 'primary'
        };
      }
      case 'done_ratio':
        return {
          old_value: old_value && old_value !== '' ? old_value : 'null',
          new_value: new_value && new_value !== '' ? new_value : 'null',
          old_value_color: 'primary',
          new_value_color: 'primary'
        };
      default:
        return {
          old_value: old_value && old_value !== '' ? old_value : 'null',
          new_value: new_value && new_value !== '' ? new_value : 'null',
          old_value_color: 'primary',
          new_value_color: 'primary'
        };
    }
  }

  static toCamelCase(inputString) {
    //used to translate tackers
    // Split the input string by spaces or other non-alphanumeric characters
    const words = inputString.split(/[^a-zA-Z0-9]+/);
    // Convert each word to lowercase, except the first one
    for (let i = 0; i < words.length; i++) {
      if (i === 0) {
        words[i] = words[i].toLowerCase();
      } else {
        words[i] =
          words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
      }
    }
    // Join the words and return the camelCase string
    return words.join('');
  }

  static fromCamelCaseToWords(camelCaseString) {
    // Use a regular expression to split the camelCase string
    const words = camelCaseString.split(/(?=[A-Z])/);
    // Capitalize the first letter of each word and join them with spaces
    const textString = words.map(word => word.toUpperCase()).join('_');
    return textString;
  }

  static convertToHoursAndMinutes(time) {
    // time comes in miliseconds
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);

    return { hours, minutes: minutes };
  }

  static convertToRedmineTime(hours, minutes) {
    const time = `${hours === '' ? 0 : hours}.${
      minutes === '' ? 0 : (minutes / 60).toString().split('.')[1]
    }`;

    return time;
  }

  static determineNewPositionSameColumn(
    issues,
    originalIndex,
    destinationIndex
  ) {
    // If moved to the beginning
    if (destinationIndex === 0) return issues[0].position - GAP_SIZE;

    // If moved to the end
    if (destinationIndex === issues.length - 1)
      return issues[destinationIndex].position + GAP_SIZE;

    // If moved up
    if (originalIndex > destinationIndex) {
      const upperNeighbor = issues[destinationIndex - 1];
      const current = issues[destinationIndex];
      return (upperNeighbor.position + current.position) / 2;
    }

    // If moved down
    if (originalIndex < destinationIndex) {
      const current = issues[destinationIndex];
      const lowerNeighbor = issues[destinationIndex + 1];
      if (lowerNeighbor) {
        return (current.position + lowerNeighbor.position) / 2;
      } else {
        return current.position + GAP_SIZE;
      }
    }

    // If no move
    return issues[destinationIndex].position;
  }

  static determineNewPositionDifferentColumn(issues, destinationIndex) {
    // If moved to the beginning
    if (!issues.length) return null;

    if (destinationIndex === 0) return issues[0].position - GAP_SIZE;

    // If moved to the end or beyond
    if (destinationIndex >= issues.length)
      return issues[issues.length - 1].position + GAP_SIZE;

    // If moved somewhere in the middle
    const upperNeighbor = issues[destinationIndex - 1];
    const lowerNeighbor = issues[destinationIndex];
    return (upperNeighbor.position + lowerNeighbor.position) / 2;
  }
}
