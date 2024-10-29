import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, TextField, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HotelIcon from '@mui/icons-material/Hotel';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useNavigate } from 'react-router-dom';
import { getHotelAd, postPost } from '../../utils/postData';
import { filesPost } from '../../utils/fileData';
import KakaoMap from '../../utils/KakaoMap';

const ProductPost = () => {
    const navigate = useNavigate();
    const membersId = localStorage.getItem('membersId');

    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [fileURLs, setFileURLs] = useState([]);
    const [nights, setNights] = useState('');
    const [days, setDays] = useState('');
    const [errors, setErrors] = useState({});
    const [editorContent, setEditorContent] = useState('');

    const [hotel, setHotel] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');

    const titleRef = useRef(null);
    const hashtagRef = useRef(null);
    const dayRef = useRef({ value: '' });
    const cityRef = useRef(null);
    const hotelRef = useRef(null);
    const hotelAdRef = useRef(null);

    // day 컬럼 통합
    useEffect(() => {
        console.log('id: ', membersId)

        const dayPeriod = `${nights}박 ${days}일`;
        if (dayRef.current) {
            dayRef.current.value = dayPeriod;
        }


    }, [nights, days]);

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
    ];

    // 파일
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        if (selectedFiles.length > 3) {
            alert("최대 3개의 파일만 선택할 수 있습니다.");
            return;
        }

        setFiles(selectedFiles);
        setFileNames(selectedFiles.map(file => file.name));
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        setFileURLs(urls);
    };

    // 호텔명으로 호텔주소에 값 넣기
    const handleSearch = async () => {
        try {
            console.log('버튼 클릭 시, hotel : ', hotel);
            const response = await getHotelAd(hotel);
            console.log('response', response);

            setAddresses(response);
            if (response.length > 0) {
                setSelectedAddress(response[0].road_address_name || response[0].address_name);
                hotelAdRef.current.value = response[0].road_address_name || response[0].address_name;
            }
        } catch (error) {
            console.error('Error fetching hotel address:', error);
            setAddresses([]);
            setSelectedAddress('Address not found');
        }
    };


    // 수정된 호텔 주소 데이타 업데이트
    const handleAddressChange = (event) => {
        setSelectedAddress(event.target.value);
        hotelAdRef.current.value = event.target.value;
    };

    // 유효성 검증    
    const validateFields = () => {
        const newErrors = {};
        // 제목이 입력되지 않았거나, 20자를 초과한 경우
        const titleValue = titleRef.current?.value;
        if (!titleValue) {
            newErrors.title = "제목을 입력해주세요. 최대 20자까지 제한합니다.";
            titleRef.current.focus();
        } else if (titleValue.length > 20) {
            newErrors.title = "제목은 최대 20자까지 입력 가능합니다.";
            titleRef.current.focus();
        }
        if (!hashtagRef.current?.value) {
            newErrors.hashtag = "해시태그를 입력해주세요.";
            hashtagRef.current.focus();
        }
        if (!files.length) {
            newErrors.files = "최소 1개의 이미지를 업로드해주세요.";
            hashtagRef.current.focus();
        }
        if (!nights || !days) {
            newErrors.dayPeriod = "박과 일 수를 입력해주세요.";          
        }
        if (!cityRef.current?.value) {
            newErrors.city = "여행도시를 입력해주세요.";
        }
        if (!editorContent || editorContent.trim() === '') {
            newErrors.content = "내용을 입력해주세요.";    
        }
        return newErrors;
    };

    // 게시글 등록
    const createPost = async () => {
        try {
            const validationErrors = validateFields();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const fileUploadResponse = await filesPost(formData);
            console.log('fileUploadResponse:', fileUploadResponse);

            if (!fileUploadResponse.success) {
                alert('파일 업로드에 실패했습니다.');
                return;
            }

            const fileNamesString = files.map(file => file.name).join(',');

            const createData = {
                title: titleRef.current?.value || '',
                hashtag: hashtagRef.current?.value || '',
                files: fileNamesString,
                city: cityRef.current?.value || '',
                content: editorContent || '',
                day: dayRef.current.value,
                hotel: hotelRef.current.value,
                hotelAd: hotelAdRef.current.value,
                member_id: membersId
            };

            console.log('createData', createData);
            await postPost(createData);
            navigate('/mypage/guide/post');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };


    return (
        <Box sx={{ maxWidth: 1200, width: '90%', mx: 'auto', mt: 5 }}>
            <Typography variant="h4" fontWeight="bold" mb={4} sx={{ display: 'flex', alignItems: 'center' }}>
                게시물 등록하기 <PostAddIcon sx={{ ml: 1 }} />
            </Typography>
            <Divider />

            <Box sx={{ p: 3, mt: 4 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <EmojiObjectsIcon sx={{ mr: 1 }} />
                    대표 내용
                </Typography>
                <TextField
                    fullWidth
                    label="제목"
                    margin="normal"
                    inputRef={titleRef}
                    error={!!errors.title}
                    helperText={errors.title}
                />
                <TextField
                    fullWidth
                    label="해시태그"
                    margin="normal"
                    inputRef={hashtagRef}
                    error={!!errors.hashtag}
                    helperText={errors.hashtag}
                />
                <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    sx={{ mt: 2 }}
                >
                    대표 이미지 업로드 (최대 3개)
                    <input type="file" hidden onChange={handleFileChange} multiple accept=".jpg,.jpeg,.png,.gif,.bmp"/>
                </Button>
                {errors.files && <Typography color="error">{errors.files}</Typography>}

                {fileURLs.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        {fileURLs.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`preview ${index + 1}`}
                                style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
            <Divider />

            <Box sx={{ p: 3, mt: 4 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <AirplanemodeActiveIcon sx={{ mr: 1 }} />
                    여행 주요 일정
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="박"
                        type="number"
                        value={nights}
                        onChange={(e) => setNights(e.target.value)}
                        sx={{ width: '48%' }}
                        error={!!errors.dayPeriod}
                    />
                    <TextField
                        label="일"
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        sx={{ width: '48%' }}
                        error={!!errors.dayPeriod}
                    />
                </Box>
                {errors.dayPeriod && <Typography color="error">{errors.dayPeriod}</Typography>}
                <TextField
                    fullWidth
                    label="여행도시"
                    margin="normal"
                    inputRef={cityRef}
                    error={!!errors.city}
                    helperText={errors.city}
                />
            </Box>
            <Divider />

            <Box sx={{ p: 3, mt: 4 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <BeachAccessIcon sx={{ mr: 1 }} />
                    테마 소개
                </Typography>
                {errors.content && <Typography color="error" sx={{

                }}>{errors.content}</Typography>}
                <ReactQuill
                    theme="snow"
                    placeholder="내용을 입력하세요..."
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={modules}
                    formats={formats}
                    style={{ height: '500px' }}
                />

            </Box>
            <Divider />

            <Box sx={{ p: 3, mt: 4 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <HotelIcon sx={{ mr: 1 }} />
                    호텔 정보
                </Typography>
                <TextField
                    fullWidth
                    label="호텔"
                    margin="normal"
                    inputRef={hotelRef}
                    onChange={(e) => setHotel(e.target.value)}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        주소 검색
                    </Button>
                    {addresses.length > 0 && (
                        <FormControl fullWidth>
                            <InputLabel id="address-select-label">호텔 주소 선택</InputLabel>
                            <Select
                                labelId="address-select-label"
                                id="address-select"
                                value={selectedAddress}
                                onChange={handleAddressChange}
                            >
                                {addresses.map((address, index) => (
                                    <MenuItem key={index} value={address.road_address_name || address.address_name}>
                                        {address.place_name} - {address.road_address_name || address.address_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
                <TextField
                    fullWidth
                    label="호텔 주소"
                    margin="normal"
                    inputRef={hotelAdRef}
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </Box>

            <Box sx={{ p: 3 }}>
                <Typography variant="subtitle2">호텔 위치</Typography>
                <KakaoMap address={selectedAddress} />
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button variant="contained" color="primary" onClick={createPost}>
                    등록하기
                </Button>
            </Box>
        </Box>
    );
};

export default ProductPost;
