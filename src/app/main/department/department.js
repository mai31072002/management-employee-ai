import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, message, Tooltip, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./srore/actions";
import reducer from "./srore/reducers";
import withReducer from "app/store/with_reducer";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddEditDepartmentModal from "./component/AddEditDepartment";
import { notificationPopup } from "app/helpers/common";
import './index.scss';
import { useTranslation } from "react-i18next";

const DepartmentManagement = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    // const [page, setPage] = useState(1);
    const [dataList ,setDataList] = useState([]);
    const [checkDataList, setCheckDataList] = useState(false);
    const [openAddDepartment, setOpenAddDepartment] = useState(false);
    // const [openEdit, setOpenEdit] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [isSearching, setIsSearching] = useState(false);

    // ===== REDUX STATE =====
    const data = useSelector(
        state => state.department.department.departmentList.data || []
    );

    const createUpdateDepartment = useSelector(
        state => state.department.department.createUpdateDepartment || null
    );

    // ===== FETCH DATA =====
    useEffect(() => {
        dispatch(Actions.fetchListDepartment());
    }, [dispatch]);

    useEffect(() => {
        setDataList(data || []);
    }, [data]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListDepartment()).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch]);

    useEffect(() => {
        if (createUpdateDepartment !== null && createUpdateDepartment.length !== 0) {
            notificationPopup(
                createUpdateDepartment.status,
                createUpdateDepartment.message
            );
        }
    }, [createUpdateDepartment]);

    // ===== HANDLE SAVE =====
    const handleSubmit = async (values) => {
        if (editingDepartment) {
            await dispatch(Actions.updateDepartment(editingDepartment.id, values));
        } else {
            await dispatch(Actions.CreateDepartment(values));
        }
        setOpenAddDepartment(false);
        setCheckDataList(true);
    }

    const handleAdd = () => {
        setOpenAddDepartment(true);
        setEditingDepartment(null);
    }

    const handleUpdate = (values) => {
        setOpenAddDepartment(true);
        setEditingDepartment(values);
    }

    const handleOnCancel = () => {
        setOpenAddDepartment(false);
        setEditingDepartment(null);
    }

    const handleDelete = async (record) => {
            
        try {
            const res = await dispatch(Actions.deleteDepartment(record.id));
            
            const departmentName = `${record.departmentName ?? ""} ${
                record.lastName ?? ""
            }`.trim();

            if (res.status === 200) {
                message.success(
                res.message ||
                    t("department.deleteSuccess", { name: departmentName })
                );
            } else {
                message.error(res.message || t("department.deleteError"));
            }

            setCheckDataList(true);
        } catch {
            message.error(t("department.deleteError"));
        }
    };

    // const handleSearch = (keyword) => {
    //     setSearchTerm(keyword);

    //     const trimmed = keyword.trim();
    //     if (!trimmed) {
    //         setIsSearching(false);
    //         refreshList(1, limit);
    //         return;
    //     }
    //     setIsSearching(true);
    //     dispatch(Actions.fetchSearchUser(trimmed, 0, limit)).catch(() => {
    //         message.error("Không thể tìm kiếm ứng viên");
    //     });
    // };

    // ===== TABLE COLUMNS =====
    const columns = [
        {
            title: t("department.name"),
            dataIndex: "departmentName",
            key: "departmentName",
        },
        {
            title: t("department.description"),
            dataIndex: "description",
            key: "description",
        },
        {
            title: t("common.actions"),
            key: "actions",
            align: "center",
            render: (record) => {
                return (
                    <Space>
                        <Tooltip title={t("common.update")}>
                            <Button
                                type="text"
                                icon={<EditOutlined style={{ color: "#1677ff" }} />}
                                onClick={() => handleUpdate(record)}
                            />
                        </Tooltip>
                        <Tooltip title={t("common.delete")}>
                            <Button
                                type="text"
                                icon={<DeleteOutlined style={{ color: "red" }} />}
                                onClick={() => handleDelete(record)}
                            />
                        </Tooltip>
                    </Space>
                );
            },
        }
    ];

    return (
        <Row className="department-page  page-base">
            <Col span="24" className="department-top">
                <h2 className="department-title">{t("department.title")}</h2>
                <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={handleAdd}>
                    {t("department.add")}
                </Button>
            </Col>
            <Col span="24" className="">
                <div className="page-base">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={dataList}
                        pagination = {false}
                        scroll={{
                            y: "calc(80vh - 200px)",
                        }}
                    />
                </div>

                <AddEditDepartmentModal
                    open={openAddDepartment}
                    department={editingDepartment}
                    onCancel={handleOnCancel}
                    onSubmit={handleSubmit}
                />

            </Col>
        </Row>
    );
};

export default withReducer("department", reducer)(DepartmentManagement);
