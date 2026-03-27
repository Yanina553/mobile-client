package com.example.mobileauthclient.utils

import android.util.Log

object Logger {
    private const val TAG = "MobileAuth"
    
    fun d(message: String) = Log.d(TAG, message)
    fun e(message: String, throwable: Throwable? = null) = 
        if (throwable != null) Log.e(TAG, message, throwable) else Log.e(TAG, message)
    fun i(message: String) = Log.i(TAG, message)
    
    fun logRequest(endpoint: String, data: Any? = null) {
        d("=== Запрос: $endpoint ===")
        if (data != null) d("Данные запроса: $data")
    }
    
    fun logResponse(endpoint: String, code: Int, body: String? = null) {
        d("=== Ответ: $endpoint ===")
        d("Код: $code")
        if (body != null) d("Тело ответа: $body")
    }
}
