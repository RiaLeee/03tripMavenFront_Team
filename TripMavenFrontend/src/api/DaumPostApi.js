import { Button } from "@mui/material";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";

export const splitByblank = (str) => {
    if (!str) {
        return ['', ''];
    }
    // 문자열의 첫 번째 ','의 인덱스를 찾습니다.
    const firstCommaIndex = str.indexOf('　');
    // ','가 없을 경우 원래 문자열을 반환합니다.
    if (firstCommaIndex === -1) {
        return [str.trim(), ''];
    }
    // 첫 번째 ','를 기준으로 문자열을 두 부분으로 나눕니다.
    const part1 = str.substring(0, firstCommaIndex).trim(); //첫부분이 1번째 인덱스
    const part2 = str.substring(firstCommaIndex + 1).trim(); //뒷부분이 0번쨰 인덱스
    return [part2, part1];
}

function DaumPost({setAreaAddress}) {
    //클릭 시 수행될 팝업 생성 함수
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = ''; //추가될 주소
        let localAddress = data.sido + ' ' + data.sigungu; //지역주소(시, 도 + 시, 군, 구)
        if (data.addressType === 'R') { //주소타입이 도로명주소일 경우
            if (data.bname !== '') {
                extraAddress += data.bname; //법정동, 법정리
            }
            if (data.buildingName !== '') { //건물명
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            //지역주소 제외 전체주소 치환
            fullAddress = fullAddress.replace(localAddress, '');
            //조건 판단 완료 후 지역 주소 및 상세주소 state 수정

            setAreaAddress(`${localAddress} ${fullAddress} ${extraAddress}`);
            //주소 검색이 완료된 후 결과를 매개변수로 전달            
        }
    }
    //클릭 시 발생할 이벤트
    const handleClick = () => {
        //주소검색이 완료되고, 결과 주소를 클릭 시 해당 함수 수행
        open({ onComplete: handleComplete });
    }
    return <Button sx={{ fontSize: '15px', width: '100px', height:'57px',color: '#676767', border: 1, backgroundColor: '#f1f1f1', '&:hover': { backgroundColor: '#DEDEDE' } }}
        variant="contained" component="label" onClick={handleClick}>주소찾기</Button>
}

export default DaumPost;