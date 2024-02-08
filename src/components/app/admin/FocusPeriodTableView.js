import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setFocusPeriodsPerPage,
} from 'features/focusPeriodSlice';
import {
  getAllFocusPeriods,
} from 'features/focusPeriodThunk';
import {  useIntl } from 'react-intl';
import { focusPeriodTableCols } from './focusPeriodTableCols';
import TableView from 'components/common/table-template/TableView';
import { useNavigate } from 'react-router-dom';

const FocusPeriodTableView = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const focusPeriodsPerPage = useSelector(state => state.focusperiod.focusPeriodsPerPage);
  const token = useSelector(state => state.user.token);
  const focusPeriods = useSelector(state => state.focusperiod.focusPeriods);

  useEffect(() => {
    dispatch(getAllFocusPeriods(token));
  }, []);

  const handleNew = () => {
    navigate('/admin/focus-periods/new')
  }
  
  const handlePeriodsPerPage = e => {
    dispatch(setFocusPeriodsPerPage(e.target.value));
  }

  return (
    <TableView
        dataArray={focusPeriods || []}
        elementsPerPage={focusPeriodsPerPage}
        setElementsPerPage={handlePeriodsPerPage}
        headerTitle={intl.formatMessage({
          id: 'focusPeriod.page.panel.viewPeriods.title'
        })}
        sortBy={[
          {
            id: 'title',
            desc: false
          }
        ]}
        columns={focusPeriodTableCols()}
        searchBy="title"
        handleNew={handleNew}
      />
  );
};

export default FocusPeriodTableView;
