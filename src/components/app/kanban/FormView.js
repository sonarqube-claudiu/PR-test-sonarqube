import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SoftBadge from 'components/common/SoftBadge';
import React, { useRef } from 'react';
import { Form, ProgressBar } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';

const FormView = ({
  type,
  value,
  label,
  inputRef,
  className,
  needsTranslation,
  icon
}) => {
  const intl = useIntl();

  let inputToRender;

  switch (type) {
    case 'badge':
      inputToRender = (
        <SoftBadge
          bg={value.type}
          className={`py-1 me-1 mb-2 w-25 ${className}`}
        >
          <FormattedMessage id={value.id} />
        </SoftBadge>
      );
      break;
    case 'text':
      inputToRender = (
        <div
          className={`mb-2 ms-2 fw-bold ${className}`}
          dangerouslySetInnerHTML={{
            __html: needsTranslation
              ? intl.formatMessage({
                  id: value
                    ? value?.toString().replace(/\r?\n/g, '<br />')

                    : value
                })
              : value?.toString().replace(/\r?\n/g, '<br />')

          }}
        ></div>
      );
      break;
    case 'progress':
      inputToRender = (
        <ProgressBar
          variant={value <= 0 || value === 'null' ? 'secondary' : 'primary'}
          now={!value || value === 'null' || value <= 0 ? 100 : value}
          label={`${value !== 'null' ? value : 0}%`}
          className={`bg-secondary w-50 mb-2 ${className}`}
        />
      );
      break;
    default:
      inputToRender = null;
      break;
  }

  return (
    <div className="d-grid mb-3 d-flex flex-row gap-3 px-2 py-1 rounded-3">
      <span className="bg-light rounded-5 p-2 text-primary d-flex flex-row align-items-center h-25">
        <FontAwesomeIcon icon={icon} className="" />
      </span>
      <div className="p-0 m-0  border-bottom w-100 d-flex flex-column text-break">
        <Form.Label htmlFor={`${value}`}>
          <div className="text-dark d-flex flex-row align-items-center">
            {label}
          </div>
        </Form.Label>
        {inputToRender}
      </div>
    </div>
  );
};

export default FormView;
