import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import routes from "app/configs/routes.config"; // truyền vào mảng routes

// css scroll đẹp trên mọi browser
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./layout_home.scss";
import "./index.scss";
import { ConfigProvider, Layout, Col, Row } from "antd";
import { Route, Switch } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import enUS from "antd/locale/en_US";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";

// import HeaderHome from "../../components/Header/header_home";
// import headerLoginBg from "assets/icon/layoutHeader/header_login.png";

const { Content } = Layout;

const LayoutHome = () => {
  const language = useSelector((state) => state.language?.language);
  const { t } = useTranslation();

  const antdLocale = useMemo(() => {
    return language === "en" ? enUS : viVN;
  }, [language]);

  const loading = (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {t("common.loading")}
    </div>
  );
  useEffect(() => {
    document.body.classList.add("body-home-page");
  }, []);

  useEffect(() => {
    dayjs.locale(language === "en" ? "en" : "vi");
  }, [language]);

  return (
    <div id={"layouthome-id"}>
      <ConfigProvider locale={antdLocale}>
        <Row
          className="main-header-layout-home"
        //   style={{ backgroundImage: `url(${headerLoginBg})` }}
        >
          <Col span={24}>
            {/* <HeaderHome /> */}
          </Col>
        </Row>
        <Layout
            className={"main-layout-home"}
            style={{
                clear: "both",
            }}
        >
          <Layout className="site-layout-home">
            <Content
                className={isMobile ? "main-content-home" : "main-content-home"}
                style={{
                    background: "url('background-register.png') !important",
                }}
            >
              <React.Suspense fallback={loading}>
                    <Switch>
                        {routes.map((route, idx) =>
                            route.component ? (
                            <Route
                                key={String(idx)}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                render={(renderProps) => (
                                    <route.component {...renderProps} />
                                )}
                            />
                            ) : null
                        )}
                    </Switch>
              </React.Suspense>
            </Content>
            {/*<FooterHome />*/}
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  );
};

LayoutHome.propTypes = {
  children: PropTypes.element,
};

export default LayoutHome;
