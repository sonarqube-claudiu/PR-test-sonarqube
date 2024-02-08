import React from 'react';
import { Card } from 'react-bootstrap';
import groupsTableCols from './groupsTableCols';
import { useSelector } from 'react-redux';
import TableView from 'components/common/table-template/TableView';
import { useNavigate } from 'react-router-dom';
import { getGroups } from 'features/groupThunk';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { setGroupsPerPage } from 'features/groupSlice';

const GroupTableView = () => {
  const groups = useSelector(state => state.groups.groups);
  const groupsPerPage = useSelector(state => state.groups.groupsPerPage);
  const token = useSelector(state => state.user.token);
  const userId = useSelector(state => state.user.id);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNewGroup = () => {
    navigate('/admin/groups/new');
  };

  const handleGroupsPerPage = e => {
    dispatch(setGroupsPerPage(e.target.value));
  };

  const intl = useIntl();

  useEffect(() => {
    if (userId) {
      dispatch(getGroups(userId, token));
    }
  }, [userId]);

  console.log('GROUPS: ', groups);
  return (
    <>
      <TableView
        dataArray={Object.values(groups)}
        searchBy={'name'}
        columns={groupsTableCols()}
        headerTitle={intl.formatMessage({ id: 'groups.page.title' })}
        changeViewActive={false}
        elementsPerPage={groupsPerPage}
        setElementsPerPage={handleGroupsPerPage}
        handleNew={handleNewGroup}
      />
    </>
  );
};

export default GroupTableView;
