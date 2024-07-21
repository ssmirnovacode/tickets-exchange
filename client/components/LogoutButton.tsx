"use client";
export default function LogoutButton() {
  function logout() {
    console.log("logout");
    // remove session cookie
  }

  return <button onClick={logout}>Logout</button>;
}
