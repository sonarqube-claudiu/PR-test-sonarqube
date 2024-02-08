import { createIssue } from 'features/issuesThunk';
import {
  INPUT_COMMENT_MAX_LEN,
  INPUT_DESC_MAX_LEN,
  INPUT_NOTES_MAX_LEN,
  INPUT_SUBJECT_MAX_LEN,
  noWhiteSpaceRegex
} from './Constants';
import { ISSUE_STATUS } from './enums/IssueStatuses';
import { ISSUE_TRACKER } from './enums/IssueTrackers';

export class Issue {
  constructor(issue) {
    this.id = issue.id || null;
    this.dataSourceId = issue.data_source_id || null;
    this.externalId = issue.external_id || null;
    this.projectId = issue.project_id || null;
    this.sprintId = issue.sprint_id || null;
    this.statusId = issue.status_id || null;
    this.subject = issue.subject || null;
    this.issueTypeId = issue.issue_type_id || null;
    this.description = issue.description || null;
    this.parentId = issue.parent_id || null;
    this.metadata = issue.metadata || null;
    this.position = issue.position || null;
    this.spentTime = issue.spent_time || null;
    this.estimatedTime = issue.estimated_time || null;
    this.done_ratio = issue.done_ratio || null;
    this.createdOn = issue.createdOn || null;
    this.updatedOn = issue.updatedOn || null;
  }

  save(callback) {
    callback();
  }

  isValid() {
    return (
      Issue.isSubjectValid(this.subject) &&
      Issue.isDescriptionValid(this.description)
    );
  }

  static notUserStory(issue) {
    return +issue?.issue_type_id !== +ISSUE_TRACKER.USER_STORY;
  }

  static isNew(issue) {
    return +issue?.status_id === +ISSUE_STATUS.NEW && Issue.notUserStory(issue);
  }

  static isInProgress(issue) {
    return (
      +issue?.status_id === +ISSUE_STATUS.IN_PROGRESS &&
      Issue.notUserStory(issue)
    );
  }

  static isOnHold(issue) {
    return (
      +issue?.status_id === +ISSUE_STATUS.ON_HOLD && Issue.notUserStory(issue)
    );
  }

  static isResolved(issue) {
    return (
      +issue?.status_id === +ISSUE_STATUS.RESOLVED && Issue.notUserStory(issue)
    );
  }

  static belongsToProject(issue, project) {
    return +issue?.project_id === +project?.id && Issue.notUserStory(issue);
  }

  static belongsToStory(issue, story) {
    return +issue?.parent_id === +story?.id && Issue.notUserStory(issue);
  }

  static isSubjectValid(subject) {
    if (
      subject?.length === 0 ||
      subject?.length > INPUT_SUBJECT_MAX_LEN ||
      !noWhiteSpaceRegex.test(subject)
    ) {
      return false;
    }
    return true;
  }

  static isDescriptionValid(description) {
    if (
      description?.length != 0 &&
      (!noWhiteSpaceRegex.test(description) ||
        description?.length > INPUT_DESC_MAX_LEN)
    ) {
      return false;
    }
    return true;
  }

  static isCommentValid(comment) {
    if (
      comment?.length === 0 ||
      comment?.length > INPUT_COMMENT_MAX_LEN ||
      !noWhiteSpaceRegex.test(comment)
    ) {
      return false;
    }
    return true;
  }

  static isNoteValid(note) {
    if (
      note?.length === 0 ||
      note?.length > INPUT_NOTES_MAX_LEN ||
      !noWhiteSpaceRegex.test(note)
    ) {
      return false;
    }
    return true;
  }
}
