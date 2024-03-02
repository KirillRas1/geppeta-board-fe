import React, { useState, useContext } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authContext } from 'contexts/Auth';

const LoginModal = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const { loginWithCredentials } = useContext(authContext);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleToggleModal}>
        Login
      </Button>
      <Dialog open={open} onClose={handleToggleModal}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Invalid email')
                .required('Email is required'),
              password: Yup.string().required('Password is required')
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                loginWithCredentials({
                  username: values.email,
                  password: values.password
                });
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              errors,
              touched
            }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email(username)"
                  variant="outlined"
                  margin="normal"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.email && touched.email)}
                />
                <ErrorMessage name="email" component="div" />
                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.password && touched.password)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <ErrorMessage name="password" component="div" />
                <DialogActions>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    Login
                  </Button>
                  <Button onClick={handleToggleModal} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginModal;
