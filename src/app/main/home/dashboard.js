import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "./store/actions";
import reduce from "./store/reducers";
import withReducer from 'app/store/with_reducer';
import EmployeeConfigModal from './component/EmployeeConfigModal';
import EmployeeLayout from './component/EmployeeLayout';
import ImportExcelModal from './component/ImportExcelModal';
import { notificationPopup } from "app/helpers/common";
import './index.scss'
import { useTranslation } from "react-i18next";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [dataList ,setDataList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ openEmployeeDetail, setOpenEmployeeDetail] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [checkDataList, setCheckDataList] = useState(false);
    const [selectEmployee, setSelectEmployee] = useState(null);
    const [selectRecord, setSelectRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    
    // New states for import functionality
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [importLoading, setImportLoading] = useState(false);

    const { 
        loading, 
        limit, 
        totalElement, 
        employleList, 
        positionList, 
        employeeCreateOrUpdate 
    } = useSelector(state => state.dashboard.dashboard);
    
    // ---------------------------------
    // USEEFFECT
    // ---------------------------------

    useEffect(() => {
        dispatch(Actions.fetchListEmployee(0, 10));
        dispatch(Actions.fetchListPosition());
    }, [dispatch]);

    useEffect(() => {
        setDataList(employleList || []);
    }, [employleList]);

    useEffect(() => {
        if (employeeCreateOrUpdate) {
            notificationPopup(
                employeeCreateOrUpdate.status,
                employeeCreateOrUpdate.message
            );
        }
    }, [employeeCreateOrUpdate]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListEmployee(page - 1, limit)).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, page, limit, dispatch]);

    useEffect(() => {
        // Thiết lập một hàng đợi (timer)
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 1000); // Đợi 500ms sau khi ngừng gõ

        // Cleanup function: Xóa timer cũ nếu searchTerm thay đổi trước khi hết 500ms
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        const trimmed = debouncedSearchTerm.trim();
        
        if (trimmed) {
            setIsSearching(true);
            // Gọi action search ở đây
            dispatch(Actions.fetchSearchEmployee(trimmed, 0, 10))
                .catch(() => message.error(t("employee.searchError")));
        } else {
            // Nếu xóa trắng ô search, refresh lại danh sách gốc
            setIsSearching(false);
            refreshList(1, limit);
        }
    }, [debouncedSearchTerm, dispatch]);

    // ---------------------------------
    // HENDLERS
    // ---------------------------------

    const refreshList = (pageNumber = 1, pageSize = limit || 10) => {
        dispatch(Actions.fetchListEmployee(pageNumber - 1, pageSize));
    };

    const refreshSearch = (pageNumber = 1, pageSize = limit || 10) => {
        dispatch(Actions.fetchSearchEmployee( searchTerm.trim(), pageNumber - 1, pageSize));
    };

    const handlePageChange = (pageNumber, pageSize) => {
        setPage(pageNumber);
        if (isSearching) {
            refreshSearch(pageNumber, pageSize)
        } else {
            refreshList(pageNumber, pageSize);
        }
    };

    const handleOpenAdd = () => {
        setEditingRecord(null);
        setIsModalVisible(true);
    };

    const handleOpenEdit = (record) => {
        setEditingRecord(record);
        setIsModalVisible(true);
    };

    const handleSubmitModal = async (values) => {
        
        if (editingRecord) {
            await dispatch(Actions.UpdateEmployee(editingRecord.userId, values));
        } else {
            await dispatch(Actions.CreateEmployee(values));
        }
        setIsModalVisible(false);
        setCheckDataList(true);
    };

    const handleDelete = async (record) => {
        
        try {
            const res = await dispatch(Actions.DeleteEmployee(record.userId));
            
            const fullName = `${record.firstName ?? ""} ${
                record.lastName ?? ""
            }`.trim();

            if (res.status === 200) {
                message.success(
                res.message ||
                    t("employee.deleteSuccess", { name: fullName })
                );
            } else {
                message.error(res.message || t("employee.deleteError"));
            }

            setCheckDataList(true);
        } catch {
            message.error(t("employee.deleteError"));
        }
    };

    const onCloseModal = () => {
        setIsModalVisible(false);
    };

    const closeDetail = () => {
        setOpenEmployeeDetail(false);
    };

    const openDetail = (record) => {
        // console.log("record", record);
        
        // const mapped = mapRecordToEmployeeDetail(record);
        setOpenEmployeeDetail(true);
        setSelectEmployee(record);
        setSelectRecord(record);
    }

    const handleEditFromDetail = () => {
        if (!selectRecord) return;
        setOpenEmployeeDetail(false);
        handleOpenEdit(selectRecord)
    }

    const handleDeleteFromDetail = () => {
        if (!selectRecord) return;
        handleDelete(selectRecord);
        setOpenEmployeeDetail(false);
    }

    const handleSearch = (keyword) => {
        setSearchTerm(keyword);

        // const trimmed = keyword.trim();
        // if (!trimmed) {
        //     setIsSearching(false);
        //     refreshList(1, limit);
        //     return;
        // }
        // setIsSearching(true);
        // dispatch(Actions.fetchSearchEmployee(trimmed, 0, 10)).catch(() => {
        //     message.error(t("employee.searchError"));
        // });
    };

    // ---------------------------------
    // IMPORT HANDLERS
    // ---------------------------------
    const handleOpenImport = () => {
        setIsImportModalVisible(true);
    };

    const handleCloseImport = () => {
        setIsImportModalVisible(false);
    };

    const handleImportExcel = async (formData, onProgress) => {
        setImportLoading(true);
        try {
            await dispatch(Actions.importExcel(formData, onProgress));
            message.success(t("employee.import.success"));
            handleCloseImport();
            setCheckDataList(true); // Refresh list
        } catch (error) {
            message.error(error.message || t("employee.import.error"));
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await dispatch(Actions.downloadTemplate());
            // message.success(t("employee.downloadTemplate.success"));
        } catch (error) {
            message.error(t("employee.downloadTemplate.error"));
        }
    };

    // ---------------------------------
    // HELPER
    // ---------------------------------
    // const mapRecordToEmployeeDetail = (record) => ({
    //     employeeId: String(record.employeeId),
    //     firstName: record.firstName ?? "",
    //     lastName: record.lastName ?? "",
    //     fullName: record.fullName ?? "",
    //     username: record.username ?? "",
    //     province: record.province ?? "",
    //     district: record.district ?? "",
    //     address: record.address ?? "",
    //     gender: record.gender ?? "",
    //     birthday: record.birthday ?? "",
    //     email: record.email ?? "",
    //     phone: record.phone ?? "",
    //     cccd: record.cccd ?? "",
    //     description: record.description ?? "",
    //     startDate: record.startDate ?? "",
    //     endDate: record.endDate ?? "",
    //     status: record.status ?? "",
    //     department: record.departmentName ?? "",
    //     employeesCode: record.employeesCode ?? "",
    //     baseSalary: record.baseSalary ?? "",
    //     allowance: record.allowance ?? "",
    //     manages: record.manages ?? "",
    //     position: record.positionName,
    // });

    return (
        <>
            <EmployeeLayout
                loading={loading}
                page={page}
                limit={limit}
                totalElement={totalElement}
                handleOpenAdd={handleOpenAdd}
                handlePageChange={handlePageChange}
                onCloseModal={onCloseModal}
                handleSubmitModal={handleSubmitModal}
                editingRecord={editingRecord}
                dataList={dataList}
                positionList={positionList}
                isModalVisible={isModalVisible}
                setEditingRecord={setEditingRecord}
                onRowClick={openDetail}
                onSearch={handleSearch}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                // Import props
                handleOpenImport={handleOpenImport}
                handleImportExcel={handleImportExcel}
                handleDownloadTemplate={handleDownloadTemplate}
                importLoading={importLoading}
            />

            <EmployeeConfigModal 
                open={openEmployeeDetail}
                onClose={closeDetail}
                employee={selectEmployee}
                onEdit={handleEditFromDetail}
                onDelete={handleDeleteFromDetail}
            />

            <ImportExcelModal
                open={isImportModalVisible}
                onCancel={handleCloseImport}
                onImport={handleImportExcel}
                onDownloadTemplate={handleDownloadTemplate}
                loading={importLoading}
            />
        </>
    );
}
export default withReducer('dashboard', reduce)(Dashboard);
