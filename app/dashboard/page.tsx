import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // TODO: Fetch actual ideas and outputs from the database
  const mockIdeas = [
    { id: 1, title: "Idea 1", output: "Generated output 1" },
    { id: 2, title: "Idea 2", output: "Generated output 2" },
    { id: 3, title: "Idea 3", output: "Generated output 3" },
    // Add more mock data as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Ideas Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockIdeas.map((idea) => (
          <div key={idea.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{idea.title}</h2>
            <p className="text-gray-600">{idea.output}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
