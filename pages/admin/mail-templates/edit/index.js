import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from 'components/admin';
import { TEMPLATE_TYPE } from 'contants/template';
import { useFormik } from 'formik';
import axios from 'axios';
import router from 'next/router';
import { getSession } from 'next-auth/client';

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

export default function AdminTemplateCreate() {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`/admin/mail-templates`, {
        subject: values.subject,
        content: values.content,
        type: values.type,
        name: values.name,
        is_primary: values.is_primary,
      });
      const { data } = response;

      if (data) router.push({ pathname: '/admin/mail-templates' }, undefined, { shallow: true });
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      subject: '',
      type: '',
      name: '',
      content: '',
      is_primary: false,
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);
  return (
    <AdminLayout pageTitle="Create categories">
      <div className="md:w-2/3 mx-auto sm:px-6">
        <div className="bg-white px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto">
          <form onSubmit={formik.handleSubmit} className="md:flex flex-wrap -mx-3 mb-6">
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Name
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>

            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Subject
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
              />
            </div>

            <div className="md:w-full px-3 mb-6">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Type mail
              </label>
              <div className="relative">
                <select
                  name="type"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.type}
                  className="block appearance-none w-full bg-grey-lighter text-xs border border-grey-lighter text-grey-darker p-2 pr-8 rounded"
                >
                  <option value="">Select type mail...</option>
                  {Object.entries(TEMPLATE_TYPE).map((item) => {
                    const key = item[0];
                    const value = item[1];
                    return (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="md:w-full px-3 mb-6">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2 flex">
                <div className="relative mr-2">
                  <input
                    type="checkbox"
                    name="is_primary"
                    onChange={formik.handleChange}
                    value={1}
                  />
                </div>
                <span>Primary</span>
              </label>
            </div>

            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Content
              </label>
              {editorLoaded && (
                <CKEditor
                  name="content"
                  editor={ClassicEditor}
                  data={formik.values.content}
                  onReady={(editor) => {
                    editor.editing.view.change((writer) => {
                      writer.setStyle('height', '400px', editor.editing.view.document.getRoot());
                    });
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    formik.setFieldValue('content', data);
                  }}
                />
              )}
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
