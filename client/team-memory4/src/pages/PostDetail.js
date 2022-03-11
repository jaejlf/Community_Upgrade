import React, { useEffect, useContext, useState } from 'react';
import { useParams } from "react-router-dom";
import { getApi } from '../api';
import { AuthContext } from "../App";
import "../styles/PostDetail.css";


const PostDetail = () => {
    const authContext = useContext(AuthContext);
    const [postData, setPostData] = useState({
        title: "제목테스트",
        content: "내용",
        date: "232",
    });
    // const [postData, setPostData] = useState({
    //     title: "",
    //     content: "",
    //     date: "",
    // });

    const params = useParams();
    console.log('postid(params)', params.id);

    useEffect(() => {
        const getPosting = async () => {
            await getApi(
                {},
                `/board/${params.id}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        console.log(data);
                        setPostData({
                            title: data.title,
                            content: data.content,
                            date: data.date,
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        getPosting();
    }, []);

    return (
        <div className='post-detail'>
            <div className='detail-header'>
                <h3 className='detail-title'>{postData.title}</h3>
                <p className='detail-writer'>닉네임</p>
                <p className='detail-role'>개인회원</p>
                <p className='detail-date'>{postData.date}</p>
            </div>
            <div className='detail-hr'></div>
            <div className='detail-content'>{postData.content}</div>
            <div className='detail-hr'></div>
            댓글들
        </div>
    );
};

export default PostDetail;