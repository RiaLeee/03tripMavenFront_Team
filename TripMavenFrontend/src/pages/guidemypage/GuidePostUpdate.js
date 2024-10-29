import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, TextField, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HotelIcon from '@mui/icons-material/Hotel';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useNavigate, useParams } from 'react-router-dom';
import { getHotelAd, postGetById, postPut } from '../../utils/postData';
import { filesPost } from '../../utils/fileData';
import KakaoMap from '../../utils/KakaoMap';

const GuidePostUpdate = () => {
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
    const contentRef = useRef(null);
    const hotelRef = useRef(null);
    const hotelAdRef = useRef(null);

    const { id } = useParams();
    const [posts, setPosts] = useState({});


    // 이전 데이타 가져오기
    useEffect(() => {
        const getData = async () => {
            try {
                const fetchedData = await postGetById(id);
                console.log('fetchedData: ', fetchedData);
                setEditorContent(fetchedData.content);
                setSelectedAddress(fetchedData.hotelAd);
                setNights(parseInt((fetchedData.day.match(/\d+/g))[0],10))
                setDays(parseInt((fetchedData.day.match(/\d+/g))[1],10))
                console.log(fetchedData.day);
                setPosts(fetchedData || {});
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };
       
        getData();
    }, [id]);

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

    // 파일 저장
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
            const response = await getHotelAd(posts.hotel);
            console.log('response: ',response);
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
        handleInputChange('hotelAd', hotelAdRef);
    };


    // 수정된 데이타 업데이트
    const handleInputChange = (field, ref) => {
        setPosts({ ...posts, [field]: ref.current.value });
    };

    
    // 유효성 검증
    const validateFields = () => {
        const newErrors = {};
        if (!titleRef.current?.value) newErrors.title = "제목을 입력해주세요.";
        if (!hashtagRef.current?.value) newErrors.hashtag = "해시태그를 입력해주세요.";
        if (!files.length) newErrors.files = "최소 1개의 이미지를 업로드해주세요.";
        if (!nights || !days) newErrors.dayPeriod = "박과 일 수를 입력해주세요.";
        if (!cityRef.current?.value) newErrors.city = "여행도시를 입력해주세요.";
        if (!editorContent || editorContent.trim() === '') newErrors.content = "내용을 입력해주세요."; 
        return newErrors;
    };
    
    // 게시글 수정
    const handlePost = async () => {
        try {

            const dayPeriod = `${nights}박 ${days}일`;           
            if (dayRef.current) {
                dayRef.current.value = dayPeriod;
            }

            const updateData = {
                title: titleRef.current.value,
                hashtag: hashtagRef.current.value,
                files: posts.files,
                day: dayRef.current.value,
                city: cityRef.current.value,
                hotel: hotelRef.current.value,
                hotelAd: hotelAdRef.current.value,
                content: editorContent,
                member_id: membersId,
                id: posts.id
            };
            await postPut(updateData);
            navigate('/mypage/guide/post');
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, width: '90%', mx: 'auto', mt: 5 }}>
            <Typography variant="h4" fontWeight="bold" mb={4} sx={{ display: 'flex', alignItems: 'center' }}>
                게시물 수정하기 <PostAddIcon sx={{ ml: 1 }} />
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
                    value={posts.title || ''}
                    onChange={() => handleInputChange('title', titleRef)}
                />
                <TextField 
                    fullWidth 
                    label="해시태그" 
                    margin="normal" 
                    inputRef={hashtagRef} 
                    error={!!errors.hashtag} 
                    helperText={errors.hashtag}
                    value={posts.hashtag || ''}                    
                    onChange={() => handleInputChange('hashtag', hashtagRef)}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    component="label" 
                    sx={{ mt: 2 }}
                >
                    대표 이미지 업로드 (최대 3개)
                    <input type="file" hidden onChange={handleFileChange} multiple />
                </Button>
                <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block' }}>
                    ※목록 페이지에 썸네일로 사용 예정
                </Typography>
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
                    value={posts.city || ''}
                    onChange={() => handleInputChange('city', cityRef)}
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
                <ReactQuill 
                    theme="snow" 
                    placeholder="내용을 입력하세요..." 
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={modules}
                    formats={formats}
                />
                {errors.content && <Typography color="error">{errors.content}</Typography>}
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
                    onChange={(e) => handleInputChange('hotel', hotelRef)}
                    value={posts.hotel || ''}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
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
                <Button variant="contained" color="primary" onClick={handlePost}>
                    수정하기
                </Button>
            </Box>
        </Box>
    );
};

export default GuidePostUpdate;
