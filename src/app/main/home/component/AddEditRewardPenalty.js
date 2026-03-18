import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const AddEditRewardPenalty = ({ open, onCancel, onSubmit, employee, dataAddAndEdit }) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        if (open && dataAddAndEdit) {
            form.setFieldsValue({
                month: dayjs(dataAddAndEdit.month),
                amount: dataAddAndEdit.amount,
                reason: dataAddAndEdit.reason,
                type: dataAddAndEdit.type,
            });
        }

        if (open && !dataAddAndEdit) {
            form.resetFields();
            form.setFieldsValue({
                month: dayjs(),
                type: 0,
            });
        }
    }, [form, open, dataAddAndEdit]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                userId: employee.userId,
                month: values.month.format("YYYY-MM-DD"),
                amount: values.amount,
                reason: values.reason,
                type: values.type,
            };

            // dispatch(Actions.createRewardPenalty(payload));

            onSubmit(payload);
        } catch (err) {
            console.log("Validate failed", err);
        }
    };

    return (
        <Modal
            title={dataAddAndEdit ? t("rewardPenalty.editTitle") : t("rewardPenalty.addTitle")}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            okText={t("common.save")}
            cancelText={t("common.cancel")}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    month: dayjs(),
                    type: 0,
                }}
            >
                <Form.Item
                    label={t("rewardPenalty.dateMonth")}
                    name="month"
                    rules={[{ required: true, message: t("rewardPenalty.selectMonthRequired") }]}
                >
                    <DatePicker
                        picker="date"
                        format="YYYY-MM-DD"
                        style={{ width: "100%" }}
                        disabled={!!dataAddAndEdit}
                    />
                </Form.Item>

                <Form.Item
                    label={t("rewardPenalty.amount")}
                    name="amount"
                    rules={[
                        { required: true, message: t("rewardPenalty.amountRequired") },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/,/g, "")}
                    />
                </Form.Item>

                <Form.Item
                    label={t("rewardPenalty.reason")}
                    name="reason"
                    rules={[
                        { required: true, message: t("rewardPenalty.reasonRequired") },
                    ]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    label={t("rewardPenalty.type")}
                    name="type"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { value: 0, label: t("rewardPenalty.typeReward") },
                            { value: 1, label: t("rewardPenalty.typePenalty") },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditRewardPenalty;
