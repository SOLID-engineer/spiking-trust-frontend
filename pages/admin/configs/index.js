import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';
import { useFormik } from 'formik';
import axios from 'axios';
import { getSession } from 'next-auth/client';
import CKEditor from 'ckeditor4-react';
import toast from 'utils/toast';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default function AdminConfig() {
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values) => {
    try {
      await axios.post(`/admin/config/mail-invitation`, {
        template: values.template,
      });
      toast.success('Save config template mail invation success');
    } catch (error) {}
  };
  // config / mail - invitation;
  const formik = useFormik({
    initialValues: {
      template: '',
    },
    onSubmit: handleSubmit,
  });

  const getMailTemplate = async () => {
    setLoading(true);
    const response = await axios.get(`/admin/config/mail-invitation`);
    const { data } = response;
    formik.setValues({
      template: data.value,
    });
    setLoading(false);
  };

  useEffect(() => {
    getMailTemplate();
  }, []);

  return (
    <AdminLayout pageTitle="Create categories">
      <div className="md:w-2/3 mx-auto sm:px-6">
        <div className="bg-white px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto">
          <form onSubmit={formik.handleSubmit} className="md:flex flex-wrap -mx-3 mb-6">
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Template
              </label>
              <CKEditor
                name="template"
                data={formik.values.template}
                onChange={({ editor }) => {
                  const data = editor.getData();
                  formik.setFieldValue('template', data);
                }}
              />
            </div>
            <div className="md:w-full px-3 flex justify-end items-center pt-10">
              <button type="submit" className="h-10 w-36 text-sm font-sm bg-blue-500 text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
