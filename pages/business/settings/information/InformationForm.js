import { isEmpty } from 'lodash';
import React from 'react';

const InformationForm = ({ form }) => (
  <div className="bg-white">
    <form onSubmit={form.handleSubmit}>
      <div className="p-4">
        <h2 className="font-semibold mb-4">Contact information</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Company name:</label>
          <input
            type="text"
            className="border px-3 py-2 w-full"
            name="companyName"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.companyName}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Email:</label>
          <input
            type="text"
            className="border px-3 py-2 w-full"
            name="email"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.email}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Telephone:</label>
          <input
            type="text"
            className="border px-3 py-2 w-full"
            name="telephone"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.telephone}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Street address:</label>
          <input
            type="text"
            className="border px-3 py-2 w-full"
            name="streetAddress"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.streetAddress}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Post-zip code:</label>
          <input
            type="text"
            className="border px-3 py-2 w-full"
            name="zipCode"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.zipCode}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">City:</label>
          <input
            type="text"
            className="border px-3 py-2 w-full"
            name="city"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.city}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Country:</label>
          <input
            type="text"
            className="border px-3 py-2 w-full"
            name="country"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.country}
          />
        </div>
      </div>
      <div className="text-right p-4 flex flex-row justify-end space-x-4 border-t">
        <button
          type="button"
          className="border py-2 px-3"
          onClick={form.handleReset}
          disabled={isEmpty(form.touched)}
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
);

export default InformationForm;
