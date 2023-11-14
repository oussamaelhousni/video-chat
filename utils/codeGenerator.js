const emailConfirmationCodeGenerator = (length = 20) => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

module.exports = emailConfirmationCodeGenerator;
