// this file will look inside the DOM of the target page try to see if there is a video content or an ifram that contain video, will return the video plus urls

let result = [];
const checkForVideo = async (page) => {
  const videos = { isVideo: false, count: 0, urls: [] };

  // await page.setRequestInterception(true);
  page.on("request", async (request) => {
    const url = request.url().toLowerCase();
    const resourceType = request.resourceType();

    if (
      resourceType == "media" ||
      url.endsWith(".mp4") ||
      url.endsWith(".avi") ||
      url.endsWith(".flv") ||
      url.endsWith(".mov") ||
      url.endsWith(".wmv")
    ) {
      result.push(url);
    }
  });

  // remove result duplicates
  let noDupliactesResult = [...new Set(result)];

  videos.urls = noDupliactesResult;
  videos.isVideo = noDupliactesResult.length > 0 ? true : false;
  videos.count = noDupliactesResult.length;

  // reset result
  result = [];

  return videos;
};

module.exports = checkForVideo;
