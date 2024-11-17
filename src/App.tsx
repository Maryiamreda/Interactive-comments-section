import { useState, useEffect } from 'react';
import axios from 'axios';
import { Comment, Reply } from './types/commentTypes';

const App = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});

  useEffect(() => {
    axios
      .get<Comment[]>('http://localhost:3000/')
      .then((response) => setComments(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleReply = (commentId: string) => {
    const replyContent = replyContents[commentId]?.trim();
    if (!replyContent) return;

    const comment = comments.find(c => c._id === commentId);
    if (!comment) return;

    const username = comment.user.username;
    const content = replyContent.startsWith(`@${username} `)
      ? replyContent.substring(`@${username} `.length)
      : replyContent;

    const replyData: Reply = {
      id: Date.now(),
      content: content,
      replyingTo: username,
      createdAt: new Date().toISOString(),
      user: {
        username: 'juliusomo',
        image: {
          webp: './images/avatars/image-juliusomo.webp',
          png: './images/avatars/image-juliusomo.png',
        },
      }
    };

    axios
      .post<Comment>(`http://localhost:3000/comments/${commentId}/reply`, replyData)
      .then((response) => {
        setComments(prev =>
          prev.map(c => (c._id === commentId ? response.data : c))
        );
        setReplyContents(prev => ({ ...prev, [commentId]: '' }));
      })
      .catch((error) => {
        console.error('Error adding reply:', error);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      });
  };

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <div key={comment._id} className="flex gap-6 flex-col">
          <div className="bg-white">
            <div>{comment.score}</div>
            <span>{comment.user.username}</span>
            <p>{comment.content}</p>
            <div
              className="cursor-pointer text-blue-500"
              onClick={() => {
                setComments(prev =>
                  prev.map(c =>
                    c._id === comment._id
                      ? { ...c, isReplying: !c.isReplying }
                      : c
                  )
                );
                // Only set the initial value if it's empty
                if (!replyContents[comment._id]) {
                  setReplyContents(prev => ({
                    ...prev,
                    [comment._id]: `@${comment.user.username} `,
                  }));
                }
              }}
            >
              reply
            </div>

            {comment.isReplying && (
              <div className="mt-3">
                <textarea
                  value={replyContents[comment._id] || ''}
                  onChange={(e) =>
                    setReplyContents(prev => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  className="border p-2 w-full min-h-[100px]"
                  placeholder="Add a reply..."
                />
                <button
                  className="ml-2 bg-blue-500 text-white p-2"
                  onClick={() => handleReply(comment._id)}
                >
                  Reply
                </button>
              </div>
            )}
          </div>

          {comment.replies?.length > 0 && (
            <div className="bg-white">
              {comment.replies.map((reply) => (
                <div key={reply.id}>
                  <span>{reply.user.username}</span>
                  <p>{reply.content}</p>
                  <div
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      setComments(prev =>
                        prev.map(c =>
                          c._id === comment._id
                            ? { ...c, isReplying: !c.isReplying }
                            : c
                        )
                      );
                      // Only set the initial value if it's empty
                      if (!replyContents[comment._id]) {
                        setReplyContents(prev => ({
                          ...prev,
                          [comment._id]: `@${comment.user.username} `,
                        }));
                      }
                    }}
                  >
                    reply
                  </div>
                </div>
              ))}
              {comment.isReplying && (
                <div className="mt-3">
                  <textarea
                    value={replyContents[comment._id] || ''}
                    onChange={(e) =>
                      setReplyContents(prev => ({
                        ...prev,
                        [comment._id]: e.target.value,
                      }))
                    }
                    className="border p-2 w-full min-h-[100px]"
                    placeholder="Add a reply..."
                  />
                  <button
                    className="ml-2 bg-blue-500 text-white p-2"
                    onClick={() => handleReply(comment._id)}
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>




          )}
        </div>
      ))}
    </div>
  );
};

export default App;