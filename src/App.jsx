import React, { useState, useEffect } from "react";
import { Layout, Tabs } from "antd";
import ShiftForm from "./components/ShiftForm";
import ShiftCalendar from "./components/ShiftCalendar";
import {
  saveShiftToLocalStorage,
  getShiftsFromLocalStorage,
} from "./utils/localStorageUtils";

const { Content } = Layout;
const { TabPane } = Tabs;

const App = () => {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    setShifts(getShiftsFromLocalStorage());
  }, []);

  const handleCreateShift = (shift) => {
    saveShiftToLocalStorage(shift);
    setShifts([...shifts, shift]);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Content style={{ padding: "0 50px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Create Shift" key="1">
            <ShiftForm onCreateShift={handleCreateShift} />
          </TabPane>
          <TabPane tab="Shift Calendar" key="2">
            <ShiftCalendar shifts={shifts} />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default App;
