import React from "react";
// import i18next from "i18next";

import { authRoles } from "app/auth";
// import en from "./i18n/en";

// import { isMobile } from "react-device-detect";
// i18next.addResourceBundle("en", "login", en);

const userRoleConfig = {
  settings: { layout: "admin" },
  auth: authRoles.onlyGuest,
  routes: [
    {
        path: "/user-role",
        exact: true,
        component: React.lazy(
            () => import("./user_role"),
        ),
    },
    {
        path: "/role",
        exact: true,
        component: React.lazy(
            () => import("./role"),
        ),
    },
  ],

  guestPath: ["/user-role", "/role"],
};

export default userRoleConfig;
