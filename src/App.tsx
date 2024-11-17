import React, { useState, useEffect } from 'react';
import { Comment } from './types/commentTypes';
import RenderComment from './components/RenderComment';

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error('Error fetching comments:', err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {comments.map((comment) => (
        <div key={comment._id}>
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
            <div className="ml-8 border-l-2 border-gray-200 pl-4">
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
    </div>
  );
};

export default Comments;
