import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";

const apiClient = axios.create({
  baseURL: "https://cai-api-dev.neutralx.com/api/v1/documents",
  timeout: 10000,
});

export interface FileData {
  user_id: string;
  file_key: string;
  file_name: string;
  created_at: string;
}

export interface ValidationError {
  detail: { loc: (string | number)[]; msg: string; type: string }[];
}

export const useApiAuthInterceptor = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const requestInterceptor = async (config: any) => {
      const token = await getAccessTokenSilently();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    };

    const interceptor = apiClient.interceptors.request.use(requestInterceptor);

    return () => {
      apiClient.interceptors.request.eject(interceptor);
    };
  }, [getAccessTokenSilently]);
};

// Upload Files
export const uploadFiles = async (files: File[]): Promise<string> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await apiClient.post<string>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Download File
export const downloadFile = async (fileKey: string): Promise<Blob> => {
  const response = await apiClient.get(`/download/${fileKey}`, {
    responseType: "blob",
  });
  return response.data;
};

// List Files
export const listFiles = async (): Promise<FileData[]> => {
  const response = await apiClient.get<FileData[]>("/list");
  return response.data;
};

// Delete File
export const deleteFile = async (fileKey: string): Promise<string> => {
  const response = await apiClient.delete<string>(`/${fileKey}`);
  return response.data;
};
