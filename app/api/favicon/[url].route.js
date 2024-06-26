import axios from "axios";

export async function GET(request, response) {
  const { url } = request.url.params;

  console.log(url, "urlllllllllllllllll");

  if (!url) {
    return response.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(
      `https://www.google.com/s2/favicons?sz=64&domain=${url}`,
      {
        responseType: "arraybuffer",
      }
    );

    response.setHeader("Content-Type", "image/png");
    response.setHeader("Cache-Control", "s-maxage=86400");
    response.status(200).send(response.data);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch favicon" });
  }
}
