import React, { useState } from "react";
import { Modal, Upload, Button, Progress, Alert, Space, Typography } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImportExcelModal = ({ open, onCancel, onImport, onDownloadTemplate, loading }) => {
    const { t } = useTranslation();
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");

    const handleFileChange = (info) => {
        const { fileList } = info;
        setFileList(fileList.slice(-1)); // Only keep latest file
        setError("");
    };

    const beforeUpload = (file) => {
        const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
                        file.type === "application/vnd.ms-excel";
        
        if (!isExcel) {
            setError(t("employee.fileTypeError"));
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            setError(t("employee.fileSizeError"));
            return false;
        }

        return false; // Prevent automatic upload
    };

    const handleImport = async () => {
        if (fileList.length === 0) {
            setError(t("employee.noFileSelected"));
            return;
        }

        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj);

        try {
            setError("");
            await onImport(formData, (progress) => {
                setUploadProgress(progress);
            });
            
            // Reset on success
            setFileList([]);
            setUploadProgress(0);
        } catch (error) {
            setError(error.message || t("employee.error"));
            setUploadProgress(0);
        }
    };

    const handleDownloadTemplate = () => {
        onDownloadTemplate();
    };

    const handleClose = () => {
        setFileList([]);
        setUploadProgress(0);
        setError("");
        onCancel();
    };

    const uploadProps = {
        fileList,
        onChange: handleFileChange,
        beforeUpload,
        multiple: false,
        accept: ".xlsx,.xls",
    };

    return (
        <Modal
            title={
                <Space>
                    <Title level={4} style={{ margin: 0 }}>
                        {t("employee.importExcel.title")}
                    </Title>
                </Space>
            }
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="template" icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
                    {t("employee.downloadTemplate.title")}
                </Button>,
                <Button key="cancel" onClick={handleClose}>
                    {t("common.cancel")}
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    loading={loading}
                    onClick={handleImport}
                    disabled={fileList.length === 0}
                >
                    {t("employee.importExcel.importButton")}
                </Button>,
            ]}
            width={600}
            destroyOnHidden
        >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {/* Instructions */}
                <Alert
                    message={t("employee.instructions")}
                    description={
                        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                            <li>{t("employee.importExcel.step1")}</li>
                            <li>{t("employee.importExcel.step2")}</li>
                            <li>{t("employee.importExcel.step3")}</li>
                            <li>{t("employee.importExcel.step4")}</li>
                        </ul>
                    }
                    type="info"
                    showIcon
                />

                {/* File Upload */}
                <Dragger {...uploadProps} style={{ padding: "20px" }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
                    </p>
                    <p className="ant-upload-text">
                        {t("employee.importExcel.dragText")}
                    </p>
                    <p className="ant-upload-hint">
                        {t("employee.importExcel.hint")}
                    </p>
                </Dragger>

                {/* Error Display */}
                {error && (
                    <Alert
                        message={t("common.error")}
                        description={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError("")}
                    />
                )}

                {/* Progress Bar */}
                {loading && (
                    <div>
                        <Text>{t("employee.importing")}</Text>
                        <Progress percent={uploadProgress} status="active" />
                    </div>
                )}

                {/* File Info */}
                {fileList.length > 0 && !loading && (
                    <Alert
                        message={t("employee.fileSelected")}
                        description={
                            <Space>
                                <Text strong>{fileList[0].name}</Text>
                                <Text type="secondary">
                                    ({(fileList[0].size / 1024 / 1024).toFixed(2)} MB)
                                </Text>
                            </Space>
                        }
                        type="success"
                        showIcon
                    />
                )}
            </Space>
        </Modal>
    );
};

export default ImportExcelModal;
