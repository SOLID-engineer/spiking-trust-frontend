import BusinessLayout from 'components/business-layout';
import React, { useState } from 'react';
import { readString } from 'react-papaparse';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().required().email(),
  name: yup.string().required(),
  referenceNumber: yup.string().required(),
});

const UploadServiceReviews = () => {
  const fileInput = React.useRef(null);
  const [fileName, setFileName] = useState(null);
  const [data, setData] = useState(null);

  const handleFileInputChange = async (e) => {
    const validLines = [];
    const invalidLines = [];
    let totalLines = 0;
    setFileName(e.target.files[0].name);
    const file = e.target.files[0];
    if (file) {
      const text = await new Response(file).text();
      const results = readString(text);
      totalLines = results.data.length;
      for (let index = 0; index < results.data.length; index += 1) {
        const row = {
          email: results.data[index][0],
          name: results.data[index][1],
          referenceNumber: results.data[index][2],
        };
        // eslint-disable-next-line no-await-in-loop
        const isValid = await schema.isValid(row);
        if (isValid) validLines.push(row);
        else invalidLines.push(row);
      }
      setData({
        validLines,
        invalidLines,
        totalLines,
      });
    }
  };

  return (
    <BusinessLayout pageTitle="Invite for service reviews">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white p-4 border">
          <h2 className="font-semibold text-lg mb-2">Upload a file with customer data</h2>
          <div className="mb-4">
            Upload a CSV file containing the data of customers you’d like to invite. The columns in
            the CSV file should contain: customer email, customer name and reference number (order
            ID, invoice ID, transaction ID, booking ID or similar).
          </div>
          <input
            type="file"
            ref={fileInput}
            className="hidden"
            accept=".csv, text/csv"
            onChange={handleFileInputChange}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
          {data !== null && data.validLines.length === 0 && (
            <div className="p-4 bg-red-200 mb-4">
              <p>The file you chose does not contain any valid lines.</p>
              <p>Please ensure the column order in the file is: Email, Name, Reference number.</p>
            </div>
          )}

          {data !== null && data.validLines.length === 0 && (
            <div className="p-4 bg-red-200 mb-4">
              <p>The file you chose does not contain any valid lines.</p>
              <p>Please ensure the column order in the file is: Email, Name, Reference number.</p>
            </div>
          )}
          <div
            className="flex justify-center items-center border border-dashed p-4"
            aria-hidden="true"
            role="button"
            onClick={() => {
              fileInput.current.click();
            }}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-800 rounded-full p-6 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-upload"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <div className="text-blue-600 text-center">{fileName || 'Select file'}</div>
            </div>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default UploadServiceReviews;
