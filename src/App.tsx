import { useState, useEffect } from 'react';
import axios from 'axios';
import { Comment } from './types/commentTypes'; // Adjust path based on folder structure

const App = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/')
      .then((response) => {
        console.log(response.data); // Debugging
        setComments(response.data); // Update the state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className=' flex flex-col gap-3'>
      {comments.map((comment) => (
        <div key={comment._id} className="bg-white" >
          <div className="">
            <div>{comment.score}</div>
            <span className="">{comment.user.username}</span>
            <p className="">{comment.content}</p>
            <div> reply</div>
          </div>

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="bg-white">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="">
                  <div className="">
                    <span className="">{reply.user.username}</span>
                  </div>
                  <p className="">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
