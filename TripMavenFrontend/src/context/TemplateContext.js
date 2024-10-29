/*
    -Context객체는 여러 컴포넌트를 하나의 문맥으로 묶는 객체다.

    -같은 영역으로 묶는 최상위 컴포넌트에 <Context객체.Provider value={데이터}>
        로 하위 컴포넌트들을 같은 영역으로 묶는다
        그러면 하위 컴포넌트들에서 value속성에 지정한 데이터를
        드릴링(Props Drilling)하지 않고 쓸 수 있다.

    -하위 컴포넌트에서 가져다 쓸때는 useContext(Context 객체) 호출
        컨텍스트 기본값은 객체 생성시 value에 넣은 값
        <Context객체.Provider value={설정값}> 로 감싸면 설정값이 기본값이 됨
*/

import React from "react";

//Context 객체 생성: React.createContext(컨텍스트의 기본값)
export const TemplateContext = React.createContext('기본값');