export async function uploadToImgBB(fileOrBlob) {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        throw new Error("ImgBB API key missing");
    }

    const formData = new FormData();
    formData.append("image", fileOrBlob);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    if (data.success) {
        return data.data.url;
    } else {
        throw new Error(data.error?.message || "Failed to upload image to ImgBB");
    }
}
