import React, { useState, useEffect, useContext } from "react";
import { getApi } from "../api";
import { AuthContext } from "../App";
import { OneComment } from '../components';


const MypageComment = () => {
    let dumpdata = {
        "myComment": [
            {
                "_id": "622aefb3e7f1228834012443",
                "userId": 3,
                "writer": "tester",
                "postNumber": 1,
                "content": "댓글테슽트1",
                "isDeleted": false,
                "depth": 1,
                "date": "2022-03-11 15:44:03"
            }
        ]
    };
    const authContext = useContext(AuthContext);
    // const [myComments, setMyComments] = useState(dumpdata.myComment);  // API TEST
    const [myComments, setMyComments] = useState([]);

    useEffect(() => {
        const getMypageComment = async() => {
            await getApi(
                {},
                '/mypage/comment',
                authContext.state.token
            )
            .then(({ status, data }) => {
                if (status === 200) {
                    console.log(data);
                    setMyComments(data.myComment);
                }
            })
            .catch((e) => {
                console.log(e);
            });
        }
        getMypageComment();
    }, []);

    return (
        <div>
            {myComments.length === 0 ? (
                <p>작성한 댓글이 없습니다.</p>
            ) : (
                myComments.map(comment => (
                    comment.isDeleted ? (
                        <></>
                    ) : (
                        <OneComment
                            key={comment._id}
                            comment={comment}
                            page={'mypage'}
                            parent={'parent'}
                        />
                    )
                ))
            )}

            
        </div>
    )
}

export default MypageComment; 