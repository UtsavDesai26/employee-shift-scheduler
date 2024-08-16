import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Checkbox,
  Select,
  Space,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;

const ShiftForm = ({ onCreateShift }) => {
  const [form] = Form.useForm();
  const [pauses, setPauses] = useState([]);

  const addPause = () => {
    setPauses([...pauses, { name: "", from: null, to: null }]);
  };

  const handlePauseChange = (index, field, value) => {
    const newPauses = [...pauses];
    newPauses[index][field] = value;
    setPauses(newPauses);
  };

  const handleFinish = (values) => {
    try {
      const shift = {
        ...values,
        pauses,
        id: Date.now(),
        status: "upcoming",
      };

      onCreateShift(shift);
      form.resetFields();
      setPauses([]);
      message.success("Shift created successfully");
    } catch (error) {
      message.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="name"
        label="Shift Name"
        rules={[{ required: true, message: "Please input the shift name!" }]}
      >
        <Input placeholder="Shift Name" />
      </Form.Item>

      <Form.Item
        name="time"
        label="Shift Start & End Time"
        rules={[{ required: true, message: "Please select the shift time!" }]}
      >
        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item name="periodicity" valuePropName="checked">
        <Checkbox>Periodicity</Checkbox>
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue("periodicity") ? (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item label="Repeat on" name="repeatOn">
                <Checkbox.Group>
                  <Space>
                    <Checkbox value="Mon">Mon</Checkbox>
                    <Checkbox value="Tue">Tue</Checkbox>
                    <Checkbox value="Wed">Wed</Checkbox>
                    <Checkbox value="Thu">Thu</Checkbox>
                    <Checkbox value="Fri">Fri</Checkbox>
                    <Checkbox value="Sat">Sat</Checkbox>
                    <Checkbox value="Sun">Sun</Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item label="Ends" name="endCondition">
                <Select>
                  <Select.Option value="never">Never</Select.Option>
                  <Select.Option value="on">On</Select.Option>
                  <Select.Option value="after">After</Select.Option>
                </Select>
              </Form.Item>
            </Space>
          ) : null
        }
      </Form.Item>

      <Form.Item label="Pauses">
        {pauses.map((pause, index) => (
          <Space key={index} style={{ display: "flex", marginBottom: 8 }}>
            <Input
              placeholder="Pause Name"
              value={pause.name}
              onChange={(e) => handlePauseChange(index, "name", e.target.value)}
            />
            <TimePicker
              value={pause.from ? moment(pause.from, "HH:mm:ss") : null}
              onChange={(time) =>
                handlePauseChange(
                  index,
                  "from",
                  time ? time.format("HH:mm:ss") : null
                )
              }
              format="HH:mm:ss"
            />
            <TimePicker
              value={pause.to ? moment(pause.to, "HH:mm:ss") : null}
              onChange={(time) =>
                handlePauseChange(
                  index,
                  "to",
                  time ? time.format("HH:mm:ss") : null
                )
              }
              format="HH:mm:ss"
            />
          </Space>
        ))}
        <Button type="dashed" onClick={addPause} block icon={<PlusOutlined />}>
          Add Pause
        </Button>
      </Form.Item>

      <Form.Item name="color" label="Label Color">
        <Input type="color" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Save Shift
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ShiftForm;
