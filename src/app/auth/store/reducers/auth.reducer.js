import * as Actions from "../actions";

const initialState = {
    success: false,
    error: null,
    isLoading: false,
    login: {
        isLoading: false,
        data: null,
        status: null,
    },
    forgotPass: {
        status: null,
        message: "",
    }
};

// reducer xử lý các action liên quan đến đăng nhập
const login = (state = initialState, action) => {
  switch (action.type) {
    case Actions.AUTH_SUCCESSS:
      return {
        ...initialState, // (hoặc state)
        success: true,
        isLoading: false,
      };
    case Actions.AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case Actions.AUTH_FETCH:
        return {
            ...state,
            login: {
                isLoading: true,
                data: action.payload,
                status: 200,
            },
        };
    case Actions.AUTH_ERROR:
        return {
            success: false,
            error: action.payload,
            isLoading: false,
            login: {
                isLoading: false,
                data: action.payload,
                status: action.payload.status,
            },
            forgotPass: {
                status: null,
                message: "",
            }
        };
    case Actions.AUTH_RESET:
        return {
            success: false,
            error: null,
            isLoading: false,
            login: {
                isLoading: false,
                data: null,
                status: null,
            },
        };
    case Actions.FORGOT_PASS: {
        return {
            forgotPass: {
                status: action.payload.status,
                message: action.payload.message,
            }
        }
    }
    case Actions.FORGOT_PASS_ERROR: {
        return {
            forgotPass: {
                status: action.payload.status,
                message: action.payload.message,
            }
        }
    }
    default:
      return initialState;
  }
};

export default login;
