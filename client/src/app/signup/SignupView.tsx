import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SignupSchemaType } from '../../utils/yup-schemas';

type ClickFunction = {
  (e: { name: string; username: string; password: string }): void;
};

interface SingupViewProp {
  click: ClickFunction;
  signupError: boolean;
  signupErrorInfo: string;
  signupSchema: SignupSchemaType;
  logIn: () => void;
}

const SingupView = ({
  click,
  signupError,
  signupErrorInfo,
  signupSchema: SignupSchema,
  logIn,
}: SingupViewProp): JSX.Element => {
  return (
    <div>
      {signupError && <div>{signupErrorInfo}</div>}
      <>
        <h1>Signup</h1>
        <Formik
          initialValues={{ name: '', username: '', password: '' }}
          validationSchema={SignupSchema}
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
            <p>Confirm password: </p>
            <Field type="password" name="passwordConfirm" />
            <ErrorMessage name="passwordConfirm" component="div" />
            <br />
            <button type="submit">Submit</button>
            <br />
            <button type="button" onClick={() => logIn()}>
              Login instead
            </button>
          </Form>
        </Formik>
      </>
    </div>
  );
};

export default SingupView;
