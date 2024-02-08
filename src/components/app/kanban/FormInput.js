import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MultiSelect from 'components/common/MultiSelect';
import React, { useRef } from 'react';
import { ToggleButton, ToggleButtonGroup, Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { FormattedMessage, useIntl } from 'react-intl';

const FormInput = ({
  type,
  value,
  defaultValue,
  setValue,
  hours,
  minutes,
  setHours,
  setMinutes,
  label,
  hint,
  errMsg,
  className,
  options,
  optionclassname,
  optionStyles,
  optionDisabled,
  inputDisabled,
  placeholder,
  rows,
  isInvalid,
  inputRef,
  icon,
  needsTranslation,
  selected
}) => {
  const formInputRef = useRef(inputRef);
  const intl = useIntl();

  let inputToRender;

  switch (type) {
    case 'select':
      inputToRender = (
        <Form.Select
          id={`${value}`}
          className={className}
          value={value}
          onChange={setValue}
          isInvalid={isInvalid}
          ref={formInputRef}
          defaultValue={defaultValue}
          disabled={inputDisabled}
        >
          {options.map((option, index) => (
            <option
              key={index}
              value={option}
              className={optionclassname}
              // disabled={disabledoptionsarray?.includes(option.toString())}
            >
              {needsTranslation ? (
                <FormattedMessage key={option} id={option} />
              ) : (
                option
              )}
            </option>
          ))}
        </Form.Select>
      );
      break;
    case 'multiselect':
      inputToRender = (
        <MultiSelect
            options={options} //in this case, the options array must be an array of objects with a value and label property
            placeholder={placeholder}
            value={value}
            onChange={setValue}
            ref={formInputRef}
          />
      );
      break;
    case 'textarea':
      inputToRender = (
        <Form.Control
          id={`${value}`}
          className={className}
          value={value}
          onChange={setValue}
          as="textarea"
          placeholder={placeholder}
          rows={rows}
          isInvalid={isInvalid}
          ref={formInputRef}
          disabled={inputDisabled}
        ></Form.Control>
      );
      break;
    case 'text':
      inputToRender = (
        <Form.Control
          id={`${value}`}
          className={className}
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          rows={rows}
          isInvalid={isInvalid}
          ref={formInputRef}
          disabled={inputDisabled}
        ></Form.Control>
      );
      break;
    case 'number':
      inputToRender = (
        <Form.Control
          id={`${value}`}
          type="number"
          className={className}
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          rows={rows}
          isInvalid={isInvalid}
          ref={formInputRef}
          disabled={inputDisabled}
        ></Form.Control>
      );
      break;
    case 'radiobtngroup':
      inputToRender = (
        <ToggleButtonGroup
          type="radio"
          name="options"
          className={className}
          value={value}
          onChange={setValue}
          ref={formInputRef}
          defaultValue={value}
          disabled={inputDisabled}
        >
          {options.map((opt, index) => (
            <ToggleButton
              key={index}
              id={`radiobtn-${opt}`}
              value={opt}
              className={optionStyles ? optionStyles[opt] : ''}
            >
              {<FormattedMessage id={opt} />}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      );
      break;
    case 'timepicker':
      inputToRender = (
        <div className={`${className}`}>
          <Form.Control
            type="number"
            value={hours}
            onChange={setHours}
            placeholder={intl.formatMessage({
              id: 'formInput.timepicker.hours'
            })}
            min="0"
            max="80"
            isInvalid={isInvalid}
            ref={formInputRef}
            disabled={inputDisabled}
          />
          <Form.Control
            type="number"
            value={minutes}
            onChange={setMinutes}
            placeholder={intl.formatMessage({
              id: 'formInput.timepicker.minutes'
            })}
            min="0"
            max="59"
            isInvalid={isInvalid}
            ref={formInputRef}
            disabled={inputDisabled}
          />
        </div>
      );
      break;
    case 'datepicker':
      inputToRender = (
        <ReactDatePicker
          selected={selected}
          onChange={setValue}
          className={className}
          placeholder={placeholder}
          icon={icon}
        />
      );
      break;
    case 'checkboxgroup':
      inputToRender = (
        <ToggleButtonGroup
          type="checkbox"
          className={className}
          value={value}
          onChange={setValue}
          isInvalid={isInvalid}
          ref={formInputRef}
          defaultValue={value}
          disabled={inputDisabled}
        >
          {options.map((opt, index) => (
            <ToggleButton
              key={index}
              id={`checkbox-${opt}`}
              value={opt}
              className={optionclassname}
              disabled={optionDisabled}
            >
              {opt}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      );
      break;
    default:
      inputToRender = null;
      break;
  }

  return (
    <div className="d-grid mb-3 d-flex flex-row gap-3 px-2 py-1 rounded-3 w-100">
      <span className="bg-light rounded-5 p-2 text-primary d-flex flex-row align-items-center h-25">
        <FontAwesomeIcon icon={icon} className="" />
      </span>
      <div className="p-0 m-0  border-bottom w-100 d-flex flex-column">
        <Form.Label htmlFor={`${value}`}>
          <div className="text-dark">{label}</div>
        </Form.Label>
        {inputToRender}
        {isInvalid ? (
          <div className="mb-3 form-text text-danger fst-italic">{errMsg}</div>
        ) : (
          <div className="mb-3 form-text fst-italic">{hint}</div>
        )}
      </div>
    </div>
  );
};

export default FormInput;
