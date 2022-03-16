import React, { useState, useEffect, useContext } from "react";
import { getApi } from "../api";
import { AuthContext } from "../App";
import { Post } from '../components';



const MypageScrap = () => {
    let dumpdata = {
        "scraps": [
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
                    setMyScrapList(data.myPost);
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