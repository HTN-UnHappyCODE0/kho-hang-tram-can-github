import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, STATUS_CUSTOMER, TYPE_CUSTOMER, TYPE_TRANSPORT} from '~/constants/config/enum';
import axiosClient from '.';

const customerServices = {
	listCustomer: (
		data: {
			page: number;
			pageSize: number;
			keyword: string;
			status: STATUS_CUSTOMER | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userUuid: string;
			partnerUUid: string | null;
			specUuid: string;
			provinceId: string;
			typeCus: TYPE_CUSTOMER | null;
			companyUuid?: string;
			parentUserUuid?: string;
			listCompanyUuid?: string[];
			listPartnerUUid?: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Customer/get-list-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	listCustomerStorage: (
		data: {
			page: number;
			pageSize: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userUuid: string;
			parentUserUuid?: string | null;
			partnerUUid: string | null;
			specUuid: string;
			provinceId: string;
			typeCus: TYPE_CUSTOMER | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Customer/get-list-customer-storage`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetail: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Customer/detail-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatus: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Customer/change-status-customer`, data, {
			cancelToken: tokenAxios,
		});
	},

	deleteCustomer: (
		data: {
			uuid: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Customer/delete-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertCustomer: (
		data: {
			uuid: string;
			name: string;
			phoneNumber: string;
			email: string;
			director: string;
			isSift: number | null;
			typeCus: TYPE_CUSTOMER;
			transportType: TYPE_TRANSPORT;
			districtId: string;
			provinceId: string;
			townId: string;
			address: string;
			description: string;
			partnerUuid: string;
			userUuid: string;
			warehouseUuid: string;
			companyUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Customer/upsert-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStorage: (
		data: {
			customerSpecUuid: string;
			storageUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Customer/update-storage`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default customerServices;
