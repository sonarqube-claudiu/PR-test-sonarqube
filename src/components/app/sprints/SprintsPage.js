import TableView from 'components/common/table-template/TableView';
import { setSprintsPerPage } from 'features/sprintSlice';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import sprintsTableCols from './sprintsTableCols';
import { useState } from 'react';
import { useEffect } from 'react';
import { getSprints } from 'features/sprintThunk';
import { fetchSprints } from 'api/api';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const SprintsPage = () => {
  const { projectId } = useParams();
  const intl = useIntl();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const sprints = useSelector(state => state.sprints.sprints);

  const sprintsPerPage = useSelector(state => state.sprints.sprintsPerPage);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleNewSprint = () => {
    navigate(`/admin/project/${projectId}/sprints/new`);
  };
  const handleSprintsPerPage = e => {
    dispatch(setSprintsPerPage(e.target.value));
  };

  useEffect(() => {
    if (user.token && projectId) {
      dispatch(getSprints(projectId, user.token));
    }
  }, [user, user.token, projectId]);

  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip style={{ position: 'fixed' }}>
            <FormattedMessage id={'btn.back'} />
          </Tooltip>
        }
      >
        <button
          onClick={handleBack}
          className="btn text-dark btn-light btn-sm shadow-none fs-4 rounded-circle pb-0 pt-0 ps-3 pe-3"
        >{`<`}</button>
      </OverlayTrigger>
      <TableView
        dataArray={Object.values(sprints || [])}
        elementsPerPage={sprintsPerPage}
        setElementsPerPage={handleSprintsPerPage}
        headerTitle={intl.formatMessage({
          id: 'sprint.page.header.title'
        })}
        sortBy={[
          {
            id: 'name',
            desc: false
          }
        ]}
        columns={sprintsTableCols()}
        searchBy="name"
        handleNew={handleNewSprint}
      />
    </>
  );
};
