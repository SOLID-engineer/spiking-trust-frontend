import axios from 'axios';
import React from 'react';

export async function getServerSideProps(context) {
  await axios.get('http://google.com');
  return {
    props: { isLoggedIn: true },
  };
}

const Settings = (props) => {
  return <div>Settings</div>;
};

export default Settings;
