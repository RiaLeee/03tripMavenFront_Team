package com.tripmaven.email;

public class EmailVerificationResult {
	
	

    private boolean success;
    private String message;

    // 기본 생성자
    public EmailVerificationResult() {}

    // 파라미터가 있는 생성자
    public EmailVerificationResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // success 필드의 getter와 setter
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    // message 필드의 getter와 setter
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "EmailVerificationResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
    
    
}
