export interface PropsDialogWarning {
	open: boolean;
	title: string;
	note?: string;
	Icon?: any;
	onClose: () => any;
	onSubmit: () => any;
	[props: string]: any;
}
