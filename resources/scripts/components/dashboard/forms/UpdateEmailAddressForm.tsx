import React from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Field from '@/components/elements/Field';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import styled from 'styled-components/macro';

interface Values {
    email: string;
    password: string;
}

const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required('You must provide your current account password.'),
});

const StyledForm = styled(Form)`
    ${tw`
        m-0 p-4 sm:p-6
        rounded-xl shadow-lg
        bg-[rgba(255,255,255,0.05)] backdrop-blur-md
        border border-[rgba(255,255,255,0.15)]
        transition-all duration-300
    `}
`;

const StyledButton = styled(Button)`
    ${tw`
        px-6 py-2 rounded-lg shadow-md
        bg-cyan-600 hover:bg-cyan-500 text-white
        transition-all duration-200
    `}
`;

export default () => {
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const updateEmail = useStoreActions((state: Actions<ApplicationStore>) => state.user.updateUserEmail);

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = (values: Values, { resetForm, setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:email');

        updateEmail({ ...values })
            .then(() =>
                addFlash({
                    type: 'success',
                    key: 'account:email',
                    message: 'Your primary email has been updated.',
                })
            )
            .catch((error) =>
                addFlash({
                    type: 'error',
                    key: 'account:email',
                    title: 'Error',
                    message: httpErrorToHuman(error),
                })
            )
            .then(() => {
                resetForm();
                setSubmitting(false);
            });
    };

    return (
        <Formik onSubmit={submit} validationSchema={schema} initialValues={{ email: user!.email, password: '' }}>
            {({ isSubmitting, isValid }) => (
                <>
                    <SpinnerOverlay size={'large'} visible={isSubmitting} />
                    <StyledForm>
                        <Field id={'current_email'} type={'email'} name={'email'} label={'Email'} />
                        <div css={tw`mt-6`}>
                            <Field
                                id={'confirm_password'}
                                type={'password'}
                                name={'password'}
                                label={'Confirm Password'}
                            />
                        </div>
                        <div css={tw`mt-6 flex justify-end`}>
                            <StyledButton disabled={isSubmitting || !isValid}>Update Email</StyledButton>
                        </div>
                    </StyledForm>
                </>
            )}
        </Formik>
    );
};
