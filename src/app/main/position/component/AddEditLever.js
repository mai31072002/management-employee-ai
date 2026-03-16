import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useTranslation } from "react-i18next";

const AddEditLeverModal = ({
    open,
    lever,
    onCancel,
    onSubmit
}) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        if (open && lever) {
            form.setFieldsValue({
                leverNumber: lever.leverNumber,
                description: lever.description
            });
        }
    }, [open, lever, form]);

    const handleFinish = (values) => {
        onSubmit({
            leverNumber: values.leverNumber,
            description: values.description
        });
    };

    return (
        <Modal
            open={open}
            title={lever ? t("lever.modalEditTitle") : t("lever.modalAddTitle")}
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
                    label={t("lever.number")}
                    name="leverNumber"
                    rules={[
                        { required: true, message: t("lever.validationNumberRequired") }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("lever.description")}
                    name="description"
                    rules={[
                        { required: true, message: t("lever.validationDescRequired") }
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

export default AddEditLeverModal;
