import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
                username: { label: 'Username', type: 'text' },
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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
        signIn: async ({ user, account, profile }) => {
            // console.log("from sign in user first", user);
            // console.log("from sign in accoutn first", account);
            if (account?.provider === 'google') {
                const { id_token } = account;

                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/social/login/google/',
                        { access_token: id_token }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                    );


                    const access_token = response.data.key;
                    //console.log("Response from django (token)", response.data.key);

                    const userDataResponse = await axios.get('http://127.0.0.1:8000/api/user-data/', {
                        headers: {
                            Authorization: `Token ${access_token}`,
                        },
                    });

                    user.user_id = userDataResponse.data.user_id;
                    user.email = userDataResponse.data.email;
                    user.username = userDataResponse.data.username;
                    user.role = userDataResponse.data.role;
                    user.first_name = userDataResponse.data.first_name;
                    user.last_name = userDataResponse.data.last_name;
                    user.image = userDataResponse.data.image;
                    user.is_active = userDataResponse.data.is_active;
                    user.date_joined = userDataResponse.data.date_joined;
                    user.accessToken = access_token;
                    user.emailVerified = userDataResponse.data.email_verified;
                    user.accessToken = access_token;
                    console.log("Response from django", userDataResponse.data);

                    console.log("from sign in user", user);

                    return true;
                }
                catch (error) {
                    console.log(error);
                    return false;
                }
            }
            return true;

        },

        jwt: async ({ profile, account, user, token, trigger, session }) => {
            if (account) {
                // console.log("ACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCOUNT");
                // console.log(account);
                // console.log("USEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER");
                // console.log(user);
                token.accessToken = user.accessToken;
                token.role = user.role;
                token.email = user.email;
                token.user_id = user.user_id;
                token.first_name = user.first_name;
                token.last_name = user.last_name;
                token.image = user.image;
                token.is_active = user.is_active;
                token.username = user.username;
                token.emailVerified = user.emailVerified;
                console.log("ToooooooooKEN");
                console.log(token);

            }
            return token;

        },
        session: async ({ session, token }) => {
            // console.log("ssssssssssssssssssssssssssssession");
            // console.log(session);
            //add the id and role and all the other stuff to the session
            session.user.user_id = token.user_id!;
            session.user.email = token.email!;
            session.user.username = token.username!;
            session.user.role = token.role!;
            session.user.first_name = token.first_name!;
            session.user.last_name = token.last_name!;
            session.user.image = token.image!;
            session.user.is_active = token.is_active!;
            session.user.accessToken = token.accessToken!;
            session.user.emailVerified = token.emailVerified!;
            return session;
        }

    }
});
