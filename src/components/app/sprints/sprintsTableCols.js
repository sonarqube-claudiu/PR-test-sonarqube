import React from 'react';
import { FormattedMessage } from 'react-intl';
import IconButton from 'components/common/IconButton';
import { Link } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SoftBadge from 'components/common/SoftBadge';
import { formatDate } from 'utils';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setActiveProject } from 'features/projectsSlice';
import { Utils } from 'models/Utils';
import ProjectSprintTimeline from '../projects/ProjectSprintTimeline';
import { ProjectSprints } from '../projects/ProjectSprints';
import { SprintTimelineItem } from './SprintTimelineItem';

export const sprintsTableCols = () => {
  const focusPeriod = useSelector(state => state.focusperiod.focusPeriod);
  const sortByName = (rowA, rowB) => {
    return rowA.original.name.localeCompare(rowB.original.name);
  };

  // Custom sorting method for update dates (by date)
  const sortByEndDate = (rowA, rowB) => {
    const dateA = new Date(+rowA.original.end_date);
    const dateB = new Date(+rowB.original.end_date);
    return dateA - dateB;
  };

  const getSprintStatus = sprint => {
    // Check if sprint object is valid
    if (!sprint) return '';
    if (!focusPeriod) return '';

    const { start_date, end_date } = sprint;

    // Function to format date for day comparison (ignores time)
    const formatDateForComparison = dateString => {
      const date = new Date(dateString);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Convert dates for comparison (ignoring time)
    const sprintStartDate = formatDateForComparison(start_date);
    const sprintEndDate = formatDateForComparison(end_date);
    const focusStartDate = formatDateForComparison(focusPeriod?.start_date);
    const focusEndDate = formatDateForComparison(focusPeriod?.end_date);

    const today = formatDateForComparison(new Date());

    // Check for invalid dates
    if (isNaN(sprintStartDate.getTime()) || isNaN(sprintEndDate.getTime()))
      return 'invalid';
    if (isNaN(focusStartDate.getTime()) || isNaN(focusEndDate.getTime()))
      return 'invalid';

    // Determine sprint status based on date comparisons
    if (focusStartDate <= sprintStartDate && today >= sprintEndDate) {
      return 'current'; // Sprint is ongoing
    } else if (focusStartDate < sprintStartDate) {
      return 'upcoming'; // Sprint hasn't started yet
    } else if (today > sprintEndDate) {
      return 'completed'; // Sprint has finished
    } else {
      return 'false'; // Fallback for any other unhandled case
    }
  };

  return [
    {
      accessor: 'sprint-project',
      Header: <FormattedMessage id="sprint.page.column.name" />,
      headerProps: { className: 'ps-2', style: { height: '46px' } },
      cellProps: {
        className: 'py-2 text-break pe-3 pe-xxl-4 ps-2'
        // style: { maxWidth: '300px' }
      },
      sortType: sortByName,
      Cell: rowData => {
        return (
          <SprintTimelineItem
            sprint={rowData.row.original}
            icon={['far', 'clock']}
            status={getSprintStatus(rowData.row.original)}
            key={rowData.row.original?.id}
            isLast={true}
          />
        );
      }
    }
    // {
    //   accessor: 'sprint-name',
    //   Header: <FormattedMessage id="sprint.page.column.name" />,
    //   headerProps: { className: 'ps-2', style: { height: '46px' } },
    //   cellProps: {
    //     className: 'py-2 pe-3 pe-xxl-4 ps-2',
    //     style: { minWidth: '200px' }
    //   },
    //   sortType: sortByName,
    //   Cell: rowData => {
    //     const { name, project_id } = rowData.row.original;
    //     return (
    //       // <div className="fw-semi-bold text-primary">
    //       //   {name}
    //       // </div>
    //       <h6 className="mb-0 d-flex">
    //         <OverlayTrigger
    //           placement="top"
    //           overlay={
    //             <Tooltip style={{ position: 'fixed' }}>
    //               <FormattedMessage id="sprint.page.column.projectBtn" />
    //             </Tooltip>
    //           }
    //         >
    //           <Link to={`/projects/project-details/${project_id}`}>
    //             <IconButton
    //               variant="falcon-default"
    //               size="sm"
    //               icon={'table'}
    //               transform="shrink-3"
    //               className="me-3"
    //               onClick={() =>
    //                 dispatch(
    //                   setActiveProject(
    //                     Object.values(sprints || []).find(
    //                       sprint => sprint.name === name
    //                     )
    //                       ? Object.values(sprints || []).find(
    //                           sprint => sprint.name === name
    //                         )
    //                       : Object.values(sprints || [])[0]
    //                   )
    //                 )
    //               }
    //               iconAlign="middle"
    //             />
    //           </Link>
    //         </OverlayTrigger>
    //         <Link
    //           to={`/admin/sprints/sprint-details/${
    //             Object.values(sprints || []).find(
    //               sprint => sprint.name === name
    //             )
    //               ? Object.values(sprints || []).find(
    //                   sprint => sprint.name === name
    //                 ).id
    //               : ''
    //           }`}
    //           className="text-800 d-flex align-items-center gap-1"
    //         >
    //           <FontAwesomeIcon icon="layer-group" transform="shrink-3 up-1" />
    //           <span className="text-break">{name}</span>
    //         </Link>
    //       </h6>
    //     );
    //   }
    // },
    // {
    //   accessor: 'sprint-project',
    //   Header: <FormattedMessage id="sprint.page.column.project" />,
    //   headerProps: { className: 'ps-2', style: { height: '46px' } },
    //   cellProps: {
    //     className: 'py-2 text-break pe-3 pe-xxl-4 ps-2',
    //     style: {maxWidth: '300px'}
    //   },
    //   sortType: sortByName,
    //   Cell: rowData => {
    //     const { project_id } = rowData.row.original;
    //     return (
    //       <div className="fw-semi-bold text-secondary text-break">
    //         {projects[project_id] ? projects[project_id].name : ''}
    //       </div>
    //     );
    //   }
    // },
    // {
    //   accessor: 'sprint-start-date',
    //   Header: <FormattedMessage id="sprint.page.column.startDate" />,
    //   headerProps: { className: 'ps-2', style: { height: '46px' } },
    //   cellProps: {
    //     className: 'py-2 white-space-nowrap text-break pe-3 pe-xxl-4 ps-2'
    //   },
    //   sortType: sortDate,
    //   Cell: rowData => {
    //     const { start_date } = rowData.row.original;
    //     return <div className="fw-semi-bold text-secondary">{start_date}</div>;
    //   }
    // },
    // {
    //   accessor: 'sprint-end-date',
    //   Header: <FormattedMessage id="sprint.page.column.endDate" />,
    //   headerProps: { className: 'ps-2', style: { height: '46px' } },
    //   cellProps: {
    //     className: 'py-2 white-space-nowrap text-break pe-3 pe-xxl-4 ps-2'
    //   },
    //   sortType: sortDate,
    //   Cell: rowData => {
    //     const { end_date } = rowData.row.original;
    //     return <div className="fw-semi-bold text-secondary">{end_date}</div>;
    //   }
    // }
  ];
};

export default sprintsTableCols;
