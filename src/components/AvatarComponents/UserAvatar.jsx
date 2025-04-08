import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/routes/userService';
import defaultAvatar from '../../assets/avatars/default_profile_400x400.png';
import Skeleton from 'react-loading-skeleton';

export default function UserAvatar({ src, alt, name, size = 'md', status }) {
  const { isLoading } = useCurrentUser();

  const getSize = () => {
    switch (size) {
      case 'xs':
        return 'w-8 h-8 text-xs';
      case 'sm':
        return 'w-16 h-16 text-sm';
      case 'lg':
        return 'w-10 h-10 text-xl';
      default:
        return 'w-12 h-12 text-md';
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${getSize()} rounded-full`}>
        {isLoading ? (
          <AvatarFallback>
            <Skeleton circle />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={src || defaultAvatar.src} alt={alt || name || 'User Avatar'} />
            <AvatarFallback>{name ? name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
          </>
        )}
      </Avatar>
      {status && <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />}
    </div>
  );
}
