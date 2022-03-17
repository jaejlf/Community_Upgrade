import React, { useState, useRef, useMemo, useContext, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { postApi, putApi, getApi } from "../api"
import ReactQuill, { Quill } from "react-quill"
// import { Quill } from "quill"
import "react-quill/dist/quill.snow.css"
import { AuthContext } from "../App"
import { useNavigate } from "react-router-dom"
import "../styles/Write.css"
import ImageResize from "@looop/quill-image-resize-module-react"
Quill.register("modules/ImageResize", ImageResize)

const Editor = (desc) => {
    // console.log('desc', desc);
    // console.log('wm', desc.value);
    let wm = desc.value;

    const params = useParams();
    let postId = params.id;

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");  // 에디터 속 콘텐츠를 저장하는 state

    useEffect(() => {  // 수정하는 글이라면, 기존 내용 불러오기
        if (wm === 'modify') {
            /// Test Code ///
            // setTitle("제목 테스트");
            // setValue("수정 내용 테스트");
            ///////////////////
            const getPosting = async () => {
                await getApi(
                    {},
                    `/board/${postId}`,
                    authContext.state.token
                )
                    .then(({ status, data }) => {
                        if (status === 200) {
                            console.log(data);
                            setTitle(data.title);
                            setValue(data.content);
                        } else {
                            console.log('게시글 불러오기 실패');
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
            getPosting();
        }
    }, []);

    const postHandler = async () => {
        if (wm === 'write') {
            await postApi(
                {
                    title: title,
                    content: value,
                    userId: authContext.state.userId,
                    writer: authContext.state.name,
                },
                "/board/write",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200 || status === 201) {
                        console.log(data);
                        navigate("/");
                    } else if (status === 500) {
                        alert("게시글 등록 시 오류가 발생했습니다.");
                    } else if (status === 501) {
                        alert("로그인을 해야 게시글을 작성할 수 있습니다.");
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            await putApi(
                {
                    title: title,
                    content: value,
                },
                `/board/${postId}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200 || status === 201) {
                        console.log(data);
                        navigate("/");
                    } else if (status === 500) {
                        alert("게시글 등록 시 오류가 발생했습니다.");
                    } else if (status === 501) {
                        alert("작성자만 게시글을 수정할 수 있습니다.");
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.addEventListener("change", async () => {
            console.log("온체인지");
            const file = input.files[0];
            const formData = new FormData();
            formData.append("img", file);
            try {
                const result = await axios.post(
                    `${process.env.REACT_APP_BACK_BASE_URL}/img`,
                    formData
                )
                console.log("성공 시, 백엔드가 보내주는 데이터", result.data.url);
                const IMG_URL = result.data.url;

                const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
                // editor.root.innerHTML =
                //     editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", IMG_URL);
            } catch (error) {
                console.log("실패했어요")
            };
        });
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ["image"],
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                    ],
                    ["link", "image"],
                    [{ align: [] }, { color: [] }, { background: [] }],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
            ImageResize: {
                // parchment: Quill.import("parchment"),
                modules: ["Resize"],
            },
        }
    }, [])

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "align",
        "color",
        "background",
    ]

    const quillRef = useRef();

    return (
        <div className="write-outer">
            <div className="write-header">
                <p className="write-title">
                    {wm === 'write' ? (
                        <p>새 글 작성하기</p>
                    ) : (
                        <p>글 수정하기</p>
                    )}

                </p>
                <button className="write-button" onClick={postHandler}>
                    등록
                </button>
            </div>
            <input
                type="text"
                name="title"
                className="write-title-input"
                placeholder="제목을 입력해주세요"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <ReactQuill
                style={{ height: "300px" }}
                ref={quillRef}
                theme="snow"
                placeholder="글을 입력하세요"
                value={value}
                onChange={setValue}
                modules={modules}
                formats={formats}
            />
        </div>
    )
}

export default Editor
