import React from 'react';
import { FormattedMessage } from 'react-intl';
// import { useSelector } from 'react-redux';
import { FocusPeriodTimelineItem } from './FocusPeriodTimelineItem';

export const focusPeriodTableCols = () => {
  // const focusPeriod = useSelector(state => state.focusperiod.focusPeriod);
  const sortByName = (rowA, rowB) => {
    return rowA.original.title.localeCompare(rowB.original.title);
  };

  // Custom sorting method for update dates (by date)
  // const sortByEndDate = (rowA, rowB) => {
  //   const dateA = new Date(+rowA.original.end_date);
  //   const dateB = new Date(+rowB.original.end_date);
  //   return dateA - dateB;
  // };

  const getFocusPeriodStatus = focusPeriod => {
    if (!focusPeriod) return '';

    // const { start_date, end_date } = focusPeriod;

    // Function to format date for day comparison (ignores time)
    const formatDateForComparison = dateString => {
      const date = new Date(dateString);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Convert dates for comparison (ignoring time)
    const focusStartDate = formatDateForComparison(focusPeriod?.start_date);
    const focusEndDate = formatDateForComparison(focusPeriod?.end_date);

    const today = formatDateForComparison(new Date());

    // Check for invalid dates
    if (isNaN(focusStartDate.getTime()) || isNaN(focusEndDate.getTime()))
      return 'invalid';

    if (focusStartDate <= today && today <= focusEndDate) {
      return 'current';
    } else if (focusStartDate > today) {
      return 'upcoming'; 
    } else if (today > focusEndDate) {
      return 'completed';
    } else {
      return 'false';
    }
  };

  return [
    {
      accessor: 'focus-period',
      Header: <FormattedMessage id="focusPeriod.page.title" />,
      headerProps: { className: 'ps-2', style: { height: '46px' } },
      cellProps: {
        className: 'py-2 text-break pe-3 pe-xxl-4 ps-2'
      },
      sortType: sortByName,
      Cell: rowData => {
        return (
          <FocusPeriodTimelineItem
            focusPeriod={rowData.row.original}
            icon={'clock'}
            status={getFocusPeriodStatus(rowData.row.original)}
            key={rowData.row.original?.id}
            isLast={true}
          />
        );
      }
    }
  ];
};

export default focusPeriodTableCols;
