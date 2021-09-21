/* eslint-disable @typescript-eslint/ban-types */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type ClickFunction = {
  (e: { username: string; password: string }): void;
};

interface LoginViewProp {
  click: ClickFunction;
}

const LoginView = ({ click }: LoginViewProp): JSX.Element => {
  return (
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
  );
};
export default LoginView;
