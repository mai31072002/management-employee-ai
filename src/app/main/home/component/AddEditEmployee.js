import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Row, Col, Select, Radio, DatePicker } from "antd";
import vietnamData from "assets/json/full_json_generated_data_vn_units.json";
import { useDispatch, useSelector } from "react-redux";
import * as Action from "../store/actions";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const AddEditEmployee = ({
    open,
    onCancel,
    onSubmit,
    editingRecord,
    position,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { Option } = Select;
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [districts, setDistricts] = useState([]);

    const { departmentList } = useSelector(state => state.dashboard.dashboard);

    useEffect(() => {
        if (!departmentList.department || departmentList.department.length === 0) {
            dispatch(Action.fetchListDepartment());
        }
    }, [dispatch, departmentList]);

    useEffect(() => {
        if (editingRecord) {
            const province = vietnamData.find((p) => p.Name === editingRecord.province);
            setDistricts(province?.Wards || []);
            const birthday = editingRecord.birthday ? dayjs(editingRecord.birthday) : null;
            const startDate = editingRecord.startDate ? dayjs(editingRecord.startDate) : null;
            const endDate = editingRecord.endDate ? dayjs(editingRecord.endDate) : null;
            const age = birthday ? dayjs().diff(birthday, "year") : undefined;
            form.setFieldsValue({
                ...editingRecord,
                birthday, 
                age, 
                startDate, 
                endDate,
                positionId: editingRecord.position?.id,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: 1,
            });
            setDistricts([]);  
        }
    }, [editingRecord, form]);

    const handleProvinceChange = (provinceName) => {
        const province = vietnamData.find((p) => p.Name === provinceName);
        setDistricts(province?.Wards || []);
    };

    const handleFinish = (values) => {
        const { age, ...cleanValues } = values;

        const reqData = {
            ...cleanValues,
            birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
            gender: Number(values.gender),
            status: Number(values.status),
            isAvatarCleared: values.isAvatarCleared || false,
        };

        onSubmit(reqData, form);
    };

  const handleDistrictChange = () => {                                                                                                   
    // const district = districts.find((d) => d.Name === districtName);
    // setWards(district?.Wards || []);
  };

  return (
    <Modal
        title={editingRecord ? t("employee.modalEditTitle") : t("employee.modalAddTitle")}
        open={open}
        onOk={() => form.submit()}
        onCancel={onCancel}
        okText={t("common.save")}
        cancelText={t("common.cancel")}
        centered
        destroyOnHidden
        width={600}
        className={"candidate-model"}
    >
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleFinish} 
            className="model-from"
        >
            <Form.Item name="employeeId" hidden>
                <Input />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={t("common.firstName")}
                        name="firstName"
                        rules={[
                            { required: true, message: t("account.validationFirstNameRequired") },
                            { min: 2, max: 50, message: t("employee.form.firstNameLength") },
                            { pattern: /^[\p{L}\s]+$/u, message: t("employee.form.firstNameLettersOnly") },
                            {
                                validator: (_, value) =>
                                value && value.trim().length === 0
                                    ? Promise.reject(t("employee.form.noWhitespaceOnly"))
                                    : Promise.resolve(),
                            },
                        ]}
                    >
                        <Input placeholder={t("common.firstName")} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("common.lastName")}
                        name="lastName"
                        rules={[
                            { required: true, message: t("account.validationLastNameRequired") },
                            { min: 1, max: 50, message: t("employee.form.lastNameLength") },
                            { pattern: /^[\p{L}\s]+$/u, message: t("employee.form.lastNameLettersOnly") },
                            {
                                validator: (_, value) =>
                                value && value.trim().length === 0
                                    ? Promise.reject(t("employee.form.noWhitespaceOnly"))
                                    : Promise.resolve(),
                            },
                        ]}
                    >
                        <Input placeholder={t("common.lastName")} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                name="username"
                rules={[
                    { required: true, message: t("employee.form.usernameRequired") },
                    { min: 4, max: 100, message: t("employee.form.usernameLength") },
                    {
                        validator: (_, value) =>
                        value && value.toLowerCase().includes("admin")
                            ? Promise.reject(t("employee.form.usernameNoAdmin"))
                            : Promise.resolve(),
                    },
                ]}
            >
                <Input placeholder={t("auth.username")} />
            </Form.Item>

            <Form.Item 
                label={t("auth.email")}
                rules={[
                    { required: true, message: t("employee.form.emailRequired") },
                    { type: "email", message: t("employee.form.emailInvalid") },
                ]}
                name="email"
            >
                <Input placeholder={t("auth.email")} />
            </Form.Item>

            <Form.Item 
                label={t("account.phone")} 
                name="phone" 
                rules={[
                    { required: true, message: t("employee.form.phoneRequired") },
                    { pattern: /^(0|\+84)(\d{8,10})$/, message: t("employee.form.phoneInvalid") },
                ]}
            >
                <Input 
                    placeholder={t("account.phone")}
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            </Form.Item>

            <Form.Item 
                label={t("employee.form.cccd")} 
                name="cccd" 
                rules={[
                    // { required: true, message: "Vui lòng nhập số CCCD" },
                    { pattern: /^[0-9]{9,15}$/, message: t("employee.form.cccdInvalid") },
                ]}
            >
                <Input 
                    placeholder={t("employee.form.cccd")}
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={t("account.birthday")}
                        name="birthday"
                        rules={[
                            { required: true, message: t("employee.form.birthdayRequired") },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const age = dayjs().diff(value, "year");
                                    if (age < 15) return Promise.reject(t("employee.form.birthdayMinAge"));
                                    if (age > 70) return Promise.reject(t("employee.form.birthdayMaxAge"));
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker 
                            format="DD/MM/YYYY" 
                            inputReadOnly={false} 
                            placeholder="MM/DD/YY"
                            allowClear
                            disabledDate={(current) => {
                                return current && current > dayjs().endOf("day");
                            }}
                            onChange={(date) => {
                                if (date) form.setFieldValue("age", dayjs().diff(date, "year"));
                                else form.setFieldValue("age", undefined);
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("account.gender")}
                        name="gender"
                        rules={[{ required: true, message: t("employee.form.genderRequired") }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>{t("employee.genderValue.male")}</Radio>
                            <Radio value={0}>{t("employee.genderValue.female")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label={t("employee.form.age")} name="age" rules={[{ required: true, message: " " }]}>
                <Input placeholder={t("employee.form.age")} disabled />
            </Form.Item>

            <Form.Item
                label={t("employee.form.startDate")}
                name="startDate"
                rules={[{ required: true, message: t("employee.form.startDateRequired") }]}
            >
                <DatePicker format="DD/MM/YYYY" className="w-100" />
            </Form.Item>
            <Form.Item
                label={t("employee.form.endDate")}
                name="endDate"
                dependencies={["startDate"]}
                rules={[
                    { required: false, message: t("employee.form.endDateSelect") },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const start = getFieldValue("startDate");
                            if (!value || !start) {
                                return Promise.resolve();
                            }

                            if (value.isBefore(start, "day")) {
                                return Promise.reject(
                                    new Error(t("employee.form.endDateAfterStart"))
                                );
                            }
                            return Promise.resolve();
                        },
                    }),
                ]}
            >
                <DatePicker format="DD/MM/YYYY" className="w-100" />
            </Form.Item>

            <Form.Item label={t("employee.form.province")} name="province" rules={[{ required: true, message: " " }]}>
                <Select
                    showSearch
                    placeholder={t("employee.form.province")}
                    optionFilterProp="children"
                    onChange={handleProvinceChange}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    classNames={{
                        popup: {
                            root: "select-address-dropdown",
                        },
                        container: "select-address"
                    }}

                >
                    {vietnamData.map((province) => (
                        <Option key={province.Code} value={province.Name}>
                            {province.Name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label={t("employee.form.district")} name="district" rules={[{ required: true, message: " " }]}>
                <Select
                    showSearch
                    placeholder={t("employee.form.district")}
                    disabled={!districts.length && !form.getFieldValue("district")}
                    optionFilterProp="children"
                    onChange={handleDistrictChange}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    classNames={{
                        popup: {
                        root: 'my-select-popup',
                        },
                    }}
                >
                    {districts.map((district) => (
                        <Option key={`${district.Code || ''}-${district.Name || ''}`} value={district.Name}>
                            {district.Name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item 
                label={t("employee.form.address")} 
                name="address" 
                rules={[
                    { required: true, message: t("employee.form.addressRequired") },
                    { max: 255, message: t("employee.form.addressMax") },
                ]}
            >
                <Input placeholder={t("employee.form.address")} />
            </Form.Item>

            <Form.Item label={t("employee.form.position")} name="positionId" rules={[{ required: true }]}>
                <Select placeholder={t("employee.form.position")}>
                    {position.map((item) => (
                    <Option key={item.id} value={item.id}>
                        {item.positionName}
                    </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label={t("employee.form.department")}
                name="departmentId"
                rules={[{ required: true, message: t("employee.form.departmentRequired") }]}
            >
                <Select
                    placeholder={t("employee.form.department")}
                    allowClear
                >
                    {departmentList?.department?.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.departmentName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item
                label={t("employee.form.employeeCode")}
                name="employeesCode"
                rules={[{ required: true, message: t("employee.form.employeeCodeRequired") }]}
            >
                <Input placeholder={t("employee.form.employeeCode")} />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={t("employee.form.baseSalary")}
                        name="baseSalary"
                        rules={[{ required: true, message: t("employee.form.baseSalaryRequired") }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("employee.form.allowance")}
                        name="allowance"
                        rules={[{ required: true, message: t("employee.form.allowanceRequired") }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                label={t("employee.form.manager")} 
                name="manages"
                rules={[{ required: true, message: t("employee.form.managerRequired") }]}
            >
                <Input placeholder={t("employee.form.manager")} />
            </Form.Item>

            <Form.Item label={t("employee.form.description")} name="description">
                <TextArea rows={3} placeholder={t("employee.form.description")} />
            </Form.Item>

            <Form.Item label={t("employee.form.status")} name="status" rules={[{ required: true, message: " " }]}>
                <Radio.Group>
                    <Radio value={1}>{t("employee.statusValue.working")}</Radio>
                    {editingRecord && <Radio value={2}>{t("employee.statusValue.quit")}</Radio>}
                    {editingRecord && <Radio value={3}>{t("employee.statusValue.probation")}</Radio>}
                </Radio.Group>
            </Form.Item>
        </Form>
    </Modal>
  );
};

export default AddEditEmployee;
