import React from 'react';
import Header from './header';

const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <div className='max-w-6xl mt-16 px-10'>{children}</div>
        </>
    );
};

export default Container;
