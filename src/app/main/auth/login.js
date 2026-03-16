import React, {useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Card, Checkbox, Typography, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import * as Actions from 'app/auth/store/actions';
import withReducer from "../../store/with_reducer";
import reducer from "../../auth/store/reducers/auth.reducer";
import ForgotPasswordModal from "./forgotPassword";
import './index.scss';
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const Login = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [openForgot, setOpenForgot] = useState(false);
    const { login } = useSelector(state => state.login);

    const openNotificationWithIcon = useCallback((type) => {
        switch (type) {
            case "success":
                return notification[type]({
                    title: t("auth.loginSuccessTitle"),
                });
            case "error":
                return notification[type]({
                    title: t("auth.loginErrorTitle"),
                    description: t("auth.loginErrorDesc"),
                });
            default:
                return type;
        }
    }, [t]);

    useEffect(() => {
        if (login?.status == null) {
            return;
        }

        if (login?.status === 200 && login?.data) {
            openNotificationWithIcon("success");
            axios.defaults.headers.common.Authorization = `Bearer ${login?.data?.accessToken}`;
            history.push("/home");
        } else {
            openNotificationWithIcon("error");
        }
    }, [login, history, openNotificationWithIcon]);

    const onFinish = (values) => {
        delete axios.defaults.headers.common.Authorization;
        dispatch(Actions.submitLogin(values));
    };

    return (
        <div className="login-page">
            <Card className="login-card">
                <Title level={3} className="login-title">
                    {t("auth.systemTitle")}
                </Title>

                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label={t("auth.username")}
                        rules={[
                            { required: true, message: t("auth.validation.usernameRequired") },
                            { max: 128, message: t("auth.validation.max128") }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder={t("auth.username")} 
                            value={username}
                            onChange={e => setUsername(e)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={t("auth.password")}
                        rules={[
                            { required: true, message: t("auth.validation.passwordRequired") },
                            { max: 128, message: t("auth.validation.max128")}
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder={t("auth.password")}
                            value={password}
                            onChange={e => setPassword(e)} 
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>{t("auth.rememberMe")}</Checkbox>
                        </Form.Item>

                        <Button type="link" onClick={() => setOpenForgot(true)}>
                            {t("auth.forgotPassword")}
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="login-submit"
                        >
                            {t("auth.login")}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <ForgotPasswordModal
                open={openForgot}
                onCancel={() => setOpenForgot(false)}
            />
        </div>
    );
};

export default withReducer("login", reducer)(Login);
