"use client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logIn } from "@/services/auth";
import { URL_LOGIN } from "@/services/constants";
import { useState } from "react";

export default function Page() {
  // async function login(formData: FormData) {
  //   "use server";

  //   const data = {
  //     email: formData.get("email") as string,
  //     password: formData.get("password") as string,
  //   };

  //   for (const value in Object.values(data)) {
  //     if (!value) throw new Error("All fields are required!");
  //   }

  //   const response = await fetch(URL_LOGIN, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }).catch((err) => console.log(`Error while fetching ${URL_LOGIN}`));
  //   if (!response) return;

  //   const result = await response.json();
  //   console.log(result);
  //   if (result) {
  //     revalidatePath("/");
  //     redirect("/");
  //   } else {
  //     //throw new Error("No response obtained!");
  //     // TODO show error
  //     return;
  //   }
  // }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await logIn({ email, password }).catch((err) =>
      console.log(err)
    );

    console.log(res);

    return res;
  }

  return (
    <main>
      <h2>Log in to your account</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log in!</button>
      </form>
      <div>
        Don&apos;t have an account yet? Don&apos;t worry, you can{" "}
        <Link href="/auth/signup">sign up here</Link>
      </div>
    </main>
  );
}
