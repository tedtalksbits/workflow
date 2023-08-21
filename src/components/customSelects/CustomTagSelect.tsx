import { Cross1Icon } from '@radix-ui/react-icons';
import { Badge } from '../ui/badge';

export interface CustomTagSelectProps {
  tags: string;
  onTagClick: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  commonTags?: string[];
}
const commonTagsArr = [
  'bug',
  'feature',
  'enhancement',
  'documentation',
  'help wanted',
  'good first issue',
];
export const CustomTagSelect = ({
  tags,
  onTagClick,
  commonTags = commonTagsArr,
  onTagRemove,
}: CustomTagSelectProps) => {
  return (
    <>
      {commonTags.map((badge) => (
        <div key={badge} className='relative'>
          <Badge
            className='cursor-pointer'
            onClick={() => onTagClick(badge)}
            variant='secondary'
          >
            {badge}
          </Badge>
          {tags.includes(badge) && (
            <span
              onClick={() => onTagRemove(badge)}
              className='p-1 absolute top-[-10px] right-[-10px]  bg-red-500 rounded-full cursor-pointer z-10'
            >
              <Cross1Icon className='w-2 h-2' />
            </span>
          )}
        </div>
      ))}
    </>
  );
};
