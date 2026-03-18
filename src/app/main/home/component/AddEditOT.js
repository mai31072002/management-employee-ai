import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col, Select, Radio, DatePicker, TimePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const AddEditOT = ({
    open,
    onCancel,
    AddEditOtSubmit,
    otDay,
    employee
}) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const { t } = useTranslation();

    useEffect(() => {
        if (otDay) {
            form.setFieldsValue({
                ...otDay,
                userId: otDay.userId ?? employee.userId,
                workDate: otDay.workDate ? dayjs(otDay.workDate) : null,
                startTime: otDay.startTime ? dayjs(otDay.startTime, "HH:mm") : null,
                endTime: otDay.endTime ? dayjs(otDay.endTime, "HH:mm") : null,
                approvedAt: otDay.approvedAt ? dayjs(otDay.approvedAt) : null,
                fullName: employee.fullName || "",
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                fullName: employee?.employee?.fullName || "",
                userId: employee?.userId,
            });
        }
    }, [otDay, form, employee]);

    const handleFinish = (values) => {
        const reqData = {
            ...values,
            workDate: values.workDate.format("YYYY-MM-DD"),
            startTime: values.startTime.format("HH:mm"),
            endTime: values.endTime.format("HH:mm"),
            approvedAt: values.approvedAt
                ? values.approvedAt.format("YYYY-MM-DDTHH:mm:ss")
                : null,
            otType: Number(values.otType),
            status: Number(values.status),
        };

        AddEditOtSubmit(reqData, form);
    };

    const calcOtMinutes = () => {
        const start = form.getFieldValue("startTime");
        const end = form.getFieldValue("endTime");

        if (start && end && end.isAfter(start)) {
            const minutes = end.diff(start, "minute");
            form.setFieldValue("otMinutes", minutes);
        } else {
            form.setFieldValue("otMinutes", null);
        }
    };

    return (
        <Modal
            title={otDay ? t("ot.modalEditTitle") : t("ot.modalAddTitle")}
            open={open}
            onOk={() => form.submit()}
            onCancel={onCancel}
            okText={t("common.save")}
            cancelText={t("common.cancel")}
            centered
            destroyOnHidden
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="model-from"
                initialValues={{
                    status: 0,
                    otRate: 1.5,
                }}
            >
                <Form.Item name="userId" hidden>
                    <Input />
                </Form.Item>
                {/* Employee */}
                <Form.Item 
                    name="fullName" 
                    label={t("ot.employeeName")}
                >
                    <Input disabled />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("ot.workDate")}
                            name="workDate"
                            rules={[{ required: true, message: t("ot.selectOtDate") }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                className="w-100"
                                disabledDate={(current) =>
                                    current && current > dayjs().endOf("day")
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={t("ot.otType")}
                            name="otType"
                            rules={[{ required: true, message: t("ot.selectOtType") }]}
                        >
                            <Select>
                                <Option value="0">{t("ot.typeNormal")}</Option>
                                <Option value="1">{t("ot.typeWeekend")}</Option>
                                <Option value="2">{t("ot.typeHoliday")}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("ot.startTime")}
                            name="startTime"
                            rules={[{ required: true, message: t("ot.selectStartTime") }]}
                        >
                            <TimePicker 
                                format="HH:mm" 
                                className="w-100" 
                                onChange={calcOtMinutes}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={t("ot.endTime")}
                            name="endTime"
                            dependencies={["startTime"]}
                            rules={[
                                { required: true, message: t("ot.selectEndTime") },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const start = getFieldValue("startTime");
                                        if (!value || !start) return Promise.resolve();
                                        if (value.isBefore(start)) {
                                            return Promise.reject(t("ot.endTimeAfterStart"));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <TimePicker 
                                format="HH:mm" 
                                className="w-100" 
                                onChange={calcOtMinutes}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={t("ot.otMinutes")}
                    name="otMinutes"
                    rules={[{ required: true, message: t("ot.otMinutesRequired") }]}
                >
                    <InputNumber min={1} className="w-100" disabled />
                </Form.Item>

                <Form.Item
                    label={t("ot.jobTitle")}
                    name="jobTitle"
                    rules={[{ required: true, message: t("ot.jobTitleRequired") }]}
                >
                    <Input placeholder={t("ot.jobTitle")} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("ot.approvedBy")}
                            name="approvedBy"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={t("ot.approvedAt")}
                            name="approvedAt"
                        >
                            <DatePicker
                                showTime
                                format="DD/MM/YYYY HH:mm"
                                className="w-100"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={t("ot.otRate")}
                    name="otRate"
                    rules={[{ required: true }]}
                >
                    <InputNumber min={1} step={0.1} className="w-100" />
                </Form.Item>

                <Form.Item
                    label={t("ot.status")}
                    name="status"
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        <Radio value={0}>{t("ot.statusWait")}</Radio>
                        <Radio value={1}>{t("ot.statusValue.approved")}</Radio>
                        <Radio value={2}>{t("ot.statusRejected")}</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditOT;
