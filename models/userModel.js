// models/userModel.js

// In-memory store; in real life swap this for a DB (Mongo, Postgres, etc.)
const users = [
    { id: "1", name: "Juan Pérez",  email: "juan@example.com",  phone: "3112688611", isVerified: false, verificationCode: null },
    { id: "2", name: "Maria Alcaraz", email: "maria@example.com", phone: "3112688610", isVerified: false, verificationCode: null }
  ];
  
  // Return all users
  const getAll = () => users;
  
  // Return one user by id
  const getById = id => users.find(u => u.id === id);
  

  const create = ({ name, email, phone }) => {
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      phone,
      isVerified: false,     
      verificationCode: null  
    };
    users.push(newUser);
    return newUser;
  };
  
  const update = (id, { name, email, phone }) => {
    const user = users.find(u => u.id === id);
    if (!user) return null;
  
    if (name  !== undefined) user.name  = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) {
      user.phone            = phone;
      user.isVerified       = false;      
      user.verificationCode = null;       
    }
  
    return user;
  };
  

  const remove = id => {
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    return users.splice(idx, 1)[0];
  };
  

  const setVerificationCode = (id, code) => {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    user.verificationCode = code;
    return user;
  };
  
  // Check code and mark verified
  const verifyCode = (id, code) => {
    const user = users.find(u => u.id === id);
    if (!user) return false;
    if (user.verificationCode === code) {
      user.isVerified       = true;
      user.verificationCode = null; 
      return true;
    }
    return false;
  };
  
  module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    setVerificationCode,
    verifyCode
  };
  