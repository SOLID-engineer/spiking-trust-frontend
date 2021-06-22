import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import { getSession, signIn } from 'next-auth/client';

import Layout from 'components/layout';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const Login = () => {
  const responseFacebook = async (data) => {
    if (data.accessToken) {
      await signIn('credentials-facebook', { facebook: data.accessToken });
    }
  };

  const responseGoogle = async (data) => {
    if (data.tokenId) {
      await signIn('credentials-google', { google: data.tokenId });
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto">
        <div className="py-8 flex flex-col items-center">
          <h1 className="text-xl lg:text-3xl font-bold mb-4">
            Read reviews. Write reviews. Find companies.
          </h1>
          <p className="mb-4">Log in or sign up below</p>
          <div className="w-96 text-center space-y-4">
            <FacebookLogin
              appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              render={(renderProps) => (
                <button
                  type="button"
                  onClick={renderProps.onClick}
                  className="py-3 bg-gray-600 text-white w-full font-semibold"
                >
                  Continue with Facebook
                </button>
              )}
            />

            <GoogleLogin
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <button
                  type="button"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="py-3 bg-gray-600 text-white w-full font-semibold"
                >
                  Continue with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              isSignedIn={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
