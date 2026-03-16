import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Avatar, Tag, Descriptions } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "app/main/home/store/actions";
import * as ActionsAcount from "./store/actions";
import dayjs from "dayjs";
import AddEditEmployee from "../home/component/AddEditEmployee";
import EditAccountForm from "./component/EditAccount";
import withReducer from 'app/store/with_reducer';
import reduce from "../home/store/reducers";
import { fetchEmployeeDetail } from "app/auth/store/actions/auth.action";
import { useTranslation } from "react-i18next";

import "./index.scss";

const Account = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);

    const positionList = useSelector(state => state?.dashboard?.dashboard?.positionList);

    const account = useSelector((state) => state.auth.user.userDetail?.data);
    const employee = useSelector((state) => state.auth.user.employeeDetail?.data?.data);

    // ---------------------------------
    // USEEFFECT
    // ---------------------------------

    useEffect(() => {
        if (!positionList || positionList.position?.length === 0) {
            dispatch(Actions.fetchListPosition());
        }
    }, [positionList, dispatch]);

    useEffect(() => {
        if (account.employeeId != null) {
            dispatch(fetchEmployeeDetail(account.employeeId));
        }
    }, [dispatch, account]);

    // ---------------------------------
    // HENDLERS
    // ---------------------------------
    
    const onCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleSubmitModal = async (values) => {
        dispatch(Actions.UpdateEmployee(employee.employeeId, values));
        setIsModalVisible(false);
    };

    const handleSubmitAccount = async (value) => {
        dispatch(ActionsAcount.UpdateAccount(account?.userId, value));
        setIsEditAccountOpen(false);
    }

    const Item = ({ label, value, span = 12 }) => (
        <Col span={span}>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{label}</div>
            <div style={{ fontWeight: 500 }}>{value || '—'}</div>
        </Col>
    );

    return (
        <div className="account-page">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title={t("account.accountInfo")}
                        extra={
                            <Button type="primary" onClick={() => setIsEditAccountOpen(true)}>
                                {t("account.edit")}
                            </Button>
                        }
                    >
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label={t("userRole.username")}>
                                {account.username}
                            </Descriptions.Item>

                            <Descriptions.Item label={t("userRole.email")}>
                                {account.email}
                            </Descriptions.Item>
                            
                            <Descriptions.Item label={t("employee.columns.fullName")}>
                                {account.firstName} {account.lastName}
                            </Descriptions.Item>
                            
                            <Descriptions.Item label={t("userRole.roles")}>
                                {account.roles.map(r => (
                                    <Tag key={r}>{r}</Tag>
                                ))}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {employee && (
                    <Col span={24}>
                        <Card
                            title={t("account.employeeInfo")}
                            extra={
                                <Button onClick={() => setIsModalVisible(true)}>
                                    {t("account.edit")}
                                </Button>
                            }
                        >
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
                                            {employee?.positionName || t("account.noPosition")} - {employee.departmentName || t("account.noDepartment")}
                                        </Tag>
                                    </div>
                                </Col>
                    
                                {/* Info */}
                                <Col span={24} md={18}>
                                    <Row gutter={[16, 16]}>
                                        <Item label={t("account.employeeCode")} value={employee.employeesCode} />
                                        <Item label={t("userRole.username")} value={employee.username} />
                                        <Item label={t("account.birthday")} value={dayjs(employee.birthday).format('DD/MM/YYYY')} />
                                        <Item
                                            label={t("account.gender")}
                                            value={employee.gender === 1 ? t("employee.genderValue.male") : t("employee.genderValue.female")}
                                        />
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
                        </Card>
                    </Col>
                )}
            </Row>

            <AddEditEmployee 
                open={isModalVisible}
                onCancel={onCloseModal}
                onSubmit={handleSubmitModal}
                editingRecord={employee}
                position={positionList?.position}
            />

            <EditAccountForm
                open={isEditAccountOpen}
                account={account}
                onCancel={() => setIsEditAccountOpen(false)}
                onSubmit={handleSubmitAccount}
            />
        </div>
    );
};

export default withReducer('dashboard', reduce)(Account);