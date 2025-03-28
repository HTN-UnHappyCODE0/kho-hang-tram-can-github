import React, {useState} from 'react';
import {PropsPopupRejectBatchBill} from './interfaces';
import styles from './PopupRejectBatchBill.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import Form, {FormContext} from '~/components/common/Form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import TextArea from '~/components/common/Form/components/TextArea';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {IoHelpCircleOutline} from 'react-icons/io5';
import batchBillServices from '~/services/batchBillServices';

function PopupRejectBatchBill({uuids, onClose}: PropsPopupRejectBatchBill) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{description: string}>({
		description: '',
	});

	const funcQLKRejectBatchbill = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'QLK hủy duyệt sản lượng thành công!',
				http: batchBillServices.QLKRejectBatchbill({
					uuid: uuids,
					description: form.description,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_tat_ca]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_nhap]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_dich_vu]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_chuyen_kho]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat_thang]);
				queryClient.invalidateQueries([QUERY_KEY.table_ktk_duyet_san_luong]);
			}
		},
	});

	const handleSubmit = () => {
		return funcQLKRejectBatchbill.mutate();
	};

	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<Loading loading={funcQLKRejectBatchbill.isLoading} />
			<div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div>

			<p className={styles.note}>Bạn chắc chắn muốn hủy duyệt cho phiếu này?</p>
			<div className={clsx('mt')}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<TextArea isRequired name='description' max={5000} blur placeholder='Nhập lý do hủy' />
					<div className={styles.groupBtnPopup}>
						<Button p_10_24 grey_2 rounded_8 bold onClick={onClose} maxContent>
							Đóng
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 primary bold rounded_8 onClick={handleSubmit} maxContent>
									Xác nhận
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default PopupRejectBatchBill;
