import { createSlice } from '@reduxjs/toolkit';
import { HttpStatusCodes } from 'api/utils';
import { ITEMS_PER_PAGE_ARRAY } from 'models/Constants';
import { toast } from 'react-toastify';
import { translate } from 'services/intlService';

const initialState = {
  projects: {},
  previousStoriesStack: [],
  previousIssuesStack: [],
  projectsScrollCompleted: false,
  activeProject: null,
  update: false,
  projectsPerPage: ITEMS_PER_PAGE_ARRAY[0],
  loading: false,
  error: null
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjectsPerPage: {
      reducer: (state, action) => {
        state.projectsPerPage = action.payload;
      }
    },
    setProjectsScrollCompleted: {
      reducer: (state, action) => {
        state.projectsScrollCompleted = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setLoadingProjects: {
      reducer: (state, action) => {
        state.loading = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setActiveProject: {
      reducer: (state, action) => {
        state.activeProject = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setUpdateProjects: {
      reducer: (state, action) => {
        state.update = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    getProjectsCommit: {
      reducer: (state, action) => {
        const projects = action.payload.data.getProjects;
        if (!projects) {
          state.loading = false;
          return;
        }

        for (let prjct of projects) {
          const { projectId, project } = prjct;

          const newSprints = project.sprints.reduce((acc, sprint) => {
            acc[sprint.id] = sprint;
            return acc;
          }, {});

          const updatedProject = {
            ...project,
            sprints: newSprints
          };

          state.projects[projectId] = {
            ...state.projects[projectId],
            ...updatedProject
          };
        }
        state.loading = false;
      }
    },
    getProjectsRollback: {
      reducer: (state, action) => {
        state.loading = false;
      }
    },

    getProjectCommit: {
      reducer: (state, action) => {
        const project = action.payload?.data?.getProject;
        if (!project) {
          state.loading = false;
          return;
        }
        const { id, stories, sprints } = project;
        // Transform stories array to an object keyed by storyId
        const storiesObject = stories.reduce((acc, { storyId, story }) => {
          // Transform issues array to an object keyed by issueId
          const issuesObject = story.issues.reduce(
            (issuesAcc, { issueId, issue }) => {
              issuesAcc[issueId] = issue;
              return issuesAcc;
            },
            {}
          );

          acc[storyId] = {
            ...story,
            issues: issuesObject || {}
          };

          return acc;
        }, {});

        const newSprints = sprints.reduce((acc, sprint) => {
          acc[sprint.id] = sprint;
          return acc;
        }, {});

        // Update the state with the transformed project data
        const updatedProject = {
          ...state.projects[id],
          ...project,
          sprints: newSprints,
          stories: storiesObject
        };
        state.projects[id] = updatedProject;

        for (let sprint of project.sprints) {
          const sprintId = sprint.id;
          state.projects[id].sprints[sprintId] = sprint;
        }
        // console.log(state.projects[id]);

        state.loading = false;
      }
    },

    getProjectRollback: {
      reducer: (state, action) => {
        state.loading = false;
      }
    },

    createProjectCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.createProject;
        if (
          +status === +HttpStatusCodes.OK ||
          +status === +HttpStatusCodes.CREATED
        ) {
          toast.success(translate('popup.project.create.success'));
        } else {
          toast.error(translate('popup.project.create.fail'));
        }
      }
    },

    createProjectRollback: {
      reducer: (state, action) => {
        toast.error(translate('popup.project.create.fail'));
      }
    },

    deleteProjectLocally: {
      reducer: (state, action) => {
        const projectId = action.payload;
        if (!projectId) return;
        delete state.projects[projectId];
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    updateProjectLocally: {
      reducer: (state, action) => {
        const { projectId, project } = action.payload;
        if (!projectId) return;
        state.projects[projectId] = project;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    deleteProjectCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.deleteProject;
        if (
          +status === +HttpStatusCodes.OK ||
          +status === +HttpStatusCodes.NO_CONTENT
        ) {
          toast.success(translate('popup.project.delete.success'));
        } else {
          toast.error(translate('popup.project.delete.fail'));
        }
      }
    },

    deleteProjectRollback: {
      reducer: (state, action) => {
        toast.error(translate('popup.project.delete.fail'));
      }
    },

    updateProjectCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.updateProject;
        if (+status === +HttpStatusCodes.OK) {
          toast.success(translate('popup.project.update.success'));
        } else {
          toast.error(translate('popup.project.update.fail'));
        }
      }
    },

    updateProjectRollback: {
      reducer: (state, action) => {
        toast.error(translate('popup.project.update.fail'));
      }
    },

    setPreviousStories: {
      reducer: (state, action) => {
        state.previousStoriesStack.push(action.payload);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    setPreviousIssues: {
      reducer: (state, action) => {
        state.previousIssuesStack.push(action.payload);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    updateIssueLocally: {
      reducer: (state, action) => {
        const issue = action.payload;
        const { project_id, parent_id, id } = issue;
        if (
          !project_id ||
          !parent_id ||
          !state.projects[project_id] ||
          !state.projects[project_id].stories
        )
          return;
        state.projects[project_id].stories[parent_id].issues[id] = issue;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    updateIssueCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.updateIssue;
        if (
          +status === +HttpStatusCodes.OK ||
          +status === +HttpStatusCodes.CREATED ||
          +status === +HttpStatusCodes.NO_CONTENT
        ) {
          state.previousIssuesStack = [];
          toast.success(translate('popup.issue.update.success'));
        } else {
          if (state.previousIssuesStack.length > 0) {
            const previousIssues = state.previousIssuesStack.pop();
            if (previousIssues && Object.values(previousIssues).length > 0) {
              const projectId = Object.values(previousIssues)[0]?.project_id;
              const parentId = Object.values(previousIssues)[0]?.parent_id;
              if (!projectId || !parentId) return;
              state.projects[projectId].stories[parentId].issues =
                previousIssues;
            }
          }
          toast.error(translate('popup.issue.update.fail'));
        }
      }
    },

    updateIssueRollback: {
      reducer: (state, action) => {
        if (state.previousIssuesStack.length > 0) {
          const previousIssues = state.previousIssuesStack.pop();
          if (previousIssues && Object.values(previousIssues).length > 0) {
            const projectId = Object.values(previousIssues)[0]?.project_id;
            const parentId = Object.values(previousIssues)[0]?.parent_id;
            if (!projectId || !parentId) return;
            state.projects[projectId].stories[parentId].issues = previousIssues;
          }
        }
        toast.error(translate('popup.issue.update.fail'));
      }
    },

    createIssueCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.createIssue;
        if (
          +status === +HttpStatusCodes.OK ||
          +status === +HttpStatusCodes.CREATED
        ) {
          toast.success(translate('popup.issue.create.success'));
        } else {
          toast.error(message);
          toast.error(translate('popup.issue.create.fail'));
        }
      }
    },

    createIssueRollback: {
      reducer: (state, action) => {
        toast.error(translate('popup.issue.create.fail'));
      }
    },

    deleteIssueCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.deleteIssue;
        if (
          +status === +HttpStatusCodes.OK ||
          +status === +HttpStatusCodes.NO_CONTENT
        ) {
          state.previousIssuesStack = [];
          toast.success(translate('popup.issue.delete.success'));
        } else {
          if (state.previousIssuesStack.length > 0) {
            const previousIssues = state.previousIssuesStack.pop();
            if (previousIssues && Object.values(previousIssues).length > 0) {
              const projectId = Object.values(previousIssues)[0]?.project_id;
              const parentId = Object.values(previousIssues)[0]?.parent_id;
              if (!projectId || !parentId) return;
              state.projects[projectId].stories[parentId].issues =
                previousIssues;
            }
          }
          toast.error(message);
          toast.error(translate('popup.issue.delete.fail'));
        }
      }
    },

    deleteIssueRollback: {
      reducer: (state, action) => {
        if (state.previousIssuesStack.length > 0) {
          const previousIssues = state.previousIssuesStack.pop();
          if (previousIssues && Object.values(previousIssues).length > 0) {
            const projectId = Object.values(previousIssues)[0]?.project_id;
            const parentId = Object.values(previousIssues)[0]?.parent_id;
            if (!projectId || !parentId) return;
            state.projects[projectId].stories[parentId].issues = previousIssues;
          }
        }
        toast.error(translate('popup.issue.delete.fail'));
      }
    },

    deleteIssueLocally: {
      reducer: (state, action) => {
        const issue = action.payload;
        const { project_id, parent_id, id } = issue;
        const issues = state.projects[project_id]?.stories[parent_id];

        if (issues) {
          delete issues[id];
        }
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    updateStoryPositionCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.updateIssuePosition;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousStoriesStack = [];
        } else {
          if (state.previousStoriesStack.length > 0) {
            const previousStories = state.previousStoriesStack.pop();
            if (previousStories && Object.values(previousStories).length > 0) {
              const projectId = Object.values(previousStories)[0]?.project_id;
              if (!projectId) return;
              state.projects[projectId].stories = previousStories;
            }
          }
        }
      }
    },

    updateStoryPositionRollback: {
      reducer: (state, action) => {
        if (state.previousStoriesStack.length > 0) {
          const previousStories = state.previousStoriesStack.pop();
          if (previousStories && Object.values(previousStories).length > 0) {
            const projectId = Object.values(previousStories)[0]?.project_id;
            if (!projectId) return;
            state.projects[projectId].stories = previousStories;
          }
        }
        toast.error(translate('popup.story.position.fail'));
      }
    },

    updateIssuePositionCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.updateIssuePosition;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousIssuesStack = [];
        } else if (status === HttpStatusCodes.BAD_REQUEST) {
          if (state.previousIssuesStack.length > 0) {
            const previousIssues = state.previousIssuesStack.pop();
            if (previousIssues && Object.values(previousIssues).length > 0) {
              const projectId = Object.values(previousIssues)[0]?.project_id;
              const parentId = Object.values(previousIssues)[0]?.parent_id;
              if (!projectId || !parentId) return;
              state.projects[projectId].stories[parentId].issues =
                previousIssues;
            }
          }
          toast.error(translate('popup.issue.position.fail'));
        }
        // console.log(action);
      }
    },

    updateIssuePositionRollback: {
      reducer: (state, action) => {
        if (state.previousIssuesStack.length > 0) {
          const previousIssues = state.previousIssuesStack.pop();
          if (previousIssues && Object.values(previousIssues).length > 0) {
            const projectId = Object.values(previousIssues)[0]?.project_id;
            const parentId = Object.values(previousIssues)[0]?.parent_id;
            if (!projectId || !parentId) return;
            state.projects[projectId].stories[parentId].issues = previousIssues;
          }
        }
        toast.error(translate('popup.issue.position.fail'));
      }
    },

    updateIssuePositionLocally: {
      reducer: (state, action) => {
        const { issueId, storyId, newPosition } = action.payload;
        const issue =
          state.projects[state.activeProject?.id]?.stories[storyId]?.issues[
            issueId
          ];
        if (issue) {
          issue.position = newPosition;
        }
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    updateStoryPositionLocally: {
      reducer: (state, action) => {
        const { storyId, newPosition } = action.payload;
        const story = state.projects[state.activeProject?.id]?.stories[storyId];
        if (story) {
          story.position = newPosition;
        }
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    }
  }
});

export const {
  setActiveProject,
  setUpdateProjects,
  setLoadingProjects,
  updateStoryPositionLocally,
  updateIssuePositionLocally,
  deleteProjectLocally,
  updateProjectLocally,
  deleteIssueLocally,
  setPreviousStories,
  updateIssueLocally,
  setProjectsScrollCompleted,
  setProjectsPerPage,
  setPreviousIssues
} = projectsSlice.actions;

export default projectsSlice.reducer;
