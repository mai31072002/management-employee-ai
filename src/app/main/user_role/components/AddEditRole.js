import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const AddRoleForm = ({
    open,
    onCancel,
    onSubmit,
    role = null
}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const permission = useSelector(
        state => state.userRole.userRole.permissionList?.data || []
    );

    useEffect(() => {
        if (!permission || permission?.length === 0) {
            dispatch(Actions.fetchListPermission());
        }
    }, [dispatch, permission]);

    useEffect(() => {
        if (open) {
            if (role) {
                // Edit mode - populate form with role data
                form.setFieldsValue({
                    roleName: role.roleName,
                    description: role.description,
                    permission: role.permissions || role.permission || []
                });
            } else {
                // Add mode - reset form
                form.resetFields();
            }
        }
    }, [open, form, role]);

    const handleFinish = (values) => {
        // Convert permission IDs to permission names
        const permissionNames = values.permission.map(permId => {
            const permissionItem = permission.find(p => p.id === permId);
            return permissionItem ? permissionItem.permissionName : permId;
        });

        onSubmit({
            roleName: values.roleName,
            description: values.description,
            permission: permissionNames
        });
    };

    return (
        <Modal
            open={open}
            title={role ? "Chỉnh sửa Quyền" : t("userRole.modalAddRoleTitle")}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item
                    label={t("userRole.roleName")}
                    name="roleName"
                    rules={[
                        { required: true, message: t("userRole.validationRoleNameRequired") }
                    ]}
                >
                    <Input placeholder="EMPLOYEE" />
                </Form.Item>

                <Form.Item
                    label={t("userRole.roleDesc")}
                    name="description"
                    rules={[
                        { required: true, message: t("userRole.validationRoleDescRequired") }
                    ]}
                >
                    <Input placeholder={t("userRole.roleDesc")} />
                </Form.Item>

                <Form.Item
                    label={t("userRole.permission")}
                    name="permission"
                    rules={[
                        { required: true, message: t("userRole.validationPermissionRequired") }
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder={t("userRole.permissionPlaceholder")}
                    >
                        {permission.map(p => (
                            <Option key={p.id} value={p.id}>
                                {p.permissionName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: "right" }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        {t("common.cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {role ? "Cập nhật" : t("userRole.createRole")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddRoleForm;
