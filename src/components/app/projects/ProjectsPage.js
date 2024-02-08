import TableView from 'components/common/table-template/TableView';
import { setProjectsPerPage } from 'features/projectsSlice';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import projectsTableCols from './projectsTableCols';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projects = useSelector(state => state.projects.projects);
  const projectsPerPage = useSelector(state => state.projects.projectsPerPage);

  const handleProjectsPerPage = e => {
    dispatch(setProjectsPerPage(e.target.value));
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  return (
    <TableView
      dataArray={Object.values(projects || [])}
      elementsPerPage={projectsPerPage}
      setElementsPerPage={handleProjectsPerPage}
      tableViewLink={'/projects/table-view'}
      cardViewLink={'/projects/card-view'}
      selection
      sortBy={[
        {
          id: 'project-update-date',
          desc: true
        }
      ]}
      changeViewActive={true}
      headerTitle={intl.formatMessage({
        id: 'projects.page.header.title'
      })}
      columns={projectsTableCols()}
      searchBy="name"
      handleNew={handleNewProject}
    />
  );
};
