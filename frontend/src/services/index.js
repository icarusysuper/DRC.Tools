import request from '../utils/request';

export function getGuid() {
  return request('/api/guid');
}
