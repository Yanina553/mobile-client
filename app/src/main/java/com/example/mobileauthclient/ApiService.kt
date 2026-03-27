package com.example.mobileauthclient

import com.example.mobileauthclient.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>
    
    @POST("/login")
    suspend fun login(@Body request: AuthRequest): Response<AuthResponse>
    
    @GET("/api/posts")
    suspend fun getProtectedPosts(@Header("Authorization") token: String): Response<List<Post>>
}
