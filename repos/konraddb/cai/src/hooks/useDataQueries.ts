import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  uploadFiles,
  downloadFile,
  listFiles,
  deleteFile,
  FileData,
} from "@/api/data";
import { useAuth0 } from "@auth0/auth0-react";

// Query for listing files
export const useListFiles = () => {
  const { isAuthenticated } = useAuth0();

  return useQuery<FileData[], Error>({
    queryKey: ["files"],
    queryFn: listFiles,
    enabled: isAuthenticated,
  });
};

// Mutation for uploading files
export const useUploadFiles = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, File[]>({
    mutationFn: uploadFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] }); // Refresh file list after upload
    },
  });
};

// Query for downloading a file
export const useDownloadFile = (fileKey: string | null) => {
  return useQuery<Blob, Error>({
    queryKey: ["file", fileKey],
    queryFn: () => downloadFile(fileKey!),
    enabled: !!fileKey, // Run only if fileKey is provided
  });
};

// Mutation for deleting a file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] }); // Refresh file list after deletion
    },
  });
};
