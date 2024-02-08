import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ISSUE_ACTION from 'models/enums/IssueAction';
import { useDispatch } from 'react-redux';
import {
  setIssueModalAction,
  setKanbanModalShow,
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import { FormattedMessage, useIntl } from 'react-intl';
import { setLoadingJournals } from 'features/issueJournalsSlice';
import { getIssueJournals } from 'features/issueJournalsThunk';
import { useSelector } from 'react-redux';
import { deleteIssue } from 'features/issuesThunk';
import { setIssueToBeUpdated } from 'features/issuesSlice';
import { deleteIssueLocally } from 'features/projectsSlice';

const ModalSidebar = ({ story }) => {
  const [actionMenu, setActionMenu] = useState([]);
  const user = useSelector(state => state.user);
  const issueModalAction = useSelector(state => state.modals.issueModalAction);
  const issueToBeUpdated = useSelector(state => state.issues.issueToBeUpdated);
  const intl = useIntl();
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (issueToBeUpdated?.spent_time && issueToBeUpdated?.spent_time > 0) {
      handleIssueSpentTime();
      return;
    } else {
      handleDeleteIssue();
    }
  };

  const handleDeleteIssue = () => {
    dispatch(
      setOpenWarningModalWith({
        title: story
          ? 'warning.story.delete.title'
          : 'warning.issue.delete.title',
        message: story
          ? 'warning.story.delete.message'
          : 'warning.issue.delete.message',
        onConfirm: () => {
          dispatch(setWarningModalShow(false));
          dispatch(setKanbanModalShow(false));
          dispatch(deleteIssue(issueToBeUpdated?.id, user?.token));
          dispatch(deleteIssueLocally(issueToBeUpdated));
          dispatch(setIssueToBeUpdated(null));
        },
        onCancel: () => {
          dispatch(setWarningModalShow(false));
        }
      })
    );
  };

  const handleIssueSpentTime = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'warning.issue.delete.spentTime.title',
        message: 'warning.issue.delete.spentTime.message',
        onConfirm: () => {
          dispatch(setWarningModalShow(false));
        },
        onCancel: () => {
          handleDeleteIssue();
        }
      })
    );
  };

  useEffect(() => {
    if (issueModalAction) {
      setActionMenu([
        {
          icon: 'eye',
          title: intl.formatMessage({ id: 'btn.view' }),
          mode: story ? ISSUE_ACTION.US_VIEW : ISSUE_ACTION.ISSUE_VIEW,
          action: () => {
            dispatch(
              setIssueModalAction(
                story ? ISSUE_ACTION.US_VIEW : ISSUE_ACTION.ISSUE_VIEW
              )
            );
          }
        },
        {
          icon: 'edit',
          title: intl.formatMessage({ id: 'btn.edit' }),
          mode: story ? ISSUE_ACTION.US_EDIT : ISSUE_ACTION.ISSUE_EDIT,
          action: () =>
            dispatch(
              setIssueModalAction(
                story ? ISSUE_ACTION.US_EDIT : ISSUE_ACTION.ISSUE_EDIT
              )
            )
        },
        {
          icon: 'book-open',
          title: intl.formatMessage({ id: 'btn.history' }),
          mode: story ? ISSUE_ACTION.US_HISTORY : ISSUE_ACTION.ISSUE_HISTORY,
          action: () => {
            dispatch(
              setIssueModalAction(
                story ? ISSUE_ACTION.US_HISTORY : ISSUE_ACTION.ISSUE_HISTORY
              )
            );
            dispatch(setLoadingJournals(true));
            dispatch(getIssueJournals(issueToBeUpdated?.id, user?.token));
          }
        },
        {
          icon: 'trash-alt',
          title: intl.formatMessage({ id: 'btn.remove' }),
          action: () => {
            handleDelete();
          } /*TODO*/
        }
      ]);
    }
  }, [issueModalAction]);

  return (
    <div className="mx-2">
      <h6 className="pt-2 text-center">
        <FormattedMessage id="addIssue.modal.label.actions" />
      </h6>
      <div className="d-flex flex-column">
        {actionMenu?.map(menu => (
          <button
            type="button"
            onClick={menu.action}
            disabled={issueModalAction === menu.mode}
            key={menu.title}
            className={`btn ${
              issueModalAction === menu.mode
                ? 'text-primary'
                : 'btn-outline-none'
            } me-2 me-lg-0 nav-link-card-details text-start text-nowrap`}
          >
            <FontAwesomeIcon icon={menu.icon} className="me-2" />
            {menu.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModalSidebar;
