import Image from 'next/image';
import React from 'react';

const TableSearch = () => {
  return (
    <div className="w-full md:w-auto flex text-xs items-center gap-2 rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src={'/search.png'} alt="" width={14} height={14} />
      <input
        type="text"
        placeholder="Search ..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
