import React from 'react';
import { Comment, Reply } from '../types/commentTypes';
import { handleReplySubmit } from './commentActions';

interface RenderCommentProps {
    comment: Comment | Reply;
    parentId: string;
    ogId: string;

    replyingTo: string | null;
    replyContent: string;
    comments: Comment[];
    setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
    setReplyContent: React.Dispatch<React.SetStateAction<string>>;
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const RenderComment: React.FC<RenderCommentProps> = ({
    comment,
    parentId,
    ogId,
    replyingTo,
    replyContent,
    comments,
    setReplyingTo,
    setReplyContent,
    setComments,
}) => {
    const isReplying = replyingTo === ogId; // Match with ogId to ensure textarea placement under the correct comment

    return (
        <div key={ogId} className="mb-4">
            <div className="flex items-start">
                <div className="ml-2">
                    <div className="font-semibold">{comment.user.username}</div>
                    {'replyingTo' in comment && (
                        <span className="text-sm text-gray-500">@{comment.replyingTo}</span>
                    )}
                </div>
            </div>
            <p className="mt-2">{comment.content}</p>
            {comment.user.username === 'juliusomo' && (
                <div className='text-black'>
                    <div>Delete</div>
                    <div>Edit</div>

                </div>)}
            <button
                onClick={() => {
                    if (isReplying) {
                        setReplyingTo(null);
                        setReplyContent('');
                    } else {
                        setReplyingTo(ogId); // Use ogId to set the replying state
                        setReplyContent(`@${comment.user.username} `);
                    }
                }}
                className="text-blue-500 hover:text-blue-600"
            >
                Reply
            </button>

            {isReplying && (
                <div className="mt-2">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                    <button
                        onClick={() =>
                            handleReplySubmit(
                                parentId,
                                replyContent,
                                comments,
                                setComments,
                                setReplyContent,
                                setReplyingTo
                            )
                        }
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Reply
                    </button>
                </div>
            )}


        </div>
    );
};


export default RenderComment;
