import { apiCall } from "@/_shared/utils/api-call";
import type { DashboardCount } from "@/_shared/types/dashboard-types";

const BASE_URL = `/groups`;
const DASHBOARD_URL = `dashboard`;

export const dashboardApi = {
  getLists: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall<DashboardCount>(
      `${BASE_URL}/${groupId}/${DASHBOARD_URL}/lists`,
      "GET",
    );

    return response;
  },

  getCalendar: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall<DashboardCount>(
      `${BASE_URL}/${groupId}/${DASHBOARD_URL}/calendar`,
      "GET",
    );

    return response;
  },

  getAlbums: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall<DashboardCount>(
      `${BASE_URL}/${groupId}/${DASHBOARD_URL}/albums`,
      "GET",
    );

    return response;
  },

  getMessages: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall<DashboardCount>(
      `${BASE_URL}/${groupId}/${DASHBOARD_URL}/messages`,
      "GET",
    );

    return response;
  },
};
