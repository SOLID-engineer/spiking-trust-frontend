export const INVITATION_STATUS_QUEUED = 'queued';
export const INVITATION_STATUS_CANCELLED = 'cancelled';
export const INVITATION_STATUS_SENDING = 'sending';
export const INVITATION_STATUS_NOT_DELIVERED = 'not_delivered';
export const INVITATION_STATUS_DELIVERED = 'delivered';
export const INVITATION_STATUSES = {
  [INVITATION_STATUS_QUEUED]: 'Queued',
  [INVITATION_STATUS_CANCELLED]: 'Cancelled',
  [INVITATION_STATUS_SENDING]: 'Sending',
  [INVITATION_STATUS_NOT_DELIVERED]: 'Not Delivered',
  [INVITATION_STATUS_DELIVERED]: 'Delivered',
};

export const INVITATION_TYPE_SERVICE_REVIEW = 'service_review';
export const INVITATION_TYPE_PRODUCT_REVIEW = 'product_review';
export const INVITATION_TYPES = {
  [INVITATION_TYPE_SERVICE_REVIEW]: 'Service Review',
  [INVITATION_TYPE_PRODUCT_REVIEW]: 'Product Review',
};
