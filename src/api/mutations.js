import { gql } from '@apollo/client';

export const CREATE_UUID = `
  mutation createUUID($userData: String!) {
    createUUID(userData: $userData) {
      uuid
    }
  }
`;

export const CREATE_DEVICE = `
mutation createDevice($deviceInfo: String!) {
  createDevice(deviceInfo: $deviceInfo) {
    uuid,
    id
  }
}
`;

export const CREATE_ISSUE = `
  mutation createIssue($issue: String!, $assignments: String!) {
    createIssue(issue: $issue, assignments: $assignments) {
      status
      message
    }
  }
`;

export const DELETE_ISSUE = `
  mutation deleteIssue($issueId: String!) {
    deleteIssue(issueId: $issueId) {
      status
      message
    }
  }
`;

export const CREATE_PROJECT = `
  mutation CreateProject($project: String!, $members: String!) {
    createProject(project: $project, members: $members) {
      status
      message
    }
  }
`;

export const UPDATE_PROJECT = `
  mutation UpdateProject($project: String!, $members: String!) {
    updateProject(project: $project, members: $members) {
      status
      message
    }
  }
`;

export const DELETE_PROJECT = `
  mutation DeleteProject($projectId: String!) {
    deleteProject(projectId: $projectId) {
      status
      message
    }
  }
`;

export const CREATE_FOCUS_PERIOD = `
  mutation createFocusPeriod($focusPeriod: String!) {
    createFocusPeriod(focusPeriod: $focusPeriod) {
      status
      message
    }
  }
`;

export const CREATE_GROUP = `
  mutation createGroup($group: String!, $selectedUsers: [String!]) {
    createGroup(group: $group, selectedUsers: $selectedUsers) {
      status
      message
    }
  }
`;

export const UPDATE_GROUP = `
  mutation updateGroup($group: String!, $userId: String!) {
    updateGroup(group: $group, userId: $userId) {
      status
      message
    }
  }
`;

export const DELETE_GROUP = `
  mutation deleteGroup($groupId: String!) {
    deleteGroup(groupId: $groupId) {
      status
      message
    }
  }
`;

export const UPDATE_ISSUE = `
mutation updateIssue($issue: String!, $assignments: String!) {
  updateIssue(issue: $issue, assignments: $assignments) {
    status
    message
  }
}
`;

export const UPDATE_ISSUE_STATUS = `
mutation updateIssueStatus($issueId: String!, $statusId: String!, $userId: String!) {
  updateIssueStatus(issueId: $issueId, statusId: $statusId, userId: $userId) {
    status
    message
    update
    issue {
      id
      data_source_id
      external_id
      project_id
      sprint_id
      status_id
      parent_id
      spent_time
      estimated_time
      done_ratio
      subject
      metadata {
        assigned_to {
          id
        }
      }
      description
      created_on
      updated_on
      issue_type_id
      position
      createdAt
      updatedAt
    }
  }
}
`;

export const UPDATE_ISSUE_POSITION = `
mutation updateIssuePosition($issueId: String!, $position: Float!) {
  updateIssuePosition(issueId: $issueId, position: $position) {
    status
    message
  }
}
`;

export const UPDATE_STORY_POSITION = `
mutation updateStoryPosition($storyId: String!, $position: Float!) {
  updateStoryPosition(storyId: $storyId, position: $position) {
    status
    message
  }
}
`;

export const UPDATE_FOCUS_PERIOD = `
mutation updateFocusPeriod($focusPeriod: String!) {
  updateFocusPeriod(focusPeriod: $focusPeriod) {
    status
    message
  }
}
`;

export const DELETE_FOCUS_PERIOD = `
  mutation DeleteFocusPeriod($focusPeriodId: String!) {
    deleteFocusPeriod(focusPeriodId: $focusPeriodId) {
      status
      message
    }
  }
`;

export const CREATE_SPRINT = `
mutation CreateSprint($sprint: String!) {
  createSprint(sprint: $sprint) {
    status
    message
  }
}
`;

export const UPDATE_SPRINT = `
mutation UpdateSprint($sprint: String!) {
  updateSprint(sprint: $sprint) {
    status
    message
  }
}
`;

export const DELETE_SPRINT = `
mutation DeleteSprint($sprintId: String!) {
  deleteSprint(sprintId: $sprintId) {
    status
    message
  }
}
`;
