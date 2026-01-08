import axios from "axios";

export interface LinkItem {
  id: number;
  originalUrl: string;
  shortCode: string;
  views: number;
  createdAt: string;
}

export interface CreateLinkResponse {
  shortCode: string;
  originalUrl: string;
}

export interface ExportCsvResponse {
  downloadUrl: string;
}

export interface ListLinksParams {
  page?: number;
  limit?: number;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export async function createLink(originalUrl: string) {
  const response = await api.post<CreateLinkResponse>("/links", {
    originalUrl,
  });
  return response.data;
}

export async function listLinks(params?: ListLinksParams) {
  const response = await api.get<LinkItem[]>("/links", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  return response.data;
}

export async function deleteLink(shortCode: string) {
  await api.delete(`/links/${shortCode}`);
}

export async function exportCsv() {
  const response = await api.post<ExportCsvResponse>("/export/csv");
  return response.data;
}

export function getShortLinkUrl(shortCode: string): string {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL?.replace(/\/$/, "");
  return `${baseUrl}/${shortCode}`;
}
