import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

import '../styles/Board.css';



const Post = (post) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const info = post.post;
    console.log(post.post);

    const contentsClickHandler = (postNumber) => {  // 클릭 시 글 상세 페이지로 이동
        navigate(`/post/${postNumber}`);
    }

    return (
        <div className="content-section">
        <div className='content-section-contents'
            onClick={() => contentsClickHandler(info.postNumber)}
            >
            <p>{info.postNumber}</p>
            <div className="content-section-title">{info.title}</div>
            <div className="content-section-date">{info.date}</div>
            <div className='content-section-cnt'>
                <div className="content-section-goodcnt">
                    goodcnt: {info.good.length}
                </div>
                <div className="content-section-viewcnt">
                    viewcnt: {info.viewCnt}
                </div>
            </div>
        </div>
        </div>
    )
}

export default Post;