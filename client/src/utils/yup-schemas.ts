import * as Yup from 'yup';

export const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  password: Yup.string()
    .min(6, 'The password must be at least 6 characters long')
    .required('Required'),
  username: Yup.string()
    .min(3, 'The username must be at least 3 characters long')
    .max(8, 'The username must be at most 8 characters long')
    .required('Required'),
  passwordConfirm: Yup.string()
    .label('Password Confirm')
    .required('Required')
    .oneOf([Yup.ref('password')], 'Passwords do not match.'),
});

export type SignUpSchemaType = typeof signUpSchema;

export const loginSchema = Yup.object().shape({
  username: Yup.string().required('required'),
  password: Yup.string().required('required'),
});
export type LoginSchemaType = typeof loginSchema;
