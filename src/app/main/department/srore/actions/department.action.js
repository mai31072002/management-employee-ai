import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";

// ===========  EXPORT ACTION  ============  //

// -- LIST USER 
export const LIST_DEPARTMENT_LOADING = "LIST_DEPARTMENT_LOADING";
export const LIST_DEPARTMENT_FETCHED = "LIST_DEPARTMENT_FETCHED";
export const LIST_DEPARTMENT_ERROR = "LIST_DEPARTMENT_ERROR";

// -- LIST SEARCH DEPARTMENT
// export const LIST_DEPARTMENT_SEARCH_FETCHED = "LIST_DEPARTMENT_SEARCH_FETCHED";
// export const LIST_DEPARTMENT_SEARCH_ERROR = "LIST_DEPARTMENT_SEARCH_ERROR";

// -- CREATE DEPARTMENT
export const CREATE_DEPARTMENT = "CREATE_DEPARTMENT";
export const CREATE_DEPARTMENT_ERROR = "CREATE_DEPARTMENT_ERROR";

// -- UPDATE DEPARTMENT
export const UPDATE_DEPARTMENT = "UPDATE_DEPARTMENT";
export const UPDATE_DEPARTMENT_ERROR = "UPDATE_DEPARTMENT_ERROR";

// -- DELETE DEPARTMENT
export const DELETE_DEPARTMENT = "DELETE_DEPARTMENT";
export const DELETE_DEPARTMENT_ERROR = "DELETE_DEPARTMENT_ERROR";

// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const fetchListDepartment = () => async (dispatch) => {
    dispatch({type: LIST_DEPARTMENT_LOADING});

    try {
        const res = await axios.get(`/department`);
        // console.log("get department: ", res);

        dispatch({
            type: LIST_DEPARTMENT_FETCHED,
            payload: res.data,
        });

        // console.log("get department res data: ", res.data);
        return res.data;

    } catch (error) {

        console.log('fetchListDepartment error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/department`);

                    dispatch({
                        type: LIST_DEPARTMENT_FETCHED, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: LIST_DEPARTMENT_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: LIST_DEPARTMENT_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

                dispatch({type: LIST_DEPARTMENT_ERROR, payload: error});

                throw error;
            }
    }
};

export const CreateDepartment = (data) => async (dispatch) => {

    try {
        const res = await axios.post(`/department`, data);
        // console.log("CreateDepartment: ", res);

        if (res.data.status === 200) {
            dispatch({
                type: CREATE_DEPARTMENT,
                payload: res.data,
            });   
            // console.log("CreateDepartment res data: ", res.data);
        } else {
            dispatch({type: CREATE_DEPARTMENT_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('CreateDepartment error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.post(`/department`, data);

                    dispatch({
                        type: CREATE_DEPARTMENT, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: CREATE_DEPARTMENT_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: CREATE_DEPARTMENT_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

                dispatch({type: CREATE_DEPARTMENT_ERROR, payload: error});

                throw error;
            }
    }
};

export const updateDepartment = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/department/${id}`, data);
        console.log("updateDepartment: ", res);

        if (res.data.status === 200) {
            dispatch({
                type: UPDATE_DEPARTMENT,
                payload: res.data,
            });   
            console.log("updateDepartment res data data: ", res.data.data);
        } else {
            dispatch({type: UPDATE_DEPARTMENT_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('updateDepartment error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.put(`/department/${id}`, data);

                    dispatch({
                        type: UPDATE_DEPARTMENT, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: UPDATE_DEPARTMENT_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: UPDATE_DEPARTMENT_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

                dispatch({type: UPDATE_DEPARTMENT_ERROR, payload: error});

                throw error;
            }
    }
};

export const deleteDepartment = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/department/${id}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: DELETE_DEPARTMENT,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: DELETE_DEPARTMENT_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('deleteDepartment error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.delete(`/department/${id}`);

                    dispatch({
                        type: DELETE_DEPARTMENT, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: DELETE_DEPARTMENT_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: DELETE_DEPARTMENT_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

                dispatch({type: DELETE_DEPARTMENT_ERROR, payload: error});
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