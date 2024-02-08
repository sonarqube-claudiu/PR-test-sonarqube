// queries.js
import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($uuid: String!) {
    user(uuid: $uuid) {
      uuid
      first_name
      last_name
    }
  }
`;

export const GET_ALL_USERS = `
  query GetAllUsers($userId: String!) {
    getAllUsers(userId: $userId) {
      id
      display_name
    }
  }
`;

export const GET_GROUPS = `
  query GetGroups($userId: String!) {
    getGroups(userId: $userId) {
      status
      message
      groups {
        id
        name
        description
        focusperiod_id
        group_members {
          id
          user_id
          group_id
          user {
            id
            display_name
          }
        }
      }
    }
  }
`;

export const GET_DEVICE = `
  query GetUser($uuid: String!) {
    device(uuid: $uuid) {
      uuid
    }
  }
`;

export const LOGIN_QUERY = `
  query Login($email: String!) {
    login(email: $email) {
      status
      message
      user {
        id
        display_name
        username
      }
      token
    }
  }
`;

export const GET_PROJECTS = `
  query GetProjects($startDate: String!, $endDate: String!, $userId: String!) {
    getProjects(startDate: $startDate, endDate: $endDate, userId: $userId) {
      projectId
      project {
        id
        data_source_id
        external_id
        name
        description
        sprints {
          id
          start_date
          end_date
          name
          description
          project_id
        }
        metadata {
          stories
          issues {
            NEW
            IN_PROGRESS
            ON_HOLD
            RESOLVED
          }
        }
        created_on
        updated_on
        members {
          user {
            id
            display_name
          }
        }
      }
    }
  }
`;

export const GET_PROJECT = `
  query GetProject($startDate: String!, $endDate: String!, $userId: String!, $projectId: String!) {
    getProject(startDate: $startDate, endDate: $endDate, userId: $userId, projectId: $projectId) {
      id
      data_source_id
      external_id
      name
      description
      sprints {
        id
        start_date
        end_date
        name
        description
        project_id
      }
      metadata {
        stories
        issues {
          NEW
          IN_PROGRESS
          ON_HOLD
          RESOLVED
        }
      }
      created_on
      updated_on
      members {
        user {
          id
          display_name
        }
      }
      stories {
        storyId
        story {
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
          journals {
            notes
            created_on
            details {
              property
              prop_key
              old_value
              value
            }
          }
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
          assignments {
            user_id
            issue_id
            user {
              id
              display_name
            }
          }
          issues {
            issueId
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
              assignments {
                user_id
                issue_id
                user {
                  id
                  display_name
                }
              }
              journals {
                notes
                created_on
                details {
                  property
                  prop_key
                  old_value
                  value
                }
              }
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
      }
    }
  }
`;

export const GET_ISSUES = `
  query GetIssues($startDate: String!, $endDate: String!, $storyId: String!) {
    getIssues(startDate: $startDate, endDate: $endDate, storyId: $storyId) {
      storyId
      issues {
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
        journals {
          notes
          created_on
          details {
            property
            prop_key
            old_value
            value
          }
        }
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

export const GET_FOCUS_PERIOD = `
  query GetFocusPeriod {
    getFocusPeriod {
      id
      title
      description
      start_date
      end_date
    }
  }
`;

export const GET_ALL_FOCUS_PERIODS = `
  query GetAllFocusPeriods {
    getAllFocusPeriods {
      id
      title
      description
      start_date
      end_date
    }
  }`;

export const GET_SPRINTS = `
  query GetSprints($projectId: String!) {
    getSprints(projectId: $projectId) {
      status
      message
      sprints {
        id
        name
        description
        start_date
        end_date
        project_id
      }
    }
  }
`;

export const GET_STORIES = `
query GetStories($startDate: String!, $endDate: String!, $projectId: String!) {
  getStories(startDate: $startDate, endDate: $endDate, projectId: $projectId) {
    projectId
    stories {
      id
      data_source_id
      external_id
      project_id
      sprint_id
      status_id
      parent_id
      subject
      spent_time
      estimated_time
      done_ratio
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

export const GET_ACTIVE_ISSUE = `
  query GetActiveIssue($userId: String!, $startDate: String!, $endDate: String!) {
    getActiveIssue(userId: $userId, startDate: $startDate, endDate: $endDate) {
      status
      message
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
        assignments {
          user_id
          issue_id
          user {
            id
            display_name
          }
        }
        journals {
          notes
          created_on
          details {
            property
            prop_key
            old_value
            value
          }
        }
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

export const GET_ISSUE_JOURNALS = `
  query GetIssueJournals($issueId: String!) {
    getIssueJournals(issueId: $issueId) {
      status
      message
      journals {
        journalized_id
        notes
        created_on
        activity {
          type
        }
        details {
          property
          prop_key
          old_value
          value
        }
      }
    }
  }
`;

export const GET_PROJECT_JOURNALS = `
  query GetProjectJournals($projectId: String!) {
    getProjectJournals(projectId: $projectId) {
      status
      message
      journals {
        journalized_id
        notes
        created_on
        activity {
          type
        }
        details {
          property
          prop_key
          old_value
          value
        }
      }
    }
  }
`;
