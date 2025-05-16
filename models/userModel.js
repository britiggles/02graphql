const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const accountSid = "AC96cd6a89f62567786181d7335e13e175";
const authToken = "5f814fe7be217b5ccec696ff2f7dc14d";
const client = require("twilio")(accountSid, authToken);
require("dotenv").config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const users = [
    { id: "1", name: "Juan Pérez",  email: "juan@example.com",  phone: "3112688611", code: 2454, isVerified: false, verificationCode: null },
    { id: "2", name: "Maria Alcaraz", email: "maria@example.com", phone: "3112688610", code: 2345, isVerified: false, verificationCode: null }
  ];
  
async function registerUser({ name, email, phone }) {
  if (!emailRegex.test(email)) {
    return { success: false, message: "El email no es válido" };
  }
  const id = uuidv4();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const user = { id, name, email, phone, code, isVerified: false };
  users.push(user);

  console.log(`Sending WhatsApp message to: ${to}`);

  const response = await client.messages.create({
    from: "whatsapp:+14155238886",
    contentSid: "HX229f5a04fd0510ce1b071852155d3e75",
    contentVariables: JSON.stringify({ 1: code }),
    to: "whatsapp:" + phone,
  });
  console.log("Response: ", response);
  return {
    success: true,
    message: "Usuario registrado. Se ha enviado el codigo de verificacion.",
    user,
  };
}

async function verifyCode({ userId, code }) {
  const user = users.find((user) => user.id === userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  if (user.code !== code) {
    throw new Error("Codigo invalido");
  }
  user.isVerified = true;
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    success: true,
    message: "Se ha verificado el usuario.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
    },
  };
}

async function login({ email }) {
  const user = users.find((user) => user.email === email);
  if (!user) {
    return {
      success: false,
      message: "Usuario no encontrado.",
      token: null,
      user: null,
    };
  }
  if ((user.isVerified = false)) {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.code = newCode;
    await client.messages.create({
      from: "whatsapp:+14155238886",
      contentSid: "HX229f5a04fd0510ce1b071852155d3e75",
      contentVariables: JSON.stringify({ 1: code }),
      to: "whatsapp:" + phone,
    });
    return {
      success: false,
      message: "El usuario no está verificado. Se ha enviado un nuevo código.",
      token: null,
      user,
    };
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { success: true, message: "Login exitoso", token, user };
}

module.exports = {
  registerUser,
  verifyCode,
  login,
};
