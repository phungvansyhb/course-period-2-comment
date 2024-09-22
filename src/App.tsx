import { useState, useReducer } from 'react';
import './App.css';
import Card from './components/Card';
import MyComment from './components/MyComment';
import data from './data.json';

export type CommentType = (typeof data.comments)[number];

export type ReplyType = (typeof data.comments)[number]['replies'][number];

export type UserType = typeof data.currentUser;

export enum ActionType {
	ADD_COMMENT = 'ADD_COMMENT',
	UPDATE_COMMENT = 'UPDATE_COMMENT',
	DELETE_COMMENT = 'DELETE_COMMENT',
	ADD_REPLIES = 'ADD_REPLIES',
	UPDATE_REPLIES = 'UPDATE_REPLIES',
	DELETE_REPLIES = 'DELETE_REPLIES',
}

function AppReducer(
	state: typeof data,
	action: { type: ActionType; payload: CommentType & { parentId?: React.Key } }
) {
	switch (action.type) {
		case ActionType.ADD_COMMENT:
			return {
				...state,
				comments: [...state.comments, action.payload],
			};
		case ActionType.UPDATE_COMMENT:
			if (!action.payload.parentId) {
				return {
					...state,
					comments: state.comments.map((comment) => {
						if (comment.id === action.payload.id) {
							return action.payload;
						}
						return comment;
					}),
				};
			} else {
				return {
					...state,
					comments: state.comments.map((comment) => {
						if (comment.id === action.payload.parentId) {
							return {
								...comment,
								replies: comment.replies.map((reply) => {
									if (reply.id === action.payload.id) {
										return action.payload as any;
									}
									return reply;
								}),
							};
						} else return comment;
					}),
				};
			}

		case ActionType.DELETE_COMMENT:
			const isParent = state.comments.some((comment) => comment.id === action.payload.id);
			if (isParent) {
				return {
					...state,
					comments: state.comments.filter((comment) => comment.id !== action.payload.id),
				};
			} else {
				return {
					...state,
					comments: state.comments.map((comment) => {
						if (comment.replies.some((reply) => reply.id === action.payload.id)) {
							comment.replies = comment.replies.filter(
								(reply) => reply.id !== action.payload.id
							);
							return comment;
						} else return comment;
					}),
				};
			}

		case ActionType.ADD_REPLIES:
			return {
				...state,
			};
		default:
			return state;
	}
}

function App() {
	const [dataApp, dispatch] = useReducer(AppReducer, data);

	function renderCard(comment: CommentType) {
		const CardItem = (commentItem: CommentType, parentId?: React.Key) => {
			return (
				<Card.CardContainer
					dispatch={dispatch}
					key={commentItem.id}
					parentId={parentId}
					comment={commentItem}
					user={data.currentUser}>
					<div className='flex gap-4 w-full'>
						<Card.CardReaction />
						<div className='space-y-6 flex-grow'>
							<div className='flex gap-4 justify-between '>
								<Card.CardAvatar />
								<Card.CardAction />
							</div>
							<Card.CardContent />
						</div>
					</div>
				</Card.CardContainer>
			);
		};

		if (comment.replies.length > 0) {
			return (
				<div className='w-full'>
					{CardItem(comment)}
					<div className='ml-10 pl-8 border-l border-solid border-primary-light-blue mt-4 space-y-4'>
						{comment.replies.map((reply) =>
							CardItem({ ...reply, replies: [] }, comment.id)
						)}
					</div>
				</div>
			);
		}
		return CardItem(comment);
	}
	return (
		<div className='flex flex-col items-center gap-4'>
			{dataApp.comments.map((comment) => renderCard(comment))}
			<MyComment
				user={dataApp.currentUser}
				dispatch={dispatch}
			/>
		</div>
	);
}

export default App;
