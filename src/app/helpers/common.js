import React, { useMemo } from "react";
import { message, Tag } from "antd";

export const notificationPopup = (status, text) => {
    if (status === 200) {
        message.success(`${status} - ${text}`).then();
    } else {
        message.error(`${status} - ${text}`).then();
    }
};

// searchHelper.js
const pendingRequests = new Map();

/**
 * Lấy signal để hủy request cũ và tạo request mới
 * @param {string} searchKey - Khóa định danh cho loại tìm kiếm (vd: 'EMPLOYEE_SEARCH')
 * @returns {AbortSignal}
 */
export const getSearchSignal = (searchKey) => {
    // 1. Nếu đang có một yêu cầu tìm kiếm cùng loại, hãy hủy nó ngay
    if (pendingRequests.has(searchKey)) {
        pendingRequests.get(searchKey).abort();
    }

    // 2. Tạo một Controller mới cho yêu cầu này
    const controller = new AbortController();
    pendingRequests.set(searchKey, controller);

    return controller.signal;
};
