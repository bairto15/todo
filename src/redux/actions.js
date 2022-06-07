import * as actions from "./actionTypes";

export const addTodo = (data) => ({
  type: actions.ADD_TODO,
  value: data,
});

export const editTodo = (data) => ({
  type: actions.EDIT_TODO,
  value: data,
});

export const deleteTodo = (data) => ({
  type: actions.DELETE_TODO,
  value: data,
});

export const updateTodo = (data) => ({
  type: actions.UPDATE_TODO,
  value: data,
});
