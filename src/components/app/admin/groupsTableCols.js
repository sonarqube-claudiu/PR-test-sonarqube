import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

export const groupsTableCols = () => {
  const groups = useSelector(state => state.groups.groups);

  //   const sortProjectName = (rowA, rowB) => {
  //     return rowA.original.name.localeCompare(rowB.original.name);
  //   };

  //   // Custom sorting method for update dates (by date)
  //   const sortUpdateDate = (rowA, rowB) => {
  //     const dateA = new Date(+rowA.original.updated_on);
  //     const dateB = new Date(+rowB.original.updated_on);
  //     return dateA - dateB;
  //   };
  return [
    {
      accessor: 'group-name',
      Header: <FormattedMessage id="groups.page.column.groupName" />,
      headerProps: { className: 'ps-2', style: { height: '46px' } },
      cellProps: {
        className: 'py-2 pe-3 pe-xxl-4 ps-2'
      },
      //   sortType: sortProjectName,
      Cell: rowData => {
        const { name, id } = rowData.row.original;
        return (
          <h6 className="mb-0 d-flex">
            {id ? (
              <Link  className="text-800 d-flex align-items-center gap-1" to={`/admin/groups/group-details/${id}`}>
                <span className="text-break">{name}</span>
              </Link>
            ) : (
              <span>{name}</span>
            )}
          </h6>
        );
      }
    },
    {
      accessor: 'group-members',
      Header: <FormattedMessage id="groups.page.column.groupMembers"/>,
      headerProps: {
        className: 'ps-2 white-space-nowrap',
        style: { height: '46px' }
      },
      cellProps: {
        className: 'py-2 pe-3 pe-xxl-4 ps-2 text-center'
      },
      Cell: rowData => {
        const { group_members } = rowData.row.original;
        return (
          <div className="fw-semi-bold">
            {/* {group_members?.map((member, index) => (
              <p key={index}>{member.user.display_name}</p>
            ))} */}
            {group_members?.length}
          </div>
        );
      }
    }
  ];
};

export default groupsTableCols;
