import axios from 'axios';
import AdminLayout from 'components/admin';
import { TEMPLATE_TYPE } from 'contants/template';
import { useFormik } from 'formik';
import { getSession } from 'next-auth/client';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { id } = context.params;
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: { template_id: id } };
};

export default function AdminTemplateEdit({ template_id }) {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  const handleSubmit = async (values) => {
    try {
      const response = await axios.put(`/admin/mail-templates/${template_id}`, {
        title: values.title,
        content: values.content,
        type: values.type,
        name: values.name,
      });
      const { data } = response;

      if (data) router.push({ pathname: '/admin/mail-templates' }, undefined, { shallow: true });
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    onSubmit: handleSubmit,
  });

  const getMailTemplate = async () => {
    const response = await axios.get(`/admin/mail-templates/${template_id}/edit`);
    const { data } = response;
    formik.setValues({
      name: data.name,
      content: data.content,
      title: data.title,
      type: data.type,
    });
  };

  useEffect(() => {
    getMailTemplate();
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
                Title
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
            </div>

            <div className="md:w-full px-3 mb-6">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Parent Category
              </label>
              <div className="relative">
                <select
                  name="type"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.type}
                  className="block appearance-none w-full bg-grey-lighter text-xs border border-grey-lighter text-grey-darker p-2 pr-8 rounded"
                >
                  <option value="">Select parent category...</option>
                  {Object.entries(TEMPLATE_TYPE).map((item) => {
                    const key = item[0];
                    const value = item[1];
                    return <option value={key}>{value}</option>;
                  })}
                </select>
              </div>
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
                  config={{
                    toolbar: [
                      'heading',
                      '|',
                      'bold',
                      'italic',
                      '|',
                      'colors',
                      'blockQuote',
                      'link',
                      'numberedList',
                      'bulletedList',
                      'imageUpload',
                      'insertTable',
                      'tableColumn',
                      'tableRow',
                      'mergeTableCells',
                      'mediaEmbed',
                      '|',
                      'undo',
                      'redo',
                    ],
                  }}
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
