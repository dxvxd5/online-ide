import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoginSchemaType } from '../../utils/yup-schemas';

import Button from '../components/button/button';

import '../../assets/styles/form.css';

type ClickFunction = {
  (e: { username: string; password: string }): void;
};

interface LoginViewProp {
  logIn: ClickFunction;
  loginError: boolean;
  loginErrorInfo: string;
  loginSchema: LoginSchemaType;
  signUp: () => void;
}

const LoginView = ({
  logIn,
  loginError,
  loginErrorInfo,
  loginSchema,
  signUp,
}: LoginViewProp): JSX.Element => {
  return (
    <div className="container">
      <div className="form form--login">
        <h1 className="form__header">Login</h1>
        {loginError && (
          <div className="form__error form__error--all">{loginErrorInfo}</div>
        )}
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={(e) => logIn(e)}
        >
          <Form className="form__container">
            <div className="form__field-group">
              <Field
                type="username"
                name="username"
                className="form__field"
                component="input"
                placeholder="username"
              />
              <ErrorMessage
                name="username"
                component="span"
                className="form__error form__error--field"
              />
            </div>
            <div className="form__field-group">
              <Field
                type="password"
                name="password"
                placeholder="password"
                className="form__field"
                component="input"
              />
              <ErrorMessage
                name="password"
                component="span"
                className="form__error form__error--field"
              />
            </div>
            <Button
              theme="main"
              text="Log in"
              submit
              className="form__button"
            />
            <Button
              theme="secondary"
              text="Sign up instead"
              onClick={signUp}
              submit={false}
              className="form__button"
            />
          </Form>
        </Formik>
      </div>
    </div>
  );
};
export default LoginView;
