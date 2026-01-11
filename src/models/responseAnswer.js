import db from '../config/db.js';

export const bulkInsert = async (responseId, answers) => {
  const payload = answers.map(a => ({
    response_id: responseId,
    question_id: a.questionId,
    option_text: a.option
  }));

  return db.from('response_answers').insert(payload);
};
