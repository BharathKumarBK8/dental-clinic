import { useState, forwardRef, useImperativeHandle } from "react";
import _ from "lodash";
import { FormFieldRef } from "./FormRenderer";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { PositionType, ValidationType } from "../../../../Models/PageModel";

export interface CHECK_BOX_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  options: Category[];
  label: string;
  value: string;
  position?: PositionType;
  validation?: Partial<typeof ValidationType>;
  onChange: (value: any) => void;
}

export interface Category {
  label: string;
  key: string;
}
export interface CheckboxProps {
  data: CHECK_BOX_DATA;
}

const CheckBox = forwardRef<FormFieldRef, CheckboxProps>(({ data }, ref) => {
  const [selected, setSelected] = useState<Category[]>([
    _.get(data, "options[0]"),
  ]);

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    getValue: () => selected,
    setValue: (categories: Category[]) => {
      setSelected(categories);
    },
    reset: () => {
      setSelected([_.get(data, "options[0]")]);
    },
    validate: () => {
      if (data.validation?.required && selected.length === 0) {
        return false;
      }
      return true;
    },
  }));

  const handleChange = (e: CheckboxChangeEvent) => {
    let selectedCategories = [...selected];

    if (e.checked) {
      selectedCategories.push(e.value);
    } else {
      selectedCategories = selectedCategories.filter(
        (category) => category.key !== e.value.key
      );
    }
    setSelected(selectedCategories);
    data.onChange(selectedCategories);
  };

  const inputContainerClassName = `${
    _.get(data, "position") === PositionType.VERTICAL ? "flex-grow-1" : "w-100"
  }`;
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

  return (
    <div className={containerClassName}>
      <div className={labelContainerClassName}>
        <label>
          {_.get(data, "title.icon") && (
            <i className={`bi ${_.get(data, "title.icon")} me-2`}></i>
          )}
          {data.title.text}
          {_.get(data, "validation.required") && (
            <span className="text-danger"> *</span>
          )}
        </label>
      </div>
      {data.options.map((category) => {
        return (
          <div key={_.get(category, "key")} className={inputContainerClassName}>
            <Checkbox
              inputId={_.get(category, "key")}
              name="category"
              value={category}
              onChange={handleChange}
              checked={selected.some(
                (item: { key: string }) =>
                  _.get(item, "key") === _.get(category, "key")
              )}
            />
            <label
              style={{ fontSize: "14px" }}
              htmlFor={_.get(category, "key")}
              className="ms-2"
            >
              {_.get(category, "label")}
            </label>
          </div>
        );
      })}
    </div>
  );
});

export default CheckBox;
