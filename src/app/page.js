import { AccordionDemo } from '@/components/Accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen gap-3 mx-auto max-w-[300px] flex items-center justify-center">
      <Button asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
