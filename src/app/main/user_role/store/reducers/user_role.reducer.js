import * as Action from "../actions";

const initialState = {
    loading: false,
    error: null,
    userList: {
        data: [],
        status: null,
        message: "",
        page: 1, 
        limit: 10,
        totalElement: 0,
    },
    roleList: {
        data: [],
        status: null,
        message: "",
    },
    permissionList: {
        data: [],
        status: null,
        message: "",
    },
    createRole: null,
    deleteRole: null,
    updateRole: null,
}

const userRoleReducer = (state  = initialState, action) => {
    switch (action.type) {
        case Action.LIST_USER_LOADING: 
            return {
                ...state,
                loading: true,
            }
        case Action.LIST_USER_FETCHED:
            return {
                ...state,
                loading: false,
                userList: {
                    data: action.payload.data.data,
                    status: action.payload.data.status,
                    message: action.payload.data.message,
                    page: action.payload.data.pageableRep.page, 
                    limit: action.payload.data.pageableRep.limit,
                    totalElement: action.payload.data.pageableRep.totalElements,
                },
            }
        case Action.LIST_USER_SEARCH_FETCHED:
            return {
                ...state,
                loading: false,
                userList: {
                    data: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                    page: action.payload.pageableRep.page, 
                    limit: action.payload.pageableRep.limit,
                    totalElement: action.payload.pageableRep.totalElements,
                },
            }
        case Action.LIST_USER_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case Action.LIST_ROLE_FETCHED:
            return {
                ...state,
                loading: false,
                roleList: {
                    data: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                },
            }
        case Action.LIST_PERMISSION_FETCHED:
            return {
                ...state,
                loading: false,
                permissionList: {
                    data: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                },
            }
        case Action.CREATE_ROLE:
            return {
                ...state,
                createRole: action.payload,
            }
        case Action.DELETE_ROLE:
            return {
                ...state,
                deleteRole: action.payload,
            }
        case Action.UPDATE_ROLE:
            return {
                ...state,
                updateRole: action.payload,
            }
        case Action.DELETE_ROLE_ERROR:
            return {
                ...state,
                deleteRole: action.payload,
            }
        case Action.UPDATE_ROLE_ERROR:
            return {
                ...state,
                updateRole: action.payload,
            }
        default:
            return state;
    }
}

export default userRoleReducer;