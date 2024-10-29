package com.tripmaven.fileUpload;

import java.io.File;
import java.io.IOException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;



@Service
public class FileService {
	
	//파일 등록
	public List<Map> upload(List<MultipartFile> files, String saveDirectory) throws IllegalStateException, IOException{
		List<Map> fileInfos = new Vector<>();
		
		// 디렉토리 존재 확인 및 생성
		/*
        File directory = new File(saveDirectory);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리가 없으면 생성
        }
        */
		
		for(MultipartFile multipartFile:files) {
			//파일객체 생성
			String systemFilename = FileUtils.getNewFileName(saveDirectory, multipartFile.getOriginalFilename());
			File f = new File(saveDirectory + File.separator + systemFilename);
			//업로드
			multipartFile.transferTo(f);
			
			Map<String, Object> map = new HashMap<>();
			map.put("filename", f.getName());
			map.put("filesize", (int)Math.ceil(f.length()/1024.0));
			map.put("filetype", multipartFile.getContentType());
			fileInfos.add(map);
			System.out.println("fileInfos : "+fileInfos);
		}
		return fileInfos;
	}

	

	//파일 조회
	//public List<Map<String, String>> getFilesByProductId(String saveDirectory, Long productboardId) {
		
		
		
		
		
		 // 상품 ID를 기준으로 파일이 저장된 디렉토리 경로 설정
		/*
        Path productPath = Paths.get(saveDirectory, productboardId.toString()).toAbsolutePath().normalize();
        File directory = productPath.toFile();

        List<Map<String, String>> filesList = new ArrayList<>();
        Map<String, String> fileInfo = new HashMap<>();
        if (directory.exists() && directory.isDirectory()) {
        	
            for (File file : directory.listFiles()) {
                if (file.isFile()) {
                
                    fileInfo.put("fileName", file.getName());
                    fileInfo.put("fileSize", String.valueOf(file.length()));
                    filesList.add(fileInfo);
                }
            }
            System.out.println("");
        }

        return filesList;
        */
}
