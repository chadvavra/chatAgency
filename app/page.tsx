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
    <div className="min-h-screen py-6 flex flex-col justify-normal sm:py-12">
      <div className="">
      <div className="text-2xl font-semibold mb-6 text-center position: absolute top-48 left-1/2">Chat Agency</div>
        <div className="text-center mb-6 position: absolute top-1/2 left-1/2">
          The #1 suite of AI powered tools to take your ideas from start, to funded.
        </div>
      <Image
        priority
        src={BackgroundHome}
        alt="cool looking waves"
        fill={false}
      />
      
      </div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="max-w-md mx-auto">

          {/* {user ? (
              <IdeaForm user={user} />
            ) : (
              <div className="text-center">
                <p className="mb-4">Please log in to generate ideas.</p>
                <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Log In
                </Link>
              </div>
            )} */}
        </div>
      </div>
    </div>
  );
}
