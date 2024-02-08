import React, { useContext, useEffect, useRef } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useIntl } from 'react-intl';
import is from 'is_js';
import AppContext from 'context/Context';
import AppRoutes from 'routes';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserData } from 'features/userSlice';
import AuthenticationPage from 'components/authentication/AuthenticationPage';
import { setLogLevel } from 'middlewares/levelLogger';
import { getStories } from 'features/storiesThunk';
import { getProjects, getProject } from 'features/projectsThunk';
import { getAllFocusPeriods, getFocusPeriod } from 'features/focusPeriodThunk';
import { getAllIssues } from 'features/issuesThunk';
import { setIntl } from 'services/intlService';
import { setLoadingProjects, setUpdateProjects } from 'features/projectsSlice';
import WarningModal from 'components/app/kanban/WarningModal';
import { getActiveIssue } from 'features/issuesThunk';
import { SERVER_EVENT_TYPES } from 'models/enums/ServerEventTypes';

const App = () => {
  setLogLevel('DEBUG');
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  const intl = useIntl();
  const locale = useSelector(state => state.language.locale);
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const activeProject = useSelector(state => state.projects.activeProject);
  const activeProjectRef = useRef(activeProject);
  const startDate = useSelector(
    state => state.focusperiod.focusPeriod.start_date
  );
  const endDate = useSelector(state => state.focusperiod.focusPeriod.end_date);

  const startDateRef = useRef();
  const endDateRef = useRef();

  const dispatch = useDispatch();
  const {
    config: { navbarPosition }
  } = useContext(AppContext);

  useEffect(() => {
    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }
    if (is.safari()) {
      HTMLClassList.add('safari');
    }
  }, [HTMLClassList]);

  useEffect(() => {
    if (navbarPosition === 'double-top') {
      HTMLClassList.add('double-top-nav-layout');
    }
    return () => HTMLClassList.remove('double-top-nav-layout');
  }, [navbarPosition]);

  useEffect(() => {
    if (user.token) {
      dispatch(getFocusPeriod(user.token));
      dispatch(getAllFocusPeriods(user.token));
    }
  }, [user]);

  useEffect(() => {
    if (user.token && user.id && startDate && endDate) {
      dispatch(setLoadingProjects(true));
      dispatch(getProjects(startDate, endDate, user.id, user.token));
    }
  }, [user, startDate, endDate]);

  useEffect(() => {
    if (user.token && user.id && startDate && endDate) {
      dispatch(getActiveIssue(user.id, startDate, endDate, user.token));
    }
  }, [user, startDate, endDate]);

  useEffect(() => {
    if (auth.data && auth.isLoggedIn) {
      dispatch(setUserData(auth.data));
    }
  }, [auth.data]);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    startDateRef.current = startDate;
    endDateRef.current = endDate;
  }, [startDate, endDate]);

  useEffect(() => {
    if (intl) {
      setIntl(intl);
    }
  }, [intl, locale]);

  useEffect(() => {
    let eventSource;
    let retryCount = 0;
    const maxRetries = 5;
    const initialRetryDelay = 5000; // 1 second

    const connect = () => {
      if (user.id) {
        eventSource = new EventSource(
          `${process.env.REACT_APP_EVENTS_ENDPOINT}?userId=${user.id}`
        );

        eventSource.onmessage = event => {
          const data = event.data;

          const serverEvent = data.split('|')[0];
          const projectId = data.split('|')[1];
          switch (serverEvent) {
            case SERVER_EVENT_TYPES.UPDATE_PROJECTS:
            case SERVER_EVENT_TYPES.UPDATE_SPRINTS:
            case SERVER_EVENT_TYPES.UPDATE_MEMBERS:
              dispatch(setLoadingProjects(true));
              dispatch(
                getProjects(
                  startDateRef.current,
                  endDateRef.current,
                  user.id,
                  user.token
                )
              );
              break;
            case SERVER_EVENT_TYPES.UPDATE_ISSUES:
            case SERVER_EVENT_TYPES.UPDATE_STORIES:
              if (+activeProjectRef.current?.id === +projectId) {
                dispatch(
                  getProject(
                    startDateRef.current,
                    endDateRef.current,
                    user.id,
                    activeProjectRef.current.id,
                    user.token
                  )
                );
              }
              dispatch(
                getActiveIssue(
                  user.id,
                  startDateRef.current,
                  endDateRef.current,
                  user.token
                )
              );
              break;
            case SERVER_EVENT_TYPES.UPDATE_FOCUS_PERIOD:
              dispatch(getFocusPeriod(user.token));
              dispatch(getAllFocusPeriods(user.token));
              dispatch(setLoadingProjects(true));
              dispatch(
                getProjects(
                  startDateRef.current,
                  endDateRef.current,
                  user.id,
                  user.token
                )
              );
              break;
            default:
              break;
          }
        };

        eventSource.onopen = () => {
          console.log('EventSource connected.');
          retryCount = 0; // Reset retry count on successful connection
        };

        eventSource.onerror = error => {
          console.error('EventSource failed:', error);
          eventSource.close();

          if (retryCount < maxRetries) {
            setTimeout(() => {
              console.log('Retrying connection...');
              connect();
            }, initialRetryDelay * (retryCount + 1)); // Increase delay with each retry
            retryCount++;
          } else {
            console.error('Max retries reached. Not reconnecting.');
          }
        };
      }
    };

    connect();

    return () => {
      eventSource?.close();
    };
  }, [user.id]);

  return (
    <>
      {!auth.isLoggedIn && <AuthenticationPage />}
      {auth.isLoggedIn && (
        <Router basename={process.env.PUBLIC_URL}>
          {/* <Kanban /> */}
          <AppRoutes />
          {/* <SettingsToggle />
          <SettingsPanel /> */}
          {/* <ToastContainer
            closeButton={CloseButton}
            icon={false}
            position={toast.POSITION.BOTTOM_LEFT}
          /> */}
          <WarningModal />
          <ToastContainer
            position="bottom-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="colored"
          />
        </Router>
      )}
    </>
  );
};

export default App;
