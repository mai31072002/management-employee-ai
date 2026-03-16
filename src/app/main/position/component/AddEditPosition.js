import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { useTranslation } from "react-i18next";

const AddEditPositionModal = ({
    open,
    position,
    leverData,
    onCancel,
    onSubmit
}) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        if (open && position) {
            form.setFieldsValue({
                positionName: position.positionName,
                description: position.description,
                leverNumber: position.leverNumber
            });
        }
    }, [open, position, form]);

    const handleFinish = (values) => {
        onSubmit({
            positionName: values.positionName,
            description: values.description,
            leverId: values.leverId,
        });
    };

    return (
        <Modal
            open={open}
            title={position ? t("position.modalEditTitle") : t("position.modalAddTitle")}
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
                    label={t("position.name")}
                    name="positionName"
                    rules={[
                        { required: true, message: t("position.validationNameRequired") }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("position.description")}
                    name="description"
                    rules={[
                        { required: true, message: t("position.validationDescRequired") }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("position.level")}
                    name="leverId"
                    rules={[
                        { required: true, message: t("position.validationLevelRequired") }
                    ]}
                >
                    <Select
                        placeholder={t("position.levelPlaceholder")}
                        options={(leverData || []).map(item => ({
                            value: item.id,
                            label: `Level ${item.leverNumber} - ${item.description}`
                        }))}
                    />
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

export default AddEditPositionModal;
