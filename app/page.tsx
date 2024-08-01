import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import IdeaForm from "@/components/IdeaForm";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen py-6 flex flex-col justify-normal sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">Business Idea Generator</h1>
            <p className="text-center mb-6 text-gray-600">
              Welcome to Chat Agency AI - The Agency Alternative. We're here to help you validate and develop your business ideas quickly and efficiently.
            </p>
            {user ? (
              <IdeaForm user={user} />
            ) : (
              <div className="text-center">
                <p className="mb-4">Please log in to generate ideas.</p>
                <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
