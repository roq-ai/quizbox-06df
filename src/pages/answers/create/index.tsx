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
import { createAnswer } from 'apiSdk/answers';
import { Error } from 'components/error';
import { answerValidationSchema } from 'validationSchema/answers';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { OptionInterface } from 'interfaces/option';
import { getUsers } from 'apiSdk/users';
import { getOptions } from 'apiSdk/options';
import { AnswerInterface } from 'interfaces/answer';

function AnswerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AnswerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAnswer(values);
      resetForm();
      router.push('/answers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AnswerInterface>({
    initialValues: {
      student_id: (router.query.student_id as string) ?? null,
      option_id: (router.query.option_id as string) ?? null,
    },
    validationSchema: answerValidationSchema,
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
            Create Answer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'student_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<OptionInterface>
            formik={formik}
            name={'option_id'}
            label={'Select Option'}
            placeholder={'Select Option'}
            fetcher={getOptions}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.text}
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
  entity: 'answer',
  operation: AccessOperationEnum.CREATE,
})(AnswerCreatePage);
