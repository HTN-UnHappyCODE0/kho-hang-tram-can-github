import React, {useEffect} from 'react';
import {ICustomer, PropsMainPagePartner} from './interfaces';
import styles from './MainPagePartner.module.scss';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
	TYPE_PARTNER,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import partnerServices from '~/services/partnerServices';
import Link from 'next/link';
import IconCustom from '~/components/common/IconCustom';
import {Eye} from 'iconsax-react';
import {LuPencil} from 'react-icons/lu';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';

function MainPagePartner({}: PropsMainPagePartner) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _partnerUuid, _parentUserUuid, _userUuid} = router.query;

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: partnerServices.listPartner({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					userUuid: '',
					provinceId: '',
					type: TYPE_PARTNER.NCC,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listRegency = useQuery([QUERY_KEY.dropdown_chuc_vu], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: regencyServices.listRegency({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listUserPurchasing = useQuery([QUERY_KEY.dropdown_quan_ly_nhap_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser2({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuid: [listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid],
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const listUserMarket = useQuery([QUERY_KEY.dropdown_nhan_vien_thi_truong, _parentUserUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser2({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuid: [listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Nhân viên thị trường'])?.uuid],
					parentUuid: (_parentUserUuid as string) || '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const listCustomerStorage = useQuery(
		[QUERY_KEY.table_nha_cung_cap, _keyword, _page, _parentUserUuid, _userUuid, _pageSize, _partnerUuid],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: customerServices.listCustomerStorage({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						specUuid: '',
						provinceId: '',
						status: STATUS_CUSTOMER.HOP_TAC,
						typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
						partnerUUid: (_partnerUuid as string) || null,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isPaging: CONFIG_PAGING.IS_PAGING,
						userUuid: (_userUuid as string) || '',
						parentUserUuid: (_parentUserUuid as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	useEffect(() => {
		if (_parentUserUuid) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						_userUuid: null,
					},
				},
				undefined,
				{shallow: true, scroll: false}
			);
		}
	}, [_parentUserUuid]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên nhà cung cấp' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Quản lý nhập hàng'
							query='_parentUserUuid'
							listFilter={listUserPurchasing?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.fullName,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Nhân viên thị trường'
							query='_userUuid'
							listFilter={listUserMarket?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.fullName,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Khách hàng'
							query='_partnerUuid'
							listFilter={listPartner?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listCustomerStorage.data?.items || []}
					loading={listCustomerStorage.isLoading}
					noti={<Noti disableButton des='Hiện tại chưa có nhà cung cấp nào!' />}
				>
					<Table
						data={listCustomerStorage.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: ICustomer, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã NCC',
								fixedLeft: true,
								render: (data: ICustomer) => (
									<Link href={`/nha-cung-cap/${data?.customerUu?.uuid}`} className={styles.link}>
										{data?.customerUu?.code}
									</Link>
								),
							},

							{
								title: 'Tên NCC',
								render: (data: ICustomer) => <>{data?.customerUu?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: ICustomer) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Quốc gia',
								render: (data: ICustomer) => <>{data?.qualityUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: ICustomer) => <>{data?.specUu?.name || '---'}</>,
							},
							{
								title: 'Vận chuyển',
								render: (data: ICustomer) => (
									<>
										{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Bãi',
								render: (data: ICustomer) => <>{data?.storageUu?.name || '---'}</>,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ICustomer) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/nha-cung-cap/${data?.customerUu?.uuid}`}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listCustomerStorage?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _keyword, _partnerUuid]}
				/>
			</div>
		</div>
	);
}

export default MainPagePartner;
