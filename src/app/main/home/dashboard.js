import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "./store/actions";
import reduce from "./store/reducers";
import withReducer from 'app/store/with_reducer';
import EmployeeConfigModal from './component/EmployeeConfigModal';
import { notificationPopup } from "app/helpers/common";
import EmployeeLayout from './component/EmployeeLayout';
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
    const [isSearching, setIsSearching] = useState(false);

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
            await dispatch(Actions.UpdateEmployee(editingRecord.employeeId, values));
        } else {
            await dispatch(Actions.CreateEmployee(values));
        }
        setIsModalVisible(false);
        setCheckDataList(true);
    };

    const handleDelete = async (record) => {
        
        try {
            const res = await dispatch(Actions.DeleteEmployee(record.employeeId));
            
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
        const mapped = mapRecordToEmployeeDetail(record);
        setOpenEmployeeDetail(true);
        setSelectEmployee(mapped);
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

        const trimmed = keyword.trim();
        if (!trimmed) {
            setIsSearching(false);
            refreshList(1, limit);
            return;
        }
        setIsSearching(true);
        dispatch(Actions.fetchSearchEmployee(trimmed, 0, 10)).catch(() => {
            message.error(t("employee.searchError"));
        });
    };

    // ---------------------------------
    // HELPER
    // ---------------------------------
    const mapRecordToEmployeeDetail = (record) => ({
        employeeId: String(record.employeeId),
        firstName: record.firstName ?? "",
        lastName: record.lastName ?? "",
        fullName: record.fullName ?? "",
        username: record.username ?? "",
        province: record.province ?? "",
        district: record.district ?? "",
        address: record.address ?? "",
        gender: record.gender ?? "",
        birthday: record.birthday ?? "",
        email: record.email ?? "",
        phone: record.phone ?? "",
        cccd: record.cccd ?? "",
        description: record.description ?? "",
        startDate: record.startDate ?? "",
        endDate: record.endDate ?? "",
        status: record.status ?? "",
        department: record.departmentName ?? "",
        employeesCode: record.employeesCode ?? "",
        baseSalary: record.baseSalary ?? "",
        allowance: record.allowance ?? "",
        manages: record.manages ?? "",
        position: record.positionName,
    });

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
            />

            <EmployeeConfigModal 
                open={openEmployeeDetail}
                onClose={closeDetail}
                employee={selectEmployee}
                onEdit={handleEditFromDetail}
                onDelete={handleDeleteFromDetail}
            />
        </>
    );
}
export default withReducer('dashboard', reduce)(Dashboard);

// import { useContext } from "react";
// import { ThemeContext } from "../../layout/home_theme_provider";

// function Home() {
//   const { setTheme } = useContext(ThemeContext);

//   const handleTheme = (bg, text) => {
//     setTheme({ background: bg, text: text }); // sửa typo
//   };

//   return (
    // <div>
    //   <button onClick={() => handleTheme("#222", "#fff")}>Dark Mode</button>
    //   <button onClick={() => handleTheme("#fff", "#000")}>Light Mode</button>
    // </div>
    // <div></div>
//   );
// }
