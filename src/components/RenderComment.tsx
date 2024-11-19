import React, { useState } from 'react';
import { Comment, Reply } from '../types/commentTypes';
import { handleReplySubmit } from './commentActions';
import styles from './RenderComment.module.css';
import { handleDelete, handleEdit } from './deleteAndEdit';

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
    const [isOpen, setIsOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editContent, setEditContent] = useState<string>("")
    // Open modal and set the current comment ID
    const openModal = () =>
        setIsOpen(true);


    // Close modal
    const closeModal = () =>
        setIsOpen(false);

    // Type guard to check if the comment is a Comment
    // const isComment = (comment: Comment | Reply): comment is Comment => {
    //     return '_id' in comment;
    // };

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
            {edit === true ? (<div >
                <textarea
                    value={comment.content}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                />

                <button
                    onClick={() => {
                        handleEdit(
                            ogId,
                            comments,
                            editContent,
                            parentId,
                            setComments,

                        ); // Pass comments and setComments
                        setEdit(false);
                    }}

                >Update</button>
            </div>) :
                (<p className="mt-2">{comment.content}</p>)}

            {comment.user.username === 'juliusomo' && (
                <div className="text-black">

                    <div
                        className=""
                        onClick={() => openModal()

                        } // Use `_id` if it's a `Comment`
                    >
                        Delete
                    </div>

                    <div onClick={() => setEdit(true)}>Edit</div>
                </div>
            )}
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

            {isOpen && (
                <div
                    className={styles.modal}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className={styles.modalContent}>
                        <p>
                            Are you sure you want to delete this comment? This will remove the
                            comment and can't be undone.
                        </p>
                        <div className="flex justify-end gap-4 mt-4">
                            <div
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={closeModal}
                            >
                                NO, CANCEL
                            </div>
                            <div
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => {
                                    handleDelete(
                                        ogId,
                                        comments,
                                        parentId,
                                        setComments,

                                    ); // Pass comments and setComments
                                    closeModal();
                                }}
                            >
                                YES, DELETE
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RenderComment;
