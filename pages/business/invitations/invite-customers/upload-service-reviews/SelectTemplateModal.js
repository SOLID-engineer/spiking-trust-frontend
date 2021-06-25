import Modal from 'components/common/Modal';
import React, { useState } from 'react';

const SelectTemplateModal = ({
  isVisible,
  onClose,
  templates,
  selectedTemplate,
  handleSelectTemplate,
}) => {
  const [selectedUuid, setSelectedUuid] = useState(selectedTemplate?.uuid);
  const onCancel = () => {
    onClose();
    setTimeout(() => {
      setSelectedUuid(selectedTemplate?.uuid);
    }, 200);
  };
  const onSelect = () => {
    onClose();
    handleSelectTemplate(selectedUuid);
  };
  return (
    <Modal isVisible={isVisible} onClose={onCancel}>
      <div>
        <h1 className="bg-white font-semibold text-xl mb-4 pb-4 border-b">
          Select an email template
        </h1>
        <div className="border p-2 h-60 overflow-y-auto mb-2">
          {templates.map((template) => (
            <div
              key={template.uuid}
              className={`px-4 py-2 ${
                selectedUuid === template.uuid ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
              role="button"
              aria-hidden
              onClick={() => setSelectedUuid(template.uuid)}
            >
              {template.name}
            </div>
          ))}
        </div>
        <div className="mb-4 italic">Template ID: {selectedUuid}</div>
        <div className="flex flex-row space-x-4 justify-end">
          <button type="button" className="px-6 py-2 bg-white border" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 text-white bg-indigo-600 border-indigo-600"
            disabled={!selectedUuid || selectedUuid === selectedTemplate?.uuid}
            onClick={onSelect}
          >
            Select this template
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SelectTemplateModal;
