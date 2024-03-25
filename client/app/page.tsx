import axios from "axios";
import Header from "../components/header";
import { cookies } from "next/headers";
import buildClient from "../api/build-client";

const baseURL = //"https://ticketing.com";
  "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";

const LandingPage = async () => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");
  console.log("sessionCookie", sessionCookie);
  const client = buildClient();
  const res = await client
    .get(`/api/users/currentuser`)
    .catch((err) => console.log(err));

  const { currentUser } = res?.data || {};
  return (
    <>
      <Header currentUser={currentUser} />
      {currentUser ? (
        <>
          <h1>You are signed in</h1>
        </>
      ) : (
        <h1>You are NOT signed in</h1>
      )}
    </>
  );
};

export default LandingPage;
