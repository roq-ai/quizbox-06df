import * as yup from 'yup';

export const quizValidationSchema = yup.object().shape({
  subject: yup.string().required(),
  teacher_id: yup.string().nullable(),
});
