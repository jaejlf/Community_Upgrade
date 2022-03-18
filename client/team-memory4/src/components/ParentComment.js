import React, { useState, useContext, useEffect } from "react"
import "../styles/Comments.css"
import { getApi } from "../api"
import { AuthContext } from "../App"
import { OneComment } from "."

const ParentComment = ({ comment, page, who }) => {
  // console.log(comment.content);
  // console.log(comment._id);
  // console.log(page);
  // console.log(who);

  const childDumpdata = [
    {
      "_id": "6230b35bb0561a15d2816474",
      "userId": 6,
      "writer": "fff",
      "postNumber": 2,
      "content": "fff 댓글의 대댓글",
      "isDeleted": false,
      "parentId": "6230aaff15a4503f3abbb926",
      "depth": 2,
      "date": "2022-03-16 00:40:11"
    },
    {
      "_id": "6230b982fc6693bb8fefd9da",
      "userId": 6,
      "writer": "fff",
      "postNumber": 2,
      "content": "fff 댓글의 대댓글2",
      "isDeleted": false,
      "parentId": "6230aaff15a4503f3abbb926",
      "depth": 2,
      "date": "2022-03-16 01:06:26"
    },
  ];

  const authContext = useContext(AuthContext)
  const [childComment, setChildComment] = useState([]);

  useEffect(() => {
    const checkChild = async () => {
      setChildComment([]);
      await getApi(
        {},
        `/comment/${comment._id}/child`,
        authContext.state.token
      )
        .then(({ status, data }) => {
          // console.log('GET child comment: ', status, data);
          if (status === 200) {
            setChildComment(data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    checkChild();
  }, []);

  // if child가 없으면 하나만 렌더링하면 됨
  // else child가 있다면, 하나 렌더링하고 map 돌면서 자식들도 렌더링

  return (
    <div className="all-comment-section">
      {
        childComment === [] ? ( // child 없다면
          <OneComment
            key={comment._id}
            comment={comment}
            page={'post'}
            who={'parent'}
          />
        ) : ( // child 있다면
          <>
            <OneComment
              key={comment._id}
              comment={comment}
              page={'post'}
              who={'parent'}
            />
            {childComment.map(comment => (
              <OneComment
                key={comment._id}
                comment={comment}
                page={'post'}
                who={'child'}
              />
            ))}
          </>
        )
      }
      
    </div>
  )
}

export default ParentComment;
