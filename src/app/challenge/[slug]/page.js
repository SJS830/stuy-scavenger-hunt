"use client";

import challenges from '@/data/challenges.json';
import { redirect } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Challenge({ params }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <main>
        <div className="w-screen h-screen flex items-center justify-center">
          <button
            className="text-xl bg-slate-300 p-2 rounded-xl"
            onClick={() => {signIn("google")}}
          >
            Sign in with your Stuyvesant email address.
          </button>
        </div>
      </main>
    );
  }

  if (!session.user.email.endsWith("@stuy.edu")) {
    signOut();
  }

  console.log(session);

  let challenge = challenges[decodeURI(params.slug)];

  // Redirect to home page if challenge is invalid
  if (!challenge) {
    redirect("/");
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-24">
      <p className="text-[25px]">{}</p>
    </main>
  )
}
