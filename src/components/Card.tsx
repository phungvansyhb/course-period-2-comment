import { createContext, useContext, useRef, useState } from 'react';
import Icon from './Icons';
import data from '../data.json';
import { ActionType, CommentType, ReplyType } from '../App';
import MyComment from './MyComment';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@nextui-org/modal';

type CardContextType = {
	countReact: number;
	setCountReact: (value: number) => void;
	currentUser: typeof data.currentUser;
	comment: CommentType;
	setComment: (value: CommentType) => void;
	isUpdatingContent: boolean;
	setIsUpdatingContent: (value: boolean) => void;
	replies: (typeof data.comments)[0]['replies'];
	setReplies: (value: (typeof data.comments)[0]['replies']) => void;
	isRepling: boolean;
	setIsRepling: (value: boolean) => void;
	isDeleting: boolean;
	setIsDeleting: (value: boolean) => void;
	parentId?: React.Key;
	dispatch: React.Dispatch<{
		type: ActionType;
		payload: CommentType & {
			parentId?: React.Key;
		};
	}>;
};

const CardContext = createContext<CardContextType | null>(null);

type CardContainerProps = {
	children: React.ReactNode;
	comment: CommentType;
	user: typeof data.currentUser;
	dispatch: React.Dispatch<{
		type: ActionType;
		payload: CommentType & {
			parentId?: React.Key;
		};
	}>;
	parentId?: React.Key;
} & React.HTMLAttributes<HTMLDivElement>;

function CardContainer({
	children,
	comment,
	user,
	dispatch,
	parentId,
	...rest
}: CardContainerProps) {
	const [isRepling, setIsRepling] = useState(false);
	// const [isDeleting, setIsDeleting] = useState(false);
	const [isUpdatingContent, setIsUpdatingContent] = useState(false);
	const [commentState, setComment] = useState(comment);
	const [replies, setReplies] = useState(comment?.replies || []);
	const [countReact, setCountReact] = useState(comment.score);
	const { isOpen: isDeleting, onOpen: setIsDeleting, onOpenChange } = useDisclosure();
	return (
		<CardContext.Provider
			value={{
				countReact,
				setCountReact,
				currentUser: data.currentUser,
				comment: commentState,
				setComment,
				isUpdatingContent,
				setIsUpdatingContent,
				replies,
				setReplies,
				isRepling,
				setIsRepling,
				isDeleting,
				setIsDeleting,
				dispatch: dispatch,
				parentId,
			}}>
			<div
				className='w-full p-6 rounded-lg bg-white'
				{...rest}>
				{children}
				{isRepling && (
					<MyComment
						user={user}
						dispatch={dispatch}
					/>
				)}
				{
					<Modal
						isOpen={isDeleting}
						onOpenChange={onOpenChange}>
						<ModalContent>
							{(onClose) => (
								<>
									<ModalHeader className='flex flex-col gap-1'>
										Delete this comment
									</ModalHeader>
									<ModalBody>
										<p>
											Are you sure you want to delete this comment? This will
											remove the comment and can't be undone
										</p>
									</ModalBody>
									<ModalFooter>
										<button
											className='px-6 py-2 text-white font-semibold bg-primary-soft-red rounded-lg'
											onClick={() =>
												dispatch({
													type: ActionType.DELETE_COMMENT,
													payload: comment,
												})
											}>
											Delete
										</button>
										<button
											className='px-6 py-2 text-white font-semibold bg-primary-blue rounded-lg'
											onClick={onClose}>
											Cancel
										</button>
									</ModalFooter>
								</>
							)}
						</ModalContent>
					</Modal>
				}
			</div>
		</CardContext.Provider>
	);
}

type CardReactionProps = React.HTMLAttributes<HTMLDivElement>;

function CardReaction({ ...rest }: CardReactionProps) {
	const { countReact, setCountReact } = useContext(CardContext)!;
	function handleIncrease() {
		setCountReact(countReact + 1);
	}
	function handleDecrease() {
		setCountReact(countReact - 1);
	}
	return (
		<div
			{...rest}
			className='flex flex-col items-center justify-between p-4 rounded-lg gap-4 bg-neutral-light-gray w-10'>
			<Icon.PlusIcon
				onClick={handleIncrease}
				className='cursor-pointer'
			/>
			<span className='font-semibold text-primary-blue'>{countReact}</span>
			<Icon.MinusIcon
				onClick={handleDecrease}
				className='cursor-pointer'
			/>
		</div>
	);
}

type CardAvatarProps = React.HTMLAttributes<HTMLDivElement>;
function CardAvatar({ ...rest }: CardAvatarProps) {
	const {
		currentUser: { username: userName },
		comment: {
			createdAt: time,
			user: {
				username: commentedUserName,
				image: { png: commentedAvatar },
			},
		},
	} = useContext(CardContext)!;
	const owner = commentedUserName === userName;
	return (
		<div
			{...rest}
			className='flex gap-4 items-center'>
			<img
				src={commentedAvatar}
				alt='avatar'
				className='w-8 h-8 rounded-full'
			/>
			<span className='text-sm font-semibold text-neutral-grayish-blue'>
				{commentedUserName}
			</span>
			{owner && (
				<span className='h-max bg-primary-blue text-white px-2  text-sm rounded font-medium'>
					you
				</span>
			)}
			<div className='text-xs font-semibold text-neutral-grayish-blue'>{time}</div>
		</div>
	);
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
function CardContent({ children, ...rest }: CardContentProps) {
	const { setIsUpdatingContent, dispatch, comment, isUpdatingContent, parentId } =
		useContext(CardContext)!;
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	function handleUpdateComment() {
		const payload = {
			...comment,
			content: textAreaRef.current!.value,
			parentId: parentId,
		};
		console.log(payload);
		dispatch({
			type: ActionType.UPDATE_COMMENT,
			payload: payload,
		});
		setIsUpdatingContent(false);
	}
	return (
		<div
			className='text-base text-neutral-grayish-blue line-clamp-3 break-keep'
			{...rest}>
			{isUpdatingContent && (
				<div>
					<textarea
						autoFocus
						ref={textAreaRef}
						className='w-full border rounded px-4 py-2 active:outline-primary-blue focus:outline-primary-blue'
						rows={3}
						defaultValue={comment.content}
					/>
					<div className='space-x-4 text-right'>
						<button
							className='px-6 py-2 text-white font-semibold bg-primary-blue rounded-lg'
							onClick={handleUpdateComment}>
							Update
						</button>
						<button
							className='px-6 py-2 text-white font-semibold bg-neutral-grayish-blue rounded-lg'
							onClick={() => setIsUpdatingContent(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}
			{!isUpdatingContent && comment.content}
		</div>
	);
}

type CardActionProps = React.HTMLAttributes<HTMLDivElement>;

function CardAction({ ...rest }: CardActionProps) {
	const {
		currentUser,
		comment,
		setIsRepling,
		setIsDeleting,
		setIsUpdatingContent,
		isUpdatingContent,
		isDeleting,
	} = useContext(CardContext)!;
	const isMyComment = currentUser.username === comment.user.username;
	const KlassName =
		'font-semibold flex gap-2 items-center text-sm cursor-pointer ' +
		(isUpdatingContent ? 'cursor-disable opacity-40' : '');
	if (isMyComment) {
		return (
			<div
				{...rest}
				className={'flex gap-4'}>
				<span
					className={'text-primary-soft-red ' + KlassName}
					onClick={() => {
						if (!isUpdatingContent && !isDeleting) setIsDeleting(true);
					}}>
					<Icon.DeleteIcon /> Delete
				</span>
				<span
					className={'text-primary-blue ' + KlassName}
					onClick={() => {
						if (!isUpdatingContent && !isDeleting) setIsUpdatingContent(true);
					}}>
					<Icon.EditIcon /> Edit
				</span>
			</div>
		);
	}
	return (
		<div
			className='text-primary-blue font-semibold flex gap-2 items-center text-sm cursor-pointer'
			onClick={() => setIsRepling(true)}
			{...rest}>
			<Icon.ReplyIcon className='w-4 h-4' /> Reply
		</div>
	);
}

const Card = { CardReaction, CardContainer, CardAvatar, CardContent, CardAction };
export default Card;
