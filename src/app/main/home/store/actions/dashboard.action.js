import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";
import { getSearchSignal } from "app/helpers/common";

// ===========  EXPORT ACTION  ============  //

// -- LIST EMPLOYEE
export const LIST_EMPLOYEE_LOADING = "LIST_EMPLOYEE_LOADING";
export const LIST_EMPLOYEE_FETCHED = "LIST_EMPLOYEE_FETCHED";
export const LIST_EMPLOYEE_ERROR = "LIST_EMPLOYEE_ERROR";

// -- EMPLOYEE DETAIL
export const EMPLOYEE_DETAIL_FETCHED = " EMPLOYEE_DETAIL_FETCHED";
export const EMPLOYEE_DETAIL_ERROR = "EMPLOYEE_DETAIL_ERROR";

// -- LIST POSITION
export const LIST_POSITION_LOADING = "LIST_POSITION_LOADING";
export const LIST_POSITION_FETCHED = "LIST_POSITION_FETCHED";
export const LIST_POSITION_ERROR = "LIST_POSITION_ERROR";

// -- LIST EMPLOYEE SEARCH
export const LIST_EMPLOYEE_SEARCH_FETCHED = "LIST_EMPLOYEE_SEARCH_FETCHED";
export const LIST_EMPLOYEE_SEARCH_FETCHING = "LIST_EMPLOYEE_SEARCH_FETCHING";
export const LIST_EMPLOYEE_SEARCH_ERROR = "LIST_EMPLOYEE_SEARCH_ERROR";

// -- lIST DEPARTMANT
export const LIST_DEPARTMENT_LOADING = "LIST_DEPARTMENT_LOADING";
export const LIST_DEPARTMENT_FETCHED = "LIST_DEPARTMENT_FETCHED";
export const LIST_DEPARTMENT_ERROR = "LIST_DEPARTMENT_ERROR";

// -- CREATE EMPLOYEE
export const CREATE_EMPLOYEE = "CREATE_EMPLOYEE";
export const CREATE_EMPLOYEE_ERROR = "CREATE_EMPLOYEE_ERROR";

// -- UPDATE EMPLOYEE
export const UPDATE_EMPLOYEE = "UPDATE_EMPLOYEE";
export const UPDATE_EMPLOYEE_ERROR = "UPDATE_EMPLOYEE_ERROR";

// -- DELETE EMPLOYEE
export const DELETE_EMPLOYEE = "DELETE_EMPLOYEE";
export const DELETE_EMPLOYEE_ERROR = "DELETE_EMPLOYEE_ERROR";

// -- SEARCH EMPLOYEE

// -- SALARY EMPLOYEE
export const SALARY_EMPLOYEE = "SALARY_EMPLOYEE";
export const SALARY_EMPLOYEE_ERROR = "SALARY_EMPLOYEE_ERROR";

// -- TIMEKEEPING EMPLOYEE
export const TIMEKEEPING_EMPLOYEE = "TIMEKEEPING_EMPLOYEE";
export const TIMEKEEPING_EMPLOYEE_ERROR = "TIMEKEEPING_EMPLOYEE_ERROR";

// -- LIST DETAIL EMPLOYEE
// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const fetchListEmployee = (page, limit) => async (dispatch) => {
    dispatch({type: LIST_EMPLOYEE_LOADING});

    try {
        const res = await axios.get(`/users?page=${page}&size=${limit}`);

        dispatch({
            type: LIST_EMPLOYEE_FETCHED,
            payload: res.data.data,
        });

        return res.data;

    } catch (error) {

        console.log('fetchListEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/users?page=${page}&size=${limit}`);

                    dispatch({
                        type: LIST_EMPLOYEE_FETCHED, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: LIST_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: LIST_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: LIST_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchEmployeeDettail = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/users/${id}`);

        dispatch({
            type: EMPLOYEE_DETAIL_FETCHED,
            payload: res.data,
        });

        return res.data;

    } catch (error) {

        console.log('fetchEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/users/${id}`);

                    dispatch({
                        type: EMPLOYEE_DETAIL_FETCHED, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: EMPLOYEE_DETAIL_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: EMPLOYEE_DETAIL_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: EMPLOYEE_DETAIL_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchListPosition = () => async (dispatch) => {
    dispatch({type: LIST_POSITION_LOADING});

    try {
        const res = await axios.get(`/position`);

        dispatch({
            type: LIST_POSITION_FETCHED,
            payload: res.data,
        });

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

export const fetchListDepartment = () => async (dispatch) => {
    dispatch({type: LIST_DEPARTMENT_LOADING});

    try {
        const res = await axios.get(`/department`);

        dispatch({
            type: LIST_DEPARTMENT_FETCHED,
            payload: res.data,
        });

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

            dispatch({
                type: LIST_DEPARTMENT_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const CreateEmployee = (data) => async (dispatch) => {

    try {
        const res = await axios.post(`/users`, data);

        if (res.data.status === 200) {
            dispatch({
                type: CREATE_EMPLOYEE,
                payload: res.data.data,
            });   
        } else {
            dispatch({type: CREATE_EMPLOYEE_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('CreateEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.post(`/users`, data);

                    dispatch({
                        type: CREATE_EMPLOYEE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: CREATE_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: CREATE_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: CREATE_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const UpdateEmployee = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/users/${id}`, data);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: UPDATE_EMPLOYEE,
                payload: res.data.data,
            });    
        } else {
            dispatch({
                type: UPDATE_EMPLOYEE_ERROR,
                payload: res.data.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('UpdateEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.put(`/users/${id}`, data);

                    dispatch({
                        type: UPDATE_EMPLOYEE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: UPDATE_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: UPDATE_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: UPDATE_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const DeleteEmployee = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/users/${id}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: DELETE_EMPLOYEE,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: DELETE_EMPLOYEE_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('DeleteEmployee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.delete(`/users/${id}`);

                    dispatch({
                        type: DELETE_EMPLOYEE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: DELETE_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: DELETE_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: DELETE_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchListSalary = (id, yearMonth) => async (dispatch) => {
    try {
        const res = await axios.get(`/salary/${id}?yearMonth=${yearMonth}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: SALARY_EMPLOYEE,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: SALARY_EMPLOYEE_ERROR,
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

                    const res = await axios.get(`/salary/${id}?yearMonth=${yearMonth}`);

                    dispatch({
                        type: SALARY_EMPLOYEE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: SALARY_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: SALARY_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: SALARY_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchListTimekeeping = (id, yearMonth) => async (dispatch) => {
    try {
        const res = await axios.get(`/time-keeping/${id}?yearMonth=${yearMonth}`);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: TIMEKEEPING_EMPLOYEE,
                payload: res.data,
            });    
        } else {
            dispatch({
                type: TIMEKEEPING_EMPLOYEE_ERROR,
                payload: res.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('Employee error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    const res = await axios.get(`/time-keeping/${id}?yearMonth=${yearMonth}`);

                    dispatch({
                        type: TIMEKEEPING_EMPLOYEE, 
                        payload: res.data
                    });

                    return res.data;
                } else {
                    dispatch({type: TIMEKEEPING_EMPLOYEE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: TIMEKEEPING_EMPLOYEE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: TIMEKEEPING_EMPLOYEE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchSearchEmployee = (search, page, limit) => async (dispatch) => {   
    // Lấy signal dành riêng cho việc tìm kiếm nhân viên
    const signal = getSearchSignal('EMPLOYEE_SEARCH');

    if (!signal.aborted) {
        dispatch({ type: LIST_EMPLOYEE_LOADING });
    }

    try {
        const res = await axios.get(`/users/search?keyword=${search}&page=${page}&size=${limit}`, {signal});
        console.log("search employee: ", res.data);
        
        dispatch({
            type: LIST_EMPLOYEE_SEARCH_FETCHED,
            payload: res.data,
        });
        return res.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Đã hủy request cũ để ưu tiên request mới nhất");
            return; // Bỏ qua nếu request bị hủy
        }
        
        if (error.response && error.response.status === 401) {
            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                    const res = await axios.get(`/users/search?keyword=${search}&page=${page}&size=${limit}`, {
                        signal: getSearchSignal('EMPLOYEE_SEARCH')
                    });
                    dispatch({type: LIST_EMPLOYEE_SEARCH_FETCHED, payload: res.data});
                    return res;
                } else {
                    dispatch({type: LIST_EMPLOYEE_SEARCH_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                if (axios.isCancel(refreshError)) {
                    console.log("Đã hủy request cũ để ưu tiên request mới nhất");
                    return; // Bỏ qua nếu request bị hủy
                }
                dispatch({type: LIST_EMPLOYEE_SEARCH_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {
            dispatch({type: LIST_EMPLOYEE_SEARCH_ERROR, payload: error});
            throw error;
        }
    }
};