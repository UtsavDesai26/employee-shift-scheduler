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

  const compareDates = (date1, date2) => {
    return date1.getTime() - date2.getTime();
  };

  const updateShiftStatus = () => {
    const now = new Date();

    shifts.forEach((shift) => {
      const start = new Date(shift.time[0]);
      const end = new Date(shift.time[1]);

      if (compareDates(now, start) >= 0 && compareDates(now, end) < 0) {
        shift.status = "active";
      } else if (compareDates(now, end) >= 0) {
        shift.status = "completed";
      } else if (compareDates(now, start) < 0) {
        shift.status = "upcoming";
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
            <List.Item
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>
                  <Badge
                    color={item.color}
                    text={`${item.name}: ${moment(item.time[0]).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )} - ${moment(item.time[1]).format("YYYY-MM-DD HH:mm:ss")}`}
                  />
                </div>
                <div>
                  {item.status &&
                    (item.status === "active" ? (
                      <Badge status="processing" text="Active" />
                    ) : item.status === "completed" ? (
                      <Badge status="success" text="Completed" />
                    ) : (
                      item.status === "upcoming" && (
                        <Badge status="default" text="Upcoming" />
                      )
                    ))}
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  marginTop: 10,
                  marginBottom: 5,
                  fontWeight: "bold",
                }}
              >
                Pauses:
              </p>
              <ul
                style={{
                  padding: 0,
                  margin: 0,
                  listStyleType: "none",
                }}
              >
                {item.pauses
                  .filter((pause) => {
                    return (
                      pause.from >= item.time[0] && pause.to <= item.time[1]
                    );
                  })
                  .map((pause, index) => (
                    <li key={index}>
                      {pause.name}:{" "}
                      {moment(pause.from).format("YYYY-MM-DD HH:mm:ss")} -{" "}
                      {moment(pause.to).format("YYYY-MM-DD HH:mm:ss")}
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
