import supabase from '../config/db.js';

export const findOrCreate = async (clientNumber, clientName) => {
  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('client_number', clientNumber)
    .single();

  if (data) return data;

  const { data: created } = await supabase
    .from('clients')
    .insert({ client_number: clientNumber, client_name: clientName })
    .select()
    .single();

  return created;
};
