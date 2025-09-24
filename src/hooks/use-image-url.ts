import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useImageUrl(
  storageId: Id<"_storage"> | string | null | undefined
) {
  const result = useQuery(
    api.files.getFileUrl,
    storageId ? { storageId: storageId as Id<"_storage"> } : "skip"
  );

  return result;
}
