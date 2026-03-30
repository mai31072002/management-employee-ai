import React, { useMemo } from 'react';
import { Table, Tag, Spin, Row, Col, Button, Input, AutoComplete, Tooltip, Pagination, Space } from 'antd';
import { CalendarOutlined, PlusOutlined, SearchOutlined, EyeOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddEditEmployee from './AddEditEmployee';
import { useTranslation } from "react-i18next";

const EmployeeLayout = ({
    loading,
    page,
    limit,
    totalElement,
    handleOpenAdd,
    handlePageChange,
    onCloseModal,
    handleSubmitModal,
    onRowClick,
    editingRecord,
    dataList,
    positionList,
    isModalVisible,
    searchTerm,
    onSearch,
    onSearchTermChange,
    // New props for import functionality
    handleOpenImport,
    handleDownloadTemplate
}) => {
    const { t } = useTranslation();

    const columns = useMemo ( 
        () => [
            { title: t("employee.columns.code"), dataIndex: ["employee", "employeesCode"], key: 'employeesCode' },
            { title: t("employee.columns.fullName"), dataIndex: ["employee", "fullName"], key: 'fullName' },
            { title: t("employee.columns.username"), dataIndex: 'username', key: 'username' },
            {
                title: t("employee.columns.gender"),
                dataIndex: ["employee", "gender"],
                render: (gender) =>
                gender === 1
                    ? t("employee.genderValue.male")
                    : gender === 0
                        ? t("employee.genderValue.female")
                        : t("employee.genderValue.unknown"),
            },
            {
                title: t("employee.columns.birthday"),
                dataIndex: ["employee", "birthday"],
                render: (value) =>
                    value ? (
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <CalendarOutlined style={{ marginRight: 4, color: "#888" }} />
                            {dayjs(value).format("DD/MM/YYYY")}
                        </span>
                ) : (
                    t("employee.genderValue.unknown")
                ),
            },
            { 
                title: t("employee.columns.workTime"),
                key: 'time',
                render: (_, record) => {
                    const start = record?.employee.startDate ? dayjs(record?.employee.startDate).format('DD/MM/YYYY') : '';
                    const end = record?.employee.endDate ? dayjs(record?.employee.endDate).format('DD/MM/YYYY') : '';
                    return start && end ? `${start} - ${end}` : start || end || '-';
                }
            },
            {
                title: t("employee.columns.position"),
                dataIndex: ["employee", "positionName"],
                key: "positionName",
            },
            {
                title: t("employee.columns.department"),
                dataIndex: ["employee", "departmentName"],
                key: "departmentName",
            },
            {
                title: t("employee.columns.status"),
                dataIndex: ["employee", "status"],
                align: "center",
                render: (status) => {
                    switch (status) {
                        case 1:
                            return <Tag color="green">{t("employee.statusValue.working")}</Tag>;
                        case 2:
                            return <Tag color="green">{t("employee.statusValue.quit")}</Tag>;
                        case 3:
                            return <Tag>{t("employee.statusValue.probation")}</Tag>;
                        default:
                            return t("employee.statusValue.unknown");
                    }
                },
            },
            {
                title: t("employee.columns.actions"),
                key: "action",
                align: "center",
                render: (_, record) => (
                    <Tooltip title={t("employee.viewDetail")}>
                        <EyeOutlined
                            style={{ cursor: "pointer", color: "#1677ff" }}
                            onClick={() => onRowClick && onRowClick(record)}
                        />
                    </Tooltip>
                ),
            }
        ], [t, onRowClick]
    );

    const autoCompleteOptions =
        dataList?.length > 0
            ? dataList.map((item) => ({
                key: item.userId,
                value: `${item?.username || ""}`.trim(),
                label: (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#000" }}>
                            <b>
                                {item?.username}
                            </b>
                        </span>
                    </div>
                ),
            }))
        : [];

    return (
        <Row className="dashboard-page page-base">
            <Col span={24}>
                <div className='dashboard-title'>
                    <h2>{t("employee.listTitle")}</h2>
                    <Space className="action-buttons">
                        <Button 
                            type="default" 
                            shape="round" 
                            icon={<UploadOutlined/>}
                            onClick={handleOpenImport}
                        >
                            {t("employee.importExcel.title")}
                        </Button>
                        <Button 
                            type="default" 
                            shape="round" 
                            icon={<DownloadOutlined/>}
                            onClick={handleDownloadTemplate}
                        >
                            {t("employee.downloadTemplate.title")}
                        </Button>
                        <Button 
                            type="primary" 
                            shape="round" 
                            icon={<PlusOutlined/>} 
                            onClick={handleOpenAdd}
                        >
                            {t("employee.addNew")}
                        </Button>
                    </Space>
                </div>
            </Col>
            <Col span={24} className="header-candidate">
                <Row>
                    <Col span={24} className="search-filter">
                        <AutoComplete
                            value={searchTerm}
                            onChange={onSearchTermChange}
                            onSearch={onSearch}
                            className="dropdown-search"
                            options={autoCompleteOptions}
                        >
                            <Input
                                placeholder={t("employee.searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => onSearchTermChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onSearch(searchTerm);
                                    }
                                }}
                                suffix={
                                    <Button
                                        type="default"
                                        icon={<SearchOutlined />}
                                        onClick={() => onSearch(searchTerm)}
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
            <Col span={24}>
                {loading ? (
                    <div className="candidate-table-loading">
                        <Spin size="large" />
                    </div>
                ) : !dataList || dataList.length === 0 ? (
                    <div className="dashboard-table-not-found">
                        {t("employee.noData")}
                    </div>
                ) : (
                    <div>
                        <Table
                            size="small"
                            columns={columns}
                            dataSource={dataList}
                            rowKey="userId"
                            pagination = {false}
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
                                x: 1300,
                                y: "calc(100vh - 200px)",
                            }}
                            onRow={(record) => ({
                                onClick: () => onRowClick && onRowClick(record),
                            })}
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
                                {t("employee.totalEmployees", { count: totalElement })}
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
                )}
            </Col>

            <AddEditEmployee
                open={isModalVisible}
                onCancel={onCloseModal}
                onSubmit={handleSubmitModal}
                editingRecord={editingRecord}
                position={positionList.position}
            />
        </Row>
    );
}
export default EmployeeLayout;
