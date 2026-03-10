import React, { useEffect } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "app/auth/store/actions";
import { notificationPopup } from "app/helpers/common";

const ForgotPasswordModal = ({ open, onCancel }) => {
    const dispatch = useDispatch();

    const forgotPass = useSelector((state) => state.auth.auth.forgotPass);

    useEffect(() => {
        if (forgotPass?.state != null) {
            notificationPopup(
                forgotPass.status,
                forgotPass.message
            );
        }
    }, [forgotPass]);
    
    const onFinish = (values) => {
        dispatch(Actions.forgotPass(values));
        onCancel();
    };

    return (
        <Modal
            open={open}
            title="Quên mật khẩu"
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: "Vui lòng nhập username" },
                        { max: 128, message: "Không vượt quá 100 ký tự" }
                    ]}
                >
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" }
                    ]}
                >
                    <Input prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu mới" },
                        {
                            pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                            message: "Tối thiểu 8 ký tự, có chữ hoa, số & ký tự đặc biệt"
                        }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Đổi mật khẩu
                </Button>
            </Form>
        </Modal>
    );
};

export default ForgotPasswordModal;