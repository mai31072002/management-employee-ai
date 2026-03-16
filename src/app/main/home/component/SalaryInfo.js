import React, { useEffect } from 'react';
import { Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "../store/actions";
import { useTranslation } from "react-i18next";

const SalaryInfo = ({ employeeId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const month = "2025-12";

    const salaryDatail = useSelector(
            state => state.dashboard.dashboard.salaryDatail?.salaryDatail ?? []
        );

    useEffect(() => {
        dispatch(Actions.fetchListSalary(employeeId, month));
    },[dispatch, employeeId, month]);

    return (
        <Descriptions column={1}>
            <Descriptions.Item label={t("salary.month")}>
                {salaryDatail.month || ''}
            </Descriptions.Item>

            <Descriptions.Item label={t("salary.baseSalary")}>
                {salaryDatail.baseSalary || ''}
            </Descriptions.Item>

            <Descriptions.Item label={t("salary.totalWorkDays")}>
                {salaryDatail.totalWorkDays || ''}
            </Descriptions.Item>

            <Descriptions.Item label={t("salary.otAmount")}>
                {salaryDatail.otAmount || ''}
            </Descriptions.Item>

            <Descriptions.Item label={t("salary.allowance")}>
                {salaryDatail.allowance || ''}
            </Descriptions.Item>

            <Descriptions.Item label={t("salary.deductions")}>
                {salaryDatail.deductions || ''}
            </Descriptions.Item>

            <Descriptions.Item label={t("salary.netSalary")}>
                {salaryDatail.netSalary || ''}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default SalaryInfo;
