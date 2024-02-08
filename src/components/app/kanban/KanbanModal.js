import React from 'react';
import { CloseButton, Col, Modal, Row, Dropdown } from 'react-bootstrap';
import IssueModal from './IssueModal';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setKanbanModalShow,
  setIssueDestination,
  setIssueSource
} from 'features/modalSlice';
import ISSUE_ACTION from 'models/enums/IssueAction';
import { setIssueToBeUpdated } from 'features/issuesSlice';

const KanbanModal = () => {
  const kanbanModalShow = useSelector(state => state.modals.kanbanModalShow);
  const openCardStatus = useSelector(state => state.modals.openCardStatus);
  const issueToBeUpdated = useSelector(state => state.issues.issueToBeUpdated);
  const issueModalAction = useSelector(state => state.modals.issueModalAction);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setKanbanModalShow(false));
    dispatch(setIssueToBeUpdated(null));
    dispatch(setIssueDestination(null));
    dispatch(setIssueSource(null));
  };

  return (
    <Modal
      show={kanbanModalShow}
      size="xl"
      onHide={handleClose}
      contentClassName="border-0"
      dialogClassName="mt-6"
    >
      <div className="position-absolute top-0 end-0 mt-2 me-2 z-index-1">
        <CloseButton
          onClick={handleClose}
          className="btn btn-sm btn-circle d-flex flex-center transition-base"
        />
      </div>
      <Modal.Body className="p-0">
        <div className="bg-light rounded-top-lg px-4 py-4">
          <h5 className="mb-1">
            {issueModalAction === ISSUE_ACTION.ISSUE_CREATE && (
              <FormattedMessage id="addIssue.modal.header.create" />
            )}
            {issueModalAction === ISSUE_ACTION.ISSUE_EDIT && (
              <FormattedMessage id="addIssue.modal.header.edit" />
            )}
            {issueModalAction === ISSUE_ACTION.ISSUE_VIEW && (
              <FormattedMessage id="addIssue.modal.header.view" />
            )}
            {issueModalAction === ISSUE_ACTION.ISSUE_UPDATE_STATUS && (
              <FormattedMessage id="addIssue.modal.header.updateStatus" />
            )}
            {issueModalAction === ISSUE_ACTION.ISSUE_HISTORY && (
              <FormattedMessage id="addIssue.modal.header.history" />
            )}
            {issueModalAction === ISSUE_ACTION.US_CREATE && (
              <FormattedMessage id="addIssue.modal.header.usCreate" />
            )}
            {issueModalAction === ISSUE_ACTION.US_VIEW && (
              <FormattedMessage id="addIssue.modal.header.usView" />
            )}
            {issueModalAction === ISSUE_ACTION.US_EDIT && (
              <FormattedMessage id="addIssue.modal.header.usEdit" />
            )}
            {issueModalAction === ISSUE_ACTION.US_HISTORY && (
              <FormattedMessage id="addIssue.modal.header.usHistory" />
            )}
            {issueToBeUpdated &&
              ` #${
                issueToBeUpdated?.id
              } - ${issueToBeUpdated?.subject.substring(0, 25)}${
                issueToBeUpdated?.subject.length > 25 ? '...' : ''
              }`}
          </h5>
        </div>
        <IssueModal status={openCardStatus} />
      </Modal.Body>
    </Modal>
  );
};

export default KanbanModal;
