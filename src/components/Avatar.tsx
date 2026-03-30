interface AvatarProps {
  emoji: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-lg', lg: 'w-14 h-14 text-2xl' };

export function Avatar({ emoji, color, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/30`}
    >
      {emoji}
    </div>
  );
}
