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
            const province = vietnamData.find((p) => p.Name === editingRecord?.employee?.province);
            setDistricts(province?.Wards || []);
            form.setFieldValue(["employee", "district"], undefined);

            const birthday = editingRecord?.employee?.birthday ? dayjs(editingRecord?.employee?.birthday) : null;
            const startDate = editingRecord?.employee?.startDate ? dayjs(editingRecord?.employee?.startDate) : null;
            const endDate = editingRecord?.employee?.endDate ? dayjs(editingRecord?.employee?.endDate) : null;
            const age = birthday ? dayjs().diff(birthday, "year") : undefined;
            
            form.setFieldsValue({
                username: editingRecord?.username,
                email: editingRecord?.email,
                employee: {
                    firstName: editingRecord?.employee?.firstName,
                    lastName: editingRecord?.employee?.lastName,
                    phone: editingRecord?.employee?.phone,
                    cccd: editingRecord?.employee?.cccd,
                    birthday, 
                    age, 
                    startDate, 
                    endDate,
                    gender: editingRecord?.employee?.gender,
                    province: editingRecord?.employee?.province,
                    district: editingRecord?.employee?.district,
                    address: editingRecord?.employee?.address,
                    positionName: editingRecord?.employee?.positionName,
                    departmentName: editingRecord?.employee?.departmentName,
                    employeesCode: editingRecord?.employee?.employeesCode,
                    baseSalary: editingRecord?.employee?.baseSalary,
                    allowance: editingRecord?.employee?.allowance,
                    manages: editingRecord?.employee?.manages,
                    description: editingRecord?.employee?.description,
                    status: editingRecord?.employee?.status,
                }
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
            username: cleanValues.username,
            email: cleanValues.email,
            ...(editingRecord ? {} : { password: cleanValues.password }),
            employee: {
                firstName: cleanValues.employee?.firstName,
                lastName: cleanValues.employee?.lastName,
                phone: cleanValues.employee?.phone,
                cccd: cleanValues.employee?.cccd,
                birthday: cleanValues.employee?.birthday ? dayjs(cleanValues.employee.birthday).format("YYYY-MM-DD") : null,
                gender: cleanValues.employee?.gender !== undefined ? Number(cleanValues.employee.gender) : null,
                province: cleanValues.employee?.province,
                district: cleanValues.employee?.district,
                address: cleanValues.employee?.address,
                positionName: cleanValues.employee?.positionName,
                departmentName: cleanValues.employee?.departmentName,
                employeesCode: cleanValues.employee?.employeesCode,
                baseSalary: cleanValues.employee?.baseSalary ? Number(cleanValues.employee.baseSalary) : null,
                allowance: cleanValues.employee?.allowance ? Number(cleanValues.employee.allowance) : null,
                manages: cleanValues.employee?.manages,
                description: cleanValues.employee?.description,
                status: cleanValues.employee?.status !== undefined ? Number(cleanValues.employee.status) : null,
                startDate: cleanValues.employee?.startDate ? dayjs(cleanValues.employee.startDate).format("YYYY-MM-DD") : null,
                endDate: cleanValues.employee?.endDate ? dayjs(cleanValues.employee.endDate).format("YYYY-MM-DD") : null,
            }
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
            <Form.Item name="userId" hidden>
                <Input />
            </Form.Item>

            {/* User Info Fields */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={t("userRole.username")}
                        name="username"
                        rules={[
                            { required: true, message: t("account.validationUsernameRequired") },
                            { min: 4, max: 128, message: t("employee.form.usernameLength") },
                        ]}
                    >
                        <Input placeholder={t("userRole.username")} disabled={!!editingRecord} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("userRole.email")}
                        name="email"
                        rules={[
                            { required: true, message: t("account.validationEmailRequired") },
                            { type: "email", message: t("account.validationEmailInvalid") },
                        ]}
                    >
                        <Input placeholder={t("userRole.email")} disabled={!!editingRecord} />
                    </Form.Item>
                </Col>
            </Row>

            {/* Employee Info Fields */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={t("common.firstName")}
                        name={["employee", "firstName"]}
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
                        name={["employee", "lastName"]}
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
                name={["employee", "phone"]} 
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
                name={["employee", "cccd"]} 
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
                        name={["employee", "birthday"]}
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
                        name={["employee", "gender"]}
                        rules={[{ required: true, message: t("employee.form.genderRequired") }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>{t("employee.genderValue.male")}</Radio>
                            <Radio value={0}>{t("employee.genderValue.female")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                label={t("employee.form.age")} 
                name={["employee", "age"]} 
                rules={[{ required: true, message: " " }]}
            >
                <Input placeholder={t("employee.form.age")} disabled />
            </Form.Item>

            <Form.Item
                label={t("employee.form.startDate")}
                name={["employee", "startDate"]}
                rules={[{ required: true, message: t("employee.form.startDateRequired") }]}
            >
                <DatePicker format="DD/MM/YYYY" className="w-100" />
            </Form.Item>
            <Form.Item
                label={t("employee.form.endDate")}
                name={["employee", "endDate"]}
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

            <Form.Item 
                label={t("employee.form.province")} 
                name={["employee", "province"]} 
                rules={[{ required: true, message: " " }]}
            >
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

            <Form.Item 
                label={t("employee.form.district")} 
                name={["employee", "district"]} 
                rules={[{ required: true, message: " " }]}
            >
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
                name={["employee", "address"]} 
                rules={[
                    { required: true, message: t("employee.form.addressRequired") },
                    { max: 255, message: t("employee.form.addressMax") },
                ]}
            >
                <Input placeholder={t("employee.form.address")} />
            </Form.Item>

            <Form.Item 
                label={t("employee.form.position")} 
                name={["employee", "positionName"]} 
                rules={[{ required: true }]}
            >
                <Select placeholder={t("employee.form.position")}>
                    {position.map((item) => (
                    <Option key={item.id} value={item.positionName}>
                        {item.positionName}
                    </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label={t("employee.form.department")}
                name={["employee", "departmentName"]}
                rules={[{ required: true, message: t("employee.form.departmentRequired") }]}
            >
                <Select
                    placeholder={t("employee.form.department")}
                    allowClear
                >
                    {departmentList?.department?.map((item) => (
                        <Select.Option key={item.id} value={item.departmentName}>
                            {item.departmentName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item
                label={t("employee.form.employeeCode")}
                name={["employee", "employeesCode"]}
                rules={[{ required: true, message: t("employee.form.employeeCodeRequired") }]}
            >
                <Input placeholder={t("employee.form.employeeCode")} />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={t("employee.form.baseSalary")}
                        name={["employee", "baseSalary"]}
                        rules={[{ required: true, message: t("employee.form.baseSalaryRequired") }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("employee.form.allowance")}
                        name={["employee", "allowance"]}
                        rules={[{ required: true, message: t("employee.form.allowanceRequired") }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                label={t("employee.form.manager")} 
                name={["employee", "manages"]}
                rules={[{ required: true, message: t("employee.form.managerRequired") }]}
            >
                <Input placeholder={t("employee.form.manager")} />
            </Form.Item>

            <Form.Item 
                label={t("employee.form.description")} 
                name={["employee", "description"]}
            >
                <TextArea rows={3} placeholder={t("employee.form.description")} />
            </Form.Item>

            <Form.Item 
                label={t("employee.form.status")} 
                name={["employee", "status"]} 
                rules={[{ required: true, message: " " }]}
            >
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
