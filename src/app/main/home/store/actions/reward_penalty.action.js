import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";

// ===========  EXPORT ACTION  ============  //

// -- LIST REWARD PENALTY BY EMPLOYEE LOADING
export const LIST_REWARD_PENALTY_BY_EMPLOYEE_LOADING = "LIST_REWARD_PENALTY_BY_EMPLOYEE_LOADING";
export const LIST_REWARD_PENALTY_BY_EMPLOYEE_FETCHED = "LIST_REWARD_PENALTY_BY_EMPLOYEE_FETCHED";
export const LIST_REWARD_PENALTY_BY_EMPLOYEE_ERROR = "LIST_REWARD_PENALTY_BY_EMPLOYEE_ERROR";

// -- CREATE REWARD PENALTY
export const CREATE_REWARD_PENALTY = "CREATE_REWARD_PENALTY";
export const CREATE_REWARD_PENALTY_ERROR = "CREATE_REWARD_PENALTY_ERROR";

// -- UPDATE REWARD PENALTY
export const UPDATE_REWARD_PENALTY = "UPDATE_REWARD_PENALTY";
export const UPDATE_REWARD_PENALTY_ERROR = "UPDATE_REWARD_PENALTY_ERROR";

// -- DELETE REWARD PENALTY
export const DELETE_REWARD_PENALTY = "DELETE_REWARD_PENALTY";
export const DELETE_REWARD_PENALTY_ERROR = "DELETE_REWARD_PENALTY_ERROR";

// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const fetchRewardPenaltyByEmployee = (id, fromDate, toDate, type) => async (dispatch) => {
    dispatch({type: LIST_REWARD_PENALTY_BY_EMPLOYEE_LOADING});

    try {
        const res = await axios.get(`/reward-penalty/${id}?fromDate=${fromDate}&toDate=${toDate}&type=${type}`);

        dispatch({
            type: LIST_REWARD_PENALTY_BY_EMPLOYEE_FETCHED,
            payload: res.data,
        });

        return res.data;

    } catch (error) {

        console.log('fetchRewardPenaltyByEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/reward-penalty/${id}?fromDate=${fromDate}&toDate=${toDate}&type=${type}`);

                    dispatch({
                        type: LIST_REWARD_PENALTY_BY_EMPLOYEE_FETCHED, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: LIST_REWARD_PENALTY_BY_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: LIST_REWARD_PENALTY_BY_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: LIST_REWARD_PENALTY_BY_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const createRewardPenalty = (data) => async (dispatch) => {

    try {
        const res = await axios.post(`/reward-penalty`, data);
        console.log("create Reward Penalty: ", res);

        if (res.data.status === 200) {
            dispatch({
                type: CREATE_REWARD_PENALTY,
                payload: res.data.data,
            });   

            console.log("create Reward Penalty data: ", res.data);
        } else {
            dispatch({type: CREATE_REWARD_PENALTY_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('createRewardPenalty error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.post(`/reward-penalty`, data);

                    dispatch({
                        type: CREATE_REWARD_PENALTY, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: CREATE_REWARD_PENALTY_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: CREATE_REWARD_PENALTY_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

                dispatch({type: CREATE_REWARD_PENALTY_ERROR, payload: error});

                throw error;
            }
    }
};

export const UpdateRewardPenalty = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/reward-penalty/${id}`, data);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: UPDATE_REWARD_PENALTY,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: UPDATE_REWARD_PENALTY_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('UpdateRewardPenalty error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.put(`/reward-penalty/${id}`, data);

                    dispatch({
                        type: UPDATE_REWARD_PENALTY, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: UPDATE_REWARD_PENALTY_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: UPDATE_REWARD_PENALTY_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

                dispatch({type: UPDATE_REWARD_PENALTY_ERROR, payload: error});

                throw error;
            }
    }
};

export const DeleteRewardPenalty = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/reward-penalty/${id}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: DELETE_REWARD_PENALTY,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: DELETE_REWARD_PENALTY_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('DeleteRewardPenalty error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.delete(`/reward-penalty/${id}`);

                    dispatch({
                        type: DELETE_REWARD_PENALTY, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: DELETE_REWARD_PENALTY_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: DELETE_REWARD_PENALTY_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

                dispatch({type: DELETE_REWARD_PENALTY_ERROR, payload: error}); 

                throw error;
            }
        }
    };