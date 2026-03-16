import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, message, Tooltip, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./srore/actions";
import reducer from "./srore/reducers";
import withReducer from "app/store/with_reducer";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddEditPositionModal from "./component/AddEditPosition";
import { notificationPopup } from "app/helpers/common";
import './index.scss';
import { useTranslation } from "react-i18next";

const PositionManagement = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    // const [page, setPage] = useState(1);
    const [dataList ,setDataList] = useState([]);
    const [checkDataList, setCheckDataList] = useState(false);
    const [openAddPosition, setOpenAddPosition] = useState(false);
    // const [openEdit, setOpenEdit] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [isSearching, setIsSearching] = useState(false);

    // ===== REDUX STATE =====
    const data = useSelector(
        state => state.position.position.positionList.data || []
    );

    const leverData = useSelector(
        state => state.position.lever.leverList.data || []
    );


    const createUpdatePosition = useSelector(
        state => state.position.position.createUpdatePosition || null
    );

    // ===== FETCH DATA =====
    useEffect(() => {
        dispatch(Actions.fetchListPosition());
        dispatch(Actions.fetchListLever());
    }, [dispatch]);

    useEffect(() => {
        setDataList(data || []);
    }, [data]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListPosition()).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch]);

    useEffect(() => {
        if (createUpdatePosition !== null && createUpdatePosition.length !== 0) {
            notificationPopup(
                createUpdatePosition.status,
                createUpdatePosition.message
            );
        }
    }, [createUpdatePosition]);

    // ===== HANDLE SAVE =====
    const handleSubmit = async (values) => {
        if (editingPosition) {
            await dispatch(Actions.updatePosition(editingPosition.id, values));
        } else {
            await dispatch(Actions.CreatePosition(values));
        }
        setOpenAddPosition(false);
        setCheckDataList(true);
    }

    const handleAdd = () => {
        setOpenAddPosition(true);
        setEditingPosition(null);
    }

    const handleUpdate = (values) => {
        setOpenAddPosition(true);
        setEditingPosition(values);
    }

    const handleOnCancel = () => {
        setOpenAddPosition(false);
        setEditingPosition(null);
    }

    const handleDelete = async (record) => {
                    
        try {
            const res = await dispatch(Actions.deletePosition(record.id));
            
            const positionName = `${record.positionName ?? ""} ${
                record.lastName ?? ""
            }`.trim();

            if (res.status === 200) {
                message.success(
                res.message ||
                    t("position.deleteSuccess", { name: positionName })
                );
            } else {
                message.error(res.message || t("position.deleteError"));
            }

            setCheckDataList(true);
        } catch {
            message.error(t("position.deleteError"));
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
            title: t("position.name"),
            dataIndex: "positionName",
            key: "positionName",
        },
        {
            title: t("position.description"),
            dataIndex: "description",
            key: "description",
        },
        {
            title: t("position.level"),
            align: "center",
            dataIndex: "leverNumber",
            key: "leverNumber",
            render: (value) => value ? `Lever ${value}` : "-"
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
        <Row className="position-page  page-base">
            <Col span="24" className="position-top">
                <h2 className="position-title">{t("position.title")}</h2>
                <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={handleAdd}>
                    {t("position.add")}
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

                <AddEditPositionModal
                    open={openAddPosition}
                    position={editingPosition}
                    leverData={leverData}
                    onCancel={handleOnCancel}
                    onSubmit={handleSubmit}
                />

            </Col>
        </Row>
    );
};

export default withReducer("position", reducer)(PositionManagement); 
        