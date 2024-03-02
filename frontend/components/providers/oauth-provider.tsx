'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const OauthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <GoogleOAuthProvider clientId='443406292396-6mcc3aul05f2jm7bu4nnbkcpil5llmbf.apps.googleusercontent.com'>
            {children}
        </GoogleOAuthProvider>
    );
};

export default OauthProvider;
