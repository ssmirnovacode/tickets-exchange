import { URL_LOGIN } from "./constants";
import { LoginData } from "./types";

export async function logIn(data: LoginData) {
  const response = await fetch(URL_LOGIN, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json().catch((err) => console.log(err));

  return result;
}
