import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa cân mẫu</title>
				<meta name='description' content='Chỉnh sửa cân mẫu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<div></div>
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa cân mẫu'>{Page}</BaseLayout>;
};
