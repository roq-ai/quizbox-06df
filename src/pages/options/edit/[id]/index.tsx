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
import { getOptionById, updateOptionById } from 'apiSdk/options';
import { Error } from 'components/error';
import { optionValidationSchema } from 'validationSchema/options';
import { OptionInterface } from 'interfaces/option';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { QuestionInterface } from 'interfaces/question';
import { getQuestions } from 'apiSdk/questions';

function OptionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OptionInterface>(
    () => (id ? `/options/${id}` : null),
    () => getOptionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OptionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOptionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/options');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OptionInterface>({
    initialValues: data,
    validationSchema: optionValidationSchema,
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
            Edit Option
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
            <FormControl id="text" mb="4" isInvalid={!!formik.errors?.text}>
              <FormLabel>Text</FormLabel>
              <Input type="text" name="text" value={formik.values?.text} onChange={formik.handleChange} />
              {formik.errors.text && <FormErrorMessage>{formik.errors?.text}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<QuestionInterface>
              formik={formik}
              name={'question_id'}
              label={'Select Question'}
              placeholder={'Select Question'}
              fetcher={getQuestions}
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
  entity: 'option',
  operation: AccessOperationEnum.UPDATE,
})(OptionEditPage);
