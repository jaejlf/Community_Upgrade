import React, { useState, useRef, useMemo } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
    const imageHandler = () => {
        console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.addEventListener('change', async () => {
            console.log('온체인지');
            const file = input.files[0];
            const formData = new FormData();
            formData.append('img', file);
            try {
                const result = await axios.post('http://localhost:3001/img', formData);
                console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
                const IMG_URL = result.data.url;

                const editor = quillRef.current.getEditor();  // 에디터 객체 가져오기
                editor.root.innerHTML =
                    editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', IMG_URL);
            } catch (error) {
                console.log('실패했어요');
            }
        });
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ['image'],
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image'],
                    [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
                    ['clean']
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        };
    }, []);

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background',
    ];

    const [value, setValue] = useState(''); // 에디터 속 콘텐츠를 저장하는 state
    const quillRef = useRef();

    return (
        <div>
            <h1>Quill 에디터 입니다.</h1>

            <ReactQuill
                style={{height: "600px"}} 
                ref={quillRef}
                theme="snow"
                placeholder="글을 입력하세요"
                value={value}
                onChange={setValue}
                modules={modules}
                formats={formats}
            />
            <p>{value}</p>
        </div>
    )
}

export default Editor;