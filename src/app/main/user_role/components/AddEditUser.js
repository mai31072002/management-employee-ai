import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const EditUserModal = ({
    open,
    onCancel,
    onSubmit,
    user,
    roleOptions
}) => {
    const [form] = Form.useForm(); 
    const { t } = useTranslation();

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                roles: user.roles
            });
        }
    }, [open, user, form]);

    const handleFinish = (values) => {
        onSubmit({
            userId: user.userId,
            username: values.username,
            email: values.email,
            roles: values.roles
        });
    };

    return (
        <Modal
            open={open}
            title={t("user.editTitle")}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item label="Username" name="username">
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label={t("auth.email")}
                    name="email"
                    rules={[
                        { required: true, message: t("user.validationEmailRequired") },
                        { type: "email", message: t("user.validationEmailInvalid") }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Roles"
                    name="roles"
                    rules={[{ required: true, message: t("user.validationRolesRequired") }]}
                >
                    <Select mode="multiple">
                        {roleOptions.map(role => (
                            <Option key={role.roleName} value={role.roleName}>
                                {role.discription}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: "right" }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        {t("common.cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {t("common.save")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserModal;
