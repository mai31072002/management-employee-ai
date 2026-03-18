import React, { useState } from 'react';
import { Modal, Tabs, Button, Space, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useTranslation } from "react-i18next";

import EmployeeInfo from './EmployeeInfo';
import AttendanceCalendar from './AttendanceCalendar';
import OtTable from './OtTable';
import SalaryInfo from './SalaryInfo';
import RewardPenalty from './RewardPenalty';

const EmployeeConfigModal = ({ open, onClose, employee, onEdit, onDelete }) => {
    const [activeKey, setActiveKey] = useState('info');
    const { t } = useTranslation();

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width="90%"
            centered
            destroyOnHidden
            title={t("employeeDetail.title", { name: employee?.employee?.fullName || "" })}
        >
            <Tabs
                className="model-from"
                activeKey={activeKey}
                onChange={setActiveKey}
                tabBarExtraContent={
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={onEdit}
                            className="btn-edit-employee"
                            disabled={activeKey !== 'info'}
                        >
                            {t("employeeDetail.edit")}
                        </Button>

                        <Popconfirm
                            title={t("employeeDetail.deleteEmployeeTitle")}
                            description={
                                t("employeeDetail.deleteEmployeeDesc", { name: employee?.fullName || "" })
                            }
                            onConfirm={onDelete}
                            okText={t("common.delete")}
                            okType="danger"
                            cancelText={t("common.cancel")}
                        >
                            <Button 
                                size="small"
                                danger 
                                icon={<DeleteOutlined />}
                                className="btn-delete-employee"
                                disabled={activeKey !== 'info'}
                            >
                                {t("common.delete")}
                            </Button>
                        </Popconfirm>
                    </Space>
                }
                items={[
                    {
                        key: 'info',
                        label: t("employeeDetail.basicInfo"),
                        children: <EmployeeInfo employee={employee} />,
                    },
                    {
                        key: 'attendance',
                        label: t("employeeDetail.attendance"),
                        children: (
                            <AttendanceCalendar employeeId={employee?.userId} />
                        ),
                    },
                    {
                        key: 'rewardPenalty',
                        label: t("employeeDetail.rewardPenalty"),
                        children: (
                        <RewardPenalty employee={employee} />
                        ),
                    },
                    {
                        key: 'ot',
                        label: t("employeeDetail.ot"),
                        children: <OtTable employee={employee} />,
                    },
                    {
                        key: 'salary',
                        label: t("employeeDetail.salary"),
                        children: <SalaryInfo employeeId={employee?.userId} />,
                    },
                ]}
            />
            
        </Modal>
    );
};

export default EmployeeConfigModal;
