import Image from 'next/image';
import React from 'react';

const Logo = () => {
    return (
        <div className='flex items-center'>
            <Image src='/logo.png' alt='Logo' width={40} height={40} />
            <h2 className='font-medium text-greenPrimary text-lg'>Mindnex</h2>
        </div>
    );
};

export default Logo;
