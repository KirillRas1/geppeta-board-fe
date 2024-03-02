import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import CaptchaWrapper from 'components/auth/Captcha';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

export const SignUpModal = ({ onClose, open }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required')
    }),
    onSubmit: values => {
      console.log('Form submitted:', values);
      // You can add your sign-up logic here
      onClose();
    }
  });

  const SignupButton = ({ captchaverified }) => (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={!captchaverified}
    >
      Sign Up
    </Button>
  );

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <h2>Sign Up</h2>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Email"
            type="email"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            {...formik.getFieldProps('confirmPassword')}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            fullWidth
            margin="normal"
          />
          <CaptchaWrapper>
            <SignupButton />
          </CaptchaWrapper>
        </form>
      </ModalContent>
    </StyledModal>
  );
};

const SignUpButton = () => {
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  return (
    <div>
      <SignUpModal
        open={signupModalOpen}
        onClose={() => {
          setSignupModalOpen(false);
        }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setSignupModalOpen(true);
        }}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default SignUpButton;
