import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-8">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
        <Link href="/about" className="text-gray-500 hover:text-gray-900">
            About
          </Link>
          <Link href="/terms" className="text-gray-500 hover:text-gray-900">
            Terms
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-gray-900">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
