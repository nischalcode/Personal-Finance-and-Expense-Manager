import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const from =
    process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@expensewise.app";
  await transporter.sendMail({
    from: `ExpenseWise <${from}>`,
    to,
    subject: "ExpenseWise — Email Verification",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="margin:0 0 8px">ExpenseWise</h2>
        <h3 style="margin:0 0 16px;color:#6b7280">Email Verification</h3>
        <p>Your verification code is:</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;margin:24px 0;color:#4f46e5">${otp}</p>
        <p style="color:#6b7280;font-size:14px">This code expires in 10 minutes.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
        <p style="color:#9ca3af;font-size:12px">If you did not create an account, please ignore this email.</p>
      </div>
    `,
  });
}
