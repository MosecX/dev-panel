import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={200} classNames={'fade'} appear in>
            <>
                <ContentContainer
                    css={tw`my-6 sm:my-12 p-4 sm:p-6 rounded-xl shadow-2xl 
                            bg-[rgba(255,255,255,0.05)] backdrop-blur-md 
                            border border-[rgba(255,255,255,0.08)] transition-all duration-300`}
                    className={className}
                >
                    {showFlashKey && (
                        <FlashMessageRender
                            byKey={showFlashKey}
                            css={tw`mb-4`}
                        />
                    )}
                    {children}
                </ContentContainer>

                <ContentContainer css={tw`mb-6`}>
                    <p
                        css={tw`text-center text-neutral-400 text-xs`}
                        className="transition-colors duration-200 hover:text-neutral-200"
                    >
                        <a
                            rel="noopener nofollow noreferrer"
                            href="https://pterodactyl.io"
                            target="_blank"
                            css={tw`no-underline`}
                            className="text-neutral-400 hover:text-cyan-300 transition-colors duration-200"
                        >
                            Pterodactyl&reg;
                        </a>
                        &nbsp;&copy; 2015 - {new Date().getFullYear()} · Hecho con{' '}
                        <span className="animate-pulse text-red-500">❤️</span> por{' '}
                        <a
                            href="https://github.com/MosecX"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-cyan-300 transition-colors duration-200"
                        >
                            MosecX
                        </a>
                    </p>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
