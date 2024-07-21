"use client";
export default function LogoutButton() {
  function logout() {
    console.log("logout");
    // remove session cookie
  }

  return (
    <button className="link" onClick={logout}>
      Logout
    </button>
  );
}
