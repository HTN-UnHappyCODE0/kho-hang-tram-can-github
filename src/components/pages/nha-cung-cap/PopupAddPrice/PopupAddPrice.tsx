import React, {useState} from 'react';

import {PropsPopupAddPrice} from './interfaces';
import styles from './PopupAddPrice.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATE_SPEC_CUSTOMER,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_CUSTOMER,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {toastWarn} from '~/common/funcs/toast';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import priceTagServices from '~/services/priceTagServices';
import storageServices from '~/services/storageServices';

function PopupAddPrice({typeCustomer, customerName, onClose}: PropsPopupAddPrice) {
	const router = useRouter();

	const {_id} = router.query;

	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		specUuid: string;
		transportType: string;
		state: CONFIG_STATE_SPEC_CUSTOMER;
		productTypeUuid: string;
		customerName: string;
		storageUuid: string;
	}>({
		specUuid: '',
		productTypeUuid: '',
		state: CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP,
		customerName: customerName,
		transportType: '',
		storageUuid: '',
	});

	const resetForm = () => {
		setForm({
			specUuid: '',
			productTypeUuid: '',
			customerName: '',
			transportType: '',
			state: CONFIG_STATE_SPEC_CUSTOMER.CHUA_CUNG_CAP,
			storageUuid: '',
		});
	};

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach, form.productTypeUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
					productTypeUuid: form.productTypeUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.productTypeUuid,
	});

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					type:
						typeCustomer == TYPE_CUSTOMER.DICH_VU
							? [TYPE_PRODUCT.DICH_VU, TYPE_PRODUCT.DUNG_CHUNG]
							: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listStorage = useQuery([QUERY_KEY.dropdown_bai, form.specUuid, form.productTypeUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					specificationsUuid: form.specUuid,
					productUuid: form.productTypeUuid,
					warehouseUuid: '',
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.specUuid && !!form.productTypeUuid,
	});

	const funcAddSpecCustomer = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới thành công!',
				http: priceTagServices.addPricetagToCustomer({
					infoSpec: [
						{
							specUuid: form.specUuid,
							status: CONFIG_STATUS.HOAT_DONG,
							state: form?.state,
							productTypeUuid: form.productTypeUuid,
							transportType: Number(form.transportType),
							priceTagUuid: '0',
							storageUuid: form?.storageUuid,
						},
					],
					customerUuid: [_id as string],
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				resetForm();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nha_cung_cap]);
				queryClient.invalidateQueries([QUERY_KEY.table_hang_hoa_cua_nha_cung_cap]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (!form.transportType) {
			return toastWarn({msg: 'Vui lòng chọn hình thức vận chuyển!'});
		}
		if (!form.specUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại quy cách!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}

		return funcAddSpecCustomer.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcAddSpecCustomer.isLoading} />
			<h4 className={styles.title}>Thêm loại hàng</h4>
			<Form form={form} setForm={setForm}>
				<div className='mt'>
					<Input
						readOnly
						name='customerName'
						value={form.customerName}
						placeholder='Nhập tên nhà cung cấp'
						label={
							<span>
								Tên nhà cung cấp <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
				</div>
				<div className={clsx('mt')}>
					<Select
						isSearch
						name='productTypeUuid'
						value={form.productTypeUuid}
						placeholder='Lựa chọn loại hàng'
						label={
							<span>
								Loại hàng<span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listProductType?.data?.map((value: any) => (
							<Option
								key={value.uuid}
								title={value.name}
								value={value.uuid}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										productTypeUuid: value.uuid,
										specUuid: '',
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch
						name='specUuid'
						placeholder='Lựa chọn quy cách'
						value={form.specUuid}
						readOnly={!form.productTypeUuid}
						label={
							<span>
								Quy cách <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listSpecifications?.data?.map((value: any) => (
							<Option
								key={value.uuid}
								title={value?.name}
								value={value?.uuid}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										specUuid: value.uuid,
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch
						name='storageUuid'
						placeholder='Lựa chọn bãi'
						value={form.storageUuid}
						readOnly={!form.specUuid || !form.productTypeUuid}
						label={
							<span>
								Bãi <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listStorage?.data?.map((value: any) => (
							<Option
								key={value.uuid}
								title={value?.name}
								value={value?.uuid}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										storageUuid: value.uuid,
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch
						name='transportType'
						placeholder='Hình thức vận chuyển'
						value={form.transportType}
						label={
							<span>
								Hình thức vận chuyển <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						<Option
							title='Đường bộ'
							value={'0'}
							onClick={() =>
								setForm((prev: any) => ({
									...prev,
									transportType: '0',
								}))
							}
						/>
						<Option
							title='Đường thủy'
							value={'1'}
							onClick={() =>
								setForm((prev: any) => ({
									...prev,
									transportType: '1',
								}))
							}
						/>
					</Select>

					{/* <div className={'mt'}>
						<SelectSearch
							isConvertNumber={true}
							options={listPriceTag?.data?.map((v: any) => ({
								id: v?.uuid,
								name: String(v?.amount),
							}))}
							data={priceTag}
							setData={setPriceTag}
							label={
								<span>
									Giá tiền áp dụng <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập giá tiền'
						/>
					</div> */}
					<div className='mt'>
						<div className={styles.input_price}>
							<input
								id={`state_spec_customer`}
								name='state'
								value={form.state}
								type='checkbox'
								className={styles.input}
								checked={form?.state == CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP}
								onChange={() =>
									setForm((prev) => ({
										...prev,
										state:
											prev.state == CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP
												? CONFIG_STATE_SPEC_CUSTOMER.CHUA_CUNG_CAP
												: CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP,
									}))
								}
							/>
							<label className={styles.label_check_box} htmlFor={`state_spec_customer`}>
								Đang cung cấp
							</label>
						</div>
					</div>
				</div>
				<div className={styles.control}>
					<div>
						<Button p_8_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button
							disable={!form.specUuid || !form.productTypeUuid}
							// disable={!form.specUuid || !form.productTypeUuid || !priceTag.name}
							p_8_24
							rounded_2
							primary
							onClick={handleSubmit}
						>
							Xác nhận
						</Button>
					</div>
				</div>
				<div className={styles.icon_close} onClick={onClose}>
					<IoClose size={24} color='#23262F' />
				</div>
			</Form>
		</div>
	);
}

export default PopupAddPrice;
