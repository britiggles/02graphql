const Twilio    = require("twilio");
const userModel = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();   
const accountSid = 'ACa418bf3ed4a3b7f324a44b1fab7a0b12';
const authToken = '13c931a26b65aedc59549ad2b4e28f5b';
const client = require('twilio')(accountSid, authToken);

const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const resolvers = {
  Query: {
    getUsers: ()    => userModel.getAll(),
    getUser: (_, { id }) => userModel.getById(id),
  },

  Mutation: {
    createUser: async (_, { name, email, phone }) => {
        // 1. Crear user
        const newUser = {
          id: uuidv4(),
          name,
          email,
          phone,
          isVerified: false,
          verificationCode: null,
        };
        const created = await userModel.create(newUser);
      
        // 2. Generar & almacenar código
        const code = generateVerificationCode();
        await userModel.setVerificationCode(created.id, code);
      
        // 3. Intentar enviar por WhatsApp
        const toWhatsApp = `whatsapp:+52${phone.replace(/^\+?52/, "")}`;
        let sent = false;
        let messageText = "";
      
        try {
          // Capturamos la respuesta de Twilio
          const msg = await client.messages
          .create({
            from: 'whatsapp:+14155238886',
              contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
              contentVariables: '{"1":"409173"}',
              to: 'whatsapp:+5213111636236'
          })
      
          // Mostramos toda la respuesta en consola
          console.log("Twilio message response:", msg);
      
          // Mark as sent if tenemos un SID
          if (msg && msg.sid) {
            sent = true;
            messageText = `Mensaje enviado correctamente (SID: ${msg.sid})`;
          } else {
            sent = false;
            messageText = "No se recibió SID de Twilio";
          }
        } catch (err) {
          console.error("Twilio error sending on createUser:", err);
          sent = false;
          messageText = `Error al enviar: ${err.message}`;
        }
      
        // 4. Devolver la respuesta compuesta
        return {
          user: created,
          sent,
          to: toWhatsApp,
          message: messageText,
        };
      },
      

    updateUser: async (_, { id, name, email, phone }) => {
      const existing = await userModel.getById(id);
      if (!existing) throw new Error("User not found");

      const updates = {};
      if (name ) updates.name  = name;
      if (email) updates.email = email;
      if (phone) {
        updates.phone            = phone;
        updates.isVerified       = false;
        updates.verificationCode = null;
      }

      return userModel.update(id, updates);
    },

    removeUser: (_, { id }) => userModel.remove(id),

    sendWhatsappVerification: async (_, { userId }) => {
      const user = await userModel.getById(userId);
      if (!user) return { success: false, message: "Usuario no encontrado" };

      const code = generateVerificationCode();
      await userModel.setVerificationCode(userId, code);

      try {
        await twilioClient.messages.create({
          from: "whatsapp:+14155238886",
          to:   'whatsapp:+523111636236',
          body: `Tu código de verificación es: ${code}`,
        });
        return { success: true, message: "Código enviado" };
      } catch (err) {
        console.error("Twilio error:", err);
        return { success: false, message: "Error al enviar código" };
      }
    },

    // (You should also add this)
    verifyWhatsappCode: async (_, { userId, code }) => {
      const ok = userModel.verifyCode(userId, code);
      return { success: ok, message: ok ? "Verificado" : "Código inválido" };
    }
  },
};

module.exports = resolvers;
