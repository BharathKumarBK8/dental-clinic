import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { InputText } from "primereact/inputtext";
import _ from "lodash";
import {
  ValidationType,
  InputType,
  PositionType,
  ErrorModel,
  Errposition,
} from "../../../../Models/PageModel";
import { FormFieldRef } from "./FormRenderer";
import { validateInput } from "../../../Utilities/Validation";

export interface TEXTBOX_DATA {
  title: {
    text: string;
    icon?: string;
  };
  placeholder?: string;
  value?: string;
  validation?: Partial<typeof ValidationType>;
  inputType?: InputType;
  disabled?: boolean;
  position?: PositionType;
  error?: ErrorModel;
  name?: string;
}

export interface TextBoxProps {
  data: TEXTBOX_DATA;
}

const TextBox = forwardRef<FormFieldRef, TextBoxProps>(({ data }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<ErrorModel | null>(null);

  // Expose methods to parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getValue: () => inputValue,
    setValue: (value: string) => {
      setInputValue(value);
    },
    validate: () => {
      const validationError = validateInput(
        inputValue,
        data.validation!,
        data.inputType,
        data.error
      );
      setError(validationError);
      return validationError === null;
    },
    reset: () => {
      setInputValue("");
      setError(null);
    },
  }));

  // Initialize and update input value when data.value changes
  useEffect(() => {
    setInputValue(data.value || "");
  }, [data.value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    console.log("TextBox - Value changing:", {
      name: data.name,
      oldValue: inputValue,
      newValue: newValue,
    });

    setInputValue(newValue);

    // Validate on change if there's an existing error
    if (error) {
      const validationError = validateInput(
        newValue,
        data.validation || {},
        data.inputType,
        data.error
      );
      setError(validationError);
    }
  };

  const handleBlur = () => {
    console.log("TextBox - Blur event:", {
      name: data.name,
      value: inputValue,
    });

    const validationError = validateInput(
      inputValue,
      data.validation!,
      data.inputType,
      data.error
    );
    setError(validationError);
  };

  return (
    <div className="form-group">
      <label>
        {_.get(data, "title.icon") && (
          <i className={`bi ${_.get(data, "title.icon")} me-2`}></i>
        )}
        {data.title.text}
        {_.get(data, "validation.required") && (
          <span className="text-danger"> *</span>
        )}
      </label>
      <InputText
        type={_.get(data, "inputType", "text")}
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={_.get(data, "placeholder")}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={data.disabled}
      />
      {error && error.position === Errposition.BELOW && (
        <div className="text-danger mt-1">
          {_.get(error, "message.required") ||
            _.get(error, "message.type_check") ||
            _.get(error, "message.reg_exp")}
        </div>
      )}
      {error && error.position === Errposition.RIGHT && (
        <div className="text-danger ms-2">
          {_.get(error, "message.required") ||
            _.get(error, "message.type_check") ||
            _.get(error, "message.reg_exp")}
        </div>
      )}
    </div>
  );
});

export default TextBox;
