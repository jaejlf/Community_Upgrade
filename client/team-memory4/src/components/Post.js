import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark, FaRegThumbsUp, FaRegEye } from 'react-icons/fa';

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
            <div
                className='content-section-contents'
                onClick={() => contentsClickHandler(info.postNumber)}
            >
                <div className="content-section-left">
                    <div className="content-section-postnum">[{info.postNumber}]</div>
                    <div className="content-section-title">{info.title}</div>
                    <div className="content-section-writer">{info.writer}</div>
                    <div className="content-section-date">{info.date}</div>
                </div>

                <div className="content-section-right">
                    <div className='content-section-cnt'>
                        <div className="content-section-viewcnt">
                            <FaRegEye />
                            <p>{info.viewCnt}</p>
                        </div>
                        <div className="content-section-goodcnt">
                            <FaRegThumbsUp />
                            <p>{info.good.length}</p>
                        </div>
                        <div className="content-section-scrapcnt">
                            <FaRegBookmark />
                            <p></p>
                        </div>
                    </div>
                </div>
                

            </div>
        </div>
    )
}

export default Post;