import { createUploadthing, type FileRouter } from "uploadthing/next";
import { generateReactHelpers } from "@uploadthing/react";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  /**
   * Menu image uploader — used on the admin/supervisor Menu page.
   * Only authenticated users can upload. Max 4MB per image.
   */
  menuImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Upload complete for userId:", metadata.userId);
      console.log("[UploadThing] File URL:", file.ufsUrl ?? file.url);
      return { uploadedBy: metadata.userId, url: file.ufsUrl ?? file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// React helpers — used by <UploadButton> and <UploadDropzone> in client components
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
