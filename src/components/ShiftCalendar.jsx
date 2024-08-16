import React, { useState, useEffect } from "react";
import { Calendar, Badge, Modal, List } from "antd";
import moment from "moment";

const getListData = (value, shifts) => {
  const date = value.format("YYYY-MM-DD");
  return shifts.filter((shift) => {
    const startDate = moment(shift.time[0]).format("YYYY-MM-DD");
    const endDate = moment(shift.time[1]).format("YYYY-MM-DD");
    return date >= startDate && date <= endDate;
  });
};

const ShiftCalendar = ({ shifts }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listData, setListData] = useState([]);

  const updateShiftStatus = () => {
    const now = moment();
    shifts.forEach((shift) => {
      const start = moment(shift.time[0]);
      const end = moment(shift.time[1]);

      if (now.isBetween(start, end, null, "[)")) {
        shift.status = "active";
      } else if (now.isAfter(end)) {
        shift.status = "completed";
      }
    });
  };

  useEffect(() => {
    updateShiftStatus();
  }, [shifts]);

  const dateCellRender = (value) => {
    const listData = getListData(value, shifts);
    return listData.length ? (
      <div>
        {listData.map((item) => (
          <Badge
            color={item.color}
            style={{
              marginRight: 5,
            }}
          />
        ))}
      </div>
    ) : null;
  };

  const onSelect = (value) => {
    const selectedListData = getListData(value, shifts);
    if (selectedListData.length > 0) {
      setSelectedDate(value.format("YYYY-MM-DD"));
      setListData(selectedListData);
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />
      <Modal
        title={`Shifts on ${selectedDate}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          dataSource={listData}
          renderItem={(item) => (
            <List.Item>
              <Badge
                color={item.color}
                text={`${item.name}: ${moment(item.time[0]).format(
                  "HH:mm"
                )} - ${moment(item.time[1]).format("HH:mm")}`}
              />
              {item.status === "active" && (
                <span style={{ color: "green" }}> (Active)</span>
              )}
              {item.status === "completed" && (
                <span style={{ color: "red" }}> (Completed)</span>
              )}
              <ul>
                {item.pauses.map((pause, index) => (
                  <li key={index}>
                    Pause: {moment(pause.start).format("HH:mm")} -{" "}
                    {moment(pause.end).format("HH:mm")}
                  </li>
                ))}
              </ul>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default ShiftCalendar;
