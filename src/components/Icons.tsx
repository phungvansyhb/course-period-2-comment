type IconProps = React.HTMLAttributes<HTMLImageElement>;

function MinusIcon(props: IconProps) {
	return (
		<img
			src={process.env.PUBLIC_URL + '/images/icon-minus.svg'}
			alt='minus'
			{...props}
		/>
	);
}
function PlusIcon(props: IconProps) {
	return (
		<img
			src={process.env.PUBLIC_URL + '/images/icon-plus.svg'}
			alt='plus'
			{...props}
		/>
	);
}
function DeleteIcon(props: IconProps) {
	return (
		<img
			src={process.env.PUBLIC_URL + '/images/icon-delete.svg'}
			alt='delete'
			{...props}
		/>
	);
}
function EditIcon(props: IconProps) {
	return (
		<img
			src={process.env.PUBLIC_URL + '/images/icon-edit.svg'}
			alt='edit'
			{...props}
		/>
	);
}
function ReplyIcon(props: IconProps) {
	return (
		<img
			src={process.env.PUBLIC_URL + '/images/icon-reply.svg'}
			alt='edit'
			{...props}
		/>
	);
}

const Icon = { MinusIcon, PlusIcon, DeleteIcon, EditIcon, ReplyIcon };
export default Icon;
