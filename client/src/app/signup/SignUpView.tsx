import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SignUpSchemaType } from '../../utils/yup-schemas';

import Button from '../components/button/Button';

import '../../assets/styles/form.css';

interface SignUpViewProp {
  click: (_: { name: string; username: string; password: string }) => void;
  signUpError: string;
  signUpSchema: SignUpSchemaType;
  logIn: () => void;
}

const SignUpView = ({
  click,
  signUpError,
  signUpSchema,
  logIn,
}: SignUpViewProp): JSX.Element => {
  return (
    <div className="container container--sign-up">
      <div className="form form--sign-up">
        <h1 className="form__header">Sign Up</h1>
        {signUpError && (
          <div className="form__error form__error--all">{signUpError}</div>
        )}
        <Formik
          initialValues={{ name: '', username: '', password: '' }}
          validationSchema={signUpSchema}
          onSubmit={(e) => click(e)}
        >
          <Form className="form__container">
            <div className="form__field-group">
              <Field
                type="name"
                name="name"
                className="form__field"
                component="input"
                placeholder="name"
              />
              <ErrorMessage
                name="name"
                component="span"
                className="form__error form__error--field"
              />
            </div>
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
            <div className="form__field-group">
              <Field
                type="password"
                name="passwordConfirm"
                placeholder="repeat password"
                className="form__field"
                component="input"
              />
              <ErrorMessage
                name="passwordConfirm"
                component="span"
                className="form__error form__error--field"
              />
            </div>
            <Button
              theme="main"
              text="Sign up"
              submit
              className="form__button"
            />
            <Button
              theme="secondary"
              text="Log in instead"
              onClick={logIn}
              submit={false}
              className="form__button"
            />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignUpView;
