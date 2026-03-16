import React, { useEffect, useCallback } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "app/auth/store/actions";
import { useTranslation } from "react-i18next";

const ForgotPasswordModal = ({ open, onCancel }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const forgotPass = useSelector((state) => state.login?.forgotPass);

    const openNotificationWithIcon = useCallback((type) => {
        switch (type) {
            case "success":
                return notification[type]({
                    message: t("auth.forgotSuccessTitle"),
                });
            case "error":
                return notification[type]({
                    message: t("auth.forgotErrorTitle"),
                    description: forgotPass.message,
                });
            default:
                return type;
        }
    }, [t, forgotPass]);

    useEffect(() => {
        if (forgotPass?.status === null) return;
    
        if (forgotPass?.status === 200) {
            openNotificationWithIcon("success");
            onCancel();
        } else {
            openNotificationWithIcon("error");
        }
    }, [forgotPass, onCancel, openNotificationWithIcon]);
     
    const onFinish = (values) => {
        dispatch(Actions.forgotPass(values));
    };

    return (
        <Modal
            open={open}
            title={t("auth.forgotModalTitle")}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label={t("auth.username")}
                    rules={[
                        { required: true, message: t("auth.validation.usernameRequired") },
                        { max: 128, message: t("auth.validation.max128") }
                    ]}
                >
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    name="email"
                    label={t("auth.email")}
                    rules={[
                        { required: true, message: t("auth.validationEmailRequired") },
                        { type: "email", message: t("auth.validationEmailInvalid") }
                    ]}
                >
                    <Input prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={t("auth.newPassword")}
                    rules={[
                        { required: true, message: t("auth.validationNewPasswordRequired") },
                        {
                            pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                            message: t("auth.validationNewPasswordPattern")
                        }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    {t("auth.changePassword")}
                </Button>
            </Form>
        </Modal>
    );
};

export default ForgotPasswordModal;