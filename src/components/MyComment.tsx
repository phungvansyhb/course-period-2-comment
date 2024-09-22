import React, { useRef } from 'react';
import { ActionType, CommentType, UserType } from '../App';

type Props = {
	user: UserType;
	dispatch: React.Dispatch<{
		type: ActionType;
		payload: CommentType;
	}>;
} & React.HTMLAttributes<HTMLDivElement>;

export default function MyComment({ user , dispatch }: Props) {

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    function handleSendComment() {
        const content = textAreaRef.current!.value;
		if (content) {
			const comment:CommentType = {
				id : Math.floor(Math.random() * 1000),
				content,
				createdAt : 'Just now',
				replies:[],
				score : 0,
				user : user
			} 
			dispatch({ type: ActionType.ADD_COMMENT, payload: comment });
			textAreaRef.current!.value = '';
		}
    }

	return (
		<div className='flex items-start gap-4 w-full p-6 rounded-lg bg-white'>
			<img
				src={user.image.png}
				alt='avatar'
				className='w-8 h-8 rounded-full'
			/>
			<textarea
				ref={textAreaRef}
				className='flex-grow border rounded px-4 py-2 active:outline-primary-blue focus:outline-primary-blue'
				rows={3}
				placeholder='Add a comment...'
			/>
			<button className='px-6 py-2 text-white font-semibold bg-primary-blue rounded-lg' onClick={handleSendComment}>
				Send
			</button>
		</div>
	);
}
