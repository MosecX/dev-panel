import React, { useState } from 'react';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';

export default () => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <EditSubuserModal
                visible={visible}
                onModalDismissed={() => setVisible(false)}
            />

            <button
                type="button"
                onClick={() => setVisible(true)}
                className="
                    px-6 py-2 rounded-lg border border-purple-400/40 
                    bg-[rgba(168,85,247,0.15)] backdrop-blur-md 
                    text-purple-300 font-semibold shadow-md 
                    transition transform hover:scale-105 
                    hover:border-purple-400 hover:text-purple-200 
                    disabled:opacity-50
                "
            >
                New User
            </button>
        </>
    );
};
