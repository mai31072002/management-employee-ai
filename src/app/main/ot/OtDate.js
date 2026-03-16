import React, { useEffect, useMemo, useState } from 'react';
import { Table, DatePicker, Tag, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import withReducer from 'app/store/with_reducer';
import reduce from "../home/store/reducers";
import * as Actions from "../home/store/actions";
import "./index.scss";
import { useTranslation } from "react-i18next";

const OtTable = () => {
    const { RangePicker } = DatePicker;
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [checkDataList, setCheckDataList] = useState(false);
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs().endOf('month'));

    const { otDate } = useSelector(
        state => state.otDate.otDate ?? []
    );

    const columns = useMemo(
        () => [
            { 
                width: 200,
                key: 'fullName',
                title: t("rewardPenalty.fullName"), 
                dataIndex: 'fullName' 
            },
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
                                    : ''}
                    </Tag>
                ),
            },
        ], [t]
    );

    // ---------------------------------
    // USEEFFECT
    // ---------------------------------

    useEffect(() => {
        if (fromDate || toDate) {
            const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
            const to = toDate ? toDate.format("YYYY-MM-DD") : null;
            dispatch(Actions.fetchListOtDate(0, 10, from, to, status));
        }
    }, [dispatch, fromDate, toDate, status]);

    useEffect(() => {
        if (checkDataList) {
            const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
            const to = toDate ? toDate.format("YYYY-MM-DD") : null;

            dispatch(Actions.fetchListOtDate(from, to)).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch, fromDate, toDate]);

    // ---------------------------------
    // HANDLE
    // ---------------------------------

    const refreshList = (pageNumber = 1, pageSize = otDate?.limit || 10) => {
        const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
        const to = toDate ? toDate.format("YYYY-MM-DD") : null;
        dispatch(Actions.fetchListEmployee(pageNumber - 1, pageSize, from, to));
    };

    const handlePageChange = (pageNumber, pageSize) => {
        setPage(pageNumber);
        refreshList(pageNumber, pageSize);
    };

    const handleChange = e => {
        const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
        const to = toDate ? toDate.format("YYYY-MM-DD") : null;
        dispatch(Actions.fetchListOtDate(page - 1, otDate?.limit || 10, from, to, e));
        setStatus(e);
    };

    return (
        <div className="ot-date-page page-base">
            <div className="otTop">
                <RangePicker
                    value={fromDate && toDate ? [fromDate, toDate] : []}
                    format="YYYY-MM-DD"
                    className="ot-data-picker"
                    onChange={(dates) => {
                        if (dates) {
                            setFromDate(dates[0]);
                            setToDate(dates[1]);
                        } else {
                            setFromDate(null);
                            setToDate(null);
                        }
                    }}
                />

                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: '', label: t("common.all") },
                        { value: '0', label: t("ot.statusValue.pending") },
                        { value: '1', label: t("ot.statusValue.approved") },
                        { value: '2', label: t("ot.statusValue.rejected") },
                    ]}
                />
            </div>
            <Table
                rowKey={"id"}
                columns={columns}
                dataSource={otDate?.otDate}
                tableLayout="fixed"
                pagination = {{
                    current: page,
                    pageSize: otDate?.limit,
                    total: otDate?.totalElement,
                    showSizeChanger: true,
                    showTotal: () => t("ot.totalEmployees", { count: otDate?.totalElement ?? 0 }),
                    onChange: handlePageChange,
                    onShowSizeChange: handlePageChange,
                }}
                scroll={{
                    x: 1300,
                    y: "calc(100vh - 200px)",
                }}
            />
        </div>
    );
};

export default withReducer('otDate', reduce)(OtTable);
