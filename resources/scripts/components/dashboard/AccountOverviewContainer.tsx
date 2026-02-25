import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
    ${tw`flex flex-wrap gap-6`};

    & > div {
        ${tw`w-full rounded-xl shadow-md bg-transparent border-none transition-all duration-300`};

        ${breakpoint('sm')`
            width: calc(50% - 0.75rem);
        `}

        ${breakpoint('lg')`
            ${tw`w-auto flex-1`};
        `}
    }
`;

export default () => {
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();

    return (
        <PageContentBlock
            title={'Account Overview'}
            className="p-4 sm:p-6 rounded-xl shadow-md bg-transparent border-none"
        >
            {state?.twoFactorRedirect && (
                <MessageBox title={'2-Factor Required'} type={'error'}>
                    Your account must have two-factor authentication enabled in order to continue.
                </MessageBox>
            )}

            <Container
                css={[
                    tw`lg:grid lg:grid-cols-3 mb-10`,
                    state?.twoFactorRedirect ? tw`mt-4` : tw`mt-10`,
                ]}
            >
                <ContentBox title={'Update Password'} showFlashes={'account:password'}>
                    <UpdatePasswordForm />
                </ContentBox>
                <ContentBox title={'Update Email Address'} showFlashes={'account:email'}>
                    <UpdateEmailAddressForm />
                </ContentBox>
                <ContentBox title={'Two-Step Verification'}>
                    <ConfigureTwoFactorForm />
                </ContentBox>
            </Container>
        </PageContentBlock>
    );
};
