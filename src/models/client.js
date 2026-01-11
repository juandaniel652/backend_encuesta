import db from '../config/db.js';

export const findOrCreate = async (clientNumber, clientName) => {
  const { data } = await db
    .from('clients')
    .select('*')
    .eq('client_number', clientNumber)
    .single();

  if (data) return data;

  const { data: created } = await db
    .from('clients')
    .insert({ client_number: clientNumber, client_name: clientName })
    .select()
    .single();

  return created;
};
