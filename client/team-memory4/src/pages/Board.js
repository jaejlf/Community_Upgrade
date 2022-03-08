import React, { useState, useEffect, useContext } from 'react';
import { PostList } from '../components';
import { AuthContext } from '../App';
import axios from "axios";
import '../styles/Board.css';

const Board = () => {
    const authContext = useContext(AuthContext);

    const initialList =
        [
            {
                "_id": "6226ecb59ae535d10e6e484c",
                "title": "제목1",
                "content": "내용1",
                "postNumber": 1,
                "date": "2022-03-08 14:42:13"
            },
            {
                "_id": "6226ecba9ae535d10e6e4851",
                "title": "제목2",
                "content": "내용2",
                "postNumber": 2,
                "date": "2022-03-08 14:42:18"
            },
            {
                "_id": "6226ecbd9ae535d10e6e4856",
                "title": "제목3",
                "content": "내용3",
                "postNumber": 3,
                "date": "2022-03-08 14:42:21"
            }
        ];

    // const [list, setList] = useState([]);
    const [list, setList] = useState(initialList);


    useEffect(() => {
        // setList([]);
        const getPostList = async () => {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                },
            };
            // const token = authContext.state.token;
            // if (token) {
            //     config.headers["Authorization"] = `Bearer ${token}`;
            // }
            await axios.get(`http://--/api/post/getAllPost`, config)
                .then(({ status, data }) => {
                    console.log(status, data);
                    if (data.allPost) setList(data.allPost);
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        // getPostList();
    }, []);

    return (
        <div className='board-page'>
            {/* 추후 Search Bar */}
            <PostList />

            <div className="board-list-contents">
                {
                    list.length ?
                    list.map((e, idx) => (
                            <div className="content-section" key={idx}>
                                <div className='content-section-contents'>
                                    <div className="content-section-title">{e.title}</div>
                                    <div className="content-section-content">{e.content}</div>
                                    <div className="content-section-date">date: {e.date}</div>
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