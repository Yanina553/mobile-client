package com.example.mobileauthclient.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mobileauthclient.ApiClient
import com.example.mobileauthclient.models.*
import com.example.mobileauthclient.utils.Logger
import com.example.mobileauthclient.utils.TokenManager
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException

class AuthViewModel(private val tokenManager: TokenManager) : ViewModel() {
    var isLoading by mutableStateOf(false)
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set
    var userPosts by mutableStateOf<List<Post>>(emptyList())
        private set
    var isAuthenticated by mutableStateOf(false)
        private set
    
    init {
        viewModelScope.launch {
            isAuthenticated = tokenManager.getToken() != null
            if (isAuthenticated) fetchProtectedPosts()
        }
    }
    
    fun register(username: String, password: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                Logger.logRequest("/register", mapOf("username" to username))
                val response = ApiClient.apiService.register(RegisterRequest(username, password))
                if (response.isSuccessful) {
                    Logger.logResponse("/register", response.code(), response.body()?.toString())
                    Logger.d("Регистрация успешна!")
                    onSuccess()
                } else {
                    errorMessage = "Ошибка регистрации: ${response.code()}"
                }
            } catch (e: IOException) {
                errorMessage = "Ошибка сети: ${e.message}"
            } catch (e: HttpException) {
                errorMessage = "Ошибка сервера: ${e.code()}"
            } finally { isLoading = false }
        }
    }
    
    fun login(username: String, password: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                Logger.logRequest("/login", mapOf("username" to username))
                val response = ApiClient.apiService.login(AuthRequest(username, password))
                if (response.isSuccessful) {
                    val token = response.body()?.token
                    if (token != null) {
                        tokenManager.saveToken(token)
                        isAuthenticated = true
                        Logger.d("Авторизация успешна!")
                        fetchProtectedPosts()
                        onSuccess()
                    } else {
                        errorMessage = "Токен не получен"
                    }
                } else {
                    errorMessage = "Ошибка авторизации: ${response.code()}"
                }
            } catch (e: IOException) {
                errorMessage = "Ошибка сети: ${e.message}"
            } catch (e: HttpException) {
                errorMessage = "Ошибка сервера: ${e.code()}"
            } finally { isLoading = false }
        }
    }
    
    fun fetchProtectedPosts() {
        viewModelScope.launch {
            isLoading = true
            try {
                val token = tokenManager.getToken() ?: return@launch
                val response = ApiClient.apiService.getProtectedPosts("Bearer $token")
                if (response.isSuccessful) {
                    userPosts = response.body() ?: emptyList()
                    Logger.d("Получено ${userPosts.size} записей")
                } else {
                    errorMessage = "Ошибка получения данных: ${response.code()}"
                    if (response.code() == 401) logout()
                }
            } catch (e: Exception) {
                errorMessage = "Ошибка: ${e.message}"
            } finally { isLoading = false }
        }
    }
    
    fun logout() {
        viewModelScope.launch {
            tokenManager.clearToken()
            isAuthenticated = false
            userPosts = emptyList()
        }
    }
    
    fun clearError() { errorMessage = null }
}
