import React, { useState, useContext, useEffect } from "react";
import { getApi } from '../api';
import { AuthContext } from "../App";
import { Comment } from '../components';
import '../styles/Comments.css';


const AllComments = ({ props }) => {
    const CommentsDumpData = [
        {
            "_id": "6230aaff15a4503f3abbb926",
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
        }
    ];

    const authContext = useContext(AuthContext);
    const [allComment, setAllComment] = useState(CommentsDumpData);
    const [childComment, setChildComment] = useState(childDumpdata);

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
        // console.log(allComment);
    }, []);

    // all comment를 받아온 다음, 그거 depth=1인 _id들 돌면서 /comment/:parentId/child api 호출. 

    return (
        <div className='all-comments-section'>
            {allComment.map(comment => (
                <Comment
                    comment={comment}
                    page={'post'}
                />
            ))}
        </div>
    )
}

export default AllComments; 