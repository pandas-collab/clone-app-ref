import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Contact Form: ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
      html: `<p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Message:</strong> ${data.message}</p>`,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendApplicationEmail = async (data: {
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
}) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Job Application: ${data.jobTitle}`,
      text: `New application received for ${data.jobTitle} from ${data.applicantName} (${data.applicantEmail})`,
      html: `<p>New application received for <strong>${data.jobTitle}</strong></p><p><strong>Applicant:</strong> ${data.applicantName}</p><p><strong>Email:</strong> ${data.applicantEmail}</p>`,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};
