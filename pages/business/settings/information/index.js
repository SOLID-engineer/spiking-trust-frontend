import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { useFormik } from 'formik';

import BusinessSelector from 'slices/business/selector';
import BusinessLayout from 'components/business-layout';
import { getSession } from 'next-auth/client';
import InformationForm from './InformationForm';

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

const Information = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [isLoading, setIsLoading] = useState(false);
  const [aboutFormInitialValues, setAboutFormInitialValues] = useState({
    companyName: '',
    companyWebsite: '',
    description: '',
  });
  const [informationFormInitialValues, setInformationFormInitialValues] = useState({
    companyName: '',
    email: '',
    telephone: '',
    streetAddress: '',
    zipCode: '',
    city: '',
    country: '',
  });

  const handleAboutFormSubmit = async (values) => {
    try {
      const response = await axios.patch(`/business/companies/${currentCompany.domain}`, {
        name: values.companyName,
        description: values.description,
      });
      setAboutFormInitialValues({
        companyName: response.data.name,
        companyWebsite: response.data.domain,
        description: response.data.description,
      });
    } catch (error) {}
  };

  const handleInformationFormSubmit = async (values) => {
    try {
      const response = await axios.patch(`/business/company-information/${currentCompany.domain}`, {
        company_name: values.companyName,
        email: values.email,
        telephone: values.telephone,
        street_address: values.streetAddress,
        zip_code: values.zipCode,
        city: values.city,
        country: values.country,
      });
      setInformationFormInitialValues({
        companyName: response.data.company_name,
        email: response.data.email,
        telephone: response.data.telephone,
        streetAddress: response.data.street_address,
        zipCode: response.data.zip_code,
        city: response.data.city,
        country: response.data.country,
      });
    } catch (error) {}
  };

  const getCompany = async () => {
    try {
      const response = await axios.get(`/business/companies/${currentCompany.domain}`);
      setAboutFormInitialValues({
        companyName: response.data.name,
        companyWebsite: response.data.domain,
        description: response.data.description,
      });
    } catch (error) {}
  };

  const getCompanyInformation = async () => {
    try {
      const response = await axios.get(`/business/company-information/${currentCompany.domain}`);
      if (!isEmpty(response.data)) {
        setInformationFormInitialValues({
          companyName: response.data.company_name,
          email: response.data.email,
          telephone: response.data.telephone,
          streetAddress: response.data.street_address,
          zipCode: response.data.zip_code,
          city: response.data.city,
          country: response.data.country,
        });
      } else {
        setInformationFormInitialValues({
          companyName: '',
          email: '',
          telephone: '',
          streetAddress: '',
          zipCode: '',
          city: '',
          country: '',
        });
      }
    } catch (error) {}
  };

  const aboutForm = useFormik({
    enableReinitialize: true,
    initialValues: aboutFormInitialValues,
    onSubmit: handleAboutFormSubmit,
  });

  const informationForm = useFormik({
    enableReinitialize: true,
    initialValues: informationFormInitialValues,
    onSubmit: handleInformationFormSubmit,
  });

  useEffect(() => {
    if (currentCompany !== null) {
      getCompany();
      getCompanyInformation();
    }
  }, [currentCompany]);

  return (
    <>
      <BusinessLayout pageTitle={`Profile page: ${currentCompany?.domain}`}>
        {currentCompany !== null && (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="bg-white">
              <form onSubmit={aboutForm.handleSubmit}>
                <div className="p-4">
                  <h2 className="font-semibold mb-4">About company</h2>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Company name:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="companyName"
                      onChange={aboutForm.handleChange}
                      onBlur={aboutForm.handleBlur}
                      value={aboutForm.values.companyName}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Company website:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="companyWebsite"
                      onChange={aboutForm.handleChange}
                      onBlur={aboutForm.handleBlur}
                      value={aboutForm.values.companyWebsite}
                      disabled
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Description:</label>
                    <textarea
                      rows={5}
                      className="border px-3 py-2 w-full resize-none"
                      name="description"
                      onChange={aboutForm.handleChange}
                      onBlur={aboutForm.handleBlur}
                      value={aboutForm.values.description}
                    ></textarea>
                  </div>
                </div>
                <div className="text-right p-4 flex flex-row justify-end space-x-4 border-t">
                  <button
                    type="button"
                    className="border py-2 px-3"
                    onClick={aboutForm.handleReset}
                    disabled={isEmpty(aboutForm.touched)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="border py-2 px-3 bg-indigo-600 text-white border-indigo-800"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
            <InformationForm form={informationForm} />
          </div>
        )}
      </BusinessLayout>
    </>
  );
};

export default Information;
