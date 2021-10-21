import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoginSchemaType } from '../../utils/yup-schemas';
import Button from '../components/button/Button';
import '../../assets/styles/form.css';

interface LoginViewProp {
  logIn: (_: { username: string; password: string }) => void;
  loginError: string;
  loginSchema: LoginSchemaType;
  signUp: () => void;
}

const LoginView = ({
  logIn,
  loginError,
  loginSchema,
  signUp,
}: LoginViewProp): JSX.Element => {
  return (
    <div className="container container--login">
      <div className="form form--login">
        <h1 className="form__header">Log In</h1>
        {!!loginError && (
          <div className="form__error form__error--all">{loginError}</div>
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
