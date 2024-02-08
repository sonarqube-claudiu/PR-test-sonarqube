import { setStatusNewModalShow } from 'features/modalSlice';
import React from 'react';
import ReactDOM from 'react-dom';
import { CloseButton, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const StatusNewModal = () => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.modals.statusNewModalShow);
  const title = useSelector(state => state.modals.statusNewModalTitle);
  const message = useSelector(state => state.modals.statusNewModalMessage);
  const onConfirm = useSelector(state => state.modals.statusNewModalOnConfirm);
  const onCancel = useSelector(state => state.modals.statusNewModalOnCancel);

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    dispatch(setStatusNewModalShow(false));
  }

  return ReactDOM.createPortal(
    <Modal
      show={show}
      className={'mt-4 h-100'}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.40)', marginLeft: '-15px' }}
      size="lg"
      onHide={handleClose}
      contentClassName="border-0"
      dialogClassName="mt-11"
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
            <FormattedMessage id={title} />
          </h5>
          <div className="mb-0 fs-0 p-5 d-flex flex-row align-items-center text-center justify-content-center">
            <FormattedMessage id={message} />
          </div>
          <div className="d-flex justify-content-around mb-3">
            <button
              className="btn btn-primary outline-none"
              onClick={handleConfirm}
            >
              <FormattedMessage id="destination.inProgress.btnYes" />
            </button>
            <button
              className="btn btn-danger outline-none"
              onClick={handleCancel}
            >
              <FormattedMessage id="destination.inProgress.btnNo" />
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StatusNewModal;
