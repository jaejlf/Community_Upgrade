import React, { useEffect, useContext, useState } from 'react';
import { useParams } from "react-router-dom";
import { deleteApi, getApi } from '../api';
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../styles/PostDetail.css";


const PostDetail = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

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


    const modifyHandler = async () => {
        
    }

    const deleteHandler = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            await deleteApi(
                {},
                `/board/${params.id}`,
                authContext.state.token
            )
            .then(({status, data}) => {
                if (status === 200) {
                    alert("삭제되었습니다.");
                    navigate("/board");
                } else if (status === 501) {
                    alert("작성자만 게시글을 삭제할 수 있습니다.");
                } else { 
                    alert("삭제에 실패했습니다.");
                }
            })
            .catch((e) => {
                console.log(e.response);
            });
        } else {
            alert("취소합니다.");
        }
    }

    return (
        <div className='post-detail'>
            <div className='detail-header'>
                <h3 className='detail-title'>{postData.title}</h3>
                <p className='detail-writer'>닉네임</p>
                <p className='detail-role'>개인회원</p>
                <p className='detail-date'>{postData.date}</p>
            </div>
            <div className='detail-hr'></div>
            <div className='detail-container'>
                <div className='detail-modify-del'>
                    <p className='detail-modify' onClick={modifyHandler}>수정</p>
                    &nbsp;&nbsp;
                    <p className='detail-del' onClick={deleteHandler}>삭제</p>
                </div>
                <div className='detail-content'>{postData.content}</div>
            </div>
            <div className='detail-hr'></div>

            <div className='comments'>
                
            </div>
        </div>
    );
};

export default PostDetail;