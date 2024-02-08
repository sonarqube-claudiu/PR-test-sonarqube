import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorLayout from '../layouts/ErrorLayout';

import Kanban from 'components/app/kanban/Kanban';

import Error404 from 'components/errors/Error404';
import Error500 from 'components/errors/Error500';

import LogoutPage from 'components/authentication/LogoutPage';

import AuthenticationPage from 'components/authentication/AuthenticationPage';
import FocusPeriodTableView from 'components/app/admin/FocusPeriodTableView';
import TableView from 'components/common/table-template/TableView';
import CardView from 'components/app/projects/table-layout/CardView';
import ProjectView from 'components/app/projects/ProjectView';
import { useSelector } from 'react-redux';
import projectsTableCols from 'components/app/projects/projectsTableCols';
import GroupForm from 'components/app/admin/GroupForm';
import GroupTableView from 'components/app/admin/GroupTableView';
import ProjectCardFormat from 'components/dashboards/support-desk/unsolved-tickets/ProjectCardFormat';
import { ProjectForm } from 'components/app/projects/ProjectForm';
import sprintsTableCols from 'components/app/sprints/sprintsTableCols';
import { SprintForm } from 'components/app/sprints/SprintForm';
import SprintView from 'components/app/sprints/SprintView';
import { useDispatch } from 'react-redux';
import { setProjectsPerPage } from 'features/projectsSlice';
import { setSprintsPerPage } from 'features/sprintSlice';
import { useIntl } from 'react-intl';
import GroupView from 'components/app/admin/GroupView';
import { ProjectsPage } from 'components/app/projects/ProjectsPage';
import { SprintsPage } from 'components/app/sprints/SprintsPage';
import ProjectActivityLog from 'components/app/projects/ProjectActivityLog';
import FocusPeriodView from 'components/app/admin/FocusPeriodView';
import FocusPeriodForm from 'components/app/admin/FocusPeriodForm';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const projects = useSelector(state => state.projects.projects);
  const projectsPerPage = useSelector(state => state.projects.projectsPerPage);
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/projects/new');
  };
  const handleProjectsPerPage = e => {
    dispatch(setProjectsPerPage(e.target.value));
  };
  return (
    <Routes>
      {/*- ------------- Authentication ---------------------------  */}
      <Route path="authentication/logout" element={<LogoutPage />} />

      {/* <Route path="landing" element={<Landing />} /> */}
      <Route element={<ErrorLayout />}>
        <Route path="errors/404" element={<Error404 />} />
        <Route path="errors/500" element={<Error500 />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Kanban />} />
        <Route path="/admin/focus-periods" element={<FocusPeriodTableView />} />
        <Route path="/admin/focus-periods/view/:focusPeriodId" element={<FocusPeriodView />}/>
        <Route path="/admin/focus-periods/edit/:focusPeriodId" element={<FocusPeriodForm edit/>}/>
        <Route path="/admin/focus-periods/new" element={<FocusPeriodForm/>}/>
        <Route path="/admin/groups" element={<GroupTableView />} />
        <Route path="/admin/groups/new" element={<GroupForm />} />
        <Route path='admin/groups/group-details/:groupId' element={<GroupView />}/>
        <Route
          path="/admin/groups/edit/:groupId"
          element={<GroupForm edit />}
        />
        <Route
          path="/admin/project/:projectId/sprints"
          element={<SprintsPage />}
        />
        <Route
          path="/admin/project/:projectId/sprints/new"
          element={<SprintForm />}
        />
        <Route
          path="/admin/project/:projectId/sprints/edit/:sprintId"
          element={<SprintForm edit />}
        />
        <Route
          path="/admin/project/:projectId/sprints/view/:sprintId"
          element={<SprintView />}
        />

        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route
          path="/projects/edit/:projectId"
          element={<ProjectForm edit />}
        />
        <Route path="/projects/view/:projectId" element={<ProjectView />} />
        <Route
          path="/projects/card-view"
          element={
            <CardView
              dataArray={Object.values(projects || [])}
              elementsPerPage={projectsPerPage}
              setElementsPerPage={handleProjectsPerPage}
              tableViewLink={'/projects/table-view'}
              cardViewLink={'/projects/card-view'}
              changeViewActive={true}
              headerTitle={intl.formatMessage({
                id: 'projects.page.header.title'
              })}
              columns={projectsTableCols()}
              searchBy="name"
              handleNew={handleNewProject}
            />
          }
        />
        <Route path="/admin/project/:projectId/activity-log" element={<ProjectActivityLog showAll/>} />

        {/* format={<ProjectCardFormat elements={projects}/> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
