import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';
import axios from 'axios';
import { useFormik } from 'formik';

export default function MailConfig() {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('/admin/settings/mail-settings', {
        mail_server: values.mail_server,
        port: values.port,
        username: values.username,
        password: values.password,
        encryption: values.encryption,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      mail_server: '',
      port: '',
      username: '',
      password: '',
      encryption: 'none',
    },
    onSubmit: handleSubmit,
  });

  const getSetting = async () => {
    const response = await axios.get('/admin/settings/mail-settings');
    const { data } = response;
    formik.setValues({
      mail_server: data.MAIL_HOST,
      port: data.MAIL_PORT,
      username: data.MAIL_USERNAME,
      password: data.MAIL_PASSWORD,
      encryption: data.MAIL_ENCRYPTION || 'none',
    });
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <AdminLayout pageTitle="Mail Configuration">
      <div className="w-full sm:px-6">
        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto rounded-md">
          <form onSubmit={formik.handleSubmit} className="md:flex flex-wrap -mx-3 mb-6">
            <div className="md:w-2/3 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                SMTP Mail Server
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="mail_server"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mail_server}
              />
            </div>
            <div className="md:w-2/3 px-3">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                SMTP Mail Port
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="number"
                name="port"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.port}
              />
            </div>

            <div className="md:w-2/3 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                SMTP Mail Username
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
            </div>
            <div className="md:w-2/3 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                SMTP Mail Password
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            <div className="md:w-2/3 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                SMTP Mail Encryption
              </label>
              <select
                name="encryption"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.encryption}
                className="block appearance-none w-full bg-grey-lighter text-xs border border-grey-lighter text-grey-darker p-2 pr-8 rounded"
              >
                <option value="none">None</option>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
              </select>
            </div>
            <div className="md:w-2/3 px-3 flex justify-end items-center pt-10">
              <button type="submit" className="h-10 w-36 rounded font-xs bg-blue-500 text-white">
                Save Mail Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
