import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPageBillDirect from '~/components/pages/lenh-can/MainPageBillDirect';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lệnh cân xuất thẳng</title>
				<meta name='description' content='Lệnh cân xuất thẳng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Tất cả',
						url: PATH.PhieuDuKienTatCa,
					},
					{
						title: 'Phiếu nhập',
						url: PATH.PhieuDuKienNhap,
					},
					{
						title: 'Phiếu xuất',
						url: PATH.PhieuDuKienXuat,
					},
					{
						title: 'Dịch vụ',
						url: PATH.PhieuDuKienDichVu,
					},
					{
						title: 'Chuyển kho',
						url: PATH.PhieuDuKienChuyenKho,
					},
					{
						title: 'Cân xuất thẳng',
						url: PATH.PhieuDuKienXuatThang,
					},
				]}
			>
				<MainPageBillDirect />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý Lệnh cân xuất thẳng'>{Page}</BaseLayout>;
};
