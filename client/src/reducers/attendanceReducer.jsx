export const attendanceReducer = (state, action) => {
  switch (action.type) {
    case "SET_RECORDS":
      return { ...state, records: action.payload };
    case "ADD_RECORD":
      return { ...state, records: [action.payload, ...state.records] };
    case "SET_CLASSES":
      return { ...state, classes: action.payload };
    case "ADD_CLASS":
      return { ...state, classes: [...state.classes, action.payload] };
    default:
      return state;
  }
};
