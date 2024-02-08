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

export const projectsTableCols = () => {
  const projects = useSelector(state => state.projects.projects);
  const dispatch = useDispatch();

  const sortProjectName = (rowA, rowB) => {
    return rowA.original.name.localeCompare(rowB.original.name);
  };

  // Custom sorting method for update dates (by date)
  const sortUpdateDate = (rowA, rowB) => {
    const dateA = new Date(+rowA.original.updated_on);
    const dateB = new Date(+rowB.original.updated_on);
    return dateA - dateB;
  };
  return [
   
    {
      accessor: 'project-name',
      Header: <FormattedMessage id="projects.page.column.projectName" />,
      headerProps: { className: 'ps-2', style: { height: '46px' } },
      cellProps: {
        className: 'py-2 pe-3 pe-xxl-4 ps-2'
      },
      sortType: sortProjectName,
      Cell: rowData => {
        const { name } = rowData.row.original;
        return (
          // <div className="fw-semi-bold text-primary">
          //   {name}
          // </div>
          <h6 className="mb-0 d-flex">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip style={{ position: 'fixed' }}><FormattedMessage id="projects.page.column.issueBtn"/></Tooltip>
              }
            >
              <Link to="/">
                <IconButton
                  variant="falcon-default"
                  size="sm"
                  icon={['fab', 'trello']}
                  transform="shrink-3"
                  className="me-3"
                  onClick={() =>
                    dispatch(
                      setActiveProject(
                        Object.values(projects || []).find(project => project.name === name)
                          ? Object.values(projects || []).find(project => project.name === name)
                          : Object.values(projects || [])[0]
                      )
                    )
                  }
                  iconAlign="middle"
                />
              </Link>
            </OverlayTrigger>
            <Link
              to={`/projects/view/${
                Object.values(projects || []).find(
                  project => project.name === name
                )
                  ? Object.values(projects || []).find(
                      project => project.name === name
                    ).id
                  : ''
              }`}
              className="text-800 d-flex align-items-center gap-1"
            >
              <FontAwesomeIcon icon="layer-group" transform="shrink-3 up-1" />
              <span className="text-break">{name}</span>
            </Link>
          </h6>
        );
      },
    },
    {
      accessor: 'project-update-date',
      Header: <FormattedMessage id="projects.page.column.updatedOn" />,
      headerProps: { className: 'ps-2', style: { height: '46px' } },
      cellProps: {
        className: 'py-2 white-space-nowrap pe-3 pe-xxl-4 ps-2'
      },
      sortType: sortUpdateDate,
      Cell: rowData => {
        const { updated_on } = rowData.row.original;
        return (
          <div className="fw-semi-bold text-secondary">
            {Utils.formatDateToYYYYMMDD(Utils.formatDate(updated_on).toLocaleString(), 'ddmmyyyy')}
            {Utils.formatDate(updated_on).split(',')[1]}
          </div>
        );
      }
    }
  ];
};

export default projectsTableCols;
