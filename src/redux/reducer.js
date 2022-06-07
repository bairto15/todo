import * as actions from "./actionTypes";
import uniqid from "uniqid";

const initial_state = {
  id: "12346",
  name: "",
  email: "",
  text: "",
  edit: false,
  status: false,
};

export default function reducer(state = [initial_state], action) {
  switch (action.type) {
    case actions.ADD_TODO:
      const id = uniqid();
      const todo = { id: id, name: "", email: "", text: "", status: false };
      return [...state, todo];

    case actions.EDIT_TODO:
      return state.map((item) => {
        if (item.id === action.value.id) {
          item[action.value.type] = action.value.data;
          return item;
        }
        return item;
      });

    case actions.DELETE_TODO:
      return state.filter((item) => {
        return item.id !== action.value.id;
      });

    case actions.UPDATE_TODO:
      return action.value;

    default:
      return state;
  }
}
