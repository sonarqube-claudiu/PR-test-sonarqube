import axios from 'axios';
import client from './apollo';
import { CREATE_DEVICE, CREATE_UUID } from './mutations';
import { GET_DEVICE, GET_SPRINTS, GET_USER } from './queries';
import { HttpStatusCodes } from './utils';

// export const autoLoginUser = async (deviceId) => {
//   try {
//     const { data } = await client.query({
//       query: GET_DEVICE,
//       variables: {
//         uuid: deviceId
//       },
//       meta: {
//         logLevel: 'DEBUG'
//       }
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const signUpUser = async userData => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_UUID,
      variables: {
        userData: JSON.stringify(userData)
      },
      meta: {
        logLevel: 'DEBUG'
      }
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const signUpUserAsGuest = async deviceInfo => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_DEVICE,
      variables: {
        deviceInfo: JSON.stringify(deviceInfo)
      },
      meta: {
        logLevel: 'DEBUG'
      }
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const autoLoginUser = deviceId => {
  return {
    url: 'http://localhost:5000/graphql', // replace with your actual GraphQL endpoint
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_DEVICE,
      variables: { uuid: deviceId }
    })
  };
};

export const fetchSprints = (projectId, token) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(
          process.env.REACT_APP_GRAPHQL_ENDPOINT,
          {
            query: GET_SPRINTS,
            variables: { projectId }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          const resp = response.data.data.getSprints;
          if(resp.status === HttpStatusCodes.OK) {
            resolve(resp.sprints)
          }
          resolve([]);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    } catch (error) {
      console.error(error);
    }
  });
};
