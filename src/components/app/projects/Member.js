import React from 'react';

const Member = ({ name }) => {
  return (
    <div className="bg-white dark__bg-1100 p-3 h-100">
      <h6 className="mb-1 text-primary">{name}</h6>
    </div>
  );
};

export default Member;
