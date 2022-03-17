import React, {
  useEffect,
  useContext,
  useState,
  useReducer,
  createContext,
} from "react"
import { useParams } from "react-router-dom"
import { deleteApi, getApi, postApi, putApi } from "../api"
import { AuthContext } from "../App"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { AllComments, MyComment } from "../components"
import parse from "html-react-parser"
import { FaRegBookmark, FaBookmark, FaThumbsUp, FaRegThumbsUp, FaRegEye } from 'react-icons/fa'
import "../styles/PostDetail.css"

export const RecommentContext = createContext()
const reducer = (state, action) => {
  switch (action.type) {
    case "recommentClick":
      return {
        recommentId: action.recommentId,
        recomment2Whom: action.recomment2Whom,
      }
    case "recommentNonClick":
      return {
        recommentId: null,
        recomment2Whom: null,
      }
    default:
      return state
  }
}

const PostDetail = () => {
  const postDumpData = {
    _id: "622ae47d33e4beacf0caaf38",
    userId: 1,
    role: 1,
    writer: "jaej",
    title: "제목4",
    content: "내용4 어쩌구 이거는 테스트용",
    postNumber: 4,
    viewCnt: 9,
    good: [],
    date: "2022-03-14 22:20:42",
    auth: true, //true이면 작성자, false이면 작성자 아님
  }
  const authContext = useContext(AuthContext)
  const [state, dispatch] = useReducer(reducer, {
    recommentId: null,
    recomment2Who: null,
  })
  const navigate = useNavigate()

  const [mine, setMine] = useState(false)
  const [postData, setPostData] = useState({
    writer: "",
    title: "",
    content: "",
    date: "",
    viewCnt: 0,
  })

  const [like, setLike] = useState();
  const [scrap, setScrap] = useState();

  const params = useParams()
  let postId = params.id

  useEffect(() => {
    const getPosting = async () => {
      // API Test Code //
      setPostData(postDumpData);
      setMine(postData.auth);
      /////////////////////
      await getApi({}, `/board/${postId}`, authContext.state.token)
        .then(({ status, data }) => {
          if (status === 200) {
            // console.log(data);
            setPostData({
              writer: data.writer,
              role: data.role,
              title: data.title,
              content: data.content,
              date: data.date,
              viewCnt: data.viewCnt,
            });
            setMine(data.auth); // 내 글인지 여부 -> 수정, 삭제
            
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
    getPosting()
  }, [mine])

  const modifyHandler = () => {
    navigate(`/modify/${postId}`)
  }

  const deleteHandler = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteApi({}, `/board/${postId}`, authContext.state.token)
        .then(({ status, data }) => {
          if (status === 200) {
            alert("삭제되었습니다.");
            navigate("/");
          } else if (status === 501) {
            alert("작성자만 게시글을 삭제할 수 있습니다.");
          } else {
            alert("삭제에 실패했습니다.");
          }
        })
        .catch((e) => {
          console.log(e.response);
        })
    } else {
      alert("취소합니다.");
    }
  }

  const likeHandler = async () => {
    setLike(!like);
    await putApi(
        {},
        `/board/${postData.postNumber}/good`,
        authContext.state.token
      )
      .then(({ status, data }) => {
        if (status === 200 || status === 201) {
            console.log(data);
            if (data === '좋아요 누름') {
              setLike(true);
            } else {  // '좋아요 삭제'
              setLike(false);
            }

        } else if (status === 500) {
            alert("로그인을 해야 게시글을 스크랩할 수 있습니다.");
            navigate('/login');
        }
    })
    .catch((e) => {
        console.log(e);
    });
  }

  const scrapHandler = async () => {
    setScrap(!scrap);
    await postApi(
      {},
      `/mypage/scrap/${postData.postNumber}`,
      authContext.state.token
    )
      .then(({ status, data }) => {
          if (status === 200 || status === 201) {
              console.log('스크랩 완료');
          } else if (status === 501) {
              alert("로그인을 해야 게시글을 스크랩할 수 있습니다.");
              navigate('/login');
          }
      })
      .catch((e) => {
          console.log(e);
      });
  }

  return (
    <div className="post-detail">
      <div className="detail-header">
      <p className="detail-postnum">[{postData.postNumber}]</p>
        <h3 className="detail-title">{postData.title}</h3>
        <p className="detail-writer">{postData.writer}</p>
        <p className="detail-role">
          {postData.role === 2 ? <>기업회원</> : <>개인회원</>}
        </p>
        
        <p className="detail-date">{postData.date}</p>
      </div>
      <div className="detail-hr"></div>
      <div className="detail-container">
        <div className="detail-modify-del">
          {mine === true ? (
            <>
              <p className="detail-modify" onClick={modifyHandler}>
                수정
              </p>
              &nbsp;&nbsp;
              <p className="detail-del" onClick={deleteHandler}>
                삭제
              </p>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="detail-content">{parse("" + postData.content)}</div>
      </div>
      
      <div className="detail-hr"></div>

      <div className="detail-lower-section">
        <div className="detail-cnts">
          <div className="detail-cnt"><FaRegThumbsUp /><p>{postData.good.length}</p></div>
          <div className="detail-cnt"><FaRegBookmark /><p></p></div>
          <div className="detail-cnt"><FaRegEye /><p>{postData.viewCnt}</p></div>
        </div>

        <div className="detail-click-cnt">
          {
            like === true ? (
              <div className="detail-cnt">
                <div className="click-cnt" onClick={likeHandler}><FaThumbsUp /><p>추천하기</p></div>
              </div>
            ) : (
              <div className="detail-cnt">
                <div className="click-cnt" onClick={likeHandler}><FaRegThumbsUp /><p>추천하기</p></div>
              </div>
            )
          }
          {
            scrap === true ? (
              <div className="detail-cnt">
                <div className="click-cnt" onClick={scrapHandler}><FaBookmark /><p>스크랩하기</p></div>
              </div>
            ) : (
              <div className="detail-cnt">
                <div className="click-cnt" onClick={scrapHandler}><FaRegBookmark onClick={scrapHandler} /><p>스크랩하기</p></div>
              </div>
            )
          }
        </div>
      </div>
      <RecommentContext.Provider value={{ state, dispatch }}>
        <AllComments props={postId} />
        <MyComment props={postId} />
      </RecommentContext.Provider>
      <div className="goboard-btn">
        <Link to="/">
          <button className="detail-goboard-btn">목록보기</button>
        </Link>
      </div>
    </div>
  )
}

export default PostDetail
