import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";

// ===========  EXPORT ACTION  ============  //

// -- LIST LEVER 
export const LIST_LEVER_LOADING = "LIST_LEVER_LOADING";
export const LIST_LEVER_FETCHED = "LIST_LEVER_FETCHED";
export const LIST_LEVER_ERROR = "LIST_LEVER_ERROR";

// -- LIST SEARCH LEVER
// export const LIST_LEVER_SEARCH_FETCHED = "LIST_LEVER_SEARCH_FETCHED";
// export const LIST_LEVER_SEARCH_ERROR = "LIST_LEVER_SEARCH_ERROR";

// -- CREATE LEVER
export const CREATE_LEVER = "CREATE_LEVER";
export const CREATE_LEVER_ERROR = "CREATE_LEVER_ERROR";

// -- UPDATE LEVER
export const UPDATE_LEVER = "UPDATE_LEVER";
export const UPDATE_LEVER_ERROR = "UPDATE_LEVER_ERROR";

// -- DELETE LEVER
export const DELETE_LEVER = "DELETE_LEVER";
export const DELETE_LEVER_ERROR = "DELETE_LEVER_ERROR";

// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const fetchListLever = () => async (dispatch) => {
    dispatch({type: LIST_LEVER_LOADING});

    try {
        const res = await axios.get(`/lever`);
        // console.log("get fetchListLever: ", res);

        dispatch({
            type: LIST_LEVER_FETCHED,
            payload: res.data,
        });
        // console.log("get  res data: ", res.data);
        return res.data;

    } catch (error) {

        console.log('fetchListLever error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/lever`);

                    dispatch({
                        type: LIST_LEVER_FETCHED, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: LIST_LEVER_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: LIST_LEVER_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: LIST_LEVER_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const CreateLever = (data) => async (dispatch) => {

    try {
        const res = await axios.post(`/lever`, data);
        // console.log("CreateLever: ", res);

        if (res.data.status === 200) {
            dispatch({
                type: CREATE_LEVER,
                payload: res.data,
            });   
            // console.log("CreateLever res data: ", res.data);
        } else {
            dispatch({type: CREATE_LEVER_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('CreateLever error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.post(`/lever`, data);

                    dispatch({
                        type: CREATE_LEVER, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: CREATE_LEVER_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: CREATE_LEVER_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: CREATE_LEVER_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const updateLever = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/lever/${id}`, data);
        console.log("updateLever: ", res);

        if (res.data.status === 200) {
            dispatch({
                type: UPDATE_LEVER,
                payload: res.data,
            });   
            console.log("updateLever res data data: ", res.data.data);
        } else {
            dispatch({type: UPDATE_LEVER_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('updateLever error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.put(`/lever/${id}`, data);

                    dispatch({
                        type: UPDATE_LEVER, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: UPDATE_LEVER_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: UPDATE_LEVER_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: UPDATE_LEVER_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const deleteLever = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/lever/${id}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: DELETE_LEVER,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: DELETE_LEVER_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('deleteLever error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.delete(`/lever/${id}`);

                    dispatch({
                        type: DELETE_LEVER, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: DELETE_LEVER_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: DELETE_LEVER_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: DELETE_LEVER_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};
