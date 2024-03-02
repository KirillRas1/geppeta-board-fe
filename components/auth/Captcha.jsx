'use client';
import ReCAPTCHA from 'react-google-recaptcha';
import { verifyCaptcha } from 'functions/serverActions';
import { useRef, useState } from 'react';
import React from 'react';
const CaptchaWrapper = ({ children }) => {
  const recaptchaRef = useRef(null);
  const [isVerified, setIsverified] = useState(false);

  async function handleCaptchaSubmission(token) {
    await verifyCaptcha(token)
      .then(() => setIsverified(true))
      .catch(() => setIsverified(false));
  }
  return (
    <>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        ref={recaptchaRef}
        onChange={handleCaptchaSubmission}
      />
      {React.Children.map(children, child =>
        React.cloneElement(child, { captchaverified: isVerified })
      )}
    </>
  );
};
export default CaptchaWrapper;
