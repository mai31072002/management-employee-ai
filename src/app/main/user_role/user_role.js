import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, AutoComplete, message, Input, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import withReducer from "app/store/with_reducer";
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import AddEditUser from "./components/AddEditUser";
import { notificationPopup } from "app/helpers/common";
import './index.scss';
import { useTranslation } from "react-i18next";

const UserRoleManagement = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [dataList ,setDataList] = useState([]);
    const [checkDataList, setCheckDataList] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // ===== REDUX STATE =====
    const { data, limit, totalElement } = useSelector(
        state => state.userRole.userRole.userList || []
    );

    const roleOptions = useSelector(
        state => state.userRole.userRole.roleList?.data || []
    );

    const createRole = useSelector(
        state => state.userRole.userRole.createRole || null
    );

    // ===== FETCH DATA =====
    useEffect(() => {
        dispatch(Actions.fetchListUser(0, 10));
        dispatch(Actions.fetchListRole());
    }, [dispatch]);

    useEffect(() => {
        setDataList(data || []);
        
    }, [data]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListUser(page - 1, limit)).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, page, limit, dispatch]);

    useEffect(() => {
        if (createRole) {
            notificationPopup(
                createRole.status,
                createRole.message
            );
        }
    }, [createRole]);

    // ===== HANDLE ROLE CHANGE =====
    const refreshList = (pageNumber = 1, pageSize = limit || 10) => {
        dispatch(Actions.fetchListUser(pageNumber - 1, pageSize));
    };

    const refreshSearch = (pageNumber = 1, pageSize = limit || 10) => {
        dispatch(Actions.fetchSearchUser( searchTerm.trim(), pageNumber - 1, pageSize));
    };

    const handlePageChange = (pageNumber, pageSize) => {
         setPage(pageNumber);
        if (isSearching) {
            refreshSearch(pageNumber, pageSize)
        } else {
            refreshList(pageNumber, pageSize);
        }
    };

    // ===== HANDLE SAVE =====
    const handleUpdateUser = (data) => {    
        dispatch(Actions.updateUser(data.userId, data));
        setOpenEdit(false);
        setEditingUser(null);
        setCheckDataList(true);
    };

    const handleSearch = (keyword) => {
        setSearchTerm(keyword);

        const trimmed = keyword.trim();
        if (!trimmed) {
            setIsSearching(false);
            refreshList(1, limit);
            return;
        }
        setIsSearching(true);
        dispatch(Actions.fetchSearchUser(trimmed, 0, limit)).catch(() => {
            message.error(t("userRole.searchError"));
        });
    };

    const mapRoleNamesToDescriptions = (roleNames = [], roleOptions = []) => {
        if (!Array.isArray(roleNames) || !Array.isArray(roleOptions)) {
            return [];
        }

        return roleNames.map(roleName => {
            const role = roleOptions.find(r => r.roleName === roleName);
            
            return role ? role.description : roleName;
        });
    };

    // ===== TABLE COLUMNS =====
    const columns = [
        {
            title: t("userRole.username"),
            dataIndex: "username",
            key: "username",
        },
        {
            title: t("userRole.email"),
            dataIndex: "email",
            key: "email",
        },
        {
            title: t("userRole.roles"),
            key: "roles",
            render: (record) => {
                const descriptions = mapRoleNamesToDescriptions(record.roles, roleOptions);

                console.log("descriptions", descriptions);

                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {descriptions.map(role => (
                            <span key={role}>{role}</span>
                        ))}
                    </div>
                );
            }
        },
        {
            title: t("common.actions"),
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Button
                    type="text"
                    onClick={() => {
                        setEditingUser(record);
                        setOpenEdit(true);
                    }}
                >
                    <EditOutlined style={{ color: "#1677ff" }} />
                </Button>
            )
        }
    ];

    const autoCompleteOptions =
        dataList?.length > 0
            ? dataList.map((item) => ({
                value: `${item.username || ""}`.trim(),
                label: (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#000" }}>
                            <b>
                            {item.username}
                            </b>
                        </span>
                    </div>
                ),
            }))
        : [];

    return (
        <Row className="user-role-page  page-base">
            <Col span="24" className="user-role-top">
                <h2 className="user-role-title">{t("userRole.title")}</h2>
                {/* <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={() => setOpenAddRole(true)}>
                    {t("userRole.addRole")}
                </Button> */}
            </Col>
            <Col span={24} className="header-candidate">
                <Row>
                    <Col span={24} className="search-filter">
                        <AutoComplete
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onSearch={handleSearch}
                            className="dropdown-search"
                            options={autoCompleteOptions}
                        >
                            <Input
                                placeholder={t("userRole.searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch(searchTerm);
                                    }
                                }}
                                suffix={
                                    <Button
                                        type="default"
                                        icon={<SearchOutlined />}
                                        onClick={() => handleSearch(searchTerm)}
                                        style={{
                                            color: "#999",
                                            background: "#f5f5f7",
                                            border: "none",
                                        }}
                                    />
                                }
                                allowClear
                                className="candidate-search"
                            />
                        </AutoComplete>
                    </Col>
                </Row>
            </Col>
            <Col span="24" className="">
                <div className="">
                    <div>
                        <Table
                            rowKey="userId"
                            columns={columns}
                            dataSource={dataList}
                            pagination={false}
                            // pagination = {{
                            //     current: page,
                            //     pageSize: limit,
                            //     total: totalElement,
                            //     showSizeChanger: true,
                            //     showTotal: () => `Tổng ${totalElement} nhân viên`,
                            //     onChange: handlePageChange,
                            //     onShowSizeChange: handlePageChange,
                            // }}
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
                            {/* BÊN TRÁI */}
                            <div>
                                {t("userRole.totalAccounts", { count: totalElement })}
                            </div>

                            {/* BÊN PHẢI */}
                            <Pagination
                                size='small'
                                current={page}
                                pageSize={limit}
                                total={totalElement}
                                showSizeChanger
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>

                <AddEditUser
                    open={openEdit}
                    user={editingUser}
                    roleOptions={roleOptions}
                    onCancel={() => {
                        setOpenEdit(false);
                        setEditingUser(null);
                    }}
                    onSubmit={handleUpdateUser}
                />

            </Col>
        </Row>
    );
};

export default withReducer("userRole", reducer)(UserRoleManagement);



