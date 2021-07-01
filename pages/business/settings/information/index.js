import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { useFormik } from 'formik';

import BusinessSelector from 'slices/business/selector';
import BusinessLayout from 'components/business-layout';
import { getSession } from 'next-auth/client';
import withCompany from 'components/hocs/withCompany';
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

const Information = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [company, setCompany] = useState(currentCompany);
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
  const logoFileInput = React.useRef(null);

  const handleLogoFileInputChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      const response = await axios.post(`/business/${currentCompany.domain}/logo`, formData);
      setCompany(response.data);
    } catch (error) {}
  };

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
      toast.success('Saved Successfully!');
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
      toast.success('Saved Successfully!');
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
      setCompany(response.data);
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

  const infoForm = useFormik({
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
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Logo:</label>
                    <div className="flex flex-row space-x-4">
                      <div>
                        <input
                          type="file"
                          ref={logoFileInput}
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoFileInputChange}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                        <button
                          type="button"
                          className="border py-2 w-64 font-semibold"
                          onClick={() => {
                            logoFileInput.current.click();
                          }}
                        >
                          Upload company logo
                        </button>
                      </div>
                      {company.profile_image && (
                        <div className="w-48 bg-gray-100 p-4">
                          <img
                            src={`${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/${company.profile_image}`}
                          />
                        </div>
                      )}
                    </div>
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
            <div className="bg-white">
              <form onSubmit={infoForm.handleSubmit}>
                <div className="p-4">
                  <h2 className="font-semibold mb-4">Contact information</h2>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Company name:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="companyName"
                      onChange={infoForm.handleChange}
                      onBlur={infoForm.handleBlur}
                      value={infoForm.values.companyName}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Email:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="email"
                      onChange={infoForm.handleChange}
                      onBlur={infoForm.handleBlur}
                      value={infoForm.values.email}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Telephone:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="telephone"
                      onChange={infoForm.handleChange}
                      onBlur={infoForm.handleBlur}
                      value={infoForm.values.telephone}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Street address:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="streetAddress"
                      onChange={infoForm.handleChange}
                      onBlur={infoForm.handleBlur}
                      value={infoForm.values.streetAddress}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Post-zip code:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="zipCode"
                      onChange={infoForm.handleChange}
                      onBlur={infoForm.handleBlur}
                      value={infoForm.values.zipCode}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">City:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="city"
                      onChange={infoForm.handleChange}
                      onBlur={infoForm.handleBlur}
                      value={infoForm.values.city}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Country:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 w-full"
                      name="country"
                      onChange={infoForm.handleChange}
                      onBlur={infoForm.handleBlur}
                      value={infoForm.values.country}
                    />
                  </div>
                </div>
                <div className="text-right p-4 flex flex-row justify-end space-x-4 border-t">
                  <button
                    type="button"
                    className="border py-2 px-3"
                    onClick={infoForm.handleReset}
                    disabled={isEmpty(infoForm.touched)}
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
          </div>
        )}
      </BusinessLayout>
    </>
  );
};

export default withCompany(Information);
