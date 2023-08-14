export const Loading = () => {
  return (
    <div className='h-screen w-screen'>
      <div className='h-full w-full flex justify-center items-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'>
          <span className='animate-pulse'></span>
        </div>
      </div>
    </div>
  );
};
