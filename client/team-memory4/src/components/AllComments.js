import React, { useState, useContext, useEffect } from "react";
import '../styles/Comments.css';
import { getApi, deleteApi } from '../api';
import { AuthContext } from "../App";
import { RecommentContext } from "../pages/PostDetail";
import { Comment } from '../components';


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
            // setAllComment(CommentsDumpData);

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