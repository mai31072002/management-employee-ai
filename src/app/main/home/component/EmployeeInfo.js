import { Avatar, Row, Col, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next";

const Item = ({ label, value, span = 12 }) => (
    <Col span={span}>
        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{label}</div>
        <div style={{ fontWeight: 500 }}>{value || '—'}</div>
    </Col>
);

const EmployeeInfo = ({ employee }) => {
    const { t } = useTranslation();
    if (!employee) return null;

    return (
        <Row gutter={[24, 16]}>
            {/* Avatar */}
            <Col span={24} md={6} style={{ textAlign: 'center' }}>
                <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: '#1677ff',
                        marginBottom: 12,
                    }}
                />
                <div style={{ marginTop: 8, fontWeight: 600 }}>
                    {employee.fullName}
                </div>

                <div style={{ marginTop: 6 }}>
                    <Tag color="blue" style={{ marginTop: 8 }}>
                        {employee?.position || t("account.noPosition")} - {employee.department || t("account.noDepartment")}
                    </Tag>
                </div>
            </Col>

            {/* Info */}
            <Col span={24} md={18}>
                <Row gutter={[16, 16]}>
                    <Item label={t("account.employeeCode")} value={employee.employeesCode} />
                    <Item label={t("userRole.username")} value={employee.username} />
                    <Item label={t("account.birthday")} value={dayjs(employee.birthday).format('DD/MM/YYYY')} />
                    <Item label={t("account.gender")} value={employee.gender === 1 ? t("employee.genderValue.male") : t("employee.genderValue.female")} />
                    <Item label={t("account.phone")} value={employee.phone} />
                    <Item label={t("userRole.email")} value={employee.email} span={24} />
                    <Item label={t("account.manager")} value={employee.manages} />

                    <Item
                        label={t("account.workTime")}
                        span={24}
                        value={
                        employee.startDate
                            ? `${dayjs(employee.startDate).format('DD/MM/YYYY')} → ${
                                employee.endDate
                                ? dayjs(employee.endDate).format('DD/MM/YYYY')
                                : t("account.present")
                            }`
                            : '—'
                        }
                    />

                    <Item
                        label={t("account.address")}
                        span={24}
                        value={`${employee.address}, ${employee.district}, ${employee.province}`}
                    />

                    <Item
                        label={t("account.status")}
                        value={
                            <Tag color={employee.status === 1 ? 'green' : 'red'}>
                                {employee.status === 1 ? t("account.working") : t("account.stopped")}
                            </Tag>
                        }
                    />
                </Row>
            </Col>
        </Row>
    );
};

export default EmployeeInfo;

