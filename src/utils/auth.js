export async function getAccessToken() {
  const refreshtoken = localStorage.getItem("refreshToken");
  console.log(refreshtoken);

  const response = await fetch("https://library-1dmu.onrender.com/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshtoken: refreshtoken }),
  });

  console.log("Response statusi:", response.status);
  console.log("Response OK mi:", response.ok);
  console.log("Response url:", response.url);

  const text = await response.text();
  console.log(text);
}
