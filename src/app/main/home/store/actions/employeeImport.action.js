import apiConfig from "app/configs/api.config";
import axios from "axios";
// import jwtService from "app/service/jwt";

export const IMPORT_EXCEL_REQUEST = "IMPORT_EXCEL_REQUEST";
export const IMPORT_EXCEL_SUCCESS = "IMPORT_EXCEL_SUCCESS";
export const IMPORT_EXCEL_FAILURE = "IMPORT_EXCEL_FAILURE";

export const DOWNLOAD_TEMPLATE_REQUEST = "DOWNLOAD_TEMPLATE_REQUEST";
export const DOWNLOAD_TEMPLATE_SUCCESS = "DOWNLOAD_TEMPLATE_SUCCESS";
export const DOWNLOAD_TEMPLATE_FAILURE = "DOWNLOAD_TEMPLATE_FAILURE";

export const DELETE_EMPLOYEE_REQUEST = "DELETE_EMPLOYEE_REQUEST";
export const DELETE_EMPLOYEE_SUCCESS = "DELETE_EMPLOYEE_SUCCESS";
export const DELETE_EMPLOYEE_FAILURE = "DELETE_EMPLOYEE_FAILURE";

axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const importExcel = (formData, onProgress) => async (dispatch) => {
    try {
        dispatch({ type: "IMPORT_EXCEL_REQUEST" });
        
        const response = await axios.post("/users/import-excel", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress && onProgress(progress);
            },
        });

        console.log("response: ", response);

        // Check if response indicates an error
        if (response.data.status === 200) {
            dispatch({
                type: "IMPORT_EXCEL_SUCCESS",
                payload: response.data,
            });
        }

        return response.data;
    } catch (error) {
        console.log("error 22", error);
        dispatch({
            type: "IMPORT_EXCEL_FAILURE",
            payload: error.response?.data?.message || error.message,
        });
        throw error;
    }
};

export const downloadTemplate = () => async (dispatch) => {
    try {
        dispatch({ type: "DOWNLOAD_TEMPLATE_REQUEST" });
        
        const response = await axios.get("/users/download-template", {
            responseType: 'blob',
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'employee-template.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        dispatch({
            type: "DOWNLOAD_TEMPLATE_SUCCESS",
        });

        return response.data;
    } catch (error) {
        dispatch({
            type: "DOWNLOAD_TEMPLATE_FAILURE",
            payload: error.response?.data?.message || error.message,
        });
        throw error;
    }
};

export const deleteEmployee = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: "DELETE_EMPLOYEE_REQUEST" });
        
        const response = await axios.delete(`/users/${employeeId}`);

        dispatch({
            type: "DELETE_EMPLOYEE_SUCCESS",
            payload: response.data,
        });

        return response.data;
    } catch (error) {
        dispatch({
            type: "DELETE_EMPLOYEE_FAILURE",
            payload: error.response?.data?.message || error.message,
        });
        throw error;
    }
};
