import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${tw`flex flex-col items-center justify-center min-h-screen px-4`};

    ${breakpoint('sm')`
        ${tw`px-6`}
    `};

    ${breakpoint('md')`
        ${tw`px-10`}
    `};
`;

const Card = styled.div`
    ${tw`
        w-full
        rounded-2xl
        shadow-2xl
        overflow-hidden
        transition-all duration-300
    `};

    max-width: 720px;
    background: linear-gradient(
        to bottom right,
        rgba(15, 23, 42, 0.85),
        rgba(30, 41, 59, 0.85)
    );
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
`;

const Header = styled.h2`
    ${tw`text-4xl text-center font-bold tracking-wide py-8 text-white`};
`;

const Body = styled.div`
    ${tw`flex flex-col md:flex-row items-center gap-8 px-8 pb-10`};
`;

const Logo = styled.img`
    ${tw`w-40 md:w-56 opacity-90 mx-auto`};
`;

const FormSection = styled.div`
    ${tw`flex-1 w-full`};
`;

const Footer = styled.p`
    ${tw`text-center text-neutral-400 text-xs mt-6`};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        <Card>
            {title && <Header>{title}</Header>}
            <FlashMessageRender css={tw`mb-4 px-2`} />
            <Form {...props} ref={ref}>
                <Body>
                    <Logo src={'/assets/svgs/pterodactyl.svg'} alt="Logo" />
                    <FormSection>{props.children}</FormSection>
                </Body>
            </Form>
        </Card>
        <Footer>
            Hecho con ❤️ por MosecX &nbsp;|&nbsp; © 2015 - {new Date().getFullYear()}&nbsp;
            <a
                rel="noopener nofollow noreferrer"
                href="https://pterodactyl.io"
                target="_blank"
                css={tw`no-underline text-neutral-400 hover:text-cyan-400 transition-colors duration-200`}
            >
                Pterodactyl Software
            </a>
        </Footer>
    </Container>
));
