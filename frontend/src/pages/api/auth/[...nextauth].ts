import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';


export default NextAuth({

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    pages: {
        signIn: '/auth/login',
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('Attempting login:', credentials);

                try {
                    const response = await axios.post('http://127.0.0.1:8000/login/', credentials, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(response.data);
                    const userData = response.data;
                    console.log(userData);


                    if (response.status === 200 && userData) {
                         console.log('Authentication successful:', userData);
                        return userData;
                    }
                } catch (error) {
                        console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {

        jwt: async ({ profile, account, user, token, trigger, session }) => {
            if (account) {
                token.accessToken = account.access_token;
                token.role = user.role;
            }
            return token;

        },
        session: async ({ session, token }) => {
            //add the id and role and all the other stuff to the session
            session.user.email = token.email!;
            session.user.role = token.role!;

            return session;
        }

    }
});
