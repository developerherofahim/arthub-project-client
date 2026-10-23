import "server-only";

export async function uploadImageToImgBB(file) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is missing.");
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", file.name || "artwork");

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message || "Image upload to ImgBB failed.");
  }

  return data;
}
