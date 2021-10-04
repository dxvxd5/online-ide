import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type ClickFunction = {
  (e: { name: string; username: string; password: string }): void;
};

interface SingupViewProp {
  click: ClickFunction;
  signupError: boolean;
  signupErrorInfo: string;
}

const SingupView = ({
  click,
  signupError,
  signupErrorInfo,
}: SingupViewProp): JSX.Element => {
  return (
    <div>
      {signupError && <div>{signupErrorInfo}</div>}
      <>
        <h1>Signup</h1>
        <Formik
          initialValues={{ name: '', username: '', password: '' }}
          onSubmit={(e) => click(e)}
        >
          <Form>
            <p>Name: </p>
            <Field type="name" name="name" />
            <ErrorMessage name="name" component="div" />
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

export default SingupView;
