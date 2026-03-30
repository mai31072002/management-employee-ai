import React from "react";
import {
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BranchesOutlined,
  ApartmentOutlined,
  SolutionOutlined,
  RiseOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { Menu, Layout, Modal } from "antd";
import history from "@history"; // đúng path của bạn
import "./index.scss";
import jwtService from "app/service/jwt";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "app/i18n/i18n.config";
import { setStoredLanguage } from "app/i18n/languageStorage";
import { setLanguage } from "app/store/actions";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const Sidebar = ({ collapsed, onCollapse }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    // const language = useSelector((state) => state.language?.language);

    const items = [
        getItem(t("sidebar.employeeManagement"), "/home", <TeamOutlined />),
        getItem(t("sidebar.departmentManagement"), "/department", <ApartmentOutlined />),
        getItem(t("sidebar.positionManagement"), "/position", <SolutionOutlined />),
        getItem(t("sidebar.leverManagement"), "/lever", <RiseOutlined />),
        getItem(t("sidebar.ot"), "/ot-date", <FieldTimeOutlined />),
        getItem(t("common.language"), "language", <SettingOutlined />, [
            getItem(t("common.vietnamese"), "lang_vi"),
            getItem(t("common.english"), "lang_en"),
        ]),
        getItem(t("sidebar.settings"), "sub1", <SettingOutlined />, [
            getItem(t("sidebar.infoAccount"), "/account", <UserOutlined />),
            getItem(t("sidebar.authorization"), "/user-role", <BranchesOutlined />),
            getItem(t("sidebar.roleManagement"), "/role", <UsergroupAddOutlined />),
            getItem(t("sidebar.logoutTitle"), "logout", <LogoutOutlined />),
        ]),
        getItem(t("sidebar.files"), "/files", <FileOutlined />),
    ];

    const handleMenuClick = ({ key }) => {
        if (key === "lang_vi" || key === "lang_en") {
            const nextLang = key === "lang_en" ? "en" : "vi";
            setStoredLanguage(nextLang); // Check đang chọn ngôn ngữ nào
            i18n.changeLanguage(nextLang); // Hàm i18n chuyển đổi ngôn ngữ
            dispatch(setLanguage(nextLang)); // Lưu redux
            return;
        }

        if (key === "logout") {
            Modal.confirm({
                title: t("sidebar.logoutTitle"),
                content: t("sidebar.logoutConfirm"),
                okText: t("sidebar.logoutOk"),
                cancelText: t("common.cancel"),
                onOk: () => jwtService.logout(),
            });
            return;
        }

        history.push(key);
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="demo-logo-vertical" />

            <Menu
                theme="dark"
                mode="inline"
                items={items}
                selectedKeys={[history.location.pathname]}
                onClick={handleMenuClick}
            />
        </Sider>
    );
};

export default Sidebar;
