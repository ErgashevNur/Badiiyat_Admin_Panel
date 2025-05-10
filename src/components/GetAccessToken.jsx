import { getAccessToken } from "./utils/auth";

async function handleProtectedRequest() {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = await getAccessToken(refreshToken);

  if (accessToken) {
    const response = await fetch(
      "https://library-1dmu.onrender.com/protected",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);
  } else {
    console.log("Token yo'q yoki muddati o'tgan.");
  }
}
