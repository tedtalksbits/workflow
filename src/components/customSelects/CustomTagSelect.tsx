import { Cross1Icon } from '@radix-ui/react-icons';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useRef } from 'react';
import { Label } from '../ui/label';

export interface CustomTagSelectProps {
  tags: string;
  setTags: React.Dispatch<React.SetStateAction<string>>;
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
  setTags,
  commonTags = commonTagsArr,
}: CustomTagSelectProps) => {
  const tagInput = useRef<HTMLInputElement>(null);
  // if (!tags) setTags('');
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };
  const handleClickToAddTag = (tag: string) => {
    if (tags === '') {
      setTags(tag);
    } else {
      setTags(tags + `, ${tag}`);
    }
    tagInput.current?.focus();
  };
  const handleRemoveTag = (tag: string) => {
    const tagsArray = tags.split(', ');
    const newTagsArray = tagsArray.filter((t) => t !== tag);
    setTags(newTagsArray.join(', '));
  };
  return (
    <>
      <Label htmlFor='newTaskTags'>Tags</Label>
      <div className='flex flex-wrap gap-2'>
        {commonTags.map((badge) => (
          <div key={badge} className='relative'>
            <Badge
              className='cursor-pointer'
              onClick={() => handleClickToAddTag(badge)}
              variant='secondary'
            >
              {badge}
            </Badge>
            {tags?.includes(badge) && (
              <span
                onClick={() => handleRemoveTag(badge)}
                className='p-1 absolute top-[-10px] right-[-10px]  bg-red-500 rounded-full cursor-pointer z-10'
              >
                <Cross1Icon className='w-2 h-2' />
              </span>
            )}
          </div>
        ))}
      </div>
      <Input
        id='newTaskTags'
        type='text'
        name='tags'
        placeholder='tags'
        value={tags}
        onChange={handleTagsChange}
        ref={tagInput}
      />
    </>
  );
};
