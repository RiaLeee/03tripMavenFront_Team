package com.tripmaven.auth.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.tripmaven.members.model.MembersEntity;

public class CustomUserDetails implements UserDetails{
	
	private MembersEntity membersEntity;
	public CustomUserDetails(MembersEntity membersEntity) {
		this.membersEntity = membersEntity;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		 List<GrantedAuthority> authorities = new ArrayList();
		 
		// 사용자의 isAdmin 값에 따라 ROLE_ADMIN 또는 ROLE_USER 권한을 부여합니다.
	        if (this.membersEntity.getRole().equalsIgnoreCase("ADMIN")) {
	            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
	        } 
	        else if(this.membersEntity.getRole().equalsIgnoreCase("GUIDE")) {
	        	authorities.add(new SimpleGrantedAuthority("ROLE_GUIDE"));
	        } 
	        else {
	            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
	        }
	       
	       return authorities;
	}

	@Override
	   public String getPassword() {
	       return membersEntity.getPassword();
	   }

	   @Override
	   public String getUsername() {
	       return membersEntity.getEmail();
	   }


	   @Override
	   public boolean isAccountNonExpired() {
	       return true;
	   }

	   @Override
	   public boolean isAccountNonLocked() {
		   //return true;
		   return membersEntity.getIsdelete()==null || membersEntity.getIsdelete().equalsIgnoreCase("0");// isDelete가 false이면 계정이 잠겨있지 않은 것으로 간주합니다. 
	   }

	   @Override
	   public boolean isCredentialsNonExpired() {
	       return true;
	   }

	   @Override
	   public boolean isEnabled() {
	       //return true;
		   return membersEntity.getIsactive().equalsIgnoreCase("1");
	   }

}
