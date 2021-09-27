import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type ClickFunction = {
  (e: { username: string; password: string }): void;
};

interface LoginViewProp {
  click: ClickFunction;
  loginError: boolean;
  loginErrorInfo: string;
}

const LoginView = ({
  click,
  loginError,
  loginErrorInfo,
}: LoginViewProp): JSX.Element => {
  return (
    <div>
      {loginError && <div>{loginErrorInfo}</div>}
      <>
        <h1>Login</h1>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(e) => click(e)}
        >
          <Form>
            <p>Username: </p>
            <Field type="username" name="username" />
            <ErrorMessage name="username" component="div" />
            <p>Password: </p>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <br />
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </>
    </div>
  );
};
export default LoginView;
