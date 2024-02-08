export const ISSUE_FIELDS = `
  fragment IssueFields on IssueType {
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
`;

export const ISSUE_PAYLOAD = `
  fragment IssuePayload on IssuePayloadType {
    issueId
    issue {
      ...IssueFields
    }
  }
  ${ISSUE_FIELDS}
`;

export const STORY_FIELDS = `
  fragment StoryFields on StoryType {
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
    issues {
      ...IssuePayload
    }
  }
  ${ISSUE_PAYLOAD}
`;

export const STORY_PAYLOAD = `
  fragment StoryPayload on StoryPayloadType {
    storyId
    story {
      ...StoryFields
    }
  }
  ${STORY_FIELDS}
`;