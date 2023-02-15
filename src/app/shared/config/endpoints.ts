import { environment } from '../../../environments/environment';
import { environment as enviroment_prod } from '../../../environments/environment.prod';

// URL backend
const URL_BASE = environment.production ? enviroment_prod.URL_BASE : environment.URL_BASE;

export const URL_SERVICES = {

  URL_SECURITY: URL_BASE + '/Security',
  URL_MARKET: URL_BASE + '/Market',
  URL_PAYMENTMETHOD: URL_BASE + '/PaymentMethod/GetPaymentMethods',
  URL_BANKS: URL_BASE + '/Bank',
  URL_CATEGORY: URL_BASE + '/Category',
  URL_ORDER: URL_BASE + '/Order',
  URL_DETAIL_ORDER: URL_BASE + '/OrderDetail',
  URL_CHAT: URL_BASE + '/Message',
  URL_DOCUMENT_TYPE: URL_BASE + '/DocumentType/GetDocumentTypes',
  URL_CATALOG: URL_BASE + '/Product',
  URL_USER: URL_BASE + '/MarketUser',
  URL_ROLES: URL_BASE + '/Roles',
  URL_REPORT: URL_BASE + '/Report',
  URL_PERMISSION: URL_BASE + '/Permission',
};
