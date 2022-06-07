import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addTodo } from "./redux/actions";
import { editTodo } from "./redux/actions";
import { deleteTodo } from "./redux/actions";
import { updateTodo } from "./redux/actions";
import "./App.css";

async function postData(data, url) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function validate(email) {
  var reg = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
}

export default function Todo() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const [sort, setSort] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(state.length);

  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [auth, setAuth] = React.useState(false);

  async function getTodos(data) {
    const response = await postData(data, "/get_todos");
    if (response.message) {
      alert(response.message);
    } else if (response.state) {
      dispatch(updateTodo(response.state));
      setSize(response.size);
    }
  }

  const handleChangeSort = async (event) => {
    setSort(event.target.value);
    const data = {
      sort: event.target.value,
      page: page,
    };
    getTodos(data);
  };

  const handleChangePage = async (e, newPage) => {
    const data = {
      sort: sort,
      page: newPage,
    };
    const response = await postData(data, "/get_todos");
    console.log(response.state);
    getTodos(data);
    setPage(newPage);
  };

  const handleSaveState = async () => {
    const validation_email_all = state.every((item) => validate(item.email));
    if (validation_email_all) {
      const response = await postData(state, "/save_todos");
      if (response.message) {
        alert(response.message);
      }
    } else {
      alert("Введите корректный e-mail");
    }
  };

  function Autorization() {
    async function handleAuth() {
      const data = { login, password, auth };
      const response = await postData(data, "/auth");
      if (response.message) {
        alert(response.message);
      } else if (response.auth === false || response.auth === true) {
        if (response.state.length) {
          dispatch(updateTodo(response.state));
        }
      }
      setAuth(response.auth);
    }

    return (
      <div className="buttons">
        <TextField
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
          type="text"
          label="Логин"
          variant="standard"
        />
        <TextField
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          label="Логин"
          variant="standard"
        />
        <div className="marginTop">
          <Button variant="contained" onClick={handleAuth}>
            {!auth ? "Войти" : "Выйти"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="todo">
      {Autorization()}
      <h1>Todo list</h1>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead className="background_blue">
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Текст задачи</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Удалить</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="background_body">
            {(state.length > 3
              ? state.slice(page * 3, page * 3 + 3)
              : state
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <TextField
                    type="text"
                    value={row.name}
                    onChange={(e) => {
                      dispatch(
                        editTodo({
                          type: "name",
                          id: row.id,
                          data: e.target.value,
                        })
                      );
                    }}
                    label="Имя"
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.email}
                    onChange={(e) => {
                      dispatch(
                        editTodo({
                          type: "email",
                          id: row.id,
                          data: e.target.value,
                        })
                      );
                    }}
                    type="email"
                    label="E-mail"
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={row.text}
                    onChange={(e) => {
                      dispatch(
                        editTodo({
                          type: "text",
                          id: row.id,
                          data: e.target.value,
                        })
                      );
                    }}
                    label={
                      "Текст задачи" + (row.edit
                        ? "(отредактирован)"
                        : "")
                    }
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.status}
                    onChange={(e) => {
                      dispatch(
                        editTodo({
                          type: "status",
                          id: row.id,
                          data: !row.status,
                        })
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        deleteTodo({
                          id: row.id,
                        })
                      );
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[3]}
          component="div"
          count={state.length > size ? state.length : size}
          rowsPerPage={3}
          page={page}
          onPageChange={handleChangePage}
        />
      </TableContainer>
      <div className="buttons">
        <div>
          <Button
            variant="contained"
            disableElevation
            onClick={() => dispatch(addTodo())}
          >
            Добавить задачу
          </Button>
        </div>
        <FormControl variant="standard">
          <InputLabel>Сортировка по</InputLabel>
          <Select value={sort} onChange={handleChangeSort} label="Сортировка">
            <MenuItem value={"name"}>Имени возрастанию</MenuItem>
            <MenuItem value={"name_minus"}>Имени убыванию</MenuItem>
            <MenuItem value={"email"}>Еmail возрастанию</MenuItem>
            <MenuItem value={"email_minus"}>Еmail убыванию</MenuItem>
            <MenuItem value={"status"}>Статусу возрастанию</MenuItem>
            <MenuItem value={"status_minus"}>Статусу убыванию</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSaveState}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
