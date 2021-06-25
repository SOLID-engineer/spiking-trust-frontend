/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import BusinessLayout from 'components/business-layout';
import Spinner from 'components/common/Spinner';
import withCompany from 'components/hocs/withCompany';
import { useFormik } from 'formik';
import useCKEditor from 'hooks/useCKEditor';
import { find } from 'lodash';
import React, { useEffect, useState } from 'react';
import { readString } from 'react-papaparse';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';
import * as Yup from 'yup';
import SelectTemplateModal from './SelectTemplateModal';

const schema = Yup.object().shape({
  consumerEmail: Yup.string().required().email(),
  consumerName: Yup.string().required(),
  referenceNumber: Yup.string().required(),
});

const UploadServiceReviews = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const fileInput = React.useRef(null);
  const [fileName, setFileName] = useState(null);
  const [data, setData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const { CKEditor, ClassicEditor, isEditorLoaded } = useCKEditor();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSelectTemplateModalVisible, setIsSelectTemplateModalVisible] = useState(false);

  const handleFileInputChange = async (e) => {
    setIsUploading(true);
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
          consumerEmail: results.data[index][0],
          consumerName: results.data[index][1],
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
      setIsUploading(false);
      if (totalLines.length > 0 && totalLines.length === validLines.length) {
        setStep((prevState) => prevState + 1);
      }
    }
  };

  const senderInformationForm = useFormik({
    initialValues: {
      senderName: currentCompany.domain,
      replyTo: 'hello@abc.com',
    },
    validationSchema: Yup.object({
      senderName: Yup.string().required(),
      replyTo: Yup.string().email().required(),
    }),
  });

  const templateForm = useFormik({
    initialValues: {
      name: '',
      subject: '',
      content: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      subject: Yup.string().required(),
      content: Yup.string().required(),
    }),
  });

  const handleSendInvitations = async () => {
    setStep((prevState) => prevState + 1);
    const invitations = [];
    data.validLines.forEach((line) => {
      invitations.push(line);
    });
    try {
      await axios.post(`/business/${currentCompany.domain}/invitations/email-invitations-bulk`, {
        ...senderInformationForm.values,
        templateId: selectedTemplate.uuid,
        invitations,
      });
      setStep((prevState) => prevState + 1);
    } catch (error) {}
  };

  const handleSelectTemplate = async (uuid) => {
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/templates/${uuid}`);
      const template = response.data;
      setSelectedTemplate(template);
      templateForm.setValues({
        name: template.name,
        subject: template.subject,
        content: template.content,
      });
    } catch (error) {}
  };

  const getTemplates = async () => {
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/templates`, {
        params: { type: 'service_review_invitation' },
      });
      setTemplates(response.data);
      if (selectedTemplate === null) {
        const defaultTemplate = find(response.data, { is_default: 1 });
        if (defaultTemplate !== undefined) handleSelectTemplate(defaultTemplate.uuid);
      }
    } catch (error) {}
  };

  const toggleSelectTemplateModalVisible = () => {
    setIsSelectTemplateModalVisible((prevState) => !prevState);
  };

  useEffect(() => {
    getTemplates();
  }, []);

  return (
    <BusinessLayout pageTitle="Invite for service reviews">
      <div className="w-full max-w-6xl mx-auto">
        <ol className="invitation-progress">
          <li className={step < 3 ? 'current' : 'done'}>
            <span className="step">1</span>
            &nbsp;
            <span className="label">Add invites</span>
          </li>
          <li className={`${step === 3 && 'current'} ${step > 3 && 'done'}`}>
            <span className="step">2</span>
            &nbsp;
            <span className="label">Set up</span>
          </li>
          <li className={`${step === 4 && 'current'} ${step > 4 && 'done'}`}>
            <span className="step">3</span>
            &nbsp;
            <span className="label">Select template</span>
          </li>
          <li className={`${step === 5 && 'current'} ${step > 5 && 'done'}`}>
            <span className="step">4</span>
            &nbsp;
            <span className="label">Send invitations</span>
          </li>
          <li className={`${step === 6 && 'current'} ${step > 6 && 'done'}`}>
            <span className="step">5</span>
            &nbsp;
            <span className="label">Done</span>
          </li>
        </ol>
        <div>
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="bg-white p-4 border mb-4">
                <h2 className="font-semibold text-lg mb-2">Upload a file with customer data</h2>
                <div className="mb-4">
                  Upload a CSV file containing the data of customers you’d like to invite. The
                  columns in the CSV file should contain: customer email, customer name and
                  reference number (order ID, invoice ID, transaction ID, booking ID or similar).
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
                  <div className="p-4 bg-red-100 mb-4">
                    <p>The file you chose does not contain any valid lines.</p>
                    <p>
                      Please ensure the column order in the file is: Email, Name, Reference number.
                    </p>
                  </div>
                )}

                {data !== null && data.validLines.length > 0 && data.invalidLines.length > 0 && (
                  <div className="p-4 bg-yellow-100 mb-4">
                    <p>
                      Notice: The file contains {data.totalLines} lines, but{' '}
                      {data.invalidLines.length} of these lines are invalid.
                    </p>
                    <p>If you continue, we will only create invitations for the valid lines.</p>
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
                      {isUploading ? (
                        <Spinner />
                      ) : (
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
                      )}
                    </div>
                    <div className="text-blue-600 text-center">{fileName || 'Select file'}</div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="px-6 py-2 text-white bg-indigo-600"
                  disabled={data === null || data.validLines.length === 0}
                  onClick={() => {
                    setStep((prevState) => prevState + 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className="bg-white p-4 border mb-4">
                <h2 className="font-semibold text-lg mb-2">
                  Does your customer data look correct?
                </h2>
                <div className="mb-4">
                  Before proceeding, please check that your customer data does not contain any
                  invalid characters, e.g. symbols rather than letters.
                </div>
                <table className="table-auto border w-full mb-4">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left">Customer email</th>
                      <th className="px-6 py-3 text-left">Customer name</th>
                      <th className="px-6 py-3 text-left">Reference number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.validLines.map((line, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={index}>
                        <td className="px-6 py-3 text-left border-t">{line.consumerEmail}</td>
                        <td className="px-6 py-3 text-left border-t">{line.consumerName}</td>
                        <td className="px-6 py-3 text-left border-t">{line.referenceNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>If the preview looks correct, you can continue to the next step.</div>
              </div>
              <div className="flex flex-row space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-white border"
                  onClick={() => {
                    setStep((prevState) => prevState - 1);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-white bg-indigo-600 border-indigo-600"
                  onClick={() => {
                    setStep((prevState) => prevState + 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Step 3 */}
          {step === 3 && (
            <div>
              <div className="bg-white p-4 border mb-4">
                <h2 className="font-semibold text-lg mb-2">Sender Information</h2>
                <div className="mb-4">
                  Set up your Sender Name and Sender Email - they appear in your customers’ inboxes
                  when they receive your email invitation. The Reply-to Email is the address you’d
                  like your customers to use when replying to your email.
                </div>

                <div className="mb-4">
                  <label className="block">
                    <div className="font-semibold mb-2">Sender Name</div>
                    <input
                      type="text"
                      className="border w-full px-4 py-2"
                      placeholder="Name"
                      name="senderName"
                      onChange={senderInformationForm.handleChange}
                      onBlur={senderInformationForm.handleBlur}
                      value={senderInformationForm.values.senderName}
                    />
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block">
                    <div className="font-semibold mb-2">Reply-to Email</div>
                    <input
                      type="text"
                      className="border w-full px-4 py-2"
                      placeholder="Reply-to Email"
                      name="replyToEmail"
                      onChange={senderInformationForm.handleChange}
                      onBlur={senderInformationForm.handleBlur}
                      value={senderInformationForm.values.replyTo}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-row space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-white border"
                  onClick={() => {
                    setStep((prevState) => prevState - 1);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-white bg-indigo-600 border-indigo-600"
                  disabled={!senderInformationForm.isValid}
                  onClick={() => {
                    setStep((prevState) => prevState + 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Step 4 */}
          {step === 4 && (
            <div>
              <SelectTemplateModal
                templates={templates}
                isVisible={isSelectTemplateModalVisible}
                onClose={toggleSelectTemplateModalVisible}
                selectedTemplate={selectedTemplate}
                handleSelectTemplate={handleSelectTemplate}
              />
              <div className="bg-white p-4 border mb-4">
                <h2 className="font-semibold text-lg mb-2">Create your invitation email</h2>
                <div className="mb-4">
                  Use our optimized invitation email template or customize it to fit your brand. You
                  can modify the text, color, font, and add your own logo.
                </div>

                <div className="mb-4">
                  <div className="p-2 bg-gray-100 mb-2">
                    <button
                      type="button"
                      className="px-6 py-2 border bg-white"
                      onClick={toggleSelectTemplateModalVisible}
                    >
                      Select template
                    </button>
                  </div>
                  <div>
                    Template type: Service review invitation, Template ID: {selectedTemplate.uuid}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block">
                    <div className="font-semibold mb-2">Template name</div>
                    <input
                      type="text"
                      className="border w-full px-4 py-2"
                      placeholder="Name"
                      name="name"
                      onChange={templateForm.handleChange}
                      onBlur={templateForm.handleBlur}
                      value={templateForm.values.name}
                      disabled
                    />
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block">
                    <div className="font-semibold mb-2">Subject</div>
                    <input
                      type="text"
                      className="border w-full px-4 py-2"
                      placeholder="Subject"
                      name="subject"
                      onChange={templateForm.handleChange}
                      onBlur={templateForm.handleBlur}
                      value={templateForm.values.subject}
                      disabled
                    />
                  </label>
                </div>
                <div className="mb-4">
                  <div className="font-semibold mb-2">Content</div>
                  {isEditorLoaded && (
                    <CKEditor
                      name="content"
                      editor={ClassicEditor}
                      data={templateForm.values.content}
                      config={{ fullPage: true, allowedContent: true }}
                      onChange={(event, editor) => {
                        const editorData = editor.getData();
                        templateForm.setFieldValue('content', editorData);
                      }}
                      disabled
                    />
                  )}
                </div>
                <div className="flex flex-row space-x-4 justify-end">
                  <button type="button" className="px-6 py-2 bg-white border">
                    Send test email
                  </button>
                  <button type="button" className="px-6 py-2 border">
                    Show preview of email
                  </button>
                </div>
              </div>
              <div className="flex flex-row space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-white border"
                  onClick={() => {
                    setStep((prevState) => prevState - 1);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-white bg-indigo-600 border-indigo-600"
                  disabled={!(templateForm.isValid && templateForm.dirty)}
                  onClick={() => {
                    setStep((prevState) => prevState + 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Step 5 */}
          {step === 5 && (
            <div>
              <div className="bg-white p-4 border mb-4">
                <h2 className="font-semibold text-lg mb-2">Invitations are ready to go!</h2>
                <div className="mb-4">
                  <div className="mb-2">Review the details before you hit send:</div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>Sender Name:</div>
                    <div className="col-span-2">{senderInformationForm.values.senderName}</div>
                    {/* <div>Sender Email:</div>
                  <div className="col-span-2">noreply.invitations@trustpilotmail.com</div> */}
                    <div>Reply-to Email:</div>
                    <div className="col-span-2">{senderInformationForm.values.replyTo}</div>
                    <div>Review invitation template:</div>
                    <div className="col-span-2">{selectedTemplate?.name}</div>
                    <div>Total number of lines in the CSV file:</div>
                    <div className="col-span-2">{data?.totalLines} lines</div>
                    <div>Number of valid lines that will be processed:</div>
                    <div className="col-span-2">{data?.validLines?.length} lines</div>
                    <div>Number of invalid lines that will be skipped:</div>
                    <div className="col-span-2">{data?.invalidLines?.length} lines</div>
                  </div>
                  <div>Invitations will be scheduled and sent as soon as possible.</div>
                </div>
              </div>
              <div className="flex flex-row space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-white border"
                  onClick={() => {
                    setStep((prevState) => prevState - 1);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-white bg-indigo-600 border-indigo-600"
                  onClick={handleSendInvitations}
                >
                  Send Invitations
                </button>
              </div>
            </div>
          )}
          {/* Step 6 */}
          {step === 6 && (
            <div>
              <div className="bg-white p-4 border mb-4">
                <div className="mb-2 flex justify-center py-4">
                  <Spinner />
                </div>
                <div className="text-center">
                  Please don't close the browser window or click the back button
                </div>
              </div>
            </div>
          )}
          {/* Step 7 */}
          {step === 7 && (
            <div>
              <div className="bg-white p-4 border mb-4">
                <h2 className="font-semibold text-lg mb-2">
                  We’ll be sending your invitations shortly
                </h2>
                <div className="mb-4">
                  You can always check the status of your invitations in invitation history.
                </div>
                <div>
                  <button
                    type="button"
                    className="px-6 py-2 text-white bg-indigo-600 border-indigo-600"
                  >
                    Invite More Customers
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default withCompany(UploadServiceReviews);
