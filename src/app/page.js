import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth/login');
  //   <div className="h-screen gap-3 mx-auto max-w-[300px] flex items-center justify-center">
  //     <Button asChild>
  //       <Link href="/auth/login">Login</Link>
  //     </Button>
  //     <Button asChild>
  //       <Link href="/auth/signup">Sign Up</Link>
  //     </Button>
  //   </div>
  // );
}
