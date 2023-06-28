import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createQuiz } from 'apiSdk/quizzes';
import { Error } from 'components/error';
import { quizValidationSchema } from 'validationSchema/quizzes';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { QuizInterface } from 'interfaces/quiz';

function QuizCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: QuizInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createQuiz(values);
      resetForm();
      router.push('/quizzes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<QuizInterface>({
    initialValues: {
      subject: '',
      teacher_id: (router.query.teacher_id as string) ?? null,
    },
    validationSchema: quizValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Quiz
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="subject" mb="4" isInvalid={!!formik.errors?.subject}>
            <FormLabel>Subject</FormLabel>
            <Input type="text" name="subject" value={formik.values?.subject} onChange={formik.handleChange} />
            {formik.errors.subject && <FormErrorMessage>{formik.errors?.subject}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'teacher_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'quiz',
  operation: AccessOperationEnum.CREATE,
})(QuizCreatePage);
