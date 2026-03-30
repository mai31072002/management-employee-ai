import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, message, Tooltip, Space, Input, Popconfirm, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import withReducer from "app/store/with_reducer";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AddEditRole from "./components/AddEditRole";
import { notificationPopup } from "app/helpers/common";
import './index.scss';
import { useTranslation } from "react-i18next";

const RoleManagement = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dataList, setDataList] = useState([]);
    const [checkDataList, setCheckDataList] = useState(false);
    const [openAddEditRole, setOpenAddEditRole] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // ===== REDUX STATE =====
    const { data, loading } = useSelector(
        state => state.userRole.userRole.roleList || { data: [], loading: false }
    );

    const createRole = useSelector(
        state => state.userRole.userRole.createRole || null
    );

    const deleteRole = useSelector(
        state => state.userRole.userRole.deleteRole || null
    );

    const updateRole = useSelector(
        state => state.userRole.userRole.updateRole || null
    );

    // ===== FETCH DATA =====
    useEffect(() => {
        dispatch(Actions.fetchListRole());
    }, [dispatch]);

    useEffect(() => {
        setDataList(data || []);
    }, [data]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListRole()).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch]);

    useEffect(() => {
        if (createRole) {
            notificationPopup(
                createRole.status,
                createRole.message || t("role.createSuccess")
            );
            dispatch(Actions.fetchListRole());
        }
    }, [createRole, dispatch, t]);

    useEffect(() => {
        if (deleteRole) {
            notificationPopup(
                200,
                t("role.deleteSuccess")
            );
            dispatch(Actions.fetchListRole());
        }
    }, [deleteRole, dispatch, t]);

    useEffect(() => {
        if (updateRole) {
            notificationPopup(
                200,
                t("role.updateSuccess")
            );
            dispatch(Actions.fetchListRole());
        }
    }, [updateRole, dispatch, t]);

    // ===== HANDLE ACTIONS =====
    const handleAddRole = () => {
        setEditingRole(null);
        setOpenAddEditRole(true);
    };

    const handleEditRole = (role) => {
        setEditingRole(role);
        setOpenAddEditRole(true);
    };

    const handleDeleteRole = async (roleId) => {
        try {
            await dispatch(Actions.DeleteRole(roleId));
            setCheckDataList(true);
        } catch (error) {
            message.error(t("role.deleteError"));
        }
    };

    const handleSubmitRole = async (data) => {
        try {
            if (editingRole) {
                await dispatch(Actions.updateRole(editingRole.roleId || editingRole.id, data));
            } else {
                await dispatch(Actions.CreateRole(data));
            }
            setOpenAddEditRole(false);
            setEditingRole(null);
            setCheckDataList(true);
        } catch (error) {
            // Error is handled by the component
        }
    };

    const handleOnCancel = () => {
        setOpenAddEditRole(false);
        setEditingRole(null);
    };

    const handleSearch = (value) => {
        const trimmed = value.trim();
        console.log('isSearching', isSearching);
        setSearchTerm(value);

        if (!trimmed) {
            setIsSearching(false);
            setDataList(data || []);
            return;
        }

        setIsSearching(true);
        const filtered = (data || []).filter(role => 
            role.roleName?.toLowerCase().includes(trimmed.toLowerCase()) ||
            role.description?.toLowerCase().includes(trimmed.toLowerCase())
        );
        setDataList(filtered);
    };

    // ===== TABLE COLUMNS =====
    const columns = [
        {
            title: t("role.id"),
            dataIndex: "roleId",
            key: "roleId",
            width: 80,
        },
        {
            title: t("role.name"),
            dataIndex: "roleName",
            key: "roleName",
            render: (text) => <strong>{text}</strong>
        },
        {
            title: t("role.description"),
            dataIndex: "description",
            key: "description",
        },
        {
            title: t("role.permissions"),
            key: "permissions",
            render: (_, record) => {
                const permissions = record.permissions || record.permission || [];
                return (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {permissions.map(perm => (
                            <span key={perm} style={{ 
                                display: 'inline-block',
                                padding: '2px 8px',
                                margin: '2px',
                                backgroundColor: '#1890ff',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}>
                                {perm}
                            </span>
                        ))}
                    </div>
                );
            }
        },
        {
            title: t("common.actions"),
            key: "actions",
            width: 120,
            align: "center",
            render: (_, record) => (
                <Space>
                    <Tooltip title={t("common.edit")}>
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: "#1677ff" }} />}
                            onClick={() => handleEditRole(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title={t("role.deleteConfirm")}
                        description={t("role.deleteDescription")}
                        onConfirm={() => handleDeleteRole(record.roleId || record.id)}
                        okText={t("common.delete")}
                        cancelText={t("common.cancel")}
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title={t("common.delete")}>
                            <Button
                                type="text"
                                icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <Row className="role-management-page page-base">
            <Col span="24" className="role-management-top">
                <h2 className="role-management-title">{t("role.title")}</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
                    {t("role.addNew")}
                </Button>
            </Col>
            
            <Col span={24} className="header-candidate">
                <Row>
                    <Col span={24} className="search-filter">
                        <Input
                            placeholder={t("role.searchPlaceholder")}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            prefix={<SearchOutlined />}
                            allowClear
                            className="candidate-search"
                        />
                    </Col>
                </Row>
            </Col>
            
            <Col span="24">
                <div className="table-container">
                    <Table
                        rowKey="roleId"
                        columns={columns}
                        dataSource={dataList}
                        loading={loading}
                        pagination={false}
                        scroll={{
                            y: "calc(80vh - 200px)",
                        }}
                    />
                    
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 16,
                        }}
                    >
                        <div>
                            {t("role.total", { count: dataList.length })}
                        </div>

                        <Pagination
                            size='small'
                            current={page}
                            pageSize={pageSize}
                            total={dataList.length}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total, range) => 
                                t("role.pagination", { start: range[0], end: range[1], total })
                            }
                            onChange={(newPage, newPageSize) => {
                                setPage(newPage);
                                if (newPageSize !== pageSize) {
                                    setPageSize(newPageSize);
                                }
                            }}
                        />
                    </div>
                </div>

                <AddEditRole
                    open={openAddEditRole}
                    role={editingRole}
                    onCancel={handleOnCancel}
                    onSubmit={handleSubmitRole}
                />
            </Col>
        </Row>
    );
};

export default withReducer("userRole", reducer)(RoleManagement);
