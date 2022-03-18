import React, { useState, useEffect, useContext } from "react";
import { getApi } from "../api";
import { AuthContext } from "../App";
import { Post } from '../components';



const MypageScrap = () => {
    let dumpdata = {
        "scraps": [
            {
                "_id": "622f84557d6b184e6c1df712",
                "postNumber": 1,
                "title": "수정한 제목",
                "content": "수정한 내용",
                "userId": 1,
                "writer": "aaa",
                "viewCnt": 463,
                "date": "2022-03-17 01:00:16",
                "good": []
            },
            {
                "_id": "622f84827d6b184e6c1df71f",
                "postNumber": 3,
                "title": "초록",
                "content": "초록",
                "userId": 1,
                "writer": "aaa",
                "viewCnt": 53,
                "date": "2022-03-17 02:53:17",
                "good": []
            }
        ]
    };

    const authContext = useContext(AuthContext);
    const [myScrapList, setMyScrapList] = useState([]);
    // const [myScrapList, setMyScrapList] = useState(dumpdata.scraps); // API TEST

    useEffect(() => {
        const getMyScrap = async() => {
            await getApi(
                {},
                '/mypage/scrap',
                authContext.state.token
            )
            .then(({ status, data }) => {
                if (status === 200) {
                    console.log(data);
                    setMyScrapList(data.scraps);
                }
            })
            .catch((e) => {
                console.log(e);
            });
        }
        getMyScrap();
    }, []);

    return (
        <div>
            {myScrapList.length === 0 ? (
                <p>스크랩한 글이 없습니다.</p>
            ): (
                myScrapList.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                        />
                ))
            )}
        </div>
    )
}

export default MypageScrap; 