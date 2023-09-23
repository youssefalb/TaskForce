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
                    const userData = response.data;

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
                token.email = user.email;
                token.user_id = user.user_id;
                token.first_name = user.first_name;
                token.last_name = user.last_name;
                token.image = user.image;
                token.is_active = user.is_active;
                console.log('this is user data from jwt function', user);
                console.log('this is token data from jwt function', token);
            }
            return token;

        },
        session: async ({ session, token }) => {
            //add the id and role and all the other stuff to the session
            session.user.user_id = token.user_id!;
            session.user.email = token.email!;
            session.user.role = token.role!;
            session.user.first_name = token.first_name!;
            session.user.last_name = token.last_name!;
            session.user.image = token.image!;
            session.user.is_active = token.is_active!;
            console.log('this is session data from session function', session);
            return session;
        }

    }
});
