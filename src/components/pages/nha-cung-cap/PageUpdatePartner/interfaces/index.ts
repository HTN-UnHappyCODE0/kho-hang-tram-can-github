import {TYPE_SIFT, TYPE_TRANSPORT} from '~/constants/config/enum';

export interface PropsPageUpdatePartner {}

export interface IFormUpdatePartner {
	name: string;
	userUuid: string;
	director: string;
	partnerUuid: string;
	email: string;
	phoneNumber: string;
	provinceId: string;
	districtId: string;
	townId: string;
	address: string;
	description: string;
	transportType: TYPE_TRANSPORT | null;
	isSift: TYPE_SIFT | null;
	warehouseUuid: string;
	typeCus: number;
	companyUuid: string;
}
