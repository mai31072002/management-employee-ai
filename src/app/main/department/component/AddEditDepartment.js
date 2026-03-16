import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useTranslation } from "react-i18next";

const AddEditDepartmentModal = ({
    open,
    department,
    onCancel,
    onSubmit
}) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        if (open && department) {
            form.setFieldsValue({
                departmentName: department.departmentName,
                description: department.description
            });
        }
    }, [open, department, form]);

    const handleFinish = (values) => {
        onSubmit({
            departmentName: values.departmentName,
            description: values.description
        });
    };

    return (
        <Modal
            open={open}
            title={department ? t("department.modalEditTitle") : t("department.modalAddTitle")}
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
                    label={t("department.name")}
                    name="departmentName"
                    rules={[
                        { required: true, message: t("department.validationNameRequired") }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("department.description")}
                    name="description"
                    rules={[
                        { required: true, message: t("department.validationDescRequired") }
                    ]}
                >
                    <Input />
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

export default AddEditDepartmentModal;
