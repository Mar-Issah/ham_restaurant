import React from 'react';

//component for the loading spinner
const Spinner = () => {
  return (
    <div className='px-4 py-2'>
      <div className='w-4 h-4 border-t-4 border-white border-solid rounded-full animate-spin'></div>
    </div>
  );
};

export default Spinner;
