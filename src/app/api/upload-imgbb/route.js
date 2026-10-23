import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageToImgBB } from "@/lib/api/server";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to upload images.",
        },
        {
          status: 401,
        }
      );
    }

    if (!["artist", "admin"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Only artists can upload artwork images." },
        { status: 403 },
      );
    }

    // 2. Get FormData
    const formData = await request.formData();

    // 3. Get uploaded file
    const file = formData.get("image");

    // 4. Validate file exists
    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          error: "No image file provided.",
        },
        {
          status: 400,
        }
      );
    }

    // 5. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG, PNG and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // 6. Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Image must be smaller than 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    // 7. Upload to ImgBB
    const data = await uploadImageToImgBB(file);

    // 12. Return required data
    return NextResponse.json({
      success: true,
      url: data.data.url,
      displayUrl: data.data.display_url,
      deleteUrl: data.data.delete_url,
      width: data.data.width,
      height: data.data.height,
      size: file.size,
      mimeType: file.type,
      fileName: file.name,
    });
  } catch (error) {
    console.error("ImgBB upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}