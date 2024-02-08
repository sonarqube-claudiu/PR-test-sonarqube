import React, { useEffect, useState } from 'react';
import LogoutContent from 'components/authentication/LogoutContent';

import AuthCardLayout from 'layouts/AuthCardLayout';
import { useDispatch } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom';
import { logOut, setLoading } from 'features/authSlice';
import { setUserData } from 'features/userSlice';
import { persistor } from 'store/store';
import { msalInstance } from './AuthenticationPage';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

let interval = null;
const logoutTime = 3; //seconds

const LogoutPage = () => {
  const [doLogout, setDoLogout] = useState(false);
  const [logoutCounter, setLogoutCounter] = useState(logoutTime);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    setDoLogout(true);
  };

  useEffect(() => {
    if (!doLogout) return;
    interval = setInterval(() => {
      setLogoutCounter(state => state - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [doLogout]);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        if (logoutCounter === 0) {
          setDoLogout(false);
          sessionStorage.setItem('logoutInitiated', 'true');
          dispatch(logOut());
          dispatch(setUserData(null));
          persistor.purge();
          msalInstance.logoutRedirect();
        }
      } catch (error) {
        console.log(error);
      }
    };
    logoutUser();
  }, [logoutCounter]);
  return (
    <>
      {auth.loading && (
        <div className="d-flex vh-100 vw-100 justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {!auth.loading && (
        <AuthCardLayout>
          <div className="text-center">
            {!doLogout && (
              <div className="d-flex flex-column w-100">
                <p>
                  <FormattedMessage id="logout.confirmation.message" />
                </p>
                <div className="w-100 d-flex justify-content-center">
                  <button onClick={handleLogout} className="btn btn-primary">
                    <FormattedMessage id="logout.confirmation.button.yes" />
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="btn btn-secondary ms-1"
                  >
                    <FormattedMessage id="logout.confirmation.button.no" />
                  </button>
                </div>
              </div>
            )}
            {doLogout && (
              <LogoutContent
                counter={logoutCounter}
                layout="card"
                titleTag="h3"
              />
            )}
          </div>
        </AuthCardLayout>
      )}
    </>
  );
};

export default LogoutPage;
