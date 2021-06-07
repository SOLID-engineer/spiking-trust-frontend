import axios from 'axios';
import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';

import Layout from '../../components/layout';
import AuthRoute from '../../components/routes/AuthRoute';
import { loginSuccess } from '../../slices/session';
import SessionSelector from '../../slices/session/selector';
import { wrapper } from '../../slices/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
  const session = SessionSelector.getSession(store.getState());
  if (session.isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {};
});

const Login = () => {
  const dispatch = useDispatch();
  const handleLogin = async (data) => {
    try {
      const response = await axios.post('/login', data);
      const { accessToken } = response.data;
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`;
      dispatch(loginSuccess({ accessToken }));
    } catch (error) {}
  };

  const responseFacebook = async (data) => {
    if (data.accessToken) {
      handleLogin({ facebook: data.accessToken });
    }
  };

  const responseGoogle = async (data) => {
    if (data.tokenId) {
      handleLogin({ google: data.tokenId });
    }
  };

  return (
    <AuthRoute>
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
    </AuthRoute>
  );
};

export default Login;
