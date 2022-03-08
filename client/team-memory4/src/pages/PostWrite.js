import React, { useState } from 'react';
import { Editor } from '../components';


const PostWrite = () => {
    const [desc, setDesc] = useState('');  // 들어갈 내용
    function onEditorChange(value) {
        setDesc(value)
    }

    return (
        <div>
            <Editor value={desc} onChange={onEditorChange} />
        </div>
    );
};

export default PostWrite;