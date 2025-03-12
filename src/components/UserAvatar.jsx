import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/routes/userService';
import Skeleton from 'react-loading-skeleton';

export default function AvatarComponent() {
  const { data: profile, isLoading } = useCurrentUser();

  return (
    <>
      <Avatar className="h-8 w-8">
        {isLoading ? (
          <AvatarFallback>
            <Skeleton circle width={40} height={40} />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.display_name}`} />
            <AvatarFallback>{profile?.display_name?.slice(0, 2).toUpperCase() || '?'}</AvatarFallback>
          </>
        )}
      </Avatar>
    </>
  );
}
