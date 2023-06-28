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
import { createOption } from 'apiSdk/options';
import { Error } from 'components/error';
import { optionValidationSchema } from 'validationSchema/options';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { QuestionInterface } from 'interfaces/question';
import { getQuestions } from 'apiSdk/questions';
import { OptionInterface } from 'interfaces/option';

function OptionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OptionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOption(values);
      resetForm();
      router.push('/options');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OptionInterface>({
    initialValues: {
      text: '',
      question_id: (router.query.question_id as string) ?? null,
    },
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
            Create Option
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'option',
  operation: AccessOperationEnum.CREATE,
})(OptionCreatePage);
