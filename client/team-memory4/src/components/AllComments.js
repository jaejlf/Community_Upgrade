import React, { useState, useContext, useEffect } from "react";
import '../styles/Comments.css';
import { getApi, deleteApi } from '../api';
import { AuthContext } from "../App";
import { RecommentContext } from "../pages/PostDetail";

const Comment = ({ comment }) => {
    const authContext = useContext(AuthContext);
    const recommentContext = useContext(RecommentContext);

    const recommentHandler = () => {
        if (recommentContext.state.recommentId === comment._id) { // 답글 누른거 또 누름 = 취소
            recommentContext.dispatch({ 
                type: "recommentNonClick", 
                recommentId: null,
                recomment2Whom: null,
            });
        } else {
            recommentContext.dispatch({ 
                type: "recommentClick", 
                recommentId: comment._id,
                recomment2Whom: comment.writer,
            });
        }
    }

    const commentDeleteHandler = async () => {
        await deleteApi(
            {},
            `/comment/${comment._id}`,
            authContext.state.token
        )
        .then(({ status, data }) => {
            if (status === 200) {
                console.log('댓글삭제', status, data);
            } else if (status === 501) {
                alert("작성자만 댓글을 삭제할 수 있습니다.");
            }
        })
        .catch((e) => {
            console.log(e);
        });
    }

    return (
        <div className="all-comment-section">
            <div className={
                (comment.depth === 1 ? "one-comment-1" : "one-comment-2")}>
                <div className="comment-upper">
                    <p className="comment-upper-writer">{comment.writer}</p>
                    <p className="comment-upper-role">{comment.role === 1 ? ('일반회원') : ('기업회원')}</p>
                    <p className="comment-upper-date">{comment.date}</p>
                </div>
                <div className="comment-content">
                    {(
                        comment.isDeleted === false 
                        ? 
                        <p>{comment.content}</p> 
                        : 
                        <p>(삭제된 댓글입니다.)</p>
                    )}
                </div>
                <div className="comment-lower">
                    <p className="recomment-btn" onClick={recommentHandler}>답글쓰기</p>
                    {(
                        comment.auth === true ?
                        <p className="comment-del-btn" onClick={commentDeleteHandler}>삭제하기</p>
                        :
                        <></>
                    )}
                </div>
            </div>

        </div>
    )
}

const AllComments = ({ props }) => {
    const CommentsDumpData = [
        {
            "_id": "622aefb3e7f1228834012443",
            "userId": 3,
            "writer": "tester1",
            "postNumber": 1,
            "content": "댓글테슽트1",
            "isDeleted": false,
            "depth": 1,
            "date": "2022-03-11 15:44:03",
            "role": 1,
            "auth": true //true이면 작성자, false이면 작성자 아님
        },
        {
            "_id": "622aefb6e7f1228834012446",
            "userId": 3,
            "writer": "tester2",
            "postNumber": 1,
            "content": "댓글테슽트2",
            "isDeleted": false,
            "depth": 2,
            "date": "2022-03-11 15:44:06",
            "role": 2,
            "auth": false
        },
        {
            "_id": "622aefb8e7f1228834012449",
            "userId": 3,
            "writer": "tester3",
            "postNumber": 1,
            "content": "수정된 댓글3",
            "isDeleted": true,
            "depth": 2,
            "date": "2022-03-11 15:45:33",
            "role": 1,
            "auth": true
        },
        {
            "_id": "622af0ece5d359f7b3a451ea",
            "userId": 3,
            "writer": "tester4",
            "postNumber": 1,
            "content": "댓글테슽트3",
            "isDeleted": false,
            "depth": 1,
            "date": "2022-03-11 15:49:16",
            "role": 1,
            "auth": false
        }
    ];

    const authContext = useContext(AuthContext);
    const [allComment, setAllComment] = useState(CommentsDumpData);

    let postId = props * 1;

    useEffect(() => {
        const getAllComments = async () => {
            // API Test Code //
            setAllComment(CommentsDumpData);

            /////////////////////
            await getApi(
                {},
                `/comment/${postId}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        console.log(data);
                        setAllComment(data);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        getAllComments();
        console.log(allComment);
    }, []);



    return (
        <div className='all-comments-section'>
            {allComment.map(comment => (
                <Comment
                    comment={comment}
                />
            ))}
        </div>
    )
}

export default AllComments; 