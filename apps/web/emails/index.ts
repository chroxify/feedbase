import { JSXElementConstructor, ReactElement } from 'react';
import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendEmail = async ({
  email,
  subject,
  react,
  marketing,
  test = process.env.NODE_ENV === 'development',
}: {
  email: string;
  subject: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  react: ReactElement<any, string | JSXElementConstructor<any>>;
  marketing?: boolean;
  test?: boolean;
}) => {
  if (!resend) {
    // eslint-disable-next-line no-console
    console.log(
      'Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work.'
    );
    return Promise.resolve();
  }
  return resend.emails.send({
    from: marketing ? 'Christo from Luminar <christo@luminar.so>' : 'Luminar <system@luminar.so>',
    to: test ? 'delivered@resend.dev' : email,
    subject,
    react,
  });
};
