import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }
                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);
                setToken('');
                if (ref.current) ref.current.reset();
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'Login to Continue'}
                    css={tw`w-full flex flex-col bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-xl shadow-lg p-8`}
                >
                    <Field
                        light
                        type="text"
                        label="Username or Email"
                        name="username"
                        disabled={isSubmitting}
                        css={tw`rounded-md border border-[rgba(255,255,255,0.15)] focus:(border-cyan-500 ring-1 ring-cyan-500)`}
                    />
                    <div css={tw`mt-6`}>
                        <Field
                            light
                            type="password"
                            label="Password"
                            name="password"
                            disabled={isSubmitting}
                            css={tw`rounded-md border border-[rgba(255,255,255,0.15)] focus:(border-cyan-500 ring-1 ring-cyan-500)`}
                        />
                    </div>
                    <div css={tw`mt-6`}>
                        <Button
                            type="submit"
                            size="xlarge"
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                            css={tw`bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:(from-cyan-400 to-blue-500) transition-all duration-300`}
                        >
                            Login
                        </Button>
                    </div>
                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size="invisible"
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                    <div css={tw`mt-6 text-center`}>
                        <Link
                            to="/auth/password"
                            css={tw`text-xs text-neutral-400 tracking-wide no-underline uppercase hover:(text-cyan-400 underline) transition-colors duration-200`}
                        >
                            Forgot password?
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
