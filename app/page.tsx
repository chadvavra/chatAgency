import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from 'next/image';
import BackgroundHome from "./background-home.png";
import Waves from "./waves.svg";
import IdeaForm from "@/components/IdeaForm";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative w-full">
      <Image
        priority
        src={BackgroundHome}
        alt="background image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="w-full"
      />
      <div className="z-10 text-white text-center">
        <h1 className="text-6xl font-semibold mb-6">Chat Agency</h1>
        <p className="text-xl mb-6 w-96">
          The most affordable way to take your ideas from start, to funded.
        </p>
      </div>
    </div>
  );
}
