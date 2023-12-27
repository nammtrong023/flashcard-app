import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='min-h-screen h-full max-w-[1440px] w-full'>
            <main className='h-fit pt-10 pb-24'>{children}</main>
        </div>
    );
};

export default MainLayout;
