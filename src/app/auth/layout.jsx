import Link from 'next/link';

export default function AuthLayout({ children }) {

  return (
    <div className="flex min-h-screen bg-[#111111]">
      {/* Left side content */}
      <div className="hidden lg:flex lg:w-1/2 text-white p-12 flex-col">
        <Link href="/" className='font-semibold text-3xl mb-[40px]'>
          {/* <Image src="/logo.svg" alt="Logo" width={150} height={50} className="mb-8" /> */}
          <span>Exylook</span>
        </Link>

        <div className="">
          <h1 className="text-4xl font-bold mb-4">Welcome to Exylook</h1>
          <p className="text-xl mb-8">Connect with friends, share moments, and explore a world of social interactions.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full flex items-center justify-center mx-auto max-w-md p-8 space-y-4">{children}</div>
    </div>
  );
}
