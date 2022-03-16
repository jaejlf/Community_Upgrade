import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

import '../styles/Board.css';



const Post = (post) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    console.log(post.post);

    const contentsClickHandler = (postNumber) => {  // 클릭 시 글 상세 페이지로 이동
        navigate(`/post/${postNumber}`);
    }

    return (
        <div className="content-section">
        <div className='content-section-contents'
            onClick={() => contentsClickHandler(post.post.postNumber)}
            >
            <div className="content-section-title">{post.post.title}</div>
            <div className="content-section-date">{post.post.date}</div>
            <div className='content-section-cnt'>
                <div className="content-section-goodcnt">{post.post.goodCnt}</div>
                <div className="content-section-viewcnt">{post.post.viewCnt}</div>
            </div>
        </div>
        </div>
    )
}

export default Post;