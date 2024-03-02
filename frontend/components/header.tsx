import React from 'react';
import Logo from './logo';
import { DropdownMenuProfile } from './dropdown/dropdown-profile';
import Link from 'next/link';

const Header = () => {
    return (
        <div className='bg-white fixed top-0 h-[60px] w-full p-3 px-5 z-40'>
            <div className='flex items-center justify-between'>
                <Link href='/'>
                    <Logo />
                </Link>
                <DropdownMenuProfile />
            </div>
        </div>
    );
};

export default Header;
