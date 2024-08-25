import axios, { AxiosError } from 'axios';
import { getAccessToken } from '@/services/authService';
import {api, handleApiError} from "@/services/api";

interface FetchFileDetailsParams {
  id: string;
  page: number;
  pageSize: number;
  filters: object;
}

export interface FileData {
  headers: string[];
  data: Array<Record<string, any>>;
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
}

export interface FileItem {
  id: string;
  file_name: string;
  url: string;
}

export const fetchFileDetailsApi = async ({
  id,
  page,
  pageSize,
  filters,
}: FetchFileDetailsParams): Promise<FileData> => {
  const filtersParam = JSON.stringify(filters);
  const queryParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    filters: filtersParam,
  }).toString();

  try {
    const response = await api.get<FileData>(
      `files/${id}/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchFiles = async (): Promise<FileItem[]> => {
  const authToken = getAccessToken();

  const response = await axios.get<FileItem[]>('http://localhost:8000/api/files/', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
};

export const uploadFile = async (file: File): Promise<FileItem> => {
  const authToken = getAccessToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_name', file.name);
  formData.append('file_type', file.name.endsWith('.csv') ? 'csv' : 'parquet');

  const response = await axios.post<FileItem>('http://localhost:8000/api/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${authToken}`,
    },
  });

  return response.data;
};