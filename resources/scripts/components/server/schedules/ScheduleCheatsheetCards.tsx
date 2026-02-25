import React from 'react';
import tw from 'twin.macro';

export default () => {
    return (
        <div css={tw`flex flex-col md:flex-row gap-6`}>
            {/* Examples */}
            <div
                css={tw`
                    md:w-1/2 h-full 
                    rounded-xl border border-neutral-700 
                    bg-[rgba(255,255,255,0.05)] backdrop-blur-md 
                    shadow-md overflow-hidden
                `}
            >
                <h2 css={tw`py-4 px-6 font-bold text-blue-300 border-b border-neutral-700`}>
                    Examples
                </h2>
                <div css={tw`flex flex-col text-sm`}>
                    <div css={tw`flex py-3 px-6 bg-[rgba(255,255,255,0.03)]`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>*/5 * * * *</div>
                        <div css={tw`w-1/2 text-neutral-300`}>every 5 minutes</div>
                    </div>
                    <div css={tw`flex py-3 px-6`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>0 */1 * * *</div>
                        <div css={tw`w-1/2 text-neutral-300`}>every hour</div>
                    </div>
                    <div css={tw`flex py-3 px-6 bg-[rgba(255,255,255,0.03)]`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>0 8-12 * * *</div>
                        <div css={tw`w-1/2 text-neutral-300`}>hour range</div>
                    </div>
                    <div css={tw`flex py-3 px-6`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>0 0 * * *</div>
                        <div css={tw`w-1/2 text-neutral-300`}>once a day</div>
                    </div>
                    <div css={tw`flex py-3 px-6 bg-[rgba(255,255,255,0.03)]`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>0 0 * * MON</div>
                        <div css={tw`w-1/2 text-neutral-300`}>every Monday</div>
                    </div>
                </div>
            </div>

            {/* Special Characters */}
            <div
                css={tw`
                    md:w-1/2 h-full 
                    rounded-xl border border-neutral-700 
                    bg-[rgba(255,255,255,0.05)] backdrop-blur-md 
                    shadow-md overflow-hidden
                `}
            >
                <h2 css={tw`py-4 px-6 font-bold text-green-300 border-b border-neutral-700`}>
                    Special Characters
                </h2>
                <div css={tw`flex flex-col text-sm`}>
                    <div css={tw`flex py-3 px-6 bg-[rgba(255,255,255,0.03)]`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>*</div>
                        <div css={tw`w-1/2 text-neutral-300`}>any value</div>
                    </div>
                    <div css={tw`flex py-3 px-6`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>,</div>
                        <div css={tw`w-1/2 text-neutral-300`}>value list separator</div>
                    </div>
                    <div css={tw`flex py-3 px-6 bg-[rgba(255,255,255,0.03)]`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>-</div>
                        <div css={tw`w-1/2 text-neutral-300`}>range values</div>
                    </div>
                    <div css={tw`flex py-3 px-6`}>
                        <div css={tw`w-1/2 font-mono text-neutral-200`}>/</div>
                        <div css={tw`w-1/2 text-neutral-300`}>step values</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
