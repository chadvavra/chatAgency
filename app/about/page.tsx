import { oswald, plex } from '../../utils/fonts';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className={`${plex.className} text-4xl font-bold text-gray-900 mb-8 text-center`}>
          About Agency For Your Ideas
        </h1>
        
        <div className={`${oswald.className} text-lg text-gray-700 space-y-6`}>
          <p>
            At Agency For Your Ideas, we believe that every idea is worth exploring. Our mission is to empower individuals, especially creatives who may lack formal business training, with the tools and resources to turn their ideas into viable products.
          </p>
          
          <p>
            We understand that many brilliant ideas never see the light of day due to constraints of time, money, or experience. That's why we've created a platform that bridges these gaps, making idea exploration and product development accessible to everyone.
          </p>
          
          <p>
            Our vision is to democratize the process of innovation. We provide a suite of AI-powered tools that guide you through every step of the journey - from initial idea validation to creating compelling value propositions and generating eye-catching visuals.
          </p>
          
          <p>
            Whether you're a seasoned entrepreneur or someone with a spark of an idea, Agency For Your Ideas is here to support you. We're committed to fostering creativity, driving innovation, and helping turn your ideas into reality.
          </p>
          
          <p>
            Join us in our mission to make every idea count. Because we believe that with the right support, your idea could be the next big thing that changes the world.
          </p>
        </div>
      </div>
    </div>
  );
}
