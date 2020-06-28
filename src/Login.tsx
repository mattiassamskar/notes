import React, { FunctionComponent, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { api } from "./api";

interface Props {
  setToken: (token: string) => void;
}

export const Login: FunctionComponent<Props> = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const login = async () => {
    try {
      setError("");
      const response = await api.login(userName, password);
      window.localStorage.setItem("token", response.token);
      props.setToken(response.token);
    } catch (error) {
      setError("Could not login");
    }
  };

  const signup = async () => {
    try {
      setError("");
      await api.signup(userName, password);
      setMode("login");
    } catch (error) {
      setError("Could not register");
    }
  };

  const renderLogin = () => {
    return (
      <Form>
        <Form.Group>
          <Form.Control
            as="input"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            as="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Button onClick={login}>Login</Button>
        </Form.Group>
        <span style={{ cursor: "pointer" }} onClick={() => setMode("signup")}>
          Sign up
        </span>
      </Form>
    );
  };

  const renderSignup = () => {
    return (
      <Form>
        <Form.Group>
          <Form.Control
            as="input"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            as="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Button onClick={signup}>Sign up</Button>
        </Form.Group>
      </Form>
    );
  };

  return (
    <Container fluid className="mt-1">
      {!!error && (
        <Alert variant="danger" dismissible={true} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {mode === "login" && renderLogin()}
      {mode === "signup" && renderSignup()}
    </Container>
  );
};
