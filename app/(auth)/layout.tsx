import Logo from '@/components/logo';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-screen py-[25px] px-[30px] bg-[#fafbfc] dark:bg-black'>
            <Logo />
            <div className='flex items-center justify-center w-full h-full'>
                <div className='flex flex-col items-center justify-center gap-y-[30px] min-w-[320px] w-full max-w-[580px] h-full'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
