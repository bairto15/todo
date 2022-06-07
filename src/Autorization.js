import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./App.css";

export default function Autorization() {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [auth, setAuth] = React.useState(false);
  function handleAuth() {
    setAuth(!auth);
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
