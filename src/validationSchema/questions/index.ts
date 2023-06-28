import * as yup from 'yup';

export const questionValidationSchema = yup.object().shape({
  text: yup.string().required(),
  quiz_id: yup.string().nullable(),
});
