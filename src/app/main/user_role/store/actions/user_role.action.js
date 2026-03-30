import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";

// ===========  EXPORT ACTION  ============  //

// -- LIST USER 
export const LIST_USER_LOADING = "LIST_USER_LOADING";
export const LIST_USER_FETCHED = "LIST_USER_FETCHED";
export const LIST_USER_ERROR = "LIST_USER_ERROR";

// -- LIST SEARCH USER
export const LIST_USER_SEARCH_FETCHED = "LIST_USER_SEARCH_FETCHED";
export const LIST_USER_SEARCH_ERROR = "LIST_USER_SEARCH_ERROR";

// -- LIST ROLE 
export const LIST_ROLE_LOADING = "LIST_ROLE_LOADING";
export const LIST_ROLE_FETCHED = "LIST_ROLE_FETCHED";
export const LIST_ROLE_ERROR = "LIST_ROLE_ERROR";

// -- LIST PERMISSION 
export const LIST_PERMISSION_LOADING = "LIST_PERMISSION_LOADING";
export const LIST_PERMISSION_FETCHED = "LIST_PERMISSION_FETCHED";
export const LIST_PERMISSION_ERROR = "LIST_PERMISSION_ERROR";

// -- CREATE ROLE
export const CREATE_ROLE = "CREATE_ROLE";
export const CREATE_ROLE_ERROR = "CREATE_ROLE_ERROR";

// -- DELETE ROLE
export const DELETE_ROLE = "DELETE_ROLE";
export const DELETE_ROLE_ERROR = "DELETE_ROLE_ERROR";

// -- UPDATE USER
export const UPDATE_ROLE = "UPDATE_ROLE";
export const UPDATE_ROLE_ERROR = "UPDATE_ROLE_ERROR";

// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const fetchListUser = (page, limit) => async (dispatch) => {
    dispatch({type: LIST_USER_LOADING});

    try {
        const res = await axios.get(`/users?page=${page}&size=${limit}`);

        dispatch({
            type: LIST_USER_FETCHED,
            payload: res.data,
        });

        return res.data;

    } catch (error) {

        console.log('fetchListUser error:', error);

        if (error.response && error.response.status === 401) {

            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {

                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;

                const res = await axios.get(`/users?page=${page}&size=${limit}`);

                dispatch({
                    type: LIST_USER_FETCHED, 
                    payload: res.data
                });

                return res.data;

            } else {

                dispatch({type: LIST_USER_ERROR, payload: error});

                throw error;
            }
        } else {

            dispatch({
                type: LIST_USER_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchListRole = () => async (dispatch) => {
    dispatch({type: LIST_ROLE_LOADING});

    try {
        const res = await axios.get(`/role`);

        dispatch({
            type: LIST_ROLE_FETCHED,
            payload: res.data,
        });

        return res.data;

    } catch (error) {

        console.log('fetchListRole error:', error);

        if (error.response && error.response.status === 401) {

            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {

                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;

                const res = await axios.get(`/role`);

                dispatch({
                    type: LIST_ROLE_FETCHED, 
                    payload: res.data
                });

                return res.data;

            } else {

                dispatch({type: LIST_ROLE_ERROR, payload: error});

                throw error;
            }
        } else {

            dispatch({
                type: LIST_ROLE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchListPermission = () => async (dispatch) => {
    dispatch({type: LIST_PERMISSION_LOADING});

    try {
        const res = await axios.get(`/permission`);

        dispatch({
            type: LIST_PERMISSION_FETCHED,
            payload: res.data,
        });

        return res.data;

    } catch (error) {

        console.log('fetchListPermission error:', error);

        if (error.response && error.response.status === 401) {

            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {

                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;

                const res = await axios.get(`/permission`);

                dispatch({
                    type: LIST_PERMISSION_FETCHED, 
                    payload: res.data
                });

                return res.data;

            } else {

                dispatch({type: LIST_PERMISSION_ERROR, payload: error});

                throw error;
            }
        } else {

            dispatch({
                type: LIST_PERMISSION_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const CreateRole = (data) => async (dispatch) => {

    try {
        const res = await axios.post(`/role`, data);

        if (res.data.status === 200) {
            dispatch({
                type: CREATE_ROLE,
                payload: res.data.data,
            });   
        } else {
            dispatch({type: CREATE_ROLE_ERROR, payload: res.data});
            throw res.data; // Throw error for frontend error handling
        }
        return res.data;

    } catch (error) {

        console.log('CreateRole error:', error);

        if (error.response && error.response.status === 401) {

            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {

                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;

                const res = await axios.post(`/role`, data);

                dispatch({
                    type: CREATE_ROLE, 
                    payload: res.data
                });

                return res.data;

            } else {

                dispatch({type: CREATE_ROLE_ERROR, payload: error});

                throw error;
            }
        } else {

            dispatch({
                type: CREATE_ROLE_ERROR, 
                payload: error
            });
            
            // Throw error for frontend to handle
            throw error;
        }
    }
};

export const DeleteRole = (id) => async (dispatch) => {
    
    try {
        const res = await axios.delete(`/role/${id}`);

        if (res.data.status === 200) {
            dispatch({
                type: DELETE_ROLE,
                payload: id,
            });   
        } else {
            dispatch({type: DELETE_ROLE_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('DeleteRole error:', error);

        if (error.response && error.response.status === 401) {

            try {
                const tokenData = await jwtService.signInWithToken();
                
                if (tokenData && tokenData.data) {
                    const newToken = tokenData.data.accessToken;
                    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                    
                    const res = await axios.delete(`/role/${id}`);
                    
                    dispatch({
                        type: DELETE_ROLE, 
                        payload: id
                    });

                    return res.data;
                } else {
                    dispatch({type: DELETE_ROLE_ERROR, payload: error});
                    throw error;
                }
            } catch (refreshError) {
                dispatch({type: DELETE_ROLE_ERROR, payload: refreshError});
                throw refreshError;
            }
        } else {

            dispatch({
                type: DELETE_ROLE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const updateUser = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/users/${id}`, data);

        if (res.data.status === 200) {
            dispatch({
                type: UPDATE_ROLE,
                payload: res.data.data,
            });   
        } else {
            dispatch({type: UPDATE_ROLE_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('updateUser error:', error);

        if (error.response && error.response.status === 401) {

            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {

                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;

                const res = await axios.put(`/users/${id}`, data);

                dispatch({
                    type: UPDATE_ROLE, 
                    payload: res.data
                });

                return res.data;

            } else {

                dispatch({type: UPDATE_ROLE_ERROR, payload: error});

                throw error;
            }
        } else {

            dispatch({
                type: UPDATE_ROLE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const updateRole = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/role/${id}`, data);

        if (res.data.status === 200) {
            dispatch({
                type: UPDATE_ROLE,
                payload: res.data.data,
            });   
        } else {
            dispatch({type: UPDATE_ROLE_ERROR, payload: res.data});
        }
        return res.data;

    } catch (error) {

        console.log('updateRole error:', error);

        if (error.response && error.response.status === 401) {

            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {

                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;

                const res = await axios.put(`/role/${id}`, data);

                dispatch({
                    type: UPDATE_ROLE, 
                    payload: res.data
                });

                return res.data;

            } else {

                dispatch({type: UPDATE_ROLE_ERROR, payload: error});

                throw error;
            }
        } else {

            dispatch({
                type: UPDATE_ROLE_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};

export const fetchSearchUser = (search, page, limit) => async (dispatch) => {
    dispatch({type: LIST_USER_LOADING});

    try {
        const res = await axios.get(`users/search?keyword=${search}&page=${page}&size=${limit}`);
        
        dispatch({
            type: LIST_USER_SEARCH_FETCHED,
            payload: res.data.data,
        });

        console.log("search fetchSearchUser data data 2: ", res.data.data);
        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {
                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;
                const res = await axios.get(`users/search?keyword=${search}&page=${page}&size=${limit}`);
                dispatch({type: LIST_USER_SEARCH_FETCHED, payload: res.data});
                return res;
            } else {
                dispatch({type: LIST_USER_SEARCH_ERROR, payload: error});
                throw error;
            }
        } else {
            dispatch({type: LIST_USER_SEARCH_ERROR, payload: error});
            throw error;
        }
    }
};