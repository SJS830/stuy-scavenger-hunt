"use client";

import challenges from '@/data/challenges.json';
import { redirect } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";

export default function Challenge({ params }) {
  const [file, setFile] = useState();

  if (file) {
    (async () => {
      try {
        const base64 = await new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        });
    
        const res = await fetch("/api/upload_file", {
          method: "POST",
          body: JSON.stringify({image: base64, challenge: challengeID})
        });
      } catch (e) {
        // Handle errors here
        console.error(e)
      }
  
      redirect("/");  
    })();
  }

  let challengeID = decodeURI(params.slug);
  let challenge = challenges[challengeID];

  // Redirect to home page if challenge is invalid
  if (!challenge) {
    redirect("/");
  }

  const { data: session, status } = useSession();

  if (status == "loading") {
    return <></>;
  }

  if (!session) {
    return (
      <main>
        <div className="w-screen h-screen flex items-center justify-center">
          <button
            className="text-xl bg-slate-300 p-2 rounded-xl"
            onClick={() => {signIn("google")}}
          >
            Sign in with your <p className="underline">Stuyvesant</p> email address.
          </button>
        </div>
      </main>
    );
  }

  if (!session.user.email.endsWith("@stuy.edu")) {
    signOut();
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-center p-24">
      <div>
        <div className="absolute top-2 right-2 text-sm text-right">
          <p>Signed in as {session.user.name}</p>
          <button className="text-blue-400 font-bold" onClick={signOut}>Sign Out</button>
        </div>

        <div className="text-center">
          <p className="text-2xl">{challenge.friendly}</p>
          <p className="text-xl text-gray-700">{challenge.hint}</p>
        </div>

        <div className="flex w-max items-center justify-center">
          <div className="mt-8">
            {/*capture="environment" tells the browser (on mobile) to only allow camera, not uploading images*/}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </div>
        </div>

        <img className="max-w-sm max-h-sm" src={`https://ik.imagekit.io/sshkolnik40/${challengeID}-${session.user.email.replace("@stuy.edu", "")}?${new Date().getTime()}`} />
      </div>
    </main>
  )
}
