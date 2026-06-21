import { apiCall } from "@/utils/apiCall";

const BASE_URL = `/groups`;
const DASHBOARD_URL = `dashboard`;

type DashboardCount = {
  count: number;
};

export const dashboardApi = {
  getLists: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/${DASHBOARD_URL}/lists`, "GET");

    return response.data;
  },

  getCalendar: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/${DASHBOARD_URL}/calendar`, "GET");

    return response.data;
  },

  getAlbums: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/${DASHBOARD_URL}/albums`, "GET");

    return response.data;
  },

  getMessages: async (groupId: string): Promise<DashboardCount> => {
    const response = await apiCall(`${BASE_URL}/${groupId}/${DASHBOARD_URL}/messages`, "GET");

    return response.data;
  },
};
