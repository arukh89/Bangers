exports.handler = async (event) => {
  // whatever your repo needs: call yt-dlp, read DB, etc.
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "vNext",
      image: "https://YOUR.netlify.app/just-dropped.png",
      buttons: [{ label: "🔊 Get MP3", action: "post" }],
      post_url: "https://YOUR.netlify.app/api"
    })
  };
};
