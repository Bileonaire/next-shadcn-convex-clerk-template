import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useImageUrls(
  storageIds: (Id<"_storage"> | string | null | undefined)[]
) {
  // Filter out null/undefined values and convert to proper types
  const validStorageIds = storageIds.filter(
    (id): id is Id<"_storage"> =>
      id !== null && id !== undefined && typeof id === "string"
  ) as Id<"_storage">[];

  const result = useQuery(
    api.images.getImageUrls,
    validStorageIds.length > 0 ? { storageIds: validStorageIds } : "skip"
  );

  return result;
}
