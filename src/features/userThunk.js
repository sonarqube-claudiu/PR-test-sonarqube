import { createAction } from '@reduxjs/toolkit';
import { GET_ALL_USERS } from 'api/queries';
import axios from 'axios';

export const getAllUsers = createAction(
    'users/getAllUsers',
    (userId, token) => {
        const effect = {
            url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                query: GET_ALL_USERS,
                variables: { userId }
            })
        };
        const commit = {
            type: 'users/getAllUsersCommit',
            meta: { logLevel: 'DEBUG' }
        };
        const rollback = {
            type: 'users/getAllUsersRollback',
            meta: { logLevel: 'DEBUG', error: 'Failed to fetch users.' }
        };

        return {
            meta: {
                logLevel: 'DEBUG',
                offline: { effect, commit, rollback }
            }
        };
    }
);

export const fetchAllUsers = (userId, token) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(
                process.env.REACT_APP_GRAPHQL_ENDPOINT,
                {
                    query: GET_ALL_USERS,
                    variables: { userId }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )
                .then(response => {
                    const users = response.data.data.getAllUsers;
                    resolve(users);
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    };
};
