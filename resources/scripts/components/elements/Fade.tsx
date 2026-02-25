import React from 'react';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import CSSTransition, { CSSTransitionProps } from 'react-transition-group/CSSTransition';

interface Props extends Omit<CSSTransitionProps, 'timeout' | 'classNames'> {
    timeout: number;
}

const Container = styled.div<{ timeout: number }>`
    .fade-enter,
    .fade-exit,
    .fade-appear {
        will-change: opacity, transform;
    }

    .fade-enter,
    .fade-appear {
        ${tw`opacity-0 translate-y-2 scale-95`};

        &.fade-enter-active,
        &.fade-appear-active {
            ${tw`opacity-100 translate-y-0 scale-100 transition-all ease-out`};
            transition-duration: ${(props) => props.timeout}ms;
        }
    }

    .fade-exit {
        ${tw`opacity-100 translate-y-0 scale-100`};

        &.fade-exit-active {
            ${tw`opacity-0 translate-y-2 scale-95 transition-all ease-in`};
            transition-duration: ${(props) => props.timeout}ms;
        }
    }
`;

const Fade: React.FC<Props> = ({ timeout, children, ...props }) => (
    <Container timeout={timeout}>
        <CSSTransition timeout={timeout} classNames={'fade'} {...props}>
            {children}
        </CSSTransition>
    </Container>
);

Fade.displayName = 'Fade';

export default Fade;
