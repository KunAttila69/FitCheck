using FitCheck_WPFApp.Models;
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
        private string _userId;
        private string _username;
        private List<string> _userRoles;

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

        /// <summary>
        /// Attempts to authenticate a user with the provided credentials
        /// </summary>
        /// <param name="username">The username for authentication</param>
        /// <param name="password">The password for authentication</param>
        /// <returns>True if authentication was successful, otherwise false</returns>
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
                _userId = result.UserId; // Make sure the API returns the UserId
                _userRoles = new List<string>(result.Roles ?? new List<string>());
                _username = username;

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Gets the current user's ID
        /// </summary>
        /// <returns>The user ID or "unknown" if not authenticated</returns>
        public string GetCurrentUserId()
        {
            return _userId ?? "unknown";
        }

        /// <summary>
        /// Gets the current user's username
        /// </summary>
        /// <returns>The username or "unknown" if not authenticated</returns>
        public string GetCurrentUsername()
        {
            return _username ?? "unknown";
        }

        /// <summary>
        /// Gets the authentication token
        /// </summary>
        /// <returns>The access token or null if not authenticated</returns>
        public string GetAccessToken()
        {
            return _accessToken;
        }

        /// <summary>
        /// Checks if the user is currently authenticated
        /// </summary>
        /// <returns>True if authenticated, otherwise false</returns>
        public bool IsAuthenticated()
        {
            return !string.IsNullOrEmpty(_accessToken);
        }

        /// <summary>
        /// Alternative method to check if user is logged in
        /// </summary>
        /// <returns>True if logged in, otherwise false</returns>
        public bool IsLoggedIn()
        {
            return IsAuthenticated();
        }

        /// <summary>
        /// Checks if the current user has a specific role
        /// </summary>
        /// <param name="role">The role to check for</param>
        /// <returns>True if the user has the role, otherwise false</returns>
        public bool IsInRole(string role)
        {
            return _userRoles?.Contains(role) ?? false;
        }

        /// <summary>
        /// Checks if the current user is an administrator
        /// </summary>
        /// <returns>True if the user is an administrator, otherwise false</returns>
        public bool IsAdmin()
        {
            return IsInRole("Administrator") || IsInRole("Admin");
        }

        /// <summary>
        /// Logs the user's login action
        /// </summary>
        /// <param name="logService">The log service for recording the action</param>
        public async Task LogLoginAsync(LogService logService)
        {
            if (logService != null && IsLoggedIn())
            {
                await logService.LogActionAsync(
                    AdminActionType.Login,
                    GetCurrentUserId(),
                    GetCurrentUsername(),
                    "N/A",
                    $"User {GetCurrentUsername()} logged in"
                );
            }
        }

        /// <summary>
        /// Logs the user's logout action
        /// </summary>
        /// <param name="logService">The log service for recording the action</param>
        public async Task LogLogoutAsync(LogService logService)
        {
            if (logService != null && IsLoggedIn())
            {
                string userId = GetCurrentUserId();
                string username = GetCurrentUsername();

                await logService.LogActionAsync(
                    AdminActionType.Logout,
                    userId,
                    username,
                    "N/A",
                    $"User {username} logged out"
                );
            }
        }

        /// <summary>
        /// Logs out the current user and optionally records the action
        /// </summary>
        /// <param name="logService">Optional log service for recording the logout action</param>
        public async Task Logout(LogService logService = null)
        {
            if (logService != null && IsLoggedIn())
            {
                await LogLogoutAsync(logService);
            }

            _accessToken = null;
            _userId = null;
            _username = null;
            _userRoles = null;
        }

        /// <summary>
        /// Response model for the login API
        /// </summary>
        private class LoginResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public string UserId { get; set; }
            public List<string> Roles { get; set; }
        }
    }
}