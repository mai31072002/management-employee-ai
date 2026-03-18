import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";

// ===========  EXPORT ACTION  ============  //

// -- LIST POSITION 
export const LIST_POSITION_LOADING = "LIST_POSITION_LOADING";
export const LIST_POSITION_FETCHED = "LIST_POSITION_FETCHED";
export const LIST_POSITION_ERROR = "LIST_POSITION_ERROR";

// -- LIST SEARCH POSITION
// export const LIST_POSITION_SEARCH_FETCHED = "LIST_POSITION_SEARCH_FETCHED";
// export const LIST_POSITION_SEARCH_ERROR = "LIST_POSITION_SEARCH_ERROR";

// -- CREATE POSITION
export const CREATE_POSITION = "CREATE_POSITION";
export const CREATE_POSITION_ERROR = "CREATE_POSITION_ERROR";

// -- UPDATE POSITION
export const UPDATE_POSITION = "UPDATE_POSITION";
export const UPDATE_POSITION_ERROR = "UPDATE_POSITION_ERROR";

// -- DELETE POSITION
export const DELETE_POSITION = "DELETE_POSITION";
export const DELETE_POSITION_ERROR = "DELETE_POSITION_ERROR";

// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const fetchListPosition = () => async (dispatch) => {
    dispatch({type: LIST_POSITION_LOADING});

    try {
        const res = await axios.get(`/position`);
        // console.log("get Position: ", res);

        dispatch({
            type: LIST_POSITION_FETCHED,
            payload: res.data,
        });

        // console.log("get Position res data: ", res.data);
        return res.data;

    } catch (error) {

        console.log('fetchListPosition error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/position`);

                    dispatch({
                        type: LIST_POSITION_FETCHED, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: LIST_POSITION_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: LIST_POSITION_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: LIST_POSITION_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const CreatePosition = (data) => async (dispatch) => {

    try {
        const res = await axios.post(`/position`, data);
        // console.log("CreatePosition: ", res);

        if (res.data.status === 200) {
            dispatch({
                type: CREATE_POSITION,
                payload: res.data,
            });   
            // console.log("CreatePosition res data: ", res.data);
        } else {
            dispatch({type: CREATE_POSITION_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('CreatePosition error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.post(`/position`, data);

                    dispatch({
                        type: CREATE_POSITION, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: CREATE_POSITION_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: CREATE_POSITION_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: CREATE_POSITION_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const updatePosition = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/position/${id}`, data);
        console.log("updatePosition: ", res);

        if (res.data.status === 200) {
            dispatch({
                type: UPDATE_POSITION,
                payload: res.data,
            });   
            console.log("updatePosition res data data: ", res.data.data);
        } else {
            dispatch({type: UPDATE_POSITION_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('updatePosition error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.put(`/position/${id}`, data);

                    dispatch({
                        type: UPDATE_POSITION, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: UPDATE_POSITION_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: UPDATE_POSITION_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: UPDATE_POSITION_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const deletePosition = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/position/${id}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: DELETE_POSITION,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: DELETE_POSITION_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('deletePosition error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.delete(`/position/${id}`);

                    dispatch({
                        type: DELETE_POSITION, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: DELETE_POSITION_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: DELETE_POSITION_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: DELETE_POSITION_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

// export const fetchSearchDepartment = (search, page, limit) => async (dispatch) => {
//     dispatch({type: LIST_USER_LOADING});

//     try {
//         const res = await axios.get(`users/search?keyword=${search}&page=${page}&size=${limit}`);
        
//         dispatch({
//             type: LIST_USER_SEARCH_FETCHED,
//             payload: res.data.data,
//         });

//         console.log("search fetchSearchDepartment data data 2: ", res.data.data);
//         return res.data;
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             let tokenNew = jwtService.signInWithToken();

//             if (tokenNew) {
//                 axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;
//                 const res = await axios.get(`users/search?keyword=${search}&page=${page}&size=${limit}`);
//                 dispatch({type: LIST_USER_SEARCH_FETCHED, payload: res.data});
//                 return res;
//             } else {
//                 dispatch({type: LIST_USER_SEARCH_ERROR, payload: error});
//                 throw error;
//             }
//         } else {
//             dispatch({type: LIST_USER_SEARCH_ERROR, payload: error});
//             throw error;
//         }
//     }
// };