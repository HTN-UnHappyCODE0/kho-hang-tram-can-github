import React, {useEffect, useState} from 'react';

import {ISampleData, PropsFormUpdateWeighDryness} from './interfaces';
import styles from './FormUpdateWeighDryness.module.scss';
import Button from '~/components/common/Button';
import Search from '~/components/common/Search';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_SAMPLE_SESSION,
	TYPE_DATE,
	TYPE_SAMPLE_SESSION,
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import GridColumn from '~/components/layouts/GridColumn';
import sampleSessionServices from '~/services/sampleSessionServices';
import wareServices from '~/services/wareServices';
import shipServices from '~/services/shipServices';
import Select, {Option} from '~/components/common/Select';
import clsx from 'clsx';
import weightSessionServices from '~/services/weightSessionServices';
import {toastWarn} from '~/common/funcs/toast';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {timeSubmit} from '~/common/funcs/optionConvert';
import SelectFilterDate from '~/components/pages/trang-chu/SelectFilterDate';
import SelectFilterOption from '~/components/pages/trang-chu/SelectFilterOption';
import Loading from '~/components/common/Loading';

function FormUpdateWeighDryness({onClose, dataUpdateWeigh}: PropsFormUpdateWeighDryness) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const {_keywordForm, _pageSample, _pageSampleSize} = router.query;

	const [dataCheckWeigh, setDataCheckWeigh] = useState<string | null>();
	const [uuidSampleSession, setUuidSampleSession] = useState<string | null>();
	const [statusSampleData, setStatusSampleData] = useState<any>('1');

	const [finalDryness, setFinalDryness] = useState<number>(0);
	const [totalSample, setTotalSample] = useState<number>(0);
	const [customerUuid, setCustomerUuid] = useState<string>('');
	const [type, setType] = useState<string>(String(TYPE_SAMPLE_SESSION.DO_KHO));
	const [shipUuid, setShipUuid] = useState<string>('');
	const [specUuid, setSpecUuid] = useState<string>('');
	const [statusSample, setStatusSample] = useState<string>(String(STATUS_SAMPLE_SESSION.USING));
	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.LAST_7_DAYS);
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);

	const [listCustomer, setListCustomer] = useState<any[]>([]);
	const [listSpec, setListSpec] = useState<any[]>([]);
	const [listShip, setListShip] = useState<any[]>([]);

	useEffect(() => {
		if (Array.isArray(dataUpdateWeigh)) {
			const customers = dataUpdateWeigh
				.flatMap((item) => (item?.fromUu ? [{name: item?.fromUu?.name, uuid: item?.fromUu?.uuid}] : []))
				.filter((customer, index, self) => index === self.findIndex((c) => c.uuid === customer.uuid));

			const specs = dataUpdateWeigh
				.flatMap((item) =>
					item?.specificationsUu ? [{name: item?.specificationsUu?.name, uuid: item?.specificationsUu?.uuid}] : []
				)
				.filter((spec, index, self) => index === self.findIndex((c) => c.uuid === spec.uuid));
			const ships = dataUpdateWeigh.flatMap((item) => {
				const shipArray = [];
				if (item?.batchUu?.shipUu) {
					shipArray.push({name: item?.batchUu?.shipUu?.licensePalate, uuid: item?.batchUu?.shipUu?.uuid});
				}
				if (item?.batchUu?.shipOutUu) {
					shipArray.push({name: item?.batchUu?.shipOutUu?.licensePalate, uuid: item?.batchUu?.shipOutUu?.uuid});
				}
				shipArray.filter((ship, index, self) => index === self.findIndex((c) => c.uuid === ship.uuid));
				return shipArray;
			});

			setListShip(ships);
			setListSpec(specs);
			setListCustomer(customers);
			setCustomerUuid(customers[0]?.uuid);
			setSpecUuid(specs[0]?.uuid);
		}
	}, [dataUpdateWeigh]);

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	// const listShip = useQuery([QUERY_KEY.dropdown_ma_tau], {
	// 	queryFn: () =>
	// 		httpRequest({
	// 			isDropdown: true,
	// 			http: shipServices.listShip({
	// 				page: 1,
	// 				pageSize: 50,
	// 				keyword: '',
	// 				status: CONFIG_STATUS.HOAT_DONG,
	// 				isPaging: CONFIG_PAGING.NO_PAGING,
	// 				isDescending: CONFIG_DESCENDING.NO_DESCENDING,
	// 				typeFind: CONFIG_TYPE_FIND.DROPDOWN,
	// 			}),
	// 		}),
	// 	select(data) {
	// 		return data;
	// 	},
	// });

	const listSampleSession = useQuery(
		[
			QUERY_KEY.table_ds_can_mau,
			_pageSample,
			_pageSampleSize,
			_keywordForm,
			customerUuid,
			specUuid,
			statusSample,
			shipUuid,
			type,
			date,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: sampleSessionServices.getListSampleSession({
						page: Number(_pageSample) || 1,
						pageSize: Number(_pageSampleSize) || 200,
						keyword: (_keywordForm as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						customerUuid: customerUuid,
						fromDate: timeSubmit(date?.from)!,
						specUuid: specUuid,
						status: STATUS_SAMPLE_SESSION.ACCEPT,
						toDate: timeSubmit(date?.to, true)!,
						type: TYPE_SAMPLE_SESSION.DO_KHO,
						shipUuid: shipUuid,
					}),
				}),
			select(data) {
				if (data?.items?.length == 1 || data?.items?.length == 0) {
					return data?.items;
				} else {
					return [
						{
							uuid: data?.items?.map((v: any) => v?.uuid),
							code: 'Tất cả',
						},
						...data?.items,
					];
				}
			},
			onSuccess(data) {
				if (data) {
					setUuidSampleSession(data[0]?.uuid);
				}
			},

			enabled: !!customerUuid || !!_keywordForm || !!specUuid || !!shipUuid || !!date,
		}
	);

	const listSampleData = useQuery([QUERY_KEY.table_du_lieu_mau, uuidSampleSession, statusSampleData], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: sampleSessionServices.getListSampleData2({
					lstSampleSessionUuid: (Array.isArray(uuidSampleSession) ? uuidSampleSession : [uuidSampleSession]).filter(
						(uuid): uuid is string => uuid !== null
					),
					lstCustomerUuid: [],
					status: null,
				}),
			}),
		select(data) {
			return data;
		},
		onSuccess(data) {
			setDataCheckWeigh(null);
		},
		enabled: !!uuidSampleSession || !!statusSampleData,
	});

	const funcUpdateDrynessWeightSession = useMutation({
		mutationFn: (body: {uuids: string[]; dryness: number}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật độ khô thành công!',
				http: weightSessionServices.updateDrynessWeightSession({
					wsUuids: body.uuids,
					dryness: body.dryness,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (!dataCheckWeigh) {
			return toastWarn({msg: 'Vui lòng chọn cân mẫu!'});
		}
		return funcUpdateDrynessWeightSession.mutate({
			uuids: dataUpdateWeigh?.map((v: any) => v?.uuid),
			dryness: finalDryness,
		});
	};

	return (
		<div className={styles.container}>
			{/* <Loading loading={funcUpdateDrynessWeightSession.isLoading} /> */}
			<div className={styles.header}>
				<h4 className={styles.title}>Cập nhật độ khô theo cân mẫu</h4>
				<div className={styles.btn}>
					<Button rounded_8 w_fit p_8_16 light_outline bold onClick={onClose}>
						Hủy bỏ
					</Button>

					<Button rounded_8 w_fit p_8_16 bold onClick={handleSubmit}>
						Xác nhận
					</Button>
				</div>
			</div>
			<div className={styles.line}></div>
			<div className={styles.form}>
				<div className={styles.header_form}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search keyName='_keywordForm' placeholder='Tìm kiếm ' />
						</div>

						<SelectFilterOption
							isShowAll={false}
							uuid={customerUuid}
							setUuid={setCustomerUuid}
							listData={listCustomer?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Tất cả khách hàng'
						/>

						{/* <SelectFilterOption
							isShowAll={false}
							uuid={type}
							setUuid={setType}
							listData={[
								{
									uuid: String(TYPE_SAMPLE_SESSION.QUY_CACH),
									name: 'Quy cách',
								},
								{
									uuid: String(TYPE_SAMPLE_SESSION.DO_KHO),
									name: 'Độ khô',
								},
							]}
							placeholder='Loại'
						/> */}

						<SelectFilterOption
							uuid={shipUuid}
							setUuid={setShipUuid}
							listData={listShip?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.licensePalate,
							}))}
							placeholder='Tất cả tàu'
						/>

						{/* <SelectFilterOption
							isShowAll={false}
							uuid={statusSample}
							setUuid={setStatusSample}
							listData={[
								{
									uuid: String(STATUS_SAMPLE_SESSION.DELETE),
									name: 'Đã xóa',
								},
								{
									uuid: String(STATUS_SAMPLE_SESSION.INIT),
									name: 'Khởi tạo',
								},
								{
									uuid: String(STATUS_SAMPLE_SESSION.USING),
									name: 'Đang cân',
								},
								{
									uuid: String(STATUS_SAMPLE_SESSION.FINISH),
									name: 'Hoàn thành',
								},
								{
									uuid: String(STATUS_SAMPLE_SESSION.ACCEPT),
									name: 'Xác nhận',
								},
							]}
							placeholder='Tất cả trạng thái'
						/> */}

						<SelectFilterOption
							isShowAll={false}
							uuid={specUuid}
							setUuid={setSpecUuid}
							listData={listSpec?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Tất cả quy cách'
						/>

						<SelectFilterDate
							isOptionDateAll={false}
							date={date}
							setDate={setDate}
							typeDate={typeDate}
							setTypeDate={setTypeDate}
						/>
					</div>
				</div>
				<div className={clsx('mt', styles.filter_option)}>
					<Select
						isSearch
						name='uuidSampleSession'
						placeholder='Chọn cân mẫu'
						value={uuidSampleSession}
						label={<span>Cân mẫu</span>}
					>
						{listSampleSession?.data?.map((v: any) => (
							<Option key={v?.uuid} value={v?.uuid} title={v?.code} onClick={() => setUuidSampleSession(v?.uuid)} />
						))}
					</Select>
					<div>
						<Select
							isSearch
							name='statusSampleData'
							placeholder='Chọn trạng thái cân'
							value={statusSampleData}
							label={<span>Trạng thái</span>}
						>
							{[
								{
									id: '0',
									name: 'Đã hủy',
								},
								{
									id: '1',
									name: 'Đang cân',
								},
							].map((v) => (
								<Option key={v?.id} value={v?.id} title={v?.name} onClick={() => setStatusSampleData(v?.id)} />
							))}
						</Select>
					</div>
				</div>
				<DataWrapper
					data={listSampleData?.data?.items || []}
					loading={listSampleData.isFetching}
					noti={<Noti des='Hiện tại chưa có dữ liệu nào!' disableButton />}
				>
					<div className={styles.table_option}>
						{listSampleData?.data?.items?.map((v: ISampleData) => (
							<label key={v?.uuid} className={styles.option}>
								<input
									id={v?.uuid}
									className={styles.input_radio}
									type='radio'
									name='check_weigh'
									value={v?.uuid}
									onChange={() => (setDataCheckWeigh(v?.uuid), setFinalDryness(v?.finalDryness))}
								/>
								<label htmlFor={v?.uuid} className={styles.infor_check}>
									<GridColumn col_2>
										<div className={styles.item}>
											<p>Mẫu làm việc:</p>
											<p style={{color: '#2D74FF'}}>{v?.sampleSessionUu?.code}</p>
										</div>

										<div className={styles.item}>
											<p>Mã lô:</p>
											<p>{v?.billCode || '---'}</p>
										</div>
										<div className={styles.item}>
											<p>Ghi chú:</p>
											<p>{v?.description || '---'}</p>
										</div>
									</GridColumn>
									<div className={styles.line_stroke}></div>
									<GridColumn col_2>
										<div className={styles.item}>
											<p>STT:</p>
											<p style={{color: '#2D74FF'}}>{v?.orderNumber}</p>
										</div>
										<div className={styles.item}>
											<p>Độ khô:</p>
											<p style={{color: 'red'}}>{v?.finalDryness} %</p>
										</div>
									</GridColumn>
								</label>
							</label>
						))}
					</div>
				</DataWrapper>
			</div>
		</div>
	);
}

export default FormUpdateWeighDryness;
