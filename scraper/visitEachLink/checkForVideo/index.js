// this file will look inside the DOM of the target page try to see if there is a video content or an ifram that contain video, will return the video plus urls

let result = [];
const checkForVideo = async (page) => {
  const videos = { isVideo: false, count: 0, urls: [] };

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

  videos.urls.push(...noDupliactesResult);
  videos.isVideo = noDupliactesResult.length > 0 ? true : false;
  videos.count = noDupliactesResult.length;

  // check for video in normal DOM
  const checkForVideoInDom = async () => {
    let videoTag;
    try {
      videoTag = await page.evaluate(() => {
        let res;
        res = document.querySelector("video");

        if (res) {
          return {
            videoUrl: res.getAttribute("src") ? res.getAttribute("src") : "",
            videoThere: true,
          };
        } else {
          return {
            videoUrl: "",
            videoThere: false,
          };
        }
      });
    } catch (error) {
      console.log(error);
    }

    videoTag.videoThere ? videos.urls.push(videoTag.videoUrl) : false;
    videoTag.videoThere
      ? (videos.isVideo = true)
      : (videos.isVideo = videos.isVideo);
    videoTag.videoThere
      ? (videos.count = Number(videos.count) + 1)
      : (videos.count = videos.count);
  };

  await checkForVideoInDom();

  // check for videos in iframe DOM
  try {
    // check for video tag in iframe
    await page.waitForSelector("iframe", { timeout: 2000 });

    console.log("iframe found");

    const elementHandle = await page.$$("iframe");

    for (let i = 0; i < elementHandle.length; i++) {
      const frame = await elementHandle[i].contentFrame();
      const iframeBody = await frame.waitForSelector("html", { timeout: 500 });
      await iframeBody.evaluate((b) => b.click());
      await page.waitForTimeout(500);

      console.log("clicked");

      const checkForVideoInIframe = async (iframeBody) => {
        try {
          const videoIframe = await iframeBody.waitForSelector("video", {
            timeout: 2000,
          });
        } catch (error) {
          console.log(error, "no video");
        }

        let videoTag;
        try {
          videoTag = await iframeBody.evaluate((iframeBody) => {
            let res;
            res = iframeBody.querySelector("video");

            if (res) {
              return {
                videoUrl: res.getAttribute("src")
                  ? res.getAttribute("src")
                  : "",
                videoThere: true,
              };
            } else {
              return {
                videoUrl: "",
                videoThere: false,
              };
            }
          }, iframeBody);
        } catch (error) {
          console.log(error);
        }

        videoTag.videoThere ? videos.urls.push(videoTag.videoUrl) : false;
        videoTag.videoThere
          ? (videos.isVideo = true)
          : (videos.isVideo = videos.isVideo);
        videoTag.videoThere
          ? (videos.count = Number(videos.count) + 1)
          : (videos.count = videos.count);
      };
      await checkForVideoInIframe(iframeBody);

      console.log("getted");
    }
  } catch (error) {
    console.log(error);
    console.log("iframe not found");
  }

  // reset result
  result = [];

  return videos;
};

module.exports = checkForVideo;
