import { createClient } from "@/utils/supabase/server";
import { oswald, plex } from '../utils/fonts';
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
    <div className="min-h-screen flex flex-col items-center relative w-full">
      <Image
        priority
        src={BackgroundHome}
        alt="background image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="w-full"
      />

      <div className="z-10 text-white text-center mt-16 justify-center">
        <h1 className="{plex.className} text-6xl font-semibold mb-6">Agency For Your Ideas </h1>
        <p className="{oswald.className} text-2xl mb-6  ">
          The fastest way to take your ideas from start, to funded.
        </p>
      </div>


     
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>

    </div>
    



  );
}
