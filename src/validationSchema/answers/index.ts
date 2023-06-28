import * as yup from 'yup';

export const answerValidationSchema = yup.object().shape({
  student_id: yup.string().nullable(),
  option_id: yup.string().nullable(),
});
