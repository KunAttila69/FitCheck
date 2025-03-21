using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace FitCheck_WPFApp.Services
{
    public class AuthService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl = "https://localhost:7293/api";
        private string _accessToken;
        private List<string> _userRoles;
        private string _currentUsername;

        public AuthService()
        {
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
                {
                    return true;
                }
            };

            _httpClient = new HttpClient(handler);
            _userRoles = new List<string>();
        }

        public async Task<bool> LoginAsync(string username, string password)
        {
            try
            {
                var loginRequest = new
                {
                    Username = username,
                    Password = password
                };

                var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/auth/login", loginRequest);
                if (!response.IsSuccessStatusCode)
                    return false;

                var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                _accessToken = result.AccessToken;
                _userRoles = new List<string>(result.Roles ?? new List<string>());
                _currentUsername = username;

                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GetAccessToken()
        {
            return _accessToken;
        }

        public bool IsAuthenticated()
        {
            return !string.IsNullOrEmpty(_accessToken);
        }

        public bool IsInRole(string role)
        {
            return _userRoles?.Contains(role) ?? false;
        }

        public bool IsAdmin()
        {
            return IsInRole("Administrator");
        }

        public string GetCurrentUsername()
        {
            return _currentUsername;
        }

        public void Logout()
        {
            _accessToken = null;
            _userRoles.Clear();
            _currentUsername = null;
        }

        private class LoginResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public List<string> Roles { get; set; }
        }
    }
}