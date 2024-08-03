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
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <Image
        priority
        src={BackgroundHome}
        alt="cool looking waves"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="z-10 text-white text-center">
        <h1 className="text-4xl font-semibold mb-6">Chat Agency</h1>
        <p className="text-xl mb-6">
          The #1 suite of AI powered tools to take your ideas from start, to funded.
        </p>
      </div>
    </div>
  );
}
