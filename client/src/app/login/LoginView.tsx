import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoginSchemaType } from '../../utils/yup-schemas';

type ClickFunction = {
  (e: { username: string; password: string }): void;
};

interface LoginViewProp {
  click: ClickFunction;
  loginError: boolean;
  loginErrorInfo: string;
  loginSchema: LoginSchemaType;
  signUp: () => void;
}

const LoginView = ({
  click,
  loginError,
  loginErrorInfo,
  loginSchema,
  signUp,
}: LoginViewProp): JSX.Element => {
  return (
    <div>
      {loginError && <div>{loginErrorInfo}</div>}
      <>
        <h1>Login</h1>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
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
            <br />
            <button type="button" onClick={() => signUp()}>
              Signup instead
            </button>
          </Form>
        </Formik>
      </>
    </div>
  );
};
export default LoginView;
