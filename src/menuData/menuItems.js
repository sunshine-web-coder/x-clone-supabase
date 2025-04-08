import { Repeat, Share, Link2, Mail, PencilLine } from 'lucide-react';

// Share menu items with both buttons and links
export const shareMenuItems = [
  { icon: Link2, label: 'Copy link' },
  { icon: Share, label: 'Share post via ...' },
  {
    icon: Mail,
    label: 'Send via Direct Message',
    href: '/messages/compose?tweet=123456789'
  }
];

// Retweet menu items with both buttons and links
export const repostMenuItems = [
  { icon: Repeat, label: 'Repost', action: 'repost' },
  { icon: PencilLine, label: 'Quote', action: 'quote' }
];

// Dynamic version that can be used to show different text based on state
export const getRepostMenuItems = (isReposted) => [
  { icon: Repeat, label: isReposted ? 'Undo repost' : 'Repost', action: 'repost' },
  { icon: PencilLine, label: 'Quote', action: 'quote' }
];