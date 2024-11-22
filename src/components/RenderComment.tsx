import React, { useState } from 'react';
import { Comment, Reply } from '../types/commentTypes';
import { handleReplySubmit } from './commentActions';
import styles from './RenderComment.module.css';
import { handleDelete, handleEdit } from './deleteAndEdit';
import axios from 'axios';
import { handleScoreChange } from './score';

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
    refreshComments: () => Promise<void>; // Add this line to the interface

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
    refreshComments,
}) => {
    const isReplying = replyingTo === ogId; // Match with ogId to ensure textarea placement under the correct comment
    const [isOpen, setIsOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editContent, setEditContent] = useState<string>("")
    const [replyto, setReplyTo] = useState<string>("")


    // Open modal and set the current comment ID
    const openModal = () =>
        setIsOpen(true);


    // Close modal
    const closeModal = () =>
        setIsOpen(false);



    return (
        <div key={ogId} className="mb-4rounded">
            <div className=' bg-white p-5 flex rounded-lg  gap-4'>
                <div className='bg-light-gray w-11 h-28 rounded-lg  flex flex-col gap-4 justify-center items-center'>
                    <div className='cursor-pointer	'>
                        <img width={20} height={20}
                            src='./images/icon-plus.svg'
                            onClick={() => handleScoreChange(
                                ogId,
                                comments,
                                true, // For increment
                                parentId,
                                setComments,
                                refreshComments,)}
                            className="text-moderate-blue hover:text-light-grayish-blue h-3"
                            alt="Icon"
                        />
                    </div>
                    <div className='text-moderate-blue'>
                        {'score' in comment && (
                            <span className="text-sm "><b>{comment.score}</b></span>
                        )}
                    </div>

                    <div className='cursor-pointer	'>
                        <img width={20} height={20}
                            onClick={() => handleScoreChange(
                                ogId,
                                comments,
                                false, // For increment
                                parentId,

                                setComments,
                                refreshComments,)}

                            src='./images/icon-minus.svg' className="text-moderate-blue hover:text-light-grayish-blue h-1" />

                    </div>
                </div>
                <div className='w-[515px]'>

                    <div className=" customW flex justify-between ">
                        <div className='inline-flex gap-5 pt-2'>
                            <div className=''>
                                <img src={comment.user.image.png} width={40} className='h-9 ' />
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
                                        setReplyContent(`${comment.user.username} `);
                                        setReplyTo(`${comment.user.username} `);

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
                            className="w-full text-dark-blue px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                            rows={3}
                        />

                        <button className="mt-2 px-4 py-2 h-[46px] w-[100px] bg-moderate-blue text-white rounded-lg hover:bg-light-grayish-blue"

                            onClick={() => {
                                handleEdit(
                                    ogId,
                                    comments,
                                    editContent,
                                    parentId,
                                    setComments,
                                    refreshComments,

                                ); // Pass comments and setComments
                                setEdit(false);
                            }}

                        ><b>Update</b></button>
                    </div>) :
                        (<p className=" text-grayish-blue  text-sm ">
                            {'replyingTo' in comment && (
                                <span className="font-semibold text-moderate-blue">@{comment.replyingTo}</span>
                            )} {comment.content}</p>)}




                </div>
            </div>



            {isReplying && (
                <div className="mt-2  bg-white p-5 flex  gap-4 justify-between">
                    <img src='./images/avatars/image-juliusomo.png' width={40} className='h-9' />

                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg  text-dark-blue shadow-sm focus:outline-none focus:border-moderate-blue"
                        rows={3}
                    />
                    <button
                        onClick={() =>
                            handleReplySubmit(
                                parentId,
                                replyContent,
                                replyto,
                                comments,
                                setComments,
                                setReplyContent,
                                setReplyingTo

                            )
                        }
                        className="mt-2 px-4 py-2 h-[46px] w-[120px] bg-moderate-blue text-white rounded-lg hover:bg-light-grayish-blue"
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
                        <h1 className='text-dark-blue font-bold text-xl mb-6'>Delete Comment</h1>
                        <p className=" text-grayish-blue  text-sm ">
                            Are you sure you want to delete this comment? This will remove the
                            comment and can't be undone.
                        </p>
                        <div className="flex justify-center gap-4 mt-4 " >
                            <div
                                className=" rounded-lg cursor-pointer mt-2 px-4 py-2 bg-dark-blue hover:bg-grayish-blue"
                                onClick={closeModal}
                            >
                                <b> NO, CANCEL</b>
                            </div>
                            <div
                                className=" rounded-lg cursor-pointer mt-2 px-4 py-2 bg-soft-red hover:bg-pale-red"
                                onClick={() => {
                                    handleDelete(
                                        ogId,
                                        comments,
                                        parentId,
                                        setComments,
                                        refreshComments,
                                    ); // Pass comments and setComments
                                    closeModal();
                                }}
                            >
                                <b>YES, DELETE</b>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RenderComment;
