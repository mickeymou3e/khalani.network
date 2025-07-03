export const createEmail = (
  email: string,
  subject: string,
  message: string
) => {
  const targetEmail = "support@neutralx.com";
  const body = email ? `Email Address: ${email}` : "";
  const msg = message ? `Message: ${message}` : "";

  return `mailto:${targetEmail}?subject=${subject}&body=${body}%0D%0D${msg}`;
};
