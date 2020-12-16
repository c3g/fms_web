import React from "react";
import {Radio, Select} from "antd";
import "antd/es/radio/style/css";
import "antd/es/select/style/css";

const { Option } = Select;

const EMPTY_VALUE = '__FILTER_SELECT_EMPTY_VALUE__'

const FilterSelect = ({
  item,
  value,
  options = item.options || [],
  onChange,
}) => {

  let handleChange
  let element

  if (item.mode !== 'multiple') {
    handleChange = ev => {
      const value = typeof ev === 'string' ? ev : ev.target.value
      onChange(item, value === EMPTY_VALUE ? null : [value])
    }
    element =
      <Radio.Group value={value ? value[0] : EMPTY_VALUE} onChange={handleChange}>
        <Radio.Button key={EMPTY_VALUE} value={EMPTY_VALUE}>
          {item.placeholder}
        </Radio.Button>
        {
          options.map(item =>
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          )
        }
      </Radio.Group>
  }
  else {
    handleChange = value => {
      onChange(item, value === EMPTY_VALUE ? null : value)
    }
    element =
      <Select
        style={{ width: 200 }}
        mode={item.mode}
        placeholder={item.placeholder}
        value={value}
        onChange={handleChange}
      >
        {
          options.map(item =>
            <Option key={item.value} value={item.value}>{item.label}</Option>
          )
        }
      </Select>
  }

  return (
    <div>
      <label>{item.label}</label>
      {element}
    </div>
  );
};

export default FilterSelect;
