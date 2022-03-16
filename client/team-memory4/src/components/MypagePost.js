import React, { useState, useEffect, useContext } from "react";
import { getApi } from "../api";
import { AuthContext } from "../App";
import { Post } from '../components';

const MypagePost = () => {
    const authContext = useContext(AuthContext);

    const dumpdata = {
        "myPost": [
            {
                "_id": "622acb33195047e5559a2780",
                "postNumber": 3,
                "title": "제목3",
                "content": "내용3",
                "userId": 3,
                "writer": "tester",
                "viewCnt": 0,
                "date": "2022-03-11 13:08:19"
            },
            {
                "_id": "622ae9b4eccbe4193f2ed234",
                "postNumber": 5,
                "title": "제목5",
                "content": "내용5",
                "userId": 3,
                "writer": "tester",
                "viewCnt": 0,
                "comment": [],
                "date": "2022-03-11 15:18:28"
            }
        ]
    };

    // const [myPostList, setMyPostList] = useState(dumpdata.myPost);  // API TEST
    const [myPostList, setMyPostList] = useState([]);

    useEffect(() => {
        const getMyPost = async() => {
            await getApi(
                {},
                '/mypage/post',
                authContext.state.token
            )
            .then(({ status, data }) => {
                if (status === 200) {
                    console.log(data);
                    setMyPostList(data.myPost);
                }
            })
            .catch((e) => {
                console.log(e);
            });
        }
        getMyPost();
    }, []);

    return (
        <div>
            {myPostList.length === 0 ? (
                <p>작성한 글이 없습니다.</p>
            ): (
                myPostList.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                        />
                ))
            )}
        </div>
    )
}

export default MypagePost; 