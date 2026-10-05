import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
      headers: await headers(),
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

    // 7. Get ImgBB API key
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      console.error("IMGBB_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    // 8. Create FormData for ImgBB
    const imgbbFormData = new FormData();

    imgbbFormData.append("image", file);
    imgbbFormData.append(
      "name",
      file.name || "artwork"
    );

    // 9. Upload to ImgBB
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    );

    // 10. Parse response
    const data = await response.json();

    // 11. Handle ImgBB error
    if (!response.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            data?.error?.message ||
            "Image upload to ImgBB failed.",
        },
        {
          status: 500,
        }
      );
    }

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