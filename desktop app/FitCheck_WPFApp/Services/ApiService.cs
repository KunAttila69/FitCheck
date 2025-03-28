using FitCheck_WPFApp.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FitCheck_WPFApp.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl = "https://localhost:7293/api"; 

        public ApiService()
        {
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
                {
                    return true;
                }
            };

            _httpClient = new HttpClient(handler);
            _httpClient.BaseAddress = new Uri(_baseUrl);
        }

        public void SetAuthToken(string token)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        // Users Endpoints
        public async Task<List<User>> GetAllUsersAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/admin/users");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<User>>();
        }

        public async Task BanUserAsync(string userId, string banReason)
        {
            var banRequest = new
            {
                UserId = userId,
                BanReason = banReason
            };
            var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/admin/ban-user", banRequest);
            response.EnsureSuccessStatusCode();
        }

        public async Task UnbanUserAsync(string userId)
        {
            var response = await _httpClient.PostAsync($"{_baseUrl}/admin/unban-user/{userId}", null);
            response.EnsureSuccessStatusCode();
        }

        // Posts Endpoints
        public async Task<List<Post>> GetAllPostsAsync(int page = 1, int pageSize = 25)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/moderator/posts?page={page}&pageSize={pageSize}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Post>>();
        }

        public async Task RemovePostAsync(int postId, string reason)
        {
            var removeRequest = new
            {
                Reason = reason
            };
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/moderator/posts/{postId}");
            response.EnsureSuccessStatusCode();
        }

        // Comments Endpoints
        public async Task<List<Comment>> GetAllCommentsAsync(int page = 1, int pageSize = 25)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/moderator/comments?page={page}&pageSize={pageSize}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Comment>>();
        }

        public async Task RemoveCommentAsync(int commentId, string reason)
        {
            var removeRequest = new
            {
                Reason = reason
            };
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/moderator/comments/{commentId}");
            response.EnsureSuccessStatusCode();
        }

        // Roles Endpoints

        public async Task<List<string>> GetUserRolesAsync(string userId)
        {
            var response = await _httpClient.GetAsync($"api/admin/user-roles/{userId}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UserRolesResponse>(content);
            return result.Roles;
        }

        public async Task AssignRoleToUserAsync(string userId, string roleName)
        {
            var request = new UserRoleRequest
            {
                UserId = userId,
                RoleName = roleName
            };

            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("api/admin/assign-role", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task RemoveRoleFromUserAsync(string userId, string roleName)
        {
            var request = new UserRoleRequest
            {
                UserId = userId,
                RoleName = roleName
            };

            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("api/admin/remove-role", content);
            response.EnsureSuccessStatusCode();
        }

        private class UserRolesResponse
        {
            public List<string> Roles { get; set; }
        }

        public class UserRoleRequest
        {
            public string UserId { get; set; }
            public string RoleName { get; set; }
        }
    }
}