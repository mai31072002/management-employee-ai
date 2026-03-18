import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";

// ===========  EXPORT ACTION  ============  //

// -- OT DATE EMPLOYEE
export const OT_DATE_EMPLOYEE = "OT_DATE_EMPLOYEE";
export const OT_DATE_EMPLOYEE_ERROR = "OT_DATE_EMPLOYEE_ERROR";

// -- OT DATE EMPLOYEE ID
export const OT_DATE_EMPLOYEE_ID = "OT_DATE_EMPLOYEE_ID";
export const OT_DATE_EMPLOYEE_ID_ERROR = "OT_DATE_EMPLOYEE_ID_ERROR";

// -- CREATE OT DATE
export const OT_DATE_EMPLOYEE_LOADING = "OT_DATE_EMPLOYEE_LOADING";
export const CREATE_OT_DATE = "CREATE_OT_DATE";
export const CREATE_OT_DATE_ERROR = "CREATE_OT_DATE_ERROR";

// -- UPDATE OT DATE
export const UPDATE_OT_DATE = "UPDATE_OT_DATE";
export const UPDATE_OT_DATE_ERROR = "UPDATE_OT_DATE_ERROR";

// -- DELETE OT DATE
export const DELETE_OT_DATE = "DELETE_OT_DATE";
export const DELETE_OT_DATE_ERROR = "DELETE_OT_DATE_ERROR";

// -- LIST DETAIL EMPLOYEE
// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const fetchListOtDateEmployeeId = (id, month) => async (dispatch) => {
    try {
        const res = await axios.get(`/ot-date/${id}?month=${month}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: OT_DATE_EMPLOYEE_ID,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: OT_DATE_EMPLOYEE_ID_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('otDateEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/ot-date/${id}?month=${month}`);

                    dispatch({
                        type: OT_DATE_EMPLOYEE_ID, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: OT_DATE_EMPLOYEE_ID_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: OT_DATE_EMPLOYEE_ID_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: OT_DATE_EMPLOYEE_ID_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchListOtDate = (page, limit, fromDate, toDate, status) => async (dispatch) => {
    dispatch({type: OT_DATE_EMPLOYEE_LOADING});
    try {
        const res = await axios.get(`/ot-date?page=${page}&size=${limit}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: OT_DATE_EMPLOYEE,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: OT_DATE_EMPLOYEE_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('otDateEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/ot-date?page=${page}&size=${limit}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`);

                    dispatch({
                        type: OT_DATE_EMPLOYEE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: OT_DATE_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: OT_DATE_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: OT_DATE_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const CreateOtDay = (data) => async (dispatch) => {

    try {
        const res = await axios.post(`/ot-date`, data);

        if (res.data.status === 200) {
            dispatch({
                type: CREATE_OT_DATE,
                payload: res.data.data,
            });   
        } else {
            dispatch({type: CREATE_OT_DATE_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('CreateOtDate error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.post(`/ot-date`, data);

                    dispatch({
                        type: CREATE_OT_DATE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: CREATE_OT_DATE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: CREATE_OT_DATE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: CREATE_OT_DATE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const UpdateOtDate = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/ot-date/${id}`, data);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: UPDATE_OT_DATE,
                payload: res.data.data,
            });    
        } else {
            dispatch({
                type: UPDATE_OT_DATE_ERROR,
                payload: res.data.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('UpdateOtdate error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.put(`/ot-date/${id}`, data);

                    dispatch({
                        type: UPDATE_OT_DATE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: UPDATE_OT_DATE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: UPDATE_OT_DATE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: UPDATE_OT_DATE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const DeleteOtDate = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/ot-date/${id}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: DELETE_OT_DATE,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: DELETE_OT_DATE_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('DeleteOtDate error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.delete(`/ot-date/${id}`);

                    dispatch({
                        type: DELETE_OT_DATE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: DELETE_OT_DATE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: DELETE_OT_DATE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: DELETE_OT_DATE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};