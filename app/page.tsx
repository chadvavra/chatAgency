import { createClient } from "@/utils/supabase/server";
import { oswald, plex } from '../utils/fonts';
import { cookies } from "next/headers";
import Image from 'next/image';
import BackgroundHome from "./background-home.png";
import IdeaForm from "@/components/IdeaForm";
import Link from "next/link";



export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();



  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <header className="w-full relative">
        <Image
          priority
          src={BackgroundHome}
          alt="background image"
          layout="responsive"
          width={1920}
          height={1080}
          className="w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center my-24">
          <h1 className={`{plex.className} text-6xl font-semibold mb-6 text-white`}>Agency For Your Ideas</h1>
          <p className={`{oswald.className} text-2xl mb-6 text-white`}>
            The fastest way to take your ideas from start, to funded.
          </p>
        </div>
      </header>

      <section className="w-full bg-white-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-2">Generate New Idea</h3>
              <p className="text-gray-600 mb-4">Create a fresh business idea using AI.</p>
              <Link href="/idea" className="text-blue-500 hover:text-blue-700">Get Started →</Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-2">Explore Competitors</h3>
              <p className="text-gray-600 mb-4">Analyze your competition in the market.</p>
              <Link href="/competitors" className="text-blue-500 hover:text-blue-700">Explore →</Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-2">Generate Images</h3>
              <p className="text-gray-600 mb-4">Create visuals for your business idea.</p>
              <Link href="/image-generation" className="text-blue-500 hover:text-blue-700">Create Images →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
