import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, DatePicker, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import AddEditOT from './AddEditOT';
import { notificationPopup } from 'app/helpers/common';
import * as Actions from "../store/actions";
import { useTranslation } from "react-i18next";

const OtTable = ({ employee }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [addEditOtModal, setAddEditOtModal] = useState(false);
    const [selectOtDay, setSelectOtDay] = useState([]);
    const [checkDataList, setCheckDataList] = useState(false);
    const [month, setMonth] = useState(dayjs());

    const { otDateEmployeeId, createOrUpdateOt} = useSelector(
        state => state.dashboard.otDate.otDateEmployeeId ?? []
    );

    const columns = useMemo(
        () => [
            { 
                width: 200,
                key: 'jobTitle',
                title: t("ot.columns.jobTitle"), 
                dataIndex: 'jobTitle' 
            },
            { 
                width: 150,
                align: "center",
                key: 'workDate',
                title: t("ot.columns.workDate"), 
                dataIndex: 'workDate' 
            },
            { 
                width: 100,
                align: "center",
                key: 'otMinutes',
                title: t("ot.columns.otMinutes"), 
                dataIndex: 'otMinutes' 
            },
            { 
                width: 150,
                align: "center",
                key: 'startTime',
                title: t("ot.columns.startTime"), 
                dataIndex: 'startTime' 
            },
            { 
                width: 150,
                align: "center",
                key: 'endTime',
                title: t("ot.columns.endTime"), 
                dataIndex: 'endTime' 
            },
            { 
                width: 150,
                align: "center",
                key: 'approvedBy',
                title: t("ot.columns.approvedBy"), 
                dataIndex: 'approvedBy' 
            },
            { 
                width: 150,
                align: "center",
                key: 'approvedAt',
                title: t("ot.columns.approvedAt"), 
                dataIndex: 'approvedAt' 
            },
            { 
                width: 70,
                align: "center",
                key: 'otRate',
                title: t("ot.columns.otRate"), 
                dataIndex: 'otRate' 
            },
            { 
                width: 100,
                align: "center",
                key: 'status',
                title: t("ot.columns.status"), 
                dataIndex: 'status',
                render: (status) => (
                    <Tag color={status === 1 ? "green" : status === 2 ? "red" : "default"}>
                        {status === 1
                            ? t("ot.statusValue.approved")
                            : status === 2
                                ? t("ot.statusValue.rejected")
                                : t("ot.statusValue.pending")}
                    </Tag>
                ),
            },
            { 
                width: 100,
                align: "center",
                key: 'otType',
                title: t("ot.columns.otType"), 
                dataIndex: 'otType',
                render: (otType) => (
                    <Tag>
                        {otType === 1
                            ? t("ot.typeValue.night")
                            : otType === 2
                                ? t("ot.typeValue.holiday")
                                : otType === 0
                                    ? t("ot.typeValue.normal")
                                    : ""}
                    </Tag>
                ),
            },
        ], [t]
    );

    // ---------------------------------
    // USEEFFECT
    // ---------------------------------

    useEffect(() => {
        if (employee?.userId && month) {
            dispatch(Actions.fetchListOtDateEmployeeId(
                employee.userId, 
                month.format("YYYY-MM")
            ));
        }
    }, [dispatch, employee?.userId, month]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListOtDateEmployeeId(
                employee?.userId, 
                month.format("YYYY-MM")
            )).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch, employee, month]);

    useEffect(() => {
        if (createOrUpdateOt) {
        notificationPopup(
            createOrUpdateOt.status,
            createOrUpdateOt.message
        );
        }
    }, [createOrUpdateOt]);

    // ---------------------------------
    // HANDLE
    // ---------------------------------

    const handleOpenAdd = () => {
        setSelectOtDay(null);
        setAddEditOtModal(true);
    }

    const handleEdit = (record) => {
        setSelectOtDay(record);
        setAddEditOtModal(true);
    }

    const AddEditOtSubmit = async (value) => {
        if (selectOtDay?.id) {
            await dispatch(Actions.UpdateOtDate(selectOtDay.id, value));
        } else {
            await dispatch(Actions.CreateOtDay(value));
        }
        setAddEditOtModal(false);
        setCheckDataList(true);
    }

    const handleClose = () => {
        setAddEditOtModal(false);
    }

    return (
        <>
            <div className="otTop">
                <DatePicker 
                    defaultValue={dayjs()} 
                    format={'YYYY/MM'} 
                    picker="month" 
                    className="ot-data-picker" 
                    onChange={(value) => {
                        setMonth(value);
                    }}
                />

                <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={handleOpenAdd}>  
                    {t("ot.addOt")}
                </Button>
            </div>
            <Table
                rowKey={"id"}
                columns={columns}
                dataSource={otDateEmployeeId}
                pagination={false}
                tableLayout="fixed"
                scroll={{
                    x: 1300,
                    y: "calc(100vh - 200px)",
                }}
                onRow={(record) => ({
                    onClick: () => handleEdit(record),
                })}
            />

            <AddEditOT
                open={addEditOtModal}
                onCancel={handleClose}
                otDay={selectOtDay}
                employee={employee}
                AddEditOtSubmit={AddEditOtSubmit}
            />
        </>
    );
};

export default OtTable;
