import React, { useEffect } from 'react';
import LogoutContent from 'components/authentication/LogoutContent';
import { useDispatch } from 'react-redux';
import { logOut } from 'features/authSlice';
import { persistor } from 'store/store';
import { setUserData } from 'features/userSlice';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logOut());
    dispatch(setUserData(null));
    persistor.purge();
  }, []);
  return (
    <div className="text-center">
      <LogoutContent />
    </div>
  );
};

export default Logout;
