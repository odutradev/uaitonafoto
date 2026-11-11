import api from "@utils/api";

import type { GetLogsParams, PaginatedLogsResponse } from "@utils/types/logs";

export const getLogs = async (params?: GetLogsParams): Promise<PaginatedLogsResponse> => {
  const response = await api.get<PaginatedLogsResponse>("/logs/list", { params });
  return response.data;
};
