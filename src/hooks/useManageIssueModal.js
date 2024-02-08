import { setIssueToBeUpdated, setMovedIssue } from 'features/issuesSlice';
import {
  createIssue,
  updateIssue,
  updateIssuePosition
} from 'features/issuesThunk';
import {
  setFromCreate,
  setIssueDestination,
  setIssueModalAction,
  setIssueSource,
  setKanbanModalShow,
  setOpenCardStatus,
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import {
  setActiveProject,
  setPreviousIssues,
  updateIssueLocally,
  updateIssuePositionLocally
} from 'features/projectsSlice';
import { setActiveStory } from 'features/storiesSlice';
import { RATIO_ARRAY, TEMP_USERS } from 'models/Constants';
import { Issue } from 'models/Issue';
import { Utils } from 'models/Utils';
import { ISSUE_MODAL_ACTIONS } from 'models/enums/IssueModalActions';
import { ISSUE_ACTIVITY_TYPE } from 'models/enums/IssueActivityType';
import ISSUE_ACTION from 'models/enums/IssueAction';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Story } from 'models/Story';

const issueDispatcher = (state, action) => {
  switch (action.type) {
    case ISSUE_MODAL_ACTIONS.SET_TRACKER:
      return {
        ...state,
        tracker: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_SUBJECT:
      return {
        ...state,
        subject: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_SUBJECT_INVALID:
      return {
        ...state,
        subjectInvalid: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_ASSIGNEE:
      return {
        ...state,
        assignee: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS:
      return {
        ...state,
        issueStatus: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_DESCRIPTION_INVALID:
      return {
        ...state,
        descriptionInvalid: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_ESTIMATED_HOURS:
      return {
        ...state,
        estimatedHours: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_ESTIMATED_MINUTES:
      return {
        ...state,
        estimatedMinutes: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_DONE_RATIO:
      return {
        ...state,
        doneRatio: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_SPENT_HOURS:
      return {
        ...state,
        spentHours: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_SPENT_MINUTES:
      return {
        ...state,
        spentMinutes: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_SPENT_TIME_INVALID:
      return {
        ...state,
        spentTimeInvalid: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_ACTIVITY_TYPE:
      return {
        ...state,
        activityType: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_COMMENT:
      return {
        ...state,
        comment: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_COMMENT_INVALID:
      return {
        ...state,
        commentInvalid: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_NOTES:
      return {
        ...state,
        notes: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_NOTES_INVALID:
      return {
        ...state,
        notesInvalid: action.payload
      };
    case ISSUE_MODAL_ACTIONS.SET_SPRINT:
      return {
        ...state,
        sprint: action.payload
      };
    default:
      return state;
  }
};

const getIssueReducerInitialState = (issueToBeUpdated, project) => {
  return {
    tracker: issueToBeUpdated
      ? Object.entries(ISSUE_TRACKER || []).find(
          ([key, value]) =>
            ISSUE_TRACKER[key] === issueToBeUpdated.issue_type_id
        )
        ? Object.entries(ISSUE_TRACKER || []).find(
            ([key, value]) =>
              ISSUE_TRACKER[key] === issueToBeUpdated.issue_type_id
          )[1]
        : Object.entries(ISSUE_TRACKER || [])[0][1]
      : Object.entries(ISSUE_TRACKER || [])[0][1],
    subject: issueToBeUpdated ? issueToBeUpdated.subject : '',
    subjectInvalid: false,
    assignee:
      issueToBeUpdated && issueToBeUpdated.assignments?.length > 0
        ? issueToBeUpdated.assignments[0]?.user?.display_name
        : project?.members?.length > 0
        ? project?.members[0]?.user?.display_name
        : null,
    sprint:
      issueToBeUpdated &&
      Object.values(issueToBeUpdated?.sprints || [])?.length > 0
        ? Object.values(issueToBeUpdated?.sprints || [])[0]?.name
        : Object.values(project?.sprints || [])?.length > 0
        ? Object.values(project?.sprints || [])[0]?.name
        : null,
    issueStatus: issueToBeUpdated ? issueToBeUpdated.status_id : 1,
    description: issueToBeUpdated ? issueToBeUpdated.description : '',
    descriptionInvalid: false,
    estimatedHours: '',
    estimatedMinutes: '',
    doneRatio: issueToBeUpdated ? `${issueToBeUpdated.done_ratio}%` : '',
    spentHours: '',
    spentMinutes: '',
    spentTimeInvalid: false,
    activityType: Object.keys(ISSUE_ACTIVITY_TYPE)[0],
    comment: '',
    commentInvalid: false,
    notes: '',
    notesInvalid: false
  };
};

export const useManageIssueModal = status => {
  const dispatch = useDispatch();

  const subjectRef = useRef(null);
  const spentTimeRef = useRef(null);
  const commentRef = useRef(null);
  const notesRef = useRef(null);
  const formRef = useRef(null);

  // const members = useSelector(state => state.projects.activeProject.members);
  const issueToBeUpdated = useSelector(state => state.issues.issueToBeUpdated);
  const movedIssue = useSelector(state => state.issues.movedIssue);
  const openCardStatus = useSelector(state => state.modals.openCardStatus);
  const activeIssue = useSelector(state => state.issues.activeIssue);
  const activeStory = useSelector(state => state.stories.activeStory);
  const activeProject = useSelector(state => state.projects.activeProject);
  const kanbanModalShow = useSelector(state => state.modals.kanbanModalShow);
  const issueModalAction = useSelector(state => state.modals.issueModalAction);
  const issueSource = useSelector(state => state.modals.issueSource);
  const issueDestination = useSelector(state => state.modals.issueDestination);
  const fromCreate = useSelector(state => state.modals.fromCreate);
  const token = useSelector(state => state.user.token);
  const userId = useSelector(state => state.user.id);
  const userName = useSelector(state => state.user.displayName);

  const projects = useSelector(state => state.projects.projects);
  const stories = useSelector(
    state => state.projects.projects[activeProject?.id]?.stories
  );

  const issues = stories ? stories[activeStory?.id]?.issues : [];

  const [reducer, dispatchReducer] = useReducer(
    issueDispatcher,
    getIssueReducerInitialState(issueToBeUpdated, activeProject)
  );

  const handleIssueDestination = () => {
    if (kanbanModalShow) {
      if (subjectRef.current) {
        subjectRef.current.focus();
      }
      if (issueToBeUpdated) {
        if (
          issueSource &&
          issueDestination &&
          +issueSource !== +issueDestination
        ) {
          dispatchReducer({
            type: ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS,
            payload: +issueDestination
          });
        } else {
          dispatchReducer({
            type: ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS,
            payload: issueToBeUpdated.status_id
          });
        }
      }
    }
  };

  const handleCalculateSpentTime = () => {
    if (Issue.isInProgress(issueToBeUpdated)) {
      const hours =
        (new Date().getTime() - +issueToBeUpdated?.updatedAt) / (1000 * 3600);
      const minutes = hours > 1 ? (hours % 1) * 60 : hours * 60;
      const formattedHours =
        hours > 1
          ? hours.toString().includes('.')
            ? hours.toString().split('.')[0]
            : hours
          : 0;
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_SPENT_HOURS,
        payload: formattedHours
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_SPENT_MINUTES,
        payload: minutes?.toFixed(0)
      });
    } else {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_SPENT_HOURS,
        payload: ''
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_SPENT_MINUTES,
        payload: ''
      });
    }
  };

  const handleCalculateEstimatedTime = () => {
    if (issueToBeUpdated?.estimated_time) {
      const { hours, minutes } = Utils.convertToHoursAndMinutes(
        issueToBeUpdated?.estimated_time
      );
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_HOURS,
        payload: hours
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_MINUTES,
        payload: minutes
      });
    } else {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_HOURS,
        payload: ''
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_MINUTES,
        payload: ''
      });
    }
  };

  const handleInitialData = () => {
    if (
      issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
      issueModalAction === ISSUE_ACTION.ISSUE_VIEW
    ) {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_TRACKER,
        payload: issueToBeUpdated.issue_type_id
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_SUBJECT,
        payload: issueToBeUpdated.subject
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS,
        payload: issueToBeUpdated.status_id
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ASSIGNEE,
        payload:
          issueToBeUpdated?.assignments?.length > 0
            ? issueToBeUpdated.assignments[0]?.user?.display_name
            : activeProject?.members?.length > 0
            ? activeProject?.members[0]?.user?.display_name
            : null
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_DESCRIPTION,
        payload: issueToBeUpdated.description
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_DONE_RATIO,
        payload: issueToBeUpdated.done_ratio
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_COMMENT,
        payload: ''
      });
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_NOTES,
        payload: ''
      });
    }
  };

  const handleIssueInProgress = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'destination.inProgress.updateIssue.title',
        message: 'destination.inProgress.updateIssue.message',
        onConfirm: () => {
          dispatch(setIssueToBeUpdated(activeIssue));
          dispatch(setIssueModalAction(ISSUE_ACTION.ISSUE_EDIT));
          dispatch(setOpenCardStatus(ISSUE_STATUS.ON_HOLD));
          dispatch(setWarningModalShow(false));
          dispatch(setKanbanModalShow(true));
        },
        onCancel: () => {
          dispatch(
            setOpenWarningModalWith({
              title: 'destination.inProgress.viewIssue.title',
              message: 'destination.inProgress.viewIssue.message',
              onConfirm: () => {
                dispatch(
                  setActiveProject(
                    projects[activeIssue?.project_id] || activeProject
                  )
                );
                dispatch(setWarningModalShow(false));
                dispatch(setKanbanModalShow(false));
              },
              onCancel: () => {
                dispatch(setWarningModalShow(false));
              }
            })
          );
        }
      })
    );
  };

  const handleIssueBackToNew = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'destination.new.updateIssue.title',
        message: 'destination.new.updateIssue.message',
        onConfirm: () => {
          dispatchReducer({
            type: ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS,
            payload: ISSUE_STATUS.NEW
          });
          dispatch(setWarningModalShow(false));
        },
        onCancel: () => {
          dispatch(setWarningModalShow(false));
        }
      })
    );
  };

  const scrollToInvalidElement = () => {
    const invalidElement = formRef.current.querySelector('.is-invalid');
    if (invalidElement) {
      invalidElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  };

  const scrollToFirstElement = () => {
    const firstElement = formRef.current.querySelector('input');
    if (firstElement) {
      firstElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormInvalid()) {
      scrollToInvalidElement();
      return;
    } else if (activeProject) {
      if (issueToBeUpdated) {
        const spent_time =
          +reducer.spentHours * 3600 + +reducer.spentMinutes * 60;
        const estimated_time =
          +reducer.estimatedHours * 3600 + +reducer.estimatedMinutes * 60;
        const assignee = activeProject?.members.find(
          member => member.user.display_name === reducer.assignee
        );
        const assignments = [
          {
            user_id: +assignee?.user?.id
          }
        ];
        // Update issue
        dispatch(setPreviousIssues(Utils.deepClone(issues)));
        if (issueToBeUpdated?.issue_type_id === ISSUE_TRACKER.USER_STORY) {
          dispatch(
            updateIssue(
              {
                ...issueToBeUpdated,
                issue_type_id: +reducer.tracker,
                subject: reducer.subject.trim(),
                description: reducer.description.trim(),
                estimated_time: +estimated_time,
                status_id: Story.hasWorkingIssues(issueToBeUpdated)
                  ? ISSUE_STATUS.IN_PROGRESS
                  : ISSUE_STATUS.NEW
              },
              assignments,
              token
            )
          );
          dispatch(
            updateIssueLocally({
              ...issueToBeUpdated,
              issue_type_id: reducer.tracker,
              subject: reducer.subject.trim(),
              description: reducer.description.trim(),
              estimated_time,
              status_id: Story.hasWorkingIssues(issueToBeUpdated)
                ? ISSUE_STATUS.IN_PROGRESS
                : ISSUE_STATUS.NEW
            })
          );
        } else {
          dispatch(
            updateIssue(
              {
                ...issueToBeUpdated,
                issue_type_id: +reducer.tracker,
                subject: reducer.subject.trim(),
                description: reducer.description.trim(),
                estimated_time: +estimated_time,
                done_ratio: +reducer.doneRatio.split('%')[0],
                status_id: +reducer.issueStatus,
                assignee: +assignee?.user?.id || +userId,
                notes: reducer.notes,
                time_entry: {
                  spent_time,
                  activity_id: +ISSUE_ACTIVITY_TYPE[reducer.activityType],
                  comments: reducer.comment,
                  time: +spent_time,
                  author_id: +userId,
                  user_id: +userId
                }
              },
              assignments,
              token
            )
          );
          dispatch(
            updateIssueLocally({
              ...issueToBeUpdated,
              issue_type_id: reducer.tracker,
              subject: reducer.subject.trim(),
              description: reducer.description.trim(),
              estimated_time,
              status_id: reducer.issueStatus,
              done_ratio: reducer.doneRatio
            })
          );
          // Update issue position
          dispatch(setPreviousIssues(Utils.deepClone(issues)));
          dispatch(
            updateIssuePosition(
              issueToBeUpdated.id,
              issueToBeUpdated.position,
              token
            )
          );
          dispatch(
            updateIssuePositionLocally({
              issueId: issueToBeUpdated.id,
              newPosition: issueToBeUpdated.position
            })
          );
        }

        // Check if the updated issue is not the moved issue(is the in progress one), if it is not, update the moved issue to be in progress
        if (
          issueToBeUpdated?.id !== movedIssue?.id &&
          issueToBeUpdated.issue_type_id !== ISSUE_TRACKER.USER_STORY
        ) {
          dispatch(setPreviousIssues(Utils.deepClone(issues)));
          dispatch(
            updateIssue(
              {
                ...movedIssue,
                status_id: ISSUE_STATUS.IN_PROGRESS
              },
              null,
              token
            )
          );
          dispatch(
            updateIssueLocally({
              ...movedIssue,
              status_id: ISSUE_STATUS.IN_PROGRESS
            })
          );
        }
        handleFormReset(e);

        if (fromCreate) {
          dispatch(setKanbanModalShow(true));
          dispatch(setIssueModalAction(ISSUE_ACTION.ISSUE_CREATE));
          dispatch(setOpenCardStatus(ISSUE_STATUS.IN_PROGRESS));
          dispatch(setFromCreate(false));
        }
      } else {
        const spent_time =
          +reducer.spentHours * 3600 + +reducer.spentMinutes * 60;
        const estimated_time =
          +reducer.estimatedHours * 3600 + +reducer.estimatedMinutes * 60;
        const assignee = activeProject?.members.find(
          member => member.user.display_name === reducer.assignee
        );
        const assignments = [
          {
            user_id: +assignee?.user?.id
          }
        ];
        const sprint_id = Object.values(activeProject?.sprints || []).find(
          sprint => sprint.name === reducer.sprint
        )?.id;
        dispatch(
          createIssue(
            status !== 'user-stories'
              ? {
                  project_id: +activeProject.id,
                  parent_id: activeStory ? +activeStory.id : null,
                  // data_source_id: +activeProject.data_source_id,
                  issue_type_id: +reducer.tracker,
                  subject: reducer.subject.trim(),
                  description: reducer.description.trim(),
                  estimated_time: +estimated_time,
                  status_id: +reducer.issueStatus,
                  done_ratio: +reducer.doneRatio.split('%')[0],
                  notes: reducer.notes,
                  assignee: +assignee?.user?.id || +userId,
                  time_entry: {
                    spent_time,
                    activity_id: +ISSUE_ACTIVITY_TYPE[reducer.activityType],
                    comments: reducer.comment,
                    time: +spent_time,
                    author_id: +userId,
                    user_id: +userId
                  }
                }
              : {
                  project_id: +activeProject.id,
                  parent_id: activeStory ? +activeStory.id : null,
                  // data_source_id: +activeProject.data_source_id,
                  issue_type_id: +ISSUE_TRACKER.USER_STORY,
                  subject: reducer.subject.trim(),
                  description: reducer.description.trim(),
                  estimated_time: +estimated_time,
                  status_id: +ISSUE_STATUS.NEW,
                  sprint_id: +sprint_id
                },
            assignments,
            token
          )
        );
        handleFormReset(e);
      }
    }
  };

  const handleFormReset = e => {
    e.preventDefault();
    dispatchReducer({ type: ISSUE_MODAL_ACTIONS.SET_SUBJECT, payload: '' });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_ASSIGNEE,
      payload: null
    });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS,
      payload: ''
    });
    dispatchReducer({ type: ISSUE_MODAL_ACTIONS.SET_DESCRIPTION, payload: '' });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_TRACKER,
      payload: Object.entries(ISSUE_TRACKER)[0][1]
    });
    dispatchReducer({ type: ISSUE_MODAL_ACTIONS.SET_DONE_RATIO, payload: '' });
    dispatchReducer({ type: ISSUE_MODAL_ACTIONS.SET_COMMENT, payload: '' });
    dispatchReducer({ type: ISSUE_MODAL_ACTIONS.SET_NOTES, payload: '' });
    dispatchReducer({ type: ISSUE_MODAL_ACTIONS.SET_SPENT_HOURS, payload: '' });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_SPENT_MINUTES,
      payload: ''
    });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_HOURS,
      payload: ''
    });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_MINUTES,
      payload: ''
    });
    dispatch(setIssueToBeUpdated(null));
    dispatch(setMovedIssue(null));
    dispatch(setIssueSource(null));
    dispatch(setIssueDestination(null));
    // dispatch(setCreateToReplace(false));
    dispatch(setKanbanModalShow(false));
  };

  useEffect(() => {
    if (issueToBeUpdated && issueModalAction) {
      handleCalculateSpentTime();
      handleCalculateEstimatedTime();
      handleInitialData();
    }
  }, [issueToBeUpdated, issueModalAction]);

  useEffect(() => {
    handleIssueDestination();
  }, [kanbanModalShow]);

  // Don't allow user to enter floating point numbers
  useEffect(() => {
    if (
      !Utils.isEmptyString(reducer?.spentHours) &&
      reducer?.spentHours?.toString().includes('.')
    ) {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_SPENT_HOURS,
        payload: reducer.spentHours.split('.')[0]
      });
    }
  }, [reducer.spentHours]);

  // Don't allow user to enter floating point numbers
  useEffect(() => {
    if (
      !Utils.isEmptyString(reducer?.estimatedHours) &&
      reducer.estimatedHours?.toString().includes('.')
    ) {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_HOURS,
        payload: reducer.estimatedHours.split('.')[0]
      });
    }
  }, [reducer.estimatedHours]);

  useEffect(() => {
    if (openCardStatus && !issueToBeUpdated) {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS,
        payload: +openCardStatus
      });
    }
  }, [openCardStatus]);

  useEffect(() => {
    if (reducer.subjectInvalid) {
      scrollToInvalidElement();
    }
  }, [reducer.subjectInvalid, reducer.descriptionInvalid]);

  useEffect(() => {
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_COMMENT_INVALID,
      payload: false
    });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_NOTES_INVALID,
      payload: false
    });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_SPENT_TIME_INVALID,
      payload: false
    });
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_DESCRIPTION_INVALID,
      payload: false
    });

    if (reducer.issueStatus === ISSUE_STATUS.RESOLVED) {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_DONE_RATIO,
        payload: `${RATIO_ARRAY[RATIO_ARRAY.length - 1]}%`
      });
    } else {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_DONE_RATIO,
        payload: `${issueToBeUpdated ? issueToBeUpdated?.done_ratio : 0}%`
      });
    }
  }, [reducer.issueStatus]);

  useEffect(() => {
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_SUBJECT_INVALID,
      payload: false
    });
  }, [reducer.subject]);

  useEffect(() => {
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_SPENT_TIME_INVALID,
      payload: false
    });
  }, [reducer.spentHours, reducer.spentMinutes]);

  useEffect(() => {
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_COMMENT_INVALID,
      payload: false
    });
  }, [reducer.comment]);

  useEffect(() => {
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_NOTES_INVALID,
      payload: false
    });
  }, [reducer.notes]);

  useEffect(() => {
    dispatchReducer({
      type: ISSUE_MODAL_ACTIONS.SET_DESCRIPTION_INVALID,
      payload: false
    });
  }, [reducer.description]);

  useEffect(() => {
    if (issueModalAction === ISSUE_ACTION.ISSUE_CREATE) {
      scrollToFirstElement();
    }
  }, [issueModalAction]);

  // Check if the form is valid
  const isFormInvalid = () => {
    let invalid = false;

    if (!Issue.isSubjectValid(reducer.subject)) {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_SUBJECT_INVALID,
        payload: true
      });
      invalid = true;
    }
    if (!Issue.isDescriptionValid(reducer.description)) {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_DESCRIPTION_INVALID,
        payload: true
      });
      invalid = true;
    }

    if (
      ((issueModalAction === ISSUE_ACTION.ISSUE_EDIT &&
        issueToBeUpdated.status_id === ISSUE_STATUS.IN_PROGRESS) ||
        (issueModalAction !== ISSUE_ACTION.ISSUE_EDIT &&
          +issueSource === +ISSUE_STATUS.IN_PROGRESS)) &&
      (reducer.issueStatus === ISSUE_STATUS.ON_HOLD ||
        reducer.issueStatus === ISSUE_STATUS.RESOLVED)
    ) {
      if (!Issue.isCommentValid(reducer.comment)) {
        dispatchReducer({
          type: ISSUE_MODAL_ACTIONS.SET_COMMENT_INVALID,
          payload: true
        });
        invalid = true;
      }
      if (!Issue.isNoteValid(reducer.notes)) {
        dispatchReducer({
          type: ISSUE_MODAL_ACTIONS.SET_NOTES_INVALID,
          payload: true
        });
        invalid = true;
      }

      if (
        Utils.isEmptyString(reducer.spentHours) &&
        Utils.isEmptyString(reducer.spentMinutes)
      ) {
        dispatchReducer({
          type: ISSUE_MODAL_ACTIONS.SET_SPENT_TIME_INVALID,
          payload: true
        });
        invalid = true;
      }
    }

    return invalid;
  };

  const handleStatusChange = val => {
    if (
      issueToBeUpdated?.status_id !== ISSUE_STATUS.IN_PROGRESS &&
      val.split('.')[4] === 'inProgress' &&
      activeIssue
    ) {
      handleIssueInProgress();
    } else if (
      issueToBeUpdated?.status_id !== ISSUE_STATUS.NEW &&
      val.split('.')[4] === 'new'
    ) {
      handleIssueBackToNew();
    } else {
      dispatchReducer({
        type: ISSUE_MODAL_ACTIONS.SET_ISSUE_STATUS,
        payload: ISSUE_STATUS[Utils.fromCamelCaseToWords(val.split('.')[4])]
      });
    }
  };

  return {
    reducer,
    formRef,
    subjectRef,
    spentTimeRef,
    commentRef,
    notesRef,
    issueToBeUpdated,
    issueModalAction,
    activeIssue,
    userName,
    members: activeProject?.members || [],
    sprints:
      Object.values(activeProject?.sprints || []).map(sprint => sprint.name) ||
      [],
    dispatchReducer,
    handleSubmit,
    handleFormReset,
    handleStatusChange
  };
};
