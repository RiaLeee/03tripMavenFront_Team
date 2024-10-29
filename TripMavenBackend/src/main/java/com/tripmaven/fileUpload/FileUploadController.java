package com.tripmaven.fileUpload;


import java.io.File;

import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Vector;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.tripmaven.productboard.ProductBoardDto;

import com.tripmaven.productboard.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class FileUploadController {
		
    @Value("${spring.servlet.multipart.location}")
    private String saveDirectory;
    
    private final FileService fileService;
    private final ProductService productService;

    // 파일 등록
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<Map>> fileUpload(
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @RequestPart(name = "type", required = false) String type){
        try {
            List<Map> filesInfo = new Vector<>();
            if(type != null && type.equals("guidelicense")) {
                filesInfo = fileService.upload(files, saveDirectory + "/guidelicense");
            } else if(type == null) {
                filesInfo = fileService.upload(files, saveDirectory);
            }
            return ResponseEntity.ok(filesInfo);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    // 여러 파일 반환용 파일이름 배열 반환
    @GetMapping("/uploads/{id}")
    public List<String> listFilesByProductId(@PathVariable("id") Long id) {
        try {
        	//System.out.println("여러 파일 컨트롤러 들어옴");
        	ProductBoardDto dto = productService.usersById(id);
            String[] filenames = dto.getFiles() != null ? dto.getFiles().split(",") : new String[0];

            List<String> fileUrls = new ArrayList<>();
            if (filenames.length > 0) {
                for (String filename : filenames) {
                 fileUrls.add(filename);
                }
            }
            return fileUrls;
       } catch (Exception e) {
          e.printStackTrace();
          return new ArrayList<>(); // 오류 발생 시 빈 리스트 반환
        }
    }



    // 단일 파일을 반환 (상품 id와 파일 이름으로 조회)
    @GetMapping("/upload/{id}/{filename}")
    public ResponseEntity<Resource> listFileByProductId(
            @PathVariable("id") Long id, @PathVariable("filename") String filename) {
        try {
        	//System.out.println("단일 파일을 반환 컨트롤러 들어옴");
        	//System.out.println("파일 이름들 : "+filename);
        	
            Path filePath = Paths.get(saveDirectory).resolve(filename).normalize();
            File file = filePath.toFile();

            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String encodedFilename = URLEncoder.encode(resource.getFilename(), "UTF-8").replace("+", "%20");
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (MalformedURLException e) {
            System.err.println("잘못된 파일 경로: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    
    //파일 다운로드(파일이름으로 자격증 가져오기)
    @GetMapping("/downloadlicense/{filename}")
    public ResponseEntity<Resource> getLicense(@PathVariable("filename") String filename) {
        try {
        	//System.out.println("filename: "+filename);
            Path filePath = Paths.get(saveDirectory+"/guidelicense").resolve(filename).normalize();
            File file = filePath.toFile();

            // 파일 존재 여부 확인
            if (!file.exists() || !file.isFile()) {
                System.out.println("파일이 존재하지 않거나 유효한 파일이 아님: " + filePath.toString());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // 파일을 리소스로 반환
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // 파일 이름을 UTF-8로 인코딩
                String encodedFilename = URLEncoder.encode(resource.getFilename(), "UTF-8");
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                        .body(resource);
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

        }
        catch (MalformedURLException e) {
            System.err.println("잘못된 파일 경로: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
