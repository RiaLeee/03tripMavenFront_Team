import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일을 불러옵니다.

const WebEditor = () => {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content) => {
    console.log('content: ',content);
    setEditorContent(content); // 에디터의 내용을 상태로 저장합니다.
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean'], // 모든 포맷 제거 버튼
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
  ];

  return <>
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        placeholder="내용을 입력하세요..."
        theme="snow" // snow 테마 사용
        style={{ height: '300px' }}
      />
    </div>
    </>
};

export default WebEditor;
