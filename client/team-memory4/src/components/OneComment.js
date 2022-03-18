import React, { useState, useContext, useEffect } from "react"
import "../styles/Comments.css"
import { deleteApi } from "../api"
import { AuthContext, RecommentContext } from "../App"
import { useNavigate } from "react-router-dom"
import { MyComment } from "../components"


const OneComment = ({ comment, page, who }) => {
    console.log(comment.content);
    console.log(comment._id);
    console.log(who);

    const authContext = useContext(AuthContext)
    const recommentContext = useContext(RecommentContext)
    const navigate = useNavigate()

    const recommentHandler = () => {
        if (recommentContext.stateR.recommentId === comment._id) {
            // 답글 누른거 또 누름 = 취소
            recommentContext.dispatchR({
                type: "recommentNonClick",
                recommentId: null,
                recomment2Whom: null,
            })
        } else {
            recommentContext.dispatchR({
                type: "recommentClick",
                recommentId: comment._id,
                recomment2Whom: comment.writer,
            })
        }
        console.log('recommentContext.stateR.type:', recommentContext.stateR.recomment2Whom);
    }

    const commentDeleteHandler = async () => {
        await deleteApi({}, `/comment/${comment._id}`, authContext.state.token)
            .then(({ status, data }) => {
                if (status === 200) {
                    console.log("댓글삭제", status, data)
                    alert("삭제되었습니다.")
                    window.location.reload() // 새로고침하여 댓글 다시 불러오기
                } else if (status === 501) {
                    alert("작성자만 댓글을 삭제할 수 있습니다.")
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const commentClickHandler = () => {
        console.log(comment.postNumber)
        navigate(`/post/${comment.postNumber}`)
    }

    return (
        <div>
            <div
                onClick={commentClickHandler}
                className={who === 'parent' ? "one-comment-1" : "one-comment-2"}
            >
                <div className="comment-upper">
                    <p className="comment-upper-writer">{comment.writer}</p>
                    <p className="comment-upper-role">
                        {comment.role === 1 ? "일반회원" : "기업회원"}
                    </p>
                    <p className="comment-upper-date">{comment.date}</p>
                </div>
                <div className="comment-content">
                    {comment.isDeleted === false ? (
                        <p>{comment.content}</p>
                    ) : (
                        <p>(삭제된 댓글입니다.)</p>
                    )}
                </div>
                {page === "mypage" ? (
                    <></>
                ) : (
                    <div className="comment-lower">
                        <p className="recomment-btn" onClick={recommentHandler}>
                            답글쓰기
                        </p>
                        {comment.auth === true ? (
                            <p className="comment-del-btn" onClick={commentDeleteHandler}>
                                삭제하기
                            </p>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
            </div>

            <div>
                {comment._id === recommentContext.stateR.recommentId ? (
                    <MyComment />
                ):(
                    <></>
                )}
                
            </div>
        </div>
    )
}

export default OneComment;
