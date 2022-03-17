import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { getApi } from '../api';
import Search from '../assets/images/search.png';
import { Post } from '../components';
import '../styles/Board.css';


const Board = () => {
    const authContext = useContext(AuthContext);

    const [option, setOption] = useState("title");  // title, content, user


    const initialList =
        [
            {
                "_id": "6226ecb59ae535d10e6e484c",
                "viewCnt": 3,
                "title": "제목1",
                "content": "내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\
                dlㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ이렇게 내용이 길면은ㅇ잘려요ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\
                sdfㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇsdlflk",
                "postNumber": 1,
                "date": "2022-03-08 14:42:13",
                "viewCnt": 3,
                "goodCnt": 5,
                "good": [],
            },
            {
                "_id": "6226ecba9ae535d10e6e4851",
                "viewCnt": 3,
                "title": "제목2",
                "content": "<p>내용2</p>",
                "postNumber": 2,
                "date": "2022-03-08 14:42:18",
                "viewCnt": 3,
                "goodCnt": 5,
                "good": [],
            },
            {
                "_id": "6226ecbd9ae535d10e6e4856",
                "viewCnt": 3,
                "title": "제목3",
                "content": "<h3>내용3</h3>",
                "postNumber": 3,
                "date": "2022-03-08 14:42:21",
                "viewCnt": 3,
                "goodCnt": 5,
                "good": [],
            }
        ];

    const searchDumpData = 
        [
            {
                "viewCnt": 0,
                "_id": "62279c3e0852694605079440",
                "title": "test-gaeun",
                "content": "test-gaeunt",
                "postNumber": 8,
                "date": "2022-03-09 03:11:10",
                "viewCnt": 3,
                "goodCnt": 5,
                "good": [],
            }
        ];

    // const [list, setList] = useState([]);
    const [list, setList] = useState(initialList);  // API TEST

    const enterSearchInput = async (e) => {
        if (e.key === 'Enter') {
            await getApi({},
                `/search/${option}/${e.target.value}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    // console.log('search 결과', status, data);
                    if (data) {
                        setList(data);
                    } else {
                        setList([]);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    const clickSearchInput = async (e) => {
        await getApi({},
            `/search/${option}/${e.target.value}`,
            authContext.state.token
        )
            .then(({ status, data }) => {
                // console.log('search 결과', status, data);
                if (data) {
                    setList(data);
                } else {
                    setList([]);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }



    useEffect(() => {
        const getList = async () => {
            await getApi({},
                `/board/posts`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    console.log(status, data);
                    if (data.allPost) {
                        setList(data.allPost);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        getList();

    }, [authContext.state.token]);

    return (
        <div className='board-page'>
            <div className="searchbar">
                <img src={Search} className="search-img" onClick={clickSearchInput}/>
                <input
                    className="search-input"
                    onKeyPress={enterSearchInput}
                    placeholder="검색어 입력 후 Enter 키를 입력하세요."
                />
                <div className="search-options">
                    <button
                        className={
                            option === "title" ?
                                'search-option-select-o' : 'search-option-select-x'
                        }
                        onClick={() => setOption("title")}
                    >글제목</button>
                    <button
                        className={
                            option === "content" ?
                                'search-option-select-o' : 'search-option-select-x'
                        }
                        onClick={() => setOption("content")}
                    >글내용</button>
                    <button
                        className={
                            option === "user" ?
                                'search-option-select-o' : 'search-option-select-x'
                        }
                        onClick={() => setOption("user")}
                    >작성자</button>
                </div>
            </div>

            <div className="board-list-contents">
                {
                    list.length ?
                        list.map((e, idx) => (
                            <Post
                                key={idx}
                                post={e}
                            />
                                
                        )) :
                        <div className="empty-title">
                            글 없음
                        </div>
                }
            </div>
        </div>
    );
};

export default Board;