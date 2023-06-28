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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getAnswerById, updateAnswerById } from 'apiSdk/answers';
import { Error } from 'components/error';
import { answerValidationSchema } from 'validationSchema/answers';
import { AnswerInterface } from 'interfaces/answer';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { OptionInterface } from 'interfaces/option';
import { getUsers } from 'apiSdk/users';
import { getOptions } from 'apiSdk/options';

function AnswerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AnswerInterface>(
    () => (id ? `/answers/${id}` : null),
    () => getAnswerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AnswerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAnswerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/answers');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AnswerInterface>({
    initialValues: data,
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
            Edit Answer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'answer',
  operation: AccessOperationEnum.UPDATE,
})(AnswerEditPage);
