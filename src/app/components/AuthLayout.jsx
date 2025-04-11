import Link from 'next/link';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
        <div className="text-2xl font-bold">MyApp</div>
        <div className="text-lg font-medium">Logo</div>
      </nav>

      {/* Main content */}
      <div className="flex flex-1">
        
        {/* Right Auth Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        
        {/* Left Image Section */}
        <div className="hidden md:block w-1/2">
          <img
            src="/auth-image.jpg"
            alt="Authentication Visual"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
