package com.example.mobileauthclient.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.compose.ui.platform.LocalContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    onRegisterSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit,
    authViewModel: AuthViewModel = viewModel(factory = AuthViewModelFactory(LocalContext.current))
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordError by remember { mutableStateOf<String?>(null) }
    
    val validateForm = {
        passwordError = when {
            password.length < 4 -> "Пароль должен содержать минимум 4 символа"
            password != confirmPassword -> "Пароли не совпадают"
            else -> null
        }
        passwordError == null
    }
    
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Регистрация", style = MaterialTheme.typography.headlineMedium, modifier = Modifier.padding(bottom = 32.dp))
        OutlinedTextField(value = username, onValueChange = { username = it }, label = { Text("Логин") }, modifier = Modifier.fillMaxWidth(), singleLine = true, enabled = !authViewModel.isLoading)
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Пароль") }, modifier = Modifier.fillMaxWidth(), visualTransformation = PasswordVisualTransformation(), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password), singleLine = true, enabled = !authViewModel.isLoading)
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(value = confirmPassword, onValueChange = { confirmPassword = it }, label = { Text("Подтвердите пароль") }, modifier = Modifier.fillMaxWidth(), visualTransformation = PasswordVisualTransformation(), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password), singleLine = true, enabled = !authViewModel.isLoading, isError = passwordError != null)
        if (passwordError != null) Text(passwordError!!, color = MaterialTheme.colorScheme.error)
        if (authViewModel.errorMessage != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(authViewModel.errorMessage!!, color = MaterialTheme.colorScheme.error)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = { if (username.isNotBlank() && password.isNotBlank() && validateForm()) authViewModel.register(username, password, onRegisterSuccess) }, modifier = Modifier.fillMaxWidth(), enabled = !authViewModel.isLoading) {
            if (authViewModel.isLoading) CircularProgressIndicator(modifier = Modifier.size(20.dp)) else Text("Зарегистрироваться")
        }
        Spacer(modifier = Modifier.height(16.dp))
        TextButton(onClick = onNavigateToLogin, enabled = !authViewModel.isLoading) { Text("Уже есть аккаунт? Войти") }
    }
}
