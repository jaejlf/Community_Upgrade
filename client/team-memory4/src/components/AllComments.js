import React, { useState, useContext, useEffect } from "react";
import { getApi } from '../api';
import { AuthContext } from "../App";
import { ParentComment } from '../components';
import '../styles/Comments.css';


const AllComments = ({ props }) => {
    const CommentsDumpData = [
        {
            "_id": "6230aaff15a4503f3abbb926",
            "userId": 3,
            "writer": "tester1",
            "postNumber": 1,
            "content": "부모댓글1",
            "isDeleted": false,
            "depth": 1,
            "date": "2022-03-11 15:44:03",
            "role": 1,
            "auth": true //true이면 작성자, false이면 작성자 아님
        },
        {
            "_id": "6230aaff15a4503f3abbb926",
            "userId": 3,
            "writer": "tester1",
            "postNumber": 1,
            "content": "depth2 없애주나",
            "isDeleted": false,
            "depth": 2,
            "date": "2022-03-11 15:44:03",
            "role": 1,
            "auth": true //true이면 작성자, false이면 작성자 아님
        },
        {
            "_id": "622af0ece5d359f7b3a451ea",
            "userId": 3,
            "writer": "tester4",
            "postNumber": 1,
            "content": "부모3",
            "isDeleted": false,
            "depth": 1,
            "date": "2022-03-11 15:49:16",
            "role": 1,
            "auth": false
        },
        {
        "_id": "6230b35bb0561a11d2816474",
        "userId": 6,
        "writer": "fff",
        "postNumber": 2,
        "content": "fff 댓글스",
        "isDeleted": false,
        "parentId": "6230aaff15a4503f3abbb926",
        "depth": 1,
        "date": "2022-03-16 00:40:11"
        },
    ];

    const authContext = useContext(AuthContext);
    const [allComment, setAllComment] = useState([]);
    const [parentComment, setParentComment] = useState([]);

    let postId = props * 1;

    useEffect(() => {
        const getAllComments = async () => {
            // API Test Code //
            // setAllComment(CommentsDumpData);
            await getApi(
                {},
                `/comment/${postId}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        // console.log(`GET /comment/${postId}`, data);
                        setAllComment(data);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        getAllComments();
        // console.log(allComment);

        // depth=2 제거
        // setAllComment(allComment.filter(allComment => allComment.depth !== 2));
        
    }, []);

    useEffect(() => {
        const allCommentFiltered = allComment.filter(allComment => allComment.depth !== 2);
        setParentComment(allCommentFiltered);
        // console.log(parentComment);
    }, [allComment]);

    // all comment를 받아온 다음, 그거 depth=1인 _id들 돌면서 /comment/:parentId/child api 호출. 

    return (
        <div className='all-comments-section'>
            {parentComment.map(comment => (
                <ParentComment
                    key={comment._id}
                    comment={comment}
                    page={'post'}
                    who={'parent'}
                />
            ))}
        </div>
    )
}

export default AllComments; 