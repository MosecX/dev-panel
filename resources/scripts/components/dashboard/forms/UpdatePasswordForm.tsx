import React from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import * as Yup from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import updateAccountPassword from '@/api/account/updateAccountPassword';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import styled from 'styled-components/macro';

interface Values {
    current: string;
    password: string;
    confirmPassword: string;
}

const schema = Yup.object().shape({
    current: Yup.string().min(1).required('You must provide your current password.'),
    password: Yup.string().min(8).required(),
    confirmPassword: Yup.string().test(
        'password',
        'Password confirmation does not match the password you entered.',
        function (value) {
            return value === this.parent.password;
        }
    ),
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
    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    if (!user) {
        return null;
    }

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:password');
        updateAccountPassword({ ...values })
            .then(() => {
                // @ts-expect-error this is valid
                window.location = '/auth/login';
            })
            .catch((error) =>
                addFlash({
                    key: 'account:password',
                    type: 'error',
                    title: 'Error',
                    message: httpErrorToHuman(error),
                })
            )
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            validationSchema={schema}
            initialValues={{ current: '', password: '', confirmPassword: '' }}
        >
            {({ isSubmitting, isValid }) => (
                <>
                    <SpinnerOverlay size={'large'} visible={isSubmitting} />
                    <StyledForm>
                        <Field
                            id={'current_password'}
                            type={'password'}
                            name={'current'}
                            label={'Current Password'}
                        />
                        <div css={tw`mt-6`}>
                            <Field
                                id={'new_password'}
                                type={'password'}
                                name={'password'}
                                label={'New Password'}
                                description={
                                    'Your new password should be at least 8 characters in length and unique to this website.'
                                }
                            />
                        </div>
                        <div css={tw`mt-6`}>
                            <Field
                                id={'confirm_new_password'}
                                type={'password'}
                                name={'confirmPassword'}
                                label={'Confirm New Password'}
                            />
                        </div>
                        <div css={tw`mt-6 flex justify-end`}>
                            <StyledButton disabled={isSubmitting || !isValid}>Update Password</StyledButton>
                        </div>
                    </StyledForm>
                </>
            )}
        </Formik>
    );
};
