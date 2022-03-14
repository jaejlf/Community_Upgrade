import React, { useState, useEffect, useContext } from 'react';
import { SearchBar } from '../components';
import { AuthContext } from '../App';
import axios from "axios";
import '../styles/Board.css';
import { getApi } from '../api';
import { useNavigate } from "react-router-dom";
import Search from '../assets/images/search.png';


const Board = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

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
                "date": "2022-03-08 14:42:13"
            },
            {
                "_id": "6226ecba9ae535d10e6e4851",
                "viewCnt": 3,
                "title": "제목2",
                "content": "내용2",
                "postNumber": 2,
                "date": "2022-03-08 14:42:18"
            },
            {
                "_id": "6226ecbd9ae535d10e6e4856",
                "viewCnt": 3,
                "title": "제목3",
                "content": "내용3",
                "postNumber": 3,
                "date": "2022-03-08 14:42:21"
            }
        ];

    // const [list, setList] = useState([]);
    const [list, setList] = useState(initialList);

    const contentsClickHandler = (postNumber) => {  // 클릭 시 글 상세 페이지로 이동
        // console.log(postNumber);
        navigate(`/post/${postNumber}`);
    }

    const enterSearchInput = async (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            await getApi({},
                `/search/${option}/${e.target.value}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    console.log(status, data);
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
                <img src={Search} className="search-img" />
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
                            <div
                                className="content-section"
                                key={idx}
                                onClick={() => contentsClickHandler(e.postNumber)}
                            >
                                <div className='content-section-contents'>
                                    <div className="content-section-title">{e.title}</div>
                                    <div className="content-section-content">{e.content}</div>
                                    <div className="content-section-date">{e.date}</div>
                                </div>
                            </div>
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