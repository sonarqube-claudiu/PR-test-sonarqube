import { setActiveProject, setLoadingProjects } from 'features/projectsSlice';
import { getProject } from 'features/projectsThunk';
import { Issue } from 'models/Issue';
import { Story } from 'models/Story';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import React, { useEffect } from 'react';
import { startTransition } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const useManageActiveProject = () => {
  const activeProject = useSelector(state => state.projects.activeProject);
  const projects = useSelector(state => state.projects.projects);
  const user = useSelector(state => state.user);
  const focusPeriod = useSelector(state => state.focusperiod.focusPeriod);
  const dispatch = useDispatch();

  const doesActiveProjectExist = () => {
    return projects[activeProject?.id];
  };

  useEffect(() => {
    startTransition(() => {
      if (activeProject && doesActiveProjectExist()) {
        return;
      }
      const project =
        projects && Object.values(projects).length > 0
          ? Object.values(projects)[0]
          : null;
      dispatch(setActiveProject(project || null));
    });
  }, [projects, dispatch]);

  useEffect(() => {
    if (
      activeProject &&
      user &&
      user?.token &&
      user?.id &&
      focusPeriod?.start_date &&
      focusPeriod?.end_date
    ) {
      dispatch(setLoadingProjects(true));
      dispatch(
        getProject(
          focusPeriod?.start_date,
          focusPeriod?.end_date,
          user?.id,
          activeProject?.id,
          user?.token
        )
      );
    }
  }, [activeProject, user, focusPeriod, dispatch]);
};

export default useManageActiveProject;
