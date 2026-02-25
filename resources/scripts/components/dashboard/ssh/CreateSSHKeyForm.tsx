import React from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Input, { Textarea } from '@/components/elements/Input';
import styled from 'styled-components/macro';
import { useFlashKey } from '@/plugins/useFlash';
import { createSSHKey, useSSHKeys } from '@/api/account/ssh-keys';

interface Values {
    name: string;
    publicKey: string;
}

const CustomTextarea = styled(Textarea)`
    ${tw`h-32 rounded-lg shadow-md bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.15)] text-neutral-200 focus:(outline-none ring-2 ring-cyan-500)`};
`;

const CustomInput = styled(Input)`
    ${tw`rounded-lg shadow-md bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.15)] text-neutral-200 focus:(outline-none ring-2 ring-cyan-500)`};
`;

const CustomButton = styled(Button)`
    ${tw`px-6 py-2 rounded-lg shadow-md bg-cyan-600 hover:bg-cyan-500 text-white transition-all duration-200`};
`;

export default () => {
    const { clearAndAddHttpError } = useFlashKey('account');
    const { mutate } = useSSHKeys();

    const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearAndAddHttpError();

        createSSHKey(values.name, values.publicKey)
            .then((key) => {
                resetForm();
                mutate((data) => (data || []).concat(key));
            })
            .catch((error) => clearAndAddHttpError(error))
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{ name: '', publicKey: '' }}
            validationSchema={object().shape({
                name: string().required(),
                publicKey: string().required(),
            })}
        >
            {({ isSubmitting }) => (
                    <Form
                        className="
                            p-4 sm:p-6
                            rounded-xl shadow-md
                            bg-transparent border border-neutral-700
                            transition-all duration-300
                        "
                    >                    <SpinnerOverlay visible={isSubmitting} />
                    <FormikFieldWrapper label={'SSH Key Name'} name={'name'} css={tw`mb-6`}>
                        <Field name={'name'} as={CustomInput} />
                    </FormikFieldWrapper>
                    <FormikFieldWrapper
                        label={'Public Key'}
                        name={'publicKey'}
                        description={'Enter your public SSH key.'}
                    >
                        <Field name={'publicKey'} as={CustomTextarea} />
                    </FormikFieldWrapper>
                    <div css={tw`flex justify-end mt-6`}>
                        <CustomButton>Save</CustomButton>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
