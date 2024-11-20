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

    //gap-72 
    return (
        <div key={ogId} className="mb-4rounded">
            <div className=' bg-white p-3  flex  gap-4'>
                <div className='bg-light-gray w-5 '>
                    <img src='./images/icon-plus.svg' className="text-moderate-blue hover:text-light-grayish-blue h-3" />
                    {'score' in comment && (
                        <span className="text-sm ">{comment.score}</span>
                    )}
                    <img src='./images/icon-minus.svg' className="text-moderate-blue hover:text-light-grayish-blue h-1" />
                </div>
                <div>

                    <div className="flex justify-between">


                        <div className='inline-flex gap-5'>
                            <div className=''>
                                <img src={comment.user.image.png} width={40} className='h-9' />
                            </div>
                            <div className="font-semibold text-dark-blue ">{comment.user.username}</div>
                            <p className='text-grayish-blue '> {comment.createdAt}</p>
                        </div>
                        <div className=' relative '>
                            {comment.user.username === 'juliusomo' ? (
                                <div className=" inline-flex gap-4">

                                    <div
                                        className='inline-flex gap-1 '
                                        onClick={() => openModal()

                                        } // Use `_id` if it's a `Comment`
                                    >
                                        <div className='py-4'>
                                            <img src="./images/icon-delete.svg" className=" hover:color-light-grayish-blue h-3" />
                                        </div>
                                        <button
                                            className="text-soft-red hover:text-pale-red"

                                        ><b>Delete</b></button>

                                    </div>

                                    <div className='inline-flex gap-1 ' onClick={() => {
                                        setEdit(true);               // Enter edit mode
                                        setEditContent(comment.content); // Initialize editContent with the original content
                                    }}>

                                        <div className='py-4'>
                                            <img src="./images/icon-edit.svg" className=" hover:color-light-grayish-blue h-3" />
                                        </div>
                                        <button
                                            className="text-moderate-blue hover:text-light-grayish-blue"

                                        ><b>Edit</b></button>

                                    </div>
                                </div>
                            ) : (
                                <div className='inline-flex gap-1  ' onClick={() => {
                                    if (isReplying) {
                                        setReplyingTo(null);
                                        setReplyContent('');
                                    } else {
                                        setReplyingTo(ogId); // Use ogId to set the replying state
                                        setReplyContent(`@${comment.user.username} `);
                                    }
                                }}>
                                    <div className='py-4'>
                                        <img src="./images/icon-reply.svg" className=" hover:color-light-grayish-blue h-3" />
                                    </div>
                                    <button

                                        className="text-moderate-blue hover:text-light-grayish-blue"
                                    >
                                        <b>Reply</b>
                                    </button>
                                </div>
                            )}


                        </div>

                    </div>
                    {edit === true ? (<div >
                        <textarea
                            value={editContent} // Controlled input bound to state
                            onChange={(e) => setEditContent(e.target.value)} // Update state as user types
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
                        (<p className="mt-2 text-grayish-blue">
                            {'replyingTo' in comment && (
                                <span className="text-sm text-gray-500">@{comment.replyingTo}</span>
                            )} {comment.content}</p>)}




                </div>
            </div>



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
