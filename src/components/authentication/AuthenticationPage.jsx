import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/authThunk';
import { logOut, setAuthMessage, setLoading } from '../../features/authSlice';
import { FormattedMessage, useIntl } from 'react-intl';
import { BsLockFill, BsPersonFill, BsWindows } from 'react-icons/bs';
import logo from '../../assets/logo.svg';
import { PublicClientApplication } from '@azure/msal-browser';
import { setUserData, setUserToken } from '../../features/userSlice';
import { LOGIN_ORIGIN } from '../../models/enums/LoginOrigin';
import { Nav, Spinner } from 'react-bootstrap';
import { DayAndNightSwitch } from 'components/navbar/top/DayAndNightSwitch';
import { LanguageDropDown } from 'components/navbar/top/LanguageDropDown';
import { setIntl, translate } from 'services/intlService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const msalConfig = {
  auth: {
    clientId: '9634c672-d0c0-4cd5-9f67-4a96ef2cfaa2', // Your client (application) ID
    authority:
      'https://login.microsoftonline.com/5669e44c-6a4d-415f-bad4-de9d7605e699', // Your tenant info
    redirectUri: 'http://localhost:3000', // Your redirect URI
    postLogoutRedirectUri: 'http://localhost:3000' // Your post-logout redirect URI
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

const AuthenticationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMargin, setPasswordMargin] = useState('0.1rem');
  const dispatch = useDispatch();
  const intl = useIntl();
  const auth = useSelector(state => state.auth);

  const loginWithMicrosoft = () => {
    try {
      // Attempt to login with Microsoft
      msalInstance.loginRedirect({
        scopes: ['openid', 'profile', 'User.Read'], //'Directory.Read.All'
        state: 'login'
      });
    } catch (error) {
      // Handle any errors that might have occurred during login
      console.error('Error during Microsoft login:', error);
    }
  };

  useEffect(() => {
    // Start loading state
    dispatch(setLoading(true));
    msalInstance
      .handleRedirectPromise()
      .then(loginResponse => {
        if (loginResponse && loginResponse.account) {
          // If logout was initiated, we don't want to auto-login
          const logoutInitiated = sessionStorage.getItem('logoutInitiated');
          if (!logoutInitiated) {
            // Successful login
            // After the popup closes, check if we received a valid response
            const { username } = loginResponse.account;
            const { idToken } = loginResponse;

            // // Get a token to access Microsoft Graph
            // const graphTokenResponse = await msalInstance.acquireTokenSilent({
            //   scopes: ['Directory.Read.All'],
            //   account: loginResponse.account
            // });

            // // Query Microsoft Graph for user's license details
            // const userDetails = await fetch(
            //   'https://graph.microsoft.com/v1.0/me/licenseDetails',
            //   {
            //     headers: {
            //       Authorization: `Bearer ${graphTokenResponse.accessToken}`
            //     }
            //   }
            // ).then(res => res.json());

            // // Check if user has a valid license (replace this with your own logic)
            // const hasValidLicense = userDetails.value.some(
            //   license => license.skuId === 'YOUR_EXPECTED_LICENSE_ID'
            // );

            // if (!hasValidLicense) {
            //   throw new Error('User does not have a valid license.');
            // }
            // Dispatch actions to save user details
            if (idToken && username) {
              dispatch(setUserToken(idToken));
              dispatch(
                loginUser({
                  email: username,
                  token: idToken,
                  origin: LOGIN_ORIGIN.MICROSOFT
                })
              );
            }
            // Handle login logic
          }
          // Handle other response types if needed
        }
      })
      .catch(error => {
        console.error('Error processing the redirect:', error);
      })
      .finally(() => {
        // Clear the flag in all cases, so next login works normally
        dispatch(setLoading(false));
        sessionStorage.removeItem('logoutInitiated');
      });
  }, [dispatch]);

  const handleLogin = event => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // if (!emailRegex.test(email)) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
    }

    // Password length validation
    if (password.length < 8) {
      setInvalidPassword(true);
    } else {
      setInvalidPassword(false);
    }

    // If both email and password are valid, proceed with form submission
    if (!invalidEmail && !invalidPassword) {
      dispatch(
        loginUser({ username: email, password, origin: LOGIN_ORIGIN.REDMINE })
      );
    }
  };

  useEffect(() => {
    if (auth.message !== '') {
      setTimeout(() => {
        dispatch(setAuthMessage(''));
      }, 5000);
    }
  }, [auth.message, dispatch]);

  useEffect(()=> {
    invalidPassword ? setPasswordMargin('1rem') : setPasswordMargin('0.1rem');
  }, [invalidPassword]);

  return (
    <>
      <Nav
        navbar
        className="navbar-nav-icons ms-auto flex-row align-items-center justify-content-end"
        as="ul"
      >
        <DayAndNightSwitch />
        <LanguageDropDown />
      </Nav>
      {auth.loading && (
        <div className="d-flex h-100 w-100 justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {!auth.loading && (
        <div className="d-flex flex-column vh-100 justify-content-center align-items-center bg-light">
          <img src={logo} alt="logo" className="mb-3" />
          <div
            className="d-flex flex-column bg-light p-5 border-1 shadow"
            style={{ maxWidth: '450px', minHeight: '300px' }}
          >
            <form className="w-100" onSubmit={handleLogin}>
              <p className="fs-1 text-secondary text-center px-3 pb-3 m-0">
                <FormattedMessage id="auth.form.title" />
              </p>
                <div className='w-100 d-flex'>
                  <div className="input-group">
                    <input
                      type="email"
                      className={`form-control ${invalidEmail ? 'is-invalid' : ''} rounded-end-0`}
                      aria-required="true"
                      placeholder={intl.formatMessage({
                        id: 'auth.form.placeholder.email'
                      })}
                      value={email}
                      onChange={e => {setEmail(e.target.value); setInvalidEmail(false); }}
                      id="cypress-input-email" // Added id for easy cypress testing
                    />
                    <div className="input-group-append">
                      <div className="input-group-text border-1 rounded-0 d-flex h-100 align-items-center fs-2">
                        <BsPersonFill />
                      </div>
                    </div>
                  </div>
                </div>
                {invalidEmail && (
                  <div className="mb-3 fw-bold form-text text-danger">
                    <FormattedMessage id="auth.form.error.email" />
                  </div>
                )}
                {!invalidEmail && (
                  <div className="mb-3 form-text w-100 ms-2 fst-italic">
                    <FormattedMessage id="auth.form.hint.email" />
                  </div>
                )}
              <div className="mb-3 input-group w-100">
                <div className='d-flex flex-grow-1'>
                  <div className="position-relative d-flex flex-grow-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control ${
                        invalidPassword ? 'is-invalid' : ''
                      } rounded-end-0 w-100 pr-2`}
                      placeholder={`${intl.formatMessage({
                        id: 'auth.form.placeholder.password'
                      })}`}
                      aria-required="true"
                      style={{paddingRight: '3rem'}}
                      value={password}
                      onChange={e => {setPassword(e.target.value); setInvalidPassword(false);}}
                      id="cypress-input-password" // Added id for easy cypress testing
                    />
                    <button 
                        className='input-group-text border-1 d-flex h-100 pe-3 align-items-center bg-transparent border-0 position-absolute' 
                        onClick={()=> setShowPassword(!showPassword)}
                        type='button'
                        style={{right: 0, marginRight: passwordMargin}}
                      >
                        <FontAwesomeIcon icon={showPassword? faEye: faEyeSlash}/>
                      </button>
                  </div>
                  <div className="input-group-text border-1 rounded-0 d-flex h-100 align-items-center fs-2 flex-grow-0">
                    <BsLockFill />
                  </div>
                </div>
                {invalidPassword && (
                  <div className="fw-bold form-text text-danger">
                    <FormattedMessage id="auth.form.error.password" />
                  </div>
                )}
                {!invalidPassword && (
                  <div className="form-text w-100 ms-2 fst-italic">
                    <FormattedMessage id="auth.form.hint.password" />
                  </div>
                )}
              </div>
              <div
                className="d-flex flex-column align-items-center"
                style={{ minHeight: '40px', maxHeight: '40px' }}
              >
                {/* <button type="button" className="btn btn-link">Register</button> */}
                <button
                  type="submit"
                  className="btn btn-primary px-4 w-100"
                  onClick={handleLogin}
                  id="cypress-button-login" // Added id for easy cypress testing
                >
                  <FormattedMessage id="auth.form.button.login" />
                </button>
              </div>
            </form>
            {/* <hr className="border-1" /> */}
            <div className="w-100">
              <div className="d-flex flex-row align-items-center">
                <hr className="w-50 text-secondary" />
                <span className="mx-3 fw-light fs-0"><FormattedMessage id="auth.form.label.or" /></span>
                <hr className="w-50 text-secondary" />
              </div>
              <button
                type="button"
                className="btn w-100 btn-dark"
                // style={{background: "violet"}}
                onClick={loginWithMicrosoft}
              >
                <FormattedMessage id="auth.form.button.microsoft" /> &nbsp;
                <BsWindows />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthenticationPage;
