package com.example.mobileauthclient.utils

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth")

class TokenManager(private val context: Context) {
    companion object {
        private val TOKEN_KEY = stringPreferencesKey("jwt_token")
    }
    
    val tokenFlow: Flow<String?> = context.dataStore.data
        .map { preferences -> preferences[TOKEN_KEY] }
    
    suspend fun saveToken(token: String) {
        context.dataStore.edit { preferences -> preferences[TOKEN_KEY] = token }
    }
    
    suspend fun getToken(): String? = context.dataStore.data.first()[TOKEN_KEY]
    
    suspend fun clearToken() {
        context.dataStore.edit { preferences -> preferences.remove(TOKEN_KEY) }
    }
    
    fun hasToken(): Boolean = runBlocking { getToken() != null }
}
