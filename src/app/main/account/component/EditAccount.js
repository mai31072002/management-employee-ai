import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const EditAccountForm = ({
    open,
    onCancel,
    onSubmit,
    account
}) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        if (open && account) {
            form.setFieldsValue({
                username: account.username,
                email: account.email,
                firstName: account.firstName,
                lastName: account.lastName,
                roles: account.roles,
            });
        }
    }, [open, account, form]);

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Modal
            open={open}
            title={t("account.editAccountTitle")}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Username"
                    name="username"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label={t("auth.email")}
                    name="email"
                    rules={[
                        { required: true, message: t("account.validationEmailRequired") },
                        { type: "email", message: t("account.validationEmailInvalid") }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("common.firstName")}
                    name="firstName"
                    rules={[{ required: true, message: t("account.validationFirstNameRequired") }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("common.lastName")}
                    name="lastName"
                    rules={[{ required: true, message: t("account.validationLastNameRequired") }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Roles"
                    name="roles"
                    rules={[{ required: true, message: t("account.validationRolesRequired") }]}
                >
                    <Select mode="multiple" placeholder={t("account.rolesPlaceholder")}>
                        <Option value="ADMIN">ADMIN</Option>
                        <Option value="USER">USER</Option>
                        <Option value="MANAGER">MANAGER</Option>
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

export default EditAccountForm;