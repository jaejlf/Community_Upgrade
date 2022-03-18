import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../App"
import { getApi } from "../api"
import Search from "../assets/images/search.png"
import { Post } from "../components"
import Pagination from "react-js-pagination"
import "../styles/Board.css"

const Board = () => {
    const authContext = useContext(AuthContext)

    const [option, setOption] = useState("title") // title, content, user

    const initialList =
    {
        "allPost": [
            {
                "_id": "622f84557d6b184e6c1df712",
                "postNumber": 1,
                "title": "제목1 취업 고민 스펙 좀 봐주세요!",
                "content": "수정한 내용",
                "userId": 1,
                "writer": "홍길동",
                "viewCnt": 463,
                "date": "2022-03-17 01:00:16",
                "good": []
            },
            {
                "_id": "622f84827d6b184e6c1df71f",
                "postNumber": 3,
                "title": "취업 고민 스펙이요 빨리요!!!! 급해요!!!!!!!!!",
                "content": "초록",
                "userId": 1,
                "writer": "재재",
                "viewCnt": 53,
                "date": "2022-03-17 02:53:17",
                "good": []
            },
            {
                "_id": "622f84a37d6b184e6c1df727",
                "postNumber": 4,
                "title": "안녕하세요 가입 인사~~",
                "content": "yellow",
                "userId": 2,
                "writer": "룰루",
                "viewCnt": 73,
                "date": "2022-03-17 01:00:12",
                "good": []
            },
            {
                "_id": "622f84557d6b184e6c1df712",
                "postNumber": 1,
                "title": "제목1 취업 고민 스펙 좀 봐주세요!",
                "content": "수정한 내용",
                "userId": 1,
                "writer": "홍길동",
                "viewCnt": 463,
                "date": "2022-03-17 01:00:16",
                "good": []
            },
            {
                "_id": "622f84827d6b184e6c1df71f",
                "postNumber": 3,
                "title": "취업 고민 스펙이요 빨리요!!!! 급해요!!!!!!!!!",
                "content": "초록",
                "userId": 1,
                "writer": "재재",
                "viewCnt": 53,
                "date": "2022-03-17 02:53:17",
                "good": []
            },
            {
                "_id": "622f84a37d6b184e6c1df727",
                "postNumber": 4,
                "title": "안녕하세요 가입 인사~~",
                "content": "yellow",
                "userId": 2,
                "writer": "룰루",
                "viewCnt": 73,
                "date": "2022-03-17 01:00:12",
                "good": []
            },
            {
                "_id": "622f84557d6b184e6c1df712",
                "postNumber": 1,
                "title": "제목1 취업 고민 스펙 좀 봐주세요!",
                "content": "수정한 내용",
                "userId": 1,
                "writer": "홍길동",
                "viewCnt": 463,
                "date": "2022-03-17 01:00:16",
                "good": []
            },
            {
                "_id": "622f84827d6b184e6c1df71f",
                "postNumber": 3,
                "title": "취업 고민 스펙이요 빨리요!!!! 급해요!!!!!!!!!",
                "content": "초록",
                "userId": 1,
                "writer": "재재",
                "viewCnt": 53,
                "date": "2022-03-17 02:53:17",
                "good": []
            },
            {
                "_id": "622f84a37d6b184e6c1df727",
                "postNumber": 4,
                "title": "안녕하세요 가입 인사~~",
                "content": "yellow",
                "userId": 2,
                "writer": "룰루",
                "viewCnt": 73,
                "date": "2022-03-17 01:00:12",
                "good": []
            },
            {
                "_id": "622f84827d6b184e6c1df71f",
                "postNumber": 3,
                "title": "취업 고민 스펙이요 빨리요!!!! 급해요!!!!!!!!!",
                "content": "초록",
                "userId": 1,
                "writer": "재재",
                "viewCnt": 53,
                "date": "2022-03-17 02:53:17",
                "good": []
            },
            {
                "_id": "622f84a37d6b184e6c1df727",
                "postNumber": 4,
                "title": "안녕하세요 가입 인사~~",
                "content": "yellow",
                "userId": 2,
                "writer": "룰루",
                "viewCnt": 73,
                "date": "2022-03-17 01:00:12",
                "good": []
            },
        ]
    }

    const searchDumpData = [
        {
            viewCnt: 0,
            _id: "62279c3e0852694605079440",
            title: "test-gaeun",
            content: "test-gaeunt",
            postNumber: 8,
            date: "2022-03-09 03:11:10",
            viewCnt: 3,
            goodCnt: 5,
            good: [],
        },
    ]

    const [list, setList] = useState([])
    // const [list, setList] = useState(initialList.allPost);  // API TEST
    const [hotList, setHotList] = useState([])

    // const [listNum, setListNum] = useState(initialList.allPost.length);  // API TEST
    const [listNum, setListNum] = useState()

    const enterSearchInput = async (e) => {
        if (e.key === 'Enter') {
            await getApi({},
                `/search/${option}/${e.target.value}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    console.log('search 결과', status, data);
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
                console.log('search 결과', status, data);
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


    const [page, setPage] = useState(1)

    useEffect(() => {
        const getListNum = async () => {
            await getApi({},
                `/board/counter`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    console.log('GET /board/counter', status, data);
                    setListNum(data.totalPost);
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        const getList = async () => {
            await getApi({},
                `/board/?page=1`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    console.log('get page=1 API:', status, data);
                    setList(data.allPost);
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        const getHotList = async () => {
            await getApi({},
                `/board/hotposts`, // api test 추후 변경
                authContext.state.token
            )
                .then(({ status, data }) => {
                    // console.log('hotlist:', status, data);
                    setHotList(data.hotPost);
                })
                .catch((e) => {
                    console.log(e);
                });

        };
        getListNum();
        getList();
        // getHotList();
    }, []);

    const handlePageChange = async (page) => {
        setPage(page);
        await getApi(
            {},
            `/board/?page=${page}`,
            authContext.state.token
        )
            .then(({ status, data }) => {
                console.log('paging API:', status, data.allPost);
                if (status === 200) {
                    setList(data.allPost);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };


    return (
        <div className='board-page'>
            <div className="searchbar">
                <img src={Search} className="search-img" onClick={clickSearchInput} />
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

            <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={listNum * 1}
                pageRangeDisplayed={10}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default Board
