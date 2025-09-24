import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useUserFiles() {
  return useQuery(api.files.getUserFiles);
}

export function useUserFilesByCategory(category: string) {
  return useQuery(api.files.getUserFilesByCategory, { category });
}

export function useFileByStorageId(storageId: string | undefined) {
  return useQuery(
    api.files.getFileByStorageId,
    storageId ? { storageId: storageId as any } : "skip"
  );
}

