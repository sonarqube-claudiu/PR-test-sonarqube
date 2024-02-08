import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
// import { ContextReplacementPlugin } from 'webpack';

// const customStyles = (height, overflow) => {return {
//   control: (provided) => ({
//     ...provided,
//     minHeight: height,
//     height: 'fit-content' // Set your desired height
//     // paddingBottom: '25px'
//   }),

//   valueContainer: (provided) => ({
//     ...provided,
//     height: height, // Set this to the same height as the control
//     // overflow: overflow, // If you want the text to be scrollable
//     // paddingBottom: '25px'
//   }),
//   // ... any other custom styles you want to override
// }};

const MultiSelect = forwardRef(({ options, placeholder, ...rest }, ref) => {
  return (
    <Select
      ref={ref}
      closeMenuOnSelect={false}
      isMulti
      options={options}
      placeholder={placeholder}
      classNamePrefix="react-select"
      // styles={customStyles('50px', 'auto')}
      {...rest}
    />
  );
});

MultiSelect.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string
};

export default MultiSelect;
