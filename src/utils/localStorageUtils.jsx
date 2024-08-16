export const saveShiftToLocalStorage = (shift) => {
  const shifts = JSON.parse(localStorage.getItem("shifts")) || [];
  shifts.push(shift);
  localStorage.setItem("shifts", JSON.stringify(shifts));
};

export const getShiftsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("shifts")) || [];
};
