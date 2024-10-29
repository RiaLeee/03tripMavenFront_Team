package com.tripmaven.email;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@ComponentScan(basePackages = {"com.tripmaven", "email"})
public class EmailService {

    private final JavaMailSender emailSender; // JavaMailSender를 서비스에서 사용할 수 있도록 의존성 주입받는 코드
    
    // 발신자 이메일 주소를 application.yml에서 가져옴
    @Value("${spring.mail.username}")
    private String fromEmail;

    // sendEmail() : 이메일 주소, 이메일 제목, 이메일 내용을 입력 받아 이메일 creataEmailForm() 메서드로 넘겨준다.
    public void sendEmail(String toEmail, String title, String text) {
        SimpleMailMessage emailForm = createEmailForm(toEmail, title, text); // createEmailForm 메서드로 이메일 내용을 구성한 후, send() 메서드를 사용해 이메일 전송
        try {
            emailSender.send(emailForm);
        } catch (Exception e) {
            log.error("이메일 전송 중 오류가 발생했습니다. 수신자: {}, 제목: {}, 오류 메시지: {}", toEmail, title, e.getMessage());
            return;
        }
    }

    // 발신할 이메일 데이터 세팅
    // createEmailForm(): 발송할 이메일 데이터를 설정하는 메서드. 수신자 이메일 주소, 이메일 제목, 이메일 내용을 입력 받아
    // SimpleMailMessage 객체를 생성하여 반환
    private SimpleMailMessage createEmailForm(String toEmail, String title, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(title);
        message.setText(text);
        message.setFrom(fromEmail);  // 발신자 이메일 주소 설정
        return message;
    }
}
