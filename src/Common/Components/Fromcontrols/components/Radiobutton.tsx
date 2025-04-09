import { useState, forwardRef, useImperativeHandle } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import _ from "lodash";
import {
  ValidationType,
  PositionType,
  ErrorModel,
  Errposition,
} from "../../../../Models/PageModel";
import { FormFieldRef } from "./FormRenderer";
import { validateRequired } from "../../../Utilities/Validation";

export interface RADIO_BUTTON_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  options: Category[];
  label: string;
  value?: string;
  position?: PositionType;
  validation?: Partial<typeof ValidationType>;
  error?: ErrorModel;
  name?: string;
  disabled?: boolean;
}

export interface Category {
  label: string;
  key: string;
}

export interface RadioButtonProps {
  data: RADIO_BUTTON_DATA;
}

const Radiobutton = forwardRef<FormFieldRef, RadioButtonProps>(
  ({ data }, ref) => {
    const [selected, setSelected] = useState<Category | null>(null);
    const [error, setError] = useState<ErrorModel | null>(null);

    // Expose methods to parent component using useImperativeHandle
    useImperativeHandle(ref, () => ({
      getValue: () => selected?.key || "",
      setValue: (value: string) => {
        const category = data.options.find((opt) => opt.key === value);
        setSelected(category || null);
      },
      validate: () => {
        const validationError = validateRequired(
          selected?.key || "",
          data.error
        );
        setError(validationError);
        return validationError === null;
      },
      reset: () => {
        setSelected(null);
        setError(null);
      },
    }));

    const handleChange = (e: RadioButtonChangeEvent) => {
      const newValue = e.value;
      console.log("RadioButton - Value changing:", {
        name: data.name,
        oldValue: selected?.key,
        newValue: newValue.key,
      });

      setSelected(newValue);

      if (error) {
        const validationError = validateRequired(newValue.key, data.error);
        setError(validationError);
      }
    };

    const handleBlur = () => {
      console.log("RadioButton - Blur event:", {
        name: data.name,
        value: selected?.key,
      });
      setError(validateRequired(selected?.key || "", data.error));
    };

    const containerClassName = `form-group ${
      _.get(data, "position") === PositionType.VERTICAL
        ? "d-flex align-items-center"
        : ""
    }`;

    const labelContainerClassName = `${
      _.get(data, "position") === PositionType.VERTICAL
        ? "d-inline-flex align-items-center me-2"
        : "mb-2 d-block"
    }`;

    const inputContainerClassName = `${
      _.get(data, "position") === PositionType.VERTICAL
        ? "flex-grow-1"
        : "w-100"
    }`;

    return (
      <div className={containerClassName}>
        <div className={labelContainerClassName}>
          {_.get(data, "title.icon") && (
            <i className={`bi ${_.get(data, "title.icon")} me-2`}></i>
          )}
          <label style={{ fontSize: "14px" }}>
            {_.get(data, "title.text")}
          </label>
          {_.get(data, `validation.includes`, ValidationType.required) && (
            <span className="text-danger ms-1">*</span>
          )}
        </div>
        <div className={inputContainerClassName}>
          {data.options.map((category) => {
            return (
              <div
                key={category.key}
                className="d-flex align-items-center mb-2"
              >
                <RadioButton
                  inputId={category.key}
                  name={data.name}
                  value={category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={selected?.key === category.key}
                  disabled={data.disabled}
                  className={error ? "is-invalid" : ""}
                />
                <label htmlFor={category.key} className="ms-2">
                  {category.label}
                </label>
              </div>
            );
          })}
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
      </div>
    );
  }
);

export default Radiobutton;
