import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, message, Tooltip, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./srore/actions";
import reducer from "./srore/reducers";
import withReducer from "app/store/with_reducer";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddEditLeverModal from "./component/AddEditLever";
import { notificationPopup } from "app/helpers/common";
import './index.scss';
import { useTranslation } from "react-i18next";

const LeverManagement = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    // const [page, setPage] = useState(1);
    const [dataList ,setDataList] = useState([]);
    const [checkDataList, setCheckDataList] = useState(false);
    const [openAddLever, setOpenAddLever] = useState(false);
    // const [openEdit, setOpenEdit] = useState(false);
    const [editingLever, setEditingLever] = useState(null);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [isSearching, setIsSearching] = useState(false);

    // ===== REDUX STATE =====
    const data = useSelector(
        state => state.position.lever.leverList.data || []
    );


    const createUpdateLever = useSelector(
        state => state.position.lever.createUpdateLever || null
    );

    // ===== FETCH DATA =====
    useEffect(() => {
        dispatch(Actions.fetchListLever());
    }, [dispatch]);

    useEffect(() => {
        setDataList(data || []);
    }, [data]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListLever()).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch]);

    useEffect(() => {
        if (createUpdateLever !== null && createUpdateLever.length !== 0) {
            notificationPopup(
                createUpdateLever.status,
                createUpdateLever.message
            );
        }
    }, [createUpdateLever]);

    // ===== HANDLE SAVE =====
    const handleSubmit = async (values) => {
        if (editingLever) {
            await dispatch(Actions.updateLever(editingLever.id, values));
        } else {
            await dispatch(Actions.CreateLever(values));
        }
        setOpenAddLever(false);
        setCheckDataList(true);
    }

    const handleAdd = () => {
        setOpenAddLever(true);
        setEditingLever(null);
    }

    const handleUpdate = (values) => {
        setOpenAddLever(true);
        setEditingLever(values);
    }

    const handleOnCancel = () => {
        setOpenAddLever(false);
        setEditingLever(null);
    }

    const handleDelete = async (record) => {
                
        try {
            const res = await dispatch(Actions.deleteLever(record.id));
            
            const leverNumber = `${record.leverNumber ?? ""} ${
                record.lastName ?? ""
            }`.trim();

            if (res.status === 200) {
                message.success(
                res.message ||
                    t("lever.deleteSuccess", { name: leverNumber })
                );
            } else {
                message.error(res.message || t("lever.deleteError"));
            }

            setCheckDataList(true);
        } catch {
            message.error(t("lever.deleteError"));
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
            title: t("lever.number"),
            dataIndex: "leverNumber",
            key: "leverNumber",
        },
        {
            title: t("lever.description"),
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
        <Row className="lever-page  page-base">
            <Col span="24" className="lever-top">
                <h2 className="lever-title">{t("lever.title")}</h2>
                <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={handleAdd}>
                    {t("lever.add")}
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

                <AddEditLeverModal
                    open={openAddLever}
                    lever={editingLever}
                    onCancel={handleOnCancel}
                    onSubmit={handleSubmit}
                />

            </Col>
        </Row>
    );
};

export default withReducer("position", reducer)(LeverManagement);
