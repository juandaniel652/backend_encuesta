import db from '../config/db.js';

export const findByEmail = async (email) => {
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
};

export const createUser = async (email, hashedPassword) => {
  return db.from('users').insert({
    email,
    password: hashedPassword
  });
};
