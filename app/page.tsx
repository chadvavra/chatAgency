import { createClient } from "@/utils/supabase/server";
import { oswald, plex } from '../utils/fonts';
import { cookies } from "next/headers";
import Image from 'next/image';
import BackgroundHome from "./background-home.png";
import ideaImg from "./images/home/idea.png";
import valuesImg from "./images/home/values.png";
import productImg from "./images/home/product.png";
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
        <div className="absolute inset-0 flex flex-col items-center my-10 px-4 sm:px-6 lg:px-8">
          <h1 className={`{plex.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6 text-white text-center`}>Agency For Your Ideas</h1>
          <p className={`{oswald.className} text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 text-white text-center max-w-3xl`}>
            The fastest way to take your ideas from start, to funded.
          </p>
        </div>
      </header>

      <section className="w-full bg-white-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 ">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-2">Idea Validation</h3>
              <p className="text-gray-600 mb-4">Use AI to create a detailed idea.</p>
              <Image src={ideaImg}
                alt="idea screen capture image" />
              {/* <Link href="/idea" className="text-blue-500 hover:text-blue-700">Get Started →</Link> */}
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-2">Value Propostions</h3>
              <p className="text-gray-600 mb-4">Find out what makes your idea great!</p>
              <Image src={valuesImg}
          alt="values screen capture image" />
              {/* <Link href="/competitors" className="text-blue-500 hover:text-blue-700">Explore →</Link> */}
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-2">Generate Visuals</h3>
              <p className="text-gray-600 mb-4">Create colors, moodboards, and product shots.</p>
              <Image src={productImg}
          alt="product example image" />
              {/* <Link href="/image-generation" className="text-blue-500 hover:text-blue-700">Create Images →</Link> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
