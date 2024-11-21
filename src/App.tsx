import { useState, useEffect } from 'react';
import { Comment } from './types/commentTypes';
import RenderComment from './components/RenderComment';
import { newComment } from './components/newComment';

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>(''); // Corrected type


  useEffect(() => {
    fetch('http://localhost:3000/')
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error('Error fetching comments:', err));
  }, []);

  return (
    <div className=" max-w-2xl p-4 flex flex-col gap-6">
      {comments.map((comment) => (
        <div key={comment._id} className=' flex flex-col gap-6'>
          <RenderComment
            comment={comment}
            replyingTo={replyingTo}
            parentId={comment._id}
            ogId={comment._id}
            replyContent={replyContent}
            comments={comments}
            setReplyingTo={setReplyingTo}
            setReplyContent={setReplyContent}
            setComments={setComments}
          />
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 border-l-2 border-gray-200 pl-4 flex flex-col gap-6">
              {comment.replies.map((reply) => (
                <RenderComment
                  // key={reply.id}
                  ogId={reply.id}
                  comment={reply}
                  parentId={comment._id}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  comments={comments}
                  setReplyingTo={setReplyingTo}
                  setReplyContent={setReplyContent}
                  setComments={setComments}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mt-2  bg-white p-5 flex  gap-4 justify-between">
        <img src='./images/avatars/image-juliusomo.png' width={40} className='h-9' />
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          rows={3}
          placeholder='Add a new comment...'
        />
        <button
          onClick={() => {
            newComment(

              commentContent,
              comments,
              setComments,
              setCommentContent,
            )
          }

          }
          className="mt-2 px-4 py-2 h-[46px] w-[120px] bg-moderate-blue text-white rounded-lg hover:bg-light-grayish-blue"
        >
          <b>SEND</b>
        </button>
      </div>

    </div>
  );
};

export default Comments;
