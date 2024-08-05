import { oswald, plex } from '../../utils/fonts';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className={`{plex.className} text-4xl font-bold text-gray-900 mb-8 text-center`}>
        Chat Agency AI
        </h1>
        
        <div className={`{oswald.className} text-lg text-gray-700 space-y-6`}>
          <p>
            I believe that every idea is worth exploring. My mission is to empower individuals, especially creatives who may lack formal training, with the tools and resources to turn their ideas into viable products.
          </p>
          
          <p>
            I understand that many brilliant ideas never see the light of day due to constraints of time, money, or experience. That's why I've created a platform that bridges these gaps, making idea exploration and product development accessible to everyone.
          </p>
          
          <p>
            My vision is to democratize the process of innovation. Chat Agency provides a suite of AI-powered tools that guide you through the journey - from initial idea to creating compelling value propositions and generating eye-catching visuals.
          </p>
          
          <p>
            Join me in my goal to make every idea count. I believe that with the right support, your idea could be the next big thing that changes the world.
          </p>
          <p>-Chad Vavra</p>
        </div>
      </div>
    </div>
  );
}
